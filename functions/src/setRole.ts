import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const setCustomUserRole = functions.https.onCall(async (data, context) => {
  // Check if the request is made by an authenticated user
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Only authenticated users can set custom claims.'
    );
  }

  // Check if the authenticated user has admin privileges (optional, but recommended)
  // For simplicity, we'll assume any authenticated user can call this for now.
  // In a real application, you'd check context.auth.token.admin === true

  const { email, role } = data;

  if (!email || !role) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with an email and a role.'
    );
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: role });
    return { message: `Success! ${email} now has the role ${role}.` };
  } catch (error: any) {
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to set custom user role.'
    );
  }
});