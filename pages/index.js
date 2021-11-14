import Loader from "../components/Loader";
import styles from "../styles/Home.module.css";
import toast from "react-hot-toast";

import {
    queryPosts,
    postToJSON,
    morePostsQuery,
    millis,
} from "../libraries/firebase";
import { useState } from "react";
import PostFeed from "../components/PostFeed";
import { limit } from "@firebase/firestore";

// global vars
const LIMIT = 5;
export default function Home(props) {
    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);
    const [postsEnd, setPostsEnd] = useState(false);
    console.log(posts);

    const getMorePosts = async () => {
        setLoading(true);
        const last = posts[posts.length - 1];
        const curser =
            // typeof last.createdAt === "number"
            //     ? millis(last).createdAt
            //     :
            last.createdAt;
        const res = await morePostsQuery(curser, LIMIT);
        console.log(res);
        console.log(typeof curser);
        setPosts(posts.concat(res));
        setLoading(false);
        if (res.length < LIMIT) {
            setPostsEnd(true);
        }
    };
    return (
        <div className="home">
            <div className="home-banner">
                <h1>Title title title</h1>
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Eius temporibus perspiciatis adipisci in minima ratione id
                    quos, enim incidunt, nesciunt natus, similique a modi
                    aliquam officia culpa. Unde, ut saepe.
                </p>
            </div>
            <PostFeed posts={posts} />
            <div className="loder-home">
                {posts.length > 0 && !loading && !postsEnd && (
                    <button className="btn-blue" onClick={getMorePosts}>
                        Load more
                    </button>
                )}
                <Loader loading={loading} />
                {postsEnd && <div>You have reached the end!</div>}
            </div>
        </div>
    );
}
export async function getServerSideProps(context) {
    const res = await queryPosts(LIMIT);
    const posts = res.map(postToJSON);
    return {
        props: { posts },
    };
}
