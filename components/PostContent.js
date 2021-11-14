import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const PostContent = ({ post }) => {
    const createdAt =
        typeof post?.createdAt === "number"
            ? new Date(post.createdAt)
            : post.createdAt.toDate();
    // console.log(createdAt);
    return (
        <div className="post-display">
            <h1>{post?.title}</h1>
            <span className="text-sm">
                Posted by{" "}
                <Link href={`/${post.username}/`}>
                    <a>@{post.username}</a>
                </Link>{" "}
                on {createdAt.toDateString()}
            </span>
            <div className="post-content">
                <ReactMarkdown>{post?.content}</ReactMarkdown>
            </div>
        </div>
    );
};

export default PostContent;
