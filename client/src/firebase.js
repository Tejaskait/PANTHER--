// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "panther-tejas.firebaseapp.com",
  projectId: "panther-tejas",
  storageBucket: "panther-tejas.firebasestorage.app",
  messagingSenderId: "340536015558",
  appId: "1:340536015558:web:1cdd282bed8a2d51e5b5c7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);