import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Custom hooks
const useUser = () => {

    console.log("useUser hook")
    const [ isLoading, setIsLoading ] = useState( true );
    const [ user, setUser ] = useState( null );

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), user => {
            if (user) {
                // Add this logic:
                user.isAdmin = user.email === 'admin@mail.com'; 
            }
            setUser(user);
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    return { isLoading, user };
}

export default useUser;