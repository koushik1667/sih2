/**
 * NotificationService: multi-channel delivery (SMS, Push, WhatsApp).
 *
 * Channels:
 *  - SMS: Twilio (primary) / MSG91 (India fallback)
 *  - Push: Firebase Cloud Messaging (FCM)
 *  - WhatsApp: Twilio WhatsApp API
 *
 * All channels degrade gracefully — failures are logged but do not
 * crash the alert pipeline.
 */

const axios = require('axios');

// ── SMS via MSG91 (preferred for India) ───────────
async function sendSMS(phone, message) {
  const apiKey = process.env.MSG91_API_KEY;
  if (!apiKey) {
    console.info(`[SMS] Skipped (no MSG91_API_KEY). To: ${phone}`);
    return { sent: false, reason: 'no_api_key' };
  }

  try {
    const { data } = await axios.post(
      'https://api.msg91.com/api/v5/flow/',
      {
        flow_id:   process.env.MSG91_FLOW_ID,
        sender:    'AGRITECH',
        mobiles:   `91${phone.replace(/\D/g, '')}`,
        message,
      },
      {
        headers: { authkey: apiKey, 'content-type': 'application/json' },
        timeout: 10_000,
      }
    );
    console.info(`[SMS] Sent to ${phone}: ${data.message}`);
    return { sent: true, messageId: data.message };
  } catch (err) {
    console.error(`[SMS] Failed to ${phone}:`, err.message);
    return { sent: false, reason: err.message };
  }
}

// ── Push via Firebase Cloud Messaging (HTTP v1 / Firebase Admin SDK) ──
let adminInstance = null;
function getFirebaseMessaging() {
  if (adminInstance) return adminInstance.messaging();
  try {
    const admin = require('firebase-admin');
    if (admin.apps.length > 0) {
      adminInstance = admin.apps[0];
      return adminInstance.messaging();
    }

    let credential = null;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      try {
        const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        credential = admin.credential.cert(parsed);
      } catch (e) {
        if (require('fs').existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)) {
          credential = admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        }
      }
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && require('fs').existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      credential = admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
    } else {
      try {
        credential = admin.credential.applicationDefault();
      } catch (e) {
        // Fallback gracefully without throwing
      }
    }

    if (credential) {
      adminInstance = admin.initializeApp({
        credential,
        projectId: process.env.FIREBASE_PROJECT_ID || undefined,
      });
      return adminInstance.messaging();
    }
  } catch (err) {
    console.warn('[Push] Firebase Admin SDK initialization failed:', err.message);
  }
  return null;
}

async function sendPushNotification(fcmToken, { title, body, data = {} }) {
  if (!fcmToken) {
    console.info('[Push] Skipped (no fcmToken provided)');
    return { sent: false, reason: 'no_token' };
  }

  const messaging = getFirebaseMessaging();
  if (!messaging) {
    console.info('[Push] Skipped (Firebase Admin SDK not configured, running in simulation mode)');
    return {
      sent: false,
      reason: 'unconfigured_credentials',
      simulated: true,
      protocol: 'FCM HTTP v1 (Firebase Admin SDK)',
      payload: { title, body, data }
    };
  }

  try {
    const message = {
      token: fcmToken,
      notification: { title, body },
      data: { ...data, timestamp: String(Date.now()), source: 'agrisphere_alerts' },
      android: {
        priority: 'high',
        notification: { sound: 'default', channelId: 'agrisphere_alerts' }
      },
      webpush: {
        headers: { Urgency: 'high' },
        notification: { icon: '/favicon.svg', badge: '/favicon.svg' }
      }
    };

    const messageId = await messaging.send(message);
    console.info(`[Push] Sent via FCM HTTP v1: messageId=${messageId}`);
    return { sent: true, messageId, protocol: 'FCM HTTP v1' };
  } catch (err) {
    console.error('[Push] FCM HTTP v1 send failed:', err.message);
    return { sent: false, reason: err.message, protocol: 'FCM HTTP v1' };
  }
}

// ── WhatsApp via Twilio WhatsApp API ──────────────
async function sendWhatsApp(phone, message) {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_WHATSAPP_FROM;

  if (!sid || !token || !from) {
    console.info('[WhatsApp] Skipped (no Twilio credentials)');
    return { sent: false, reason: 'no_credentials' };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
    const params = new URLSearchParams({
      From: `whatsapp:${from}`,
      To:   `whatsapp:+91${phone.replace(/\D/g, '')}`,
      Body: message,
    });

    const { data } = await axios.post(url, params.toString(), {
      auth: { username: sid, password: token },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10_000,
    });

    console.info(`[WhatsApp] Sent: sid=${data.sid}`);
    return { sent: true, messageSid: data.sid };
  } catch (err) {
    console.error('[WhatsApp] Failed:', err.message);
    return { sent: false, reason: err.message };
  }
}

/**
 * High-level dispatcher — sends across all enabled channels
 * based on the alert severity and user preferences.
 *
 * @param {Object} user  - { phone, fcmToken, notifyPrefs }
 * @param {Object} alert - { title, message, severity }
 */
async function dispatchAlert(user, alert) {
  const { phone, fcmToken, notifyPrefs = {} } = user;
  const { title, message, severity } = alert;

  const results = {};

  // Push: always attempt if token available
  if (fcmToken) {
    results.push = await sendPushNotification(fcmToken, { title, body: message });
  }

  // SMS: only for warning/critical to avoid spam
  if (phone && (severity === 'warning' || severity === 'critical') && notifyPrefs.sms !== false) {
    results.sms = await sendSMS(phone, `AgriTech Alert: ${message}`);
  }

  // WhatsApp: only for critical + if user opted in
  if (phone && severity === 'critical' && notifyPrefs.whatsapp === true) {
    results.whatsapp = await sendWhatsApp(phone, `🚨 *AgriTech Critical Alert*\n${title}\n\n${message}`);
  }

  return results;
}

module.exports = { sendSMS, sendPushNotification, sendWhatsApp, dispatchAlert };
