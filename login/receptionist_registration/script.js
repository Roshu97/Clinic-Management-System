import { app, auth } from '../../assets/firebase-init.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-functions.js";
import logger from '../../assets/logger.js';

document.getElementById('receptionistRegistrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const employeeId = document.getElementById('employeeId').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    let user = null;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;

        const functions = getFunctions(app);
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            connectFunctionsEmulator(functions, "127.0.0.1", 5002);
        }

        const setRole = httpsCallable(functions, "setCustomUserRole");
        await setRole({ email: email, role: "receptionist" });

        const idTokenResult = await user.getIdTokenResult(true);
        const assignedRole = idTokenResult.claims.role;

        if (assignedRole !== 'receptionist') {
            logger.error('Role verification failed after receptionist registration', email, assignedRole);
            await user.delete();
            alert('Registration failed: Unable to assign receptionist role. Please try again.');
            return;
        }

        logger.info('Receptionist registered and role assigned successfully', email);
        alert('Receptionist registered successfully!');
        window.location.href = '/login/receptionist/index.html';
    } catch (error) {
        logger.error('Error during receptionist registration', error);

        if (user) {
            try {
                await user.delete();
            } catch (deleteError) {
                logger.error('Failed to rollback user after receptionist registration failure', deleteError);
            }
        }

        const errorMessage = error && error.message ? error.message : 'An unknown error occurred.';
        alert(`Registration failed: ${errorMessage}`);
    }

    // this.reset();
});
