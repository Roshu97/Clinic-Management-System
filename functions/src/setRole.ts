import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const setCustomUserRole = functions.https.onRequest(async (req, res) => {
  // Manual CORS handling
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  functions.logger.info(`Received request: ${req.method}`, { body: req.body });

  try {
    const { email, uid, role } = req.body;

    if (!role) {
      functions.logger.error("Missing role in request body");
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
        functions.logger.error(`User not found for email: ${email}`, authError);
        res.status(404).json({ error: `User with email ${email} not found` });
        return;
      }
    }

    if (!targetUid) {
      functions.logger.error("Missing uid or email in request body");
      res.status(400).json({ error: "Missing uid or email" });
      return;
    }

    const allowedRoles = ['doctor', 'receptionist'];
    if (!allowedRoles.includes(role)) {
      functions.logger.error(`Invalid role: ${role}`);
      res.status(400).json({ error: "Invalid role" });
      return;
    }

    functions.logger.info(`Setting role ${role} for user ${targetUid}`);
    await admin.auth().setCustomUserClaims(targetUid, { role });

    res.status(200).json({ success: true, message: `Role ${role} assigned successfully` });
  } catch (error: any) {
    functions.logger.error('Failed to set custom user role', error);
    res.status(500).json({ error: error.message || "internal server error" });
  }
});