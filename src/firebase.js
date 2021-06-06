import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyChtUt_1duRWpNadoOQElh2xyIY807kh-E",
  authDomain: "photos-43f51.firebaseapp.com",
  projectId: "photos-43f51",
  storageBucket: "photos-43f51.appspot.com",
  messagingSenderId: "550237548114",
  appId: "1:550237548114:web:ab8b9f3c0090252697398b",
});

export const auth = firebase.auth();
export const storage = firebase.storage();
export const firestore = firebase.firestore();

export default firebase;
