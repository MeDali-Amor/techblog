import PrivateRoute from "../../components/PrivateRoute";
import { kebabCase } from "lodash";
import { useState, useContext, useEffect } from "react";
// import { UserContext } from "../libraries/context";
import {
    firestore,
    auth,
    // serverTimestamp,
    queryPostsByUser,
    postToJSON,
} from "../../libraries/firebase";
import { serverTimestamp } from "firebase/firestore";

import { useRouter } from "next/dist/client/router";
import toast from "react-hot-toast";
import { useCollection } from "react-firebase-hooks/firestore";
import PostFeed from "../../components/PostFeed";
import { collection, doc, orderBy, query, setDoc } from "@firebase/firestore";
import { UserContext } from "../../libraries/context";
const AdminPage = () => {
    return (
        <div
            className="admin-page
        "
        >
            <PrivateRoute>
                <h1 className="admin-banner">Manage your Posts</h1>
                <CreatePost />
                <PostList />
            </PrivateRoute>
        </div>
    );
};

export default AdminPage;

function PostList() {
    // const posts = [];
    const q = query(
        collection(firestore, "users", auth.currentUser.uid, "posts"),
        orderBy("createdAt", "desc")
    );
    const [querySnapshot] = useCollection(q);

    // const posts = querySnapshot?.map((doc) => doc.data);
    const posts = querySnapshot?.docs.map((doc) => doc.data());

    console.log(posts);

    return <div>{<PostFeed posts={posts} admin={true} />}</div>;
}

function CreatePost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState("");
    const slug = encodeURI(kebabCase(title));

    const isValid = title.length > 3 && title.length < 100;

    const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(firestore, "users", uid, "posts", slug);

        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: "# New post",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            likes: 0,
        };

        await setDoc(ref, data);
        toast.success("New Post Created!");
        router.push(`/admin/${slug}`);
    };

    return (
        <form onSubmit={createPost} className="title-form">
            <input
                className={
                    isValid ? "input-title valid" : "input-title not-valid"
                }
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post Title"
            />
            <div className="form-footer">
                <span>
                    <strong>Slug:</strong>

                    {slug}
                </span>
                <button type="submit" disabled={!isValid} className="btn-green">
                    Create New Post
                </button>
            </div>
        </form>
    );
}
