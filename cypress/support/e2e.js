import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import { attachCustomCommands } from 'cypress-firebase';
import { addCompareSnapshotCommand } from 'cypress-visual-regression/dist/command';

const app = firebase.initializeApp({
  apiKey: Cypress.env('FIREBASE_API_KEY'),
  authDomain: Cypress.env('FIREBASE_AUTH_DOMAIN'),
  projectId: Cypress.env('FIREBASE_PROJECT_ID'),
  storageBucket: Cypress.env('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: Cypress.env('FIREBASE_MESSAGING_SENDER_ID'),
  appId: Cypress.env('FIREBASE_APP_ID'),
});

Cypress.Commands.add('login', (email, password) => {
  cy.callFirestore('get', 'users', { where: ['email', '==', email] }).then((users) => {
    if (users.length === 0) {
      throw new Error(`User with email ${email} not found.`);
    }
    const user = users[0];
    cy.log(`Logging in user: ${user.email} with role: ${user.role}`);
    cy.wrap(user).as('currentUser');
  });
});

// Attach custom commands from cypress-firebase
attachCustomCommands({
  Cypress,
  cy,
  app, // Pass the initialized app instance directly as 'app'
});

addCompareSnapshotCommand();