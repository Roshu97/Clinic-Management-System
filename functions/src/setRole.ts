import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import cors from 'cors';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

export const setCustomUserRole = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
      }

      const { email, uid, role } = req.body;

      // Support both email (current frontend) and uid (user's snippet)
      let targetUid = uid;
      if (!targetUid && email) {
        const user = await admin.auth().getUserByEmail(email);
        targetUid = user.uid;
      }

      if (!targetUid || !role) {
        res.status(400).json({ error: "Missing uid/email or role" });
        return;
      }

      const allowedRoles = ['doctor', 'receptionist'];
      if (!allowedRoles.includes(role)) {
        res.status(400).json({ error: "Invalid role" });
        return;
      }

      functions.logger.info(`Setting role ${role} for user ${targetUid}`);
      await admin.auth().setCustomUserClaims(targetUid, { role });

      res.status(200).json({ success: true, message: `Role ${role} assigned successfully` });
    } catch (error: any) {
      functions.logger.error('Failed to set custom user role', error);
      res.status(500).json({ error: error.message || "internal" });
    }
  });
});