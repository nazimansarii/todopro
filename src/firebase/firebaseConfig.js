import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail // <-- Add this import
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCl9rBSc32pQQlmGeQmlDG4uvTHxYvnK_Q",
  authDomain: "todolist-68d4f.firebaseapp.com",
  projectId: "todolist-68d4f",
  storageBucket: "todolist-68d4f.firebasestorage.app",
  messagingSenderId: "397322804779",
  appId: "1:397322804779:web:3024699473c460cbb4d46e",
  measurementId: "G-771499KG6E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export {
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail // <-- Export it here
};