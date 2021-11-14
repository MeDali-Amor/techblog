import Link from "next/link";
import { signOut } from "@firebase/auth";
import { auth } from "../libraries/firebase";
import { useContext } from "react";
import { UserContext } from "../libraries/context";

const Navbar = () => {
    const { user, username } = useContext(UserContext);
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <h1 className="logo">TechBlog</h1>
                    </Link>
                </li>
                {username && (
                    <>
                        <li>
                            <ul className="nav-right">
                                <li>
                                    <Link href={`${username}`}>
                                        <img src={user?.photoURL} />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin">
                                        <button className="btn-blue">
                                            Add Posts
                                        </button>
                                    </Link>
                                </li>

                                <li>
                                    <button
                                        onClick={() => signOut(auth)}
                                        className="signout-btn"
                                    >
                                        Sign out
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </>
                )}
                {!username && (
                    <>
                        <Link href="/signin">
                            <button className="btn-blue">Sign In</button>
                        </Link>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
