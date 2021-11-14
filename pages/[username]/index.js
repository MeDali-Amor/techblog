import { getDocs, orderBy, where, query, limit } from "@firebase/firestore";
import React from "react";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import {
    getUserWithUsername,
    queryPostsByUser,
    postToJSON,
} from "../../libraries/firebase";

const UserProfilePage = ({ user, posts }) => {
    return (
        <div>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </div>
    );
};
export default UserProfilePage;

export async function getServerSideProps({ query }) {
    const { username } = query;
    let user = { username: "dali" };
    let posts = null;
    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
        return {
            notFound: true,
        };
    }

    if (userDoc) {
        user = userDoc.data();
        const userRef = userDoc.ref;
        const res = await queryPostsByUser(userRef);
        posts = res.map(postToJSON);
    }

    return {
        props: { user, posts },
    };
}
