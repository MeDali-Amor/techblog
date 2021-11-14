import { useState, useEffect } from "react";
import { auth, firestore } from "../libraries/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, onSnapshot } from "firebase/firestore";
export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);
    useEffect(() => {
        let unsub;
        if (user) {
            const userRef = doc(firestore, "users", user.uid);
            unsub = onSnapshot(userRef, (doc) => {
                setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null);
        }
        return unsub;
    }, [user]);
    return { user, username };
}
