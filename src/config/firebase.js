import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, signInWithPopup, signOut } from 'firebase/auth';
import { GoogleAuthProvider } from "firebase/auth";

import { getFirestore } from 'firebase/firestore';
import { collection, doc, getDoc, addDoc, setDoc, deleteDoc } from 'firebase/firestore';

import { useNavigate } from "react-router-dom";

const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_APIKEY}`,
  authDomain: `${process.env.REACT_APP_FIREBASE_AUTHDOMAIN}`,
  projectId: `${process.env.REACT_APP_FIREBASE_PROJECTID}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGEBUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID}`,
  appId: `${process.env.REACT_APP_FIREBASE_APPID}`,
  measurementId: `${process.env.REACT_APP_FIREBASE_MEASUREMENTID}`
};

class Firebase {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);

    this.provider = new GoogleAuthProvider();
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }

  // Auth
  authUser = () => this.auth.currentUser;
  doSignIn = () => signInWithPopup(this.auth, this.provider);
  doSignOut = () => {
    signOut(this.auth);
    useNavigate()('/');
  }

  // Firestore
  getDocument = (col, item) => getDoc(doc(this.db, col, item));
  addDocument = (col, data) => addDoc(collection(this.db, col), data);
  setDocument = (col, item, data) => setDoc(doc(this.db, col, item), data,{merge: true});
  deleteDocument = (col, item) => deleteDoc(doc(this.db, col, item));

  getUser = uid => this.getDocument('users', uid);
  getCurrentUser = () => this.auth.currentUser ? this.getUser(this.auth.currentUser.uid) : Promise.reject("User Unknown");
  setCurrentUserData = data => this.setDocument('users', this.auth.currentUser.uid, data);
}

export default Firebase;