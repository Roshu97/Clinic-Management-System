import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import cors from 'cors';

const corsHandler = cors({ origin: true });

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const setCustomUserRole = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    // Handle preflight request 
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.status(204).send("");
      return;
    }

    try {
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

      logger.info(`Setting role ${role} for user ${targetUid}`);
      await admin.auth().setCustomUserClaims(targetUid, { role });

      res.set("Access-Control-Allow-Origin", "*");
      res.status(200).json({ success: true, message: `Role ${role} assigned successfully` });
    } catch (error: any) {
      logger.error('Failed to set custom user role', error);
      res.set("Access-Control-Allow-Origin", "*");
      res.status(500).json({ error: error.message || "internal" });
    }
  });
});