
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Function to check if the Firebase config is valid for the client
export const isFirebaseConfigValid = () => {
    return !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
           !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
           !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
           !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
           !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
           !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
};

// Initialize Firebase App
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

// Get Auth instance (conditionally for client-side)
const auth: Auth = getAuth(app);


export { app, db, auth, firebaseConfig };
