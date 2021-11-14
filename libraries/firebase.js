import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, Timestamp, FieldValue } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
    collection,
    collectionGroup,
    doc,
    query,
    where,
    getDocs,
    limit,
    orderBy,
    startAfter,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyChCZ0iRfhcSXFILGIgUd9pMgCgTfv0ITY",
    authDomain: "next-blog-841ca.firebaseapp.com",
    projectId: "next-blog-841ca",
    storageBucket: "next-blog-841ca.appspot.com",
    messagingSenderId: "491063178376",
    appId: "1:491063178376:web:0a5b0253bdd4b3c97b5b3d",
    measurementId: "G-574FETPX7D",
};

// Initialize Firebase
// if (!firebase.apps.length) {
const app = initializeApp(firebaseConfig);
// }
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const storage = getStorage();
export const firestore = getFirestore(app);
// export const serverTimestamp = FieldValue.serverTimestamp();

export async function getUserWithUsername(username) {
    const usersRef = collection(firestore, "users");
    const usersDocs = [];
    const q = query(
        collection(firestore, "users"),
        where("username", "==", username),
        limit(1)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        usersDocs.push(doc);
    });
    // const userDocArray = await getDocs(q);
    const userDoc = usersDocs[0];
    return userDoc;
}
export async function queryPostsByUser(userRef) {
    const usersPosts = [];
    const postsQuery = query(
        collection(userRef, "posts"),
        where("published", "==", true),
        orderBy("createdAt", "desc")
        // limit(5)
    );
    const querySnapshot = await getDocs(postsQuery);
    querySnapshot.forEach((doc) => {
        usersPosts.push(doc.data());
    });
    return usersPosts;
}
export async function queryPosts(LIMIT) {
    const homePosts = [];
    const q = query(
        collectionGroup(firestore, "posts"),
        where("published", "==", true),
        orderBy("createdAt", "desc"),
        limit(LIMIT)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        homePosts.push(doc.data());
    });
    return homePosts;
}

export async function morePostsQuery(curser, LIMIT) {
    const morePosts = [];
    const q = query(
        collectionGroup(firestore, "posts"),
        where("published", "==", true),
        orderBy("createdAt", "desc"),
        startAfter(Timestamp.fromMillis(curser)),
        limit(LIMIT)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        morePosts.push(doc.data());
    });
    return morePosts;
}

export function postToJSON(doc) {
    return {
        ...doc,
        createdAt: doc.createdAt.toMillis(),
        updatedAt: doc.updatedAt.toMillis(),
    };
}
// export function millis(doc) {
//     return {
//         ...doc,
//         createdAt: Timestamp.fromMillis(doc.createdAt),
//         updatedAt: Timestamp.fromMillis(doc.updatedAt),
//     };
// }
