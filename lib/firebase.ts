import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

// Production configuration values read from environment variables on Vercel
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize client-side Firebase gracefully to ensure it never crashes if variables are missing during local dev or server builds
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = typeof window !== 'undefined' ? getAuth(app) : null;
const storage = typeof window !== 'undefined' ? getStorage(app) : null;

const googleProvider = new GoogleAuthProvider();

export { auth, storage, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };

// Helper to upload base64 images (signatures/selfies) to Firebase Storage
export async function uploadBase64Image(base64Str: string, path: string): Promise<string> {
  if (!storage) throw new Error("Firebase storage not initialized");
  
  try {
    const storageRef = ref(storage, path);
    // uploadString handles base64 data URIs perfectly
    await uploadString(storageRef, base64Str, 'data_url');
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Firebase Storage Upload Error:", error);
    // In local development fallback, return the original base64 string so the app still functions perfectly!
    return base64Str;
  }
}
