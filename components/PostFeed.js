import React from "react";
import Post from "./Post";

const PostFeed = ({ posts, admin }) => {
    return (
        <div className="post-feed">
            {posts
                ? posts.map((post) => (
                      <Post post={post} key={post.slug} admin={admin} />
                  ))
                : null}
        </div>
    );
};

export default PostFeed;
