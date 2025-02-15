// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD7QTphzIOGuXL3luGQaSliQaI0dx_oKsg",
    authDomain: "skillup-ed290.firebaseapp.com",
    projectId: "skillup-ed290",
    storageBucket: "skillup-ed290.firebasestorage.app",
    messagingSenderId: "492581200583",
    appId: "1:492581200583:web:b3009418842a08e4c854e2"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
