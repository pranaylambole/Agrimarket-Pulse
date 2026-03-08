import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUserProfile } from '../services/firestoreService';

interface AuthContextValue {
    currentUser: User | null;
    loading: boolean;
    signup: (email: string, password: string, name: string, role: 'farmer' | 'trader') => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    async function signup(email: string, password: string, name: string, role: 'farmer' | 'trader') {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(user.uid, { name, email, role });
    }

    async function login(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email, password);
    }

    async function logout() {
        await signOut(auth);
    }

    const value: AuthContextValue = { currentUser, loading, signup, login, logout };

    // Don't render children until we know auth state (avoids flicker)
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
