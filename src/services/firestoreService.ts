import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    role: 'farmer' | 'trader';
    createdAt?: unknown;
}

/** Create or overwrite a user profile document in Firestore. */
export async function createUserProfile(uid: string, data: Omit<UserProfile, 'uid' | 'createdAt'>) {
    const ref = doc(db, 'users', uid);
    await setDoc(ref, {
        ...data,
        uid,
        createdAt: serverTimestamp(),
    });
}

/** Fetch a user profile document from Firestore. Returns null if not found. */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
}

/** Update specific fields on a user profile document. */
export async function updateUserProfile(uid: string, data: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>) {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, data);
}
