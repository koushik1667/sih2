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

// ── Push via Firebase Cloud Messaging ─────────────
async function sendPushNotification(fcmToken, { title, body, data = {} }) {
  const serverKey = process.env.FCM_SERVER_KEY;
  if (!serverKey || !fcmToken) {
    console.info('[Push] Skipped (no FCM_SERVER_KEY or token)');
    return { sent: false, reason: 'no_credentials' };
  }

  try {
    const { data: resp } = await axios.post(
      'https://fcm.googleapis.com/fcm/send',
      {
        to: fcmToken,
        notification: { title, body, sound: 'default' },
        data: { ...data, click_action: 'FLUTTER_NOTIFICATION_CLICK' },
        priority: 'high',
      },
      {
        headers: {
          Authorization: `key=${serverKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10_000,
      }
    );
    console.info(`[Push] Sent: messageId=${resp.results?.[0]?.message_id}`);
    return { sent: true, messageId: resp.results?.[0]?.message_id };
  } catch (err) {
    console.error('[Push] Failed:', err.message);
    return { sent: false, reason: err.message };
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
