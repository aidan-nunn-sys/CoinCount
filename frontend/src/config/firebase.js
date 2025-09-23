// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIwOlBkU9l-g3ls7JGt3cUBEBmMgZYIn4",
  authDomain: "coincount-ecd14.firebaseapp.com",
  projectId: "coincount-ecd14",
  storageBucket: "coincount-ecd14.firebasestorage.app",
  messagingSenderId: "546130670545",
  appId: "1:546130670545:web:95b07c8780633bb883a6f0",
  measurementId: "G-KH9XT6NJPW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app, analytics };
