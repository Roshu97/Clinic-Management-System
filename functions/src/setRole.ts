import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { onCall, HttpsError, CallableRequest } from 'firebase-functions/v2/https';

interface SetRoleData {
  email: string;
  role: string;
}

admin.initializeApp();

export const setCustomUserRole = onCall({
  cors: true
}, async (request: CallableRequest<SetRoleData>) => {
  // Check if the request is made by an authenticated user
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'Only authenticated users can set custom claims.'
    );
  }

  const { email, role } = request.data;

  if (!email || !role) {
    throw new HttpsError(
      'invalid-argument',
      'The function must be called with an email and a role.'
    );
  }

  const allowedRoles = ['doctor', 'receptionist'];

  if (!allowedRoles.includes(role)) {
    throw new HttpsError(
      'invalid-argument',
      'The role must be either doctor or receptionist.'
    );
  }

  try {
    logger.info(`Setting role ${role} for user ${email}`);
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: role });
    return { message: `Success! ${email} now has the role ${role}.` };
  } catch (error: any) {
    logger.error('Failed to set custom user role', error);
    
    // Check if it's a known auth error
    if (error.code === 'auth/user-not-found') {
      throw new HttpsError('not-found', `User with email ${email} not found.`);
    }
    
    throw new HttpsError(
      'internal',
      error.message || 'Failed to set custom user role.'
    );
  }
});
