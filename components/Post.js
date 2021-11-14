import React from "react";
import Link from "next/link";

const Post = ({ post, admin = false }) => {
    const wordcount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordcount / 100 + 1).toFixed(0);
    return (
        <div className="post-card">
            <div className="post-header">
                <Link href={`/${post.username}`}>
                    <a>
                        <strong>By @{post.username}</strong>
                    </a>
                </Link>
                {admin && (
                    <button className="btn-blue">
                        <Link href={`/admin/${post.slug}`}>Edit</Link>
                    </button>
                )}
            </div>
            <div className="post-title">
                <Link href={`/${post.username}/${post.slug}`}>
                    <a>{post.title}</a>
                </Link>
            </div>
            <div className="post-footer">
                <span>
                    {wordcount} words {minutesToRead} min read
                </span>
                <span>{post.likes} likes</span>
            </div>
        </div>
    );
};

export default Post;
