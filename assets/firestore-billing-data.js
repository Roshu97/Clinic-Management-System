import { db } from './firebase-init.js';
import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const billsCollection = collection(db, 'bills');

export const addBill = async (billData) => {
  try {
    const docRef = await addDoc(billsCollection, billData);
    console.log('Bill added with ID:', docRef.id);
    return { id: docRef.id, ...billData };
  } catch (e) {
    console.error('Error adding bill:', e);
    throw e;
  }
};

export const getBillById = async (id) => {
  try {
    const docRef = doc(db, 'bills', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No such bill!');
      return null;
    }
  } catch (e) {
    console.error('Error getting bill by ID:', e);
    throw e;
  }
};

export const getAllBills = async () => {
  try {
    const q = query(billsCollection);
    const querySnapshot = await getDocs(q);
    const bills = [];
    querySnapshot.forEach((doc) => {
      bills.push({ id: doc.id, ...doc.data() });
    });
    return bills;
  } catch (e) {
    console.error('Error getting all bills:', e);
    throw e;
  }
};