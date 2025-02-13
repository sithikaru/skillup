// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB1cGNIsGaEii07JtTFj5ICbn-HPLPO348",
    authDomain: "skill-up-3.firebaseapp.com",
    projectId: "skill-up-3",
    storageBucket: "skill-up-3.firebasestorage.app",
    messagingSenderId: "622872630056",
    appId: "1:622872630056:web:64848be29702e30042761d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
