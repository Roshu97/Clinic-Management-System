import { db, collection } from './firebase-init.js';
import { addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const tokensCollection = collection(db, 'tokens');

export async function addToken(tokenData) {
  // Basic validation
  if (!tokenData.patientName || typeof tokenData.patientName !== 'string' || tokenData.patientName.trim() === '') {
    throw new Error('Patient name is required and must be a non-empty string.');
  }
  if (!tokenData.tokenNumber || typeof tokenData.tokenNumber !== 'number' || tokenData.tokenNumber <= 0) {
    throw new Error('Token number is required and must be a positive number.');
  }

  try {
    const docRef = await addDoc(tokensCollection, tokenData);
    console.log('Token added with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding token: ', e);
    throw e;
  }
}

export async function getTokenById(tokenId) {
  try {
    const q = query(tokensCollection, where('id', '==', tokenId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      console.log('No token found with ID:', tokenId);
      return null;
    }
  } catch (e) {
    console.error('Error getting token by ID: ', e);
    throw e;
  }
}

export async function getAllTokens() {
  try {
    const querySnapshot = await getDocs(tokensCollection);
    const tokens = [];
    querySnapshot.forEach((doc) => {
      tokens.push({ id: doc.id, ...doc.data() });
    });
    return tokens;
  } catch (e) {
    console.error('Error getting all tokens: ', e);
    throw e;
  }
}