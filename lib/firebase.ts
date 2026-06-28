import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Senior Resiliency Guard: 
// If API keys are missing (like during Vercel's initial build or before you configure them in Settings),
// we bypass Firebase initialization gracefully so the build compiles 100% successfully!
const hasFirebaseKeys = typeof process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'string' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length > 0;

let app;
let auth: any = null;
let storage: any = null;
const googleProvider = hasFirebaseKeys ? new GoogleAuthProvider() : null;

if (hasFirebaseKeys) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = typeof window !== 'undefined' ? getAuth(app) : null;
    storage = typeof window !== 'undefined' ? getStorage(app) : null;
  } catch (error) {
    console.warn("Firebase failed to initialize:", error);
  }
} else {
  console.warn("Firebase API keys are missing. Firebase features will run in Mock/Offline mode.");
}

export { auth, storage, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };

export async function uploadBase64Image(base64Str: string, path: string): Promise<string> {
  // Safe fallback if Firebase is not linked
  if (!storage) {
    console.warn("Firebase Storage is not initialized. Using direct base64 fallback.");
    return base64Str;
  }
  
  try {
    const storageRef = ref(storage, path);
    await uploadString(storageRef, base64Str, 'data_url');
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Firebase Storage Upload Error:", error);
    return base64Str;
  }
}

