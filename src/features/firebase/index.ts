import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKEPIapVZDDWamBZmtp6w2y-hbRl72dro",
  authDomain: "multi-store-2b052.firebaseapp.com",
  projectId: "multi-store-2b052",
  storageBucket: "multi-store-2b052.appspot.com",
  messagingSenderId: "470555603384",
  appId: "1:470555603384:web:b248e54d613911fac91f4d",
  measurementId: "G-YDBQCJFYDN",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
