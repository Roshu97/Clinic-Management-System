import * as admin from 'firebase-admin';
import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const setCustomUserRole = onRequest({ 
  region: 'asia-southeast1',
  cors: true 
}, async (req, res) => {
  logger.info(`Received request: ${req.method}`, { body: req.body });

  try {
    const { email, uid, role } = req.body;

    if (!role) {
      logger.error("Missing role in request body");
      res.status(400).json({ error: "Missing role" });
      return;
    }

    // Support both email (current frontend) and uid (user's snippet)
    let targetUid = uid;
    if (!targetUid && email) {
      try {
        const user = await admin.auth().getUserByEmail(email);
        targetUid = user.uid;
      } catch (authError: any) {
        logger.error(`User not found for email: ${email}`, authError);
        res.status(404).json({ error: `User with email ${email} not found` });
        return;
      }
    }

    if (!targetUid) {
      logger.error("Missing uid or email in request body");
      res.status(400).json({ error: "Missing uid or email" });
      return;
    }

    const allowedRoles = ['doctor', 'receptionist'];
    if (!allowedRoles.includes(role)) {
      logger.error(`Invalid role: ${role}`);
      res.status(400).json({ error: "Invalid role" });
      return;
    }

    logger.info(`Setting role ${role} for user ${targetUid}`);
    await admin.auth().setCustomUserClaims(targetUid, { role });

    res.status(200).json({ success: true, message: `Role ${role} assigned successfully` });
  } catch (error: any) {
    logger.error('Failed to set custom user role', error);
    res.status(500).json({ error: error.message || "internal server error" });
  }
});