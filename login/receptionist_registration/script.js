import { auth } from '../../../assets/firebase-init.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

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

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Receptionist registered successfully:', user);
        alert('Receptionist registered successfully!');
        window.location.href = '../../receptionist/index.html'; // Redirect to receptionist login page
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error during receptionist registration:', errorCode, errorMessage);
        alert(`Registration failed: ${errorMessage}`);
    }

    this.reset();
});