const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const fs = require('fs');

let testEnv;

beforeAll(async () => {
  const rulesContent = fs.readFileSync('./firestore.rules', 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId: 'clinec-management-system',
    firestore: {
      rules: rulesContent,
      host: '127.0.0.1',
      port: 8080,
    },
  });
  console.log('testEnv initialized:', !!testEnv);
});

afterAll(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

beforeEach(async () => {
  if (testEnv) {
    await testEnv.clearFirestore();
  }
});

module.exports = { testEnv };