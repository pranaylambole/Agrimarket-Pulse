import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate that all required env vars are present
const missingVars = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k);

if (missingVars.length > 0) {
    console.error(
        '[Firebase] Missing environment variables:',
        missingVars.join(', '),
        '\nMake sure all VITE_FIREBASE_* variables are set in your .env file (local) or Vercel project settings (production).'
    );
}

// Avoid re-initializing if HMR re-runs this module
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
