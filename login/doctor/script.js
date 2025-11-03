import { auth } from '../../assets/firebase-init.js';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import logger from '../../assets/logger.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');
  const forgotPasswordLink = document.getElementById('forgot-password-link');

  // 🔐 Handle Login
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role;

      if (role === 'doctor') {
        window.location.href = '/doctor/dashboard/';
      } else {
        logger.warn('Unauthorized login attempt:', email, 'with role:', role);
        errorMessage.textContent = 'Access Denied: You are not authorized to access the doctor portal.';
        // Optionally, sign out the user if they are not a doctor
        auth.signOut();
      }
    } catch (error) {
      logger.error('Login error:', error.message);
      errorMessage.textContent = 'Invalid email or password.';
    }
  });

  // 🔄 Handle Forgot Password
  forgotPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      errorMessage.textContent = 'Please enter your email address first.';
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      errorMessage.style.color = 'green';
      errorMessage.textContent = 'Password reset email sent. Check your inbox.';
    } catch (error) {
      logger.error('Password reset error:', error.message);
      errorMessage.style.color = 'red';
      errorMessage.textContent = 'Failed to send password reset email. Please try again.';
    }
  });
});
