// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbHrzKZll0_kud5Y68Lgr1PoebhljOIeo",
  authDomain: "wandermind-d633e.firebaseapp.com",
  projectId: "wandermind-d633e",
  storageBucket: "wandermind-d633e.firebasestorage.app",
  messagingSenderId: "517741155758",
  appId: "1:517741155758:web:5d4c8dc679590318cf243f",
  measurementId: "G-S4MSJJPY1Y"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);