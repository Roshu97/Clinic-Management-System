const admin = require('firebase-admin');
const serviceAccount = require('../../assets/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setCustomUserRole(email, role) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: role });
    console.log(`Successfully set ${email} to role: ${role}`);
  } catch (error) {
    console.error('Error setting custom user claim:', error);
  }
}

// Set doctor role
setCustomUserRole('doctor@clinicflow.com', 'doctor');

// Set receptionist role
setCustomUserRole('receptionist@clinicflow.com', 'receptionist');