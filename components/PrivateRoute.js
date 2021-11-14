import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../libraries/context";

const PrivateRoute = (props) => {
    const { username } = useContext(UserContext);
    return username
        ? props.children
        : props.fallback || <Link href="/signin">You must be signed in</Link>;
};

export default PrivateRoute;
