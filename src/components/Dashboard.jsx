import { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import { storage, firestore as db } from "../firebase";

import { AuthContext } from "../AuthContext";
import StyledDropzone from "./StyledDropzone";

const storageRef = storage.ref();
const firestoreImagesRef = db.collection("images");

function Dashboard({ onLogout }) {
  const { authState } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({
    pending: false,
    isDone: true,
  });

  useEffect(() => {
    let firestoreListener;
    if (authState.isSignedIn && authState.user) {
      firestoreListener = firestoreImagesRef
        .where("userId", "==", authState.user.uid)
        .onSnapshot((querySnapshot) => {
          const firestoreImages = querySnapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          });
          setImages(firestoreImages);
        });
    }

    return () => {
      if (firestoreListener) {
        firestoreListener();
      }
    };
  }, [authState.user, authState.isSignedIn]);

  const onUpload = async () => {
    if (files.length === 0) return;

    files.forEach((file) => {
      const imageRef = storageRef.child(file.name);
      const uploadTask = imageRef.put(file);

      setUploadStatus({ pending: true, isDone: false });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => {
            return { ...prev, [file.name]: progress };
          });
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            firestoreImagesRef.add({
              url: downloadURL,
              userId: authState.user.uid,
            });
            setFiles([]);
            setUploadProgress({});
            setUploadStatus({
              pending: false,
              isDone: true,
            });
          });
        }
      );
    });
  };

  const onDropFiles = (files) => {
    setFiles(files);
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="mb-16">
          <p className="text-xl font-bold">Photos</p>

          <p className="my-1">Welcome, {authState.user.displayName}!</p>
          <button
            onClick={onLogout}
            className="bg-red-400 hover:bg-red-500 text-white rounded p-2"
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </div>
        <div className="ml-16">
          <div className="flex flex-col items-center my-5">
            <p>Upload an image</p>
            <StyledDropzone
              onDropFiles={onDropFiles}
              uploadProgress={uploadProgress}
              uploadStatus={uploadStatus}
            />
            <button
              onClick={onUpload}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              <FontAwesomeIcon icon={faFileUpload} />{" "}
              <span className="px-1">Upload</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-full">
        {images.map((image) => (
          <div className="h-48 w-48 mx-1 mt-2" key={image.id}>
            <img
              src={image.url}
              className="object-scale-down  h-48 w-full"
            ></img>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
