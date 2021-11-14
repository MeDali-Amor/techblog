import React from "react";

const UserProfile = ({ user }) => {
    return (
        <div className="user-info">
            <img src={user.photoURL} className="user-profile-img" />
            <p>
                <i>@{user.username}</i>
            </p>
            <h1>{user.displayName}</h1>
        </div>
    );
};

export default UserProfile;
