// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
//import {...} from "firebase/auth";
//import {...} from "firebase/database";
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAVJhQvYsraXco8w0Tls1DBSzQHwd8CBJA",
  authDomain: "kunetwork-3d529.firebaseapp.com",
  projectId: "kunetwork-3d529",
  storageBucket: "kunetwork-3d529.appspot.com",
  messagingSenderId: "976455828726",
  appId: "1:976455828726:web:38ac8f787b84bcfef4d8d7",
  measurementId: "G-G4YXT2SHTC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;