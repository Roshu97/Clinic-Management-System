import { auth } from '../../assets/firebase-init.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import logger from '../../assets/logger.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/receptionist/dashboard/';
    } catch (error) {
      // Log the error using the logger utility
      logger.error('Login error:', error.message);
      errorMessageElement.textContent = 'Invalid email or password.';
    }
  });
});