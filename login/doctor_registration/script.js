import { app, auth } from '../../../assets/firebase-init.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import logger from '../../../assets/logger.js';

document.getElementById('doctorRegistrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const specialization = document.getElementById('specialization').value;
    const licenseNumber = document.getElementById('licenseNumber').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    let user = null;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;

        const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
        const functionUrl = isLocal 
            ? "http://127.0.0.1:5002/clinic-management-system-12345/us-central1/setCustomUserRole"
            : "https://us-central1-clinic-management-system-12345.cloudfunctions.net/setCustomUserRole";

        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, role: "doctor" })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to assign role');
        }



        const idTokenResult = await user.getIdTokenResult(true);
        const assignedRole = idTokenResult.claims.role;

        if (assignedRole !== 'doctor') {
            logger.error('Role verification failed after doctor registration', email, assignedRole);
            await user.delete();
            alert('Registration failed: Unable to assign doctor role. Please try again.');
            return;
        }

        logger.info('Doctor registered and role assigned successfully', email);
        alert('Doctor registered successfully!');
        window.location.href = '/login/doctor/index.html';
    } catch (error) {
        logger.error('Error during doctor registration', error);

        if (user) {
            try {
                await user.delete();
            } catch (deleteError) {
                logger.error('Failed to rollback user after doctor registration failure', deleteError);
            }
        }

        const errorMessage = error && error.message ? error.message : 'An unknown error occurred.';
        alert(`Registration failed: ${errorMessage}`);
    }

    // this.reset();
});