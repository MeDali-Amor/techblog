import { signInWithPopup, signOut } from "@firebase/auth";
import { auth, provider, firestore } from "../libraries/firebase";
import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../libraries/context";
import { getDoc, doc, writeBatch, collection } from "@firebase/firestore";
import { debounce } from "lodash";
import Link from "next/link";

const SigninPage = () => {
    const { user, username } = useContext(UserContext);
    const [formInput, setFormInput] = useState("");
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error(error);
        }
    };
    const changeHandler = (e) => {
        const val = e.target.value.toLowerCase();
        const reg = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (reg.test(val)) {
            // setFormInput(val);
            setLoading(true);
            setValid(false);
        }
        setFormInput(val);
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const userRef = doc(firestore, "users", `${user.uid}`);
            const usernameRef = doc(firestore, "usernames", `${formInput}`);
            const batch = writeBatch(firestore);
            batch.set(userRef, {
                username: formInput,
                photoURL: user.photoURL,
                displayName: user.displayName,
            });
            batch.set(usernameRef, { uid: user.uid });
            await batch.commit();
        } catch (error) {
            console.error(error);
        }
    };
    const checkUserName = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                try {
                    const collRef = collection(firestore, "usernames");
                    const ref = doc(
                        firestore,
                        "usernames",
                        // `${username}`,
                        `${username}`
                    );
                    const docSnap = await getDoc(ref);
                    if (docSnap.exists()) {
                        console.log("executed");
                        setValid(false);
                    } else {
                        console.log("executed");
                        setValid(true);
                    }
                    setLoading(false);
                    console.log(valid);
                } catch (error) {
                    console.error(error);
                }
            }
        }, 500),
        []
    );
    useEffect(() => {
        checkUserName(formInput);
    }, [formInput]);
    return (
        <div className="sign-page">
            {user ? (
                !username ? (
                    <form onSubmit={submitHandler} className="username-form">
                        <h3>Choose a valid username</h3>

                        <label>
                            {/* username */}
                            <input
                                type="text"
                                name="username"
                                placeholder="username"
                                value={formInput}
                                onChange={changeHandler}
                                className={valid ? "valid" : "not-valid"}
                            />
                        </label>
                        <button
                            className="btn-green"
                            type="submit"
                            disabled={!valid}
                        >
                            Submit
                        </button>
                        {/* {loading ? (
                            <p>checking...</p>
                        ) : valid ? (
                            <p>{username} is available</p>
                        ) : username && !valid ? (
                            <p>{username} is taken</p>
                        ) : (
                            <p></p>
                        )} */}
                        <UsernameHandler
                            username={formInput}
                            valid={valid}
                            loading={loading}
                        />
                    </form>
                ) : (
                    <div className="signout-container">
                        <Link href="/">
                            <h3 className="home-link">Home</h3>
                        </Link>
                        <button
                            className="btn-blue"
                            onClick={() => signOut(auth)}
                        >
                            Sign out
                        </button>
                    </div>
                )
            ) : (
                <div style={{ transform: "translateY(-35%)" }}>
                    <h3 style={{ textAlign: "center" }}>Welcome To TechBlog</h3>
                    <button className="btn-google" onClick={signInWithGoogle}>
                        <img src="/google.png" alt="" />{" "}
                        <span>Sign in with Google</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SigninPage;

function UsernameHandler({ username, valid, loading }) {
    if (loading) {
        return <p className="username-status">Checking...</p>;
    } else if (valid) {
        return <p className="username-status">{username} is available!</p>;
    } else if (username && !valid) {
        return <p className="username-status">{username} is taken</p>;
    } else {
        return <p></p>;
    }
}
