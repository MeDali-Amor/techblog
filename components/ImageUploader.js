import React, { useState } from "react";
import { auth, storage } from "../libraries/firebase";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";

import Loader from "./Loader";

const ImageUploader = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState(null);

    const uploadImg = async (e) => {
        const file = Array.from(e.target.files)[0];
        const extension = file.type.split("/")[1];
        const storageRef = ref(
            storage,
            `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
        );
        setUploading(true);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const pct = (
                    (snapshot.bytesTransferred / snapshot.totalBytes) *
                    100
                ).toFixed(0);
                setProgress(pct);
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((dURL) => {
                    setDownloadURL(dURL);
                    setUploading(false);
                });
            }
        );
    };

    return (
        <div className="uploader">
            {uploading ? (
                <div className="upload-info">
                    {/* <Loader loading={uploading} /> */}
                    <h3>{progress}%</h3>
                </div>
            ) : (
                <label className="upload-btn">
                    Upload an Image
                    <input
                        type="file"
                        onChange={uploadImg}
                        accept="image/x-png,image/gif,image/jpeg"
                    />
                </label>
            )}
            {/* <div className="upload-info">
                <Loader loading={uploading} />
                {uploading && <h3>{progress}</h3>}
            </div>
            {!uploading && (
                <>
                    <label className="upload-btn">
                        Upload an Image
                        <input
                            type="file"
                            onChange={uploadImg}
                            accept="image/x-png,image/gif,image/jpeg"
                        />
                    </label>
                </>
            )} */}
            <div className="code-snippet">
                {downloadURL && <code>{`![alt](${downloadURL})`}</code>}
            </div>
        </div>
    );
};

export default ImageUploader;
