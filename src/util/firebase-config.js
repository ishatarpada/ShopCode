// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLOpUhU7HFiQt5e4zxhMRZHYVUjagE1S8",
  authDomain: "shop-code-be7ea.firebaseapp.com",
  projectId: "shop-code-be7ea",
  storageBucket: "shop-code-be7ea.appspot.com",
  messagingSenderId: "749270838469",
  appId: "1:749270838469:web:1d04cd39644862a5bd14ac",
  measurementId: "G-VSPLGH8J5S"
};

// Initialize Firebase
const firebaseAppConfig = initializeApp(firebaseConfig);

export default firebaseAppConfig;


/* 
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
*/