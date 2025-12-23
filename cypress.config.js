const { defineConfig } = require('cypress');
const cypressFirebasePlugin = require('cypress-firebase').plugin;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
const { configureVisualRegression } = require('cypress-visual-regression');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    screenshotsFolder: './cypress/snapshots/actual',
    env: {
      visualRegressionType: 'regression',
      visualRegressionFailSilently: true
    },
    setupNodeEvents(on, config) {
      configureVisualRegression(on);

      return cypressFirebasePlugin(on, config, admin, {
        projectId: 'clinic-management-system-12345',
      });
    },
  },
});