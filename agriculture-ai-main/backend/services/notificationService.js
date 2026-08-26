/**
 * NotificationService: Push notification delivery via Firebase Cloud Messaging (FCM HTTP v1).
 *
 * Channels:
 *  - Push: Firebase Cloud Messaging (FCM HTTP v1 / Firebase Admin SDK)
 *
 * All channels degrade gracefully — failures are logged but do not
 * crash the alert pipeline.
 */

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

/**
 * High-level dispatcher — sends push notification alerts
 * via Firebase Cloud Messaging (FCM HTTP v1).
 *
 * @param {Object} user  - { fcmToken }
 * @param {Object} alert - { title, message, severity }
 */
async function dispatchAlert(user, alert) {
  const { fcmToken } = user;
  const { title, message } = alert;

  const results = {};

  // Push: always attempt if token available
  if (fcmToken) {
    results.push = await sendPushNotification(fcmToken, { title, body: message });
  }

  return results;
}

module.exports = { sendPushNotification, dispatchAlert };
