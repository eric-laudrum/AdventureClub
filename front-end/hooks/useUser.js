import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function useUser() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
                
                const adminId = import.meta.env.VITE_FIREBASE_ADMIN?.trim();
                const isMatch = String(authUser.uid).trim() === String(import.meta.env.VITE_FIREBASE_ADMIN).trim();

                console.log("Logged in UID:", authUser.uid);
                console.log("Target Admin UID:", adminId);

            
                
                console.log("Admin Match Status:", isMatch);
                setIsAdmin(isMatch);
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    return { user, isLoading, isAdmin };
}