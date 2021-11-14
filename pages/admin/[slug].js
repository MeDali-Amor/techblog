import React, { useState } from "react";
import PrivateRoute from "../../components/PrivateRoute";
// import Metatags from "../../components/Metatags";
import { firestore, auth } from "../../libraries/firebase";
import { serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/dist/client/router";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import ReactMarkdown from "react-markdown";
import { useForm } from "react-hook-form";
import Link from "next/dist/client/link";
import toast from "react-hot-toast";
import ImageUploader from "../../components/ImageUploader";
const EditPost = () => {
    return (
        <div>
            <PrivateRoute>
                <PostManager />
            </PrivateRoute>
        </div>
    );
};

export default EditPost;
function PostManager() {
    const [preview, setPreview] = useState(false);
    const router = useRouter();
    const { slug } = router.query;
    const postRef = doc(
        firestore,
        "users",
        auth.currentUser.uid,
        "posts",
        slug
    );
    const [post] = useDocumentDataOnce(postRef);

    return (
        <div className="edit-post">
            {post && (
                <>
                    <div>
                        {/* <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p> */}
                        <PostForm
                            postRef={postRef}
                            defaultValues={post}
                            preview={preview}
                            title={post.title}
                            slug={post.slug}
                        />
                    </div>
                    <aside className="tools">
                        <h3>Tools</h3>
                        <button
                            className="btn-blue"
                            onClick={() => setPreview(!preview)}
                        >
                            {preview ? "Edit" : "Preview"}
                        </button>

                        <button className="btn-blue">
                            <Link href={`/${post.username}/${post.slug}`}>
                                Live view
                            </Link>
                        </button>
                    </aside>
                </>
            )}
        </div>
    );
}

function PostForm({ defaultValues, postRef, preview, title, slug }) {
    const { handleSubmit, watch, register, reset } = useForm({
        defaultValues,
        mode: "onChange",
    });

    const updatePost = async ({ content, published }) => {
        await updateDoc(postRef, {
            content,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({ content, published });
        toast.success("Post updated successfully");
    };

    return (
        <form onSubmit={handleSubmit(updatePost)} className="post-form">
            {preview ? (
                <div className="post-display">
                    <h1>{title}</h1>
                    <p>ID: {slug}</p>

                    <ReactMarkdown>{watch("content")}</ReactMarkdown>
                </div>
            ) : (
                <div className="form-control">
                    <h1>{title}</h1>
                    <p>ID: {slug}</p>
                    <ImageUploader />
                    <textarea
                        name="content"
                        {...register("content", { required: true })}
                    ></textarea>
                </div>
            )}

            <div className="form-control bottom">
                <fieldset>
                    <input
                        type="checkbox"
                        name="published"
                        {...register("published")}
                    />
                    <label>Published</label>
                </fieldset>
                <button className="btn-green" type="submit">
                    Save Changes
                </button>
            </div>
        </form>
    );
}
