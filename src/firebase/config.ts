'use client';

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZM3y8JgI0nupugrW5c2-PRoxVrA1nyaU",
  authDomain: "mushroom-pro.firebaseapp.com",
  projectId: "mushroom-pro",
  storageBucket: "mushroom-pro.firebasestorage.app",
  messagingSenderId: "591850788114",
  appId: "1:591850788114:web:1891184a5da87a801d0fcb",
  measurementId: "G-JX7EPBVW4L"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
