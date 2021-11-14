import { firestore, auth } from "../libraries/firebase";
import { increment, doc, writeBatch } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

const LikeButton = ({ postRef }) => {
    const likeRef = doc(postRef, "likeCol", auth.currentUser.uid);
    const [likeDoc] = useDocument(likeRef);
    console.log(postRef.path);

    const likeHandler = async () => {
        const uid = auth.currentUser.uid;
        const batch = writeBatch(firestore);

        batch.update(postRef, { likes: increment(1) });
        batch.set(likeRef, { uid });

        await batch.commit();
    };

    const unlikeHandler = async () => {
        const batch = writeBatch(firestore);

        batch.update(postRef, { likes: increment(-1) });
        batch.delete(likeRef);

        await batch.commit();
    };

    return likeDoc?.data() ? (
        <button className="btn-blue" onClick={unlikeHandler}>
            Unlike
        </button>
    ) : (
        <button className="btn-blue" onClick={likeHandler}>
            Like
        </button>
    );
};

export default LikeButton;
