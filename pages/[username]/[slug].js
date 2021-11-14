import {
    collection,
    collectionGroup,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
} from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import PostContent from "../../components/PostContent";
import {
    firestore,
    getUserWithUsername,
    postToJSON,
} from "../../libraries/firebase";
import { useDocument } from "react-firebase-hooks/firestore";

const PostPage = (props) => {
    const [realtimeData, setRealtimeData] = useState(null);
    useEffect(() => {
        const unsub = onSnapshot(doc(firestore, props.path), (doc) => {
            setRealtimeData(doc.data());
        });
        return unsub;
    }, [doc]);

    const post = realtimeData || props.post;
    // console.log(post);

    return (
        <div>
            {" "}
            <PostContent post={post} />{" "}
        </div>
    );
};

export default PostPage;

export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if (userDoc) {
        const colRef = collection(userDoc.ref, "posts");
        const postRef = doc(colRef, `${slug}`);
        const snapShot = await getDoc(postRef);
        const res = snapShot.data();
        post = postToJSON(res);
        path = postRef.path;
        // console.log(post);
        // console.log(path);
    }
    return {
        props: {
            post,
            path,
        },
        revalidate: 5000,
    };
}
export async function getStaticPaths() {
    const allPostsRef = await collectionGroup(firestore, "posts");
    const snapShot = await getDocs(allPostsRef);
    const paths = snapShot.docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug },
        };
    });
    return {
        paths,
        fallback: "blocking",
    };
}
