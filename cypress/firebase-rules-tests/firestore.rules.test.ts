import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'clinic-management-system', // Replace with your project ID
    firestore: {
      rules: readFileSync('./firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Firestore Security Rules', () => {
  const patientData = { name: 'Test Patient', age: 30 };
  const historyData = { patientId: 'patient1', diagnosis: 'Flu' };
  const prescriptionData = { patientId: 'patient1', medication: 'Amoxicillin' };
  const tokenData = { patientId: 'patient1', tokenNumber: 1 };
  const queueData = { patientId: 'patient1', status: 'waiting' };

  // Helper function to get authenticated context
  const getAuthenticatedContext = (uid: string, role: string) => {
    return testEnv.authenticatedContext(uid, { role });
  };

  // Helper function to get unauthenticated context
  const getUnauthenticatedContext = () => {
    return testEnv.unauthenticatedContext();
  };

  describe('patients collection', () => {
    it('should allow doctor to read and write', async () => {
      const doctorDb = getAuthenticatedContext('doctor1', 'doctor').firestore();
      const patientRef = doc(collection(doctorDb, 'patients'), 'patient1');

      await assertSucceeds(setDoc(patientRef, patientData));
      await assertSucceeds(getDoc(patientRef));
      await assertSucceeds(deleteDoc(patientRef));
    });

    it('should deny receptionist to read and write', async () => {
      const receptionistDb = getAuthenticatedContext('receptionist1', 'receptionist').firestore();
      const patientRef = doc(collection(receptionistDb, 'patients'), 'patient1');

      await assertFails(setDoc(patientRef, patientData));
      await assertFails(getDoc(patientRef));
      await assertFails(deleteDoc(patientRef));
    });

    it('should deny unauthenticated user to read and write', async () => {
      const unauthenticatedDb = getUnauthenticatedContext().firestore();
      const patientRef = doc(collection(unauthenticatedDb, 'patients'), 'patient1');

      await assertFails(setDoc(patientRef, patientData));
      await assertFails(getDoc(patientRef));
      await assertFails(deleteDoc(patientRef));
    });
  });

  describe('patientHistory collection', () => {
    it('should allow doctor to read and write', async () => {
      const doctorDb = getAuthenticatedContext('doctor1', 'doctor').firestore();
      const historyRef = doc(collection(doctorDb, 'patientHistory'), 'history1');

      await assertSucceeds(setDoc(historyRef, historyData));
      await assertSucceeds(getDoc(historyRef));
      await assertSucceeds(deleteDoc(historyRef));
    });

    it('should deny receptionist to read and write', async () => {
      const receptionistDb = getAuthenticatedContext('receptionist1', 'receptionist').firestore();
      const historyRef = doc(collection(receptionistDb, 'patientHistory'), 'history1');

      await assertFails(setDoc(historyRef, historyData));
      await assertFails(getDoc(historyRef));
      await assertFails(deleteDoc(historyRef));
    });

    it('should deny unauthenticated user to read and write', async () => {
      const unauthenticatedDb = getUnauthenticatedContext().firestore();
      const historyRef = doc(collection(unauthenticatedDb, 'patientHistory'), 'history1');

      await assertFails(setDoc(historyRef, historyData));
      await assertFails(getDoc(historyRef));
      await assertFails(deleteDoc(historyRef));
    });
  });

  describe('prescriptions collection', () => {
    it('should allow doctor to read and write', async () => {
      const doctorDb = getAuthenticatedContext('doctor1', 'doctor').firestore();
      const prescriptionRef = doc(collection(doctorDb, 'prescriptions'), 'prescription1');

      await assertSucceeds(setDoc(prescriptionRef, prescriptionData));
      await assertSucceeds(getDoc(prescriptionRef));
      await assertSucceeds(deleteDoc(prescriptionRef));
    });

    it('should deny receptionist to read and write', async () => {
      const receptionistDb = getAuthenticatedContext('receptionist1', 'receptionist').firestore();
      const prescriptionRef = doc(collection(receptionistDb, 'prescriptions'), 'prescription1');

      await assertFails(setDoc(prescriptionRef, prescriptionData));
      await assertFails(getDoc(prescriptionRef));
      await assertFails(deleteDoc(prescriptionRef));
    });

    it('should deny unauthenticated user to read and write', async () => {
      const unauthenticatedDb = getUnauthenticatedContext().firestore();
      const prescriptionRef = doc(collection(unauthenticatedDb, 'prescriptions'), 'prescription1');

      await assertFails(setDoc(prescriptionRef, prescriptionData));
      await assertFails(getDoc(prescriptionRef));
      await assertFails(deleteDoc(prescriptionRef));
    });
  });

  describe('tokens collection', () => {
    it('should allow doctor to read and write', async () => {
      const doctorDb = getAuthenticatedContext('doctor1', 'doctor').firestore();
      const tokenRef = doc(collection(doctorDb, 'tokens'), 'token1');

      await assertSucceeds(setDoc(tokenRef, tokenData));
      await assertSucceeds(getDoc(tokenRef));
      await assertSucceeds(deleteDoc(tokenRef));
    });

    it('should allow receptionist to read and write', async () => {
      const receptionistDb = getAuthenticatedContext('receptionist1', 'receptionist').firestore();
      const tokenRef = doc(collection(receptionistDb, 'tokens'), 'token1');

      await assertSucceeds(setDoc(tokenRef, tokenData));
      await assertSucceeds(getDoc(tokenRef));
      await assertSucceeds(deleteDoc(tokenRef));
    });

    it('should deny unauthenticated user to read and write', async () => {
      const unauthenticatedDb = getUnauthenticatedContext().firestore();
      const tokenRef = doc(collection(unauthenticatedDb, 'tokens'), 'token1');

      await assertFails(setDoc(tokenRef, tokenData));
      await assertFails(getDoc(tokenRef));
      await assertFails(deleteDoc(tokenRef));
    });
  });

  describe('queue collection', () => {
    it('should allow doctor to read and write', async () => {
      const doctorDb = getAuthenticatedContext('doctor1', 'doctor').firestore();
      const queueRef = doc(collection(doctorDb, 'queue'), 'queue1');

      await assertSucceeds(setDoc(queueRef, queueData));
      await assertSucceeds(getDoc(queueRef));
      await assertSucceeds(deleteDoc(queueRef));
    });

    it('should allow receptionist to read and write', async () => {
      const receptionistDb = getAuthenticatedContext('receptionist1', 'receptionist').firestore();
      const queueRef = doc(collection(receptionistDb, 'queue'), 'queue1');

      await assertSucceeds(setDoc(queueRef, queueData));
      await assertSucceeds(getDoc(queueRef));
      await assertSucceeds(deleteDoc(queueRef));
    });

    it('should deny unauthenticated user to read and write', async () => {
      const unauthenticatedDb = getUnauthenticatedContext().firestore();
      const queueRef = doc(collection(unauthenticatedDb, 'queue'), 'queue1');

      await assertFails(setDoc(queueRef, queueData));
      await assertFails(getDoc(queueRef));
      await assertFails(deleteDoc(queueRef));
    });
  });
});