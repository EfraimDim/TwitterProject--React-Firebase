import React from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useState, useContext } from "react";
import styles from "../styles/Login.module.css";
import { AuthContext } from "./AuthContext";
import { createRef } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FirebaseContext } from "../utils/Firebase";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

export default function Login() {
  const [usernameSignUp, setUsername] = useState("");
  const [emailSignUp, setEmailSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [rePasswordSignUp, setRePasswordSignUp] = useState("");
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [accountBeingCreated, setAccountBeingCreated] = useState(false);

  const { login, isSignUp } = useContext(AuthContext);

  const fileInputRef = createRef();
  const storage = getStorage();
  const firebase = useContext(FirebaseContext);
  const db = getFirestore(firebase);

  const handleUsernameSignUp = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailSignUp = (e) => {
    setEmailSignUp(e.target.value);
  };
  const handlePasswordSignUp = (e) => {
    setPasswordSignUp(e.target.value);
  };
  const handleRePasswordSignUp = (e) => {
    setRePasswordSignUp(e.target.value);
  };

  const handleEmailLogin = (e) => {
    setEmailLogin(e.target.value);
  };
  const handlePasswordLogin = (e) => {
    setPasswordLogin(e.target.value);
  };

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setAccountBeingCreated(true);
      if (passwordSignUp === rePasswordSignUp) {
        const photoToUpload = fileInputRef.current.files[0];
        const uniquePhotoId = `id${photoToUpload.name}` + Math.random().toString(16).slice(2);
        const storageRef = ref(storage, uniquePhotoId);
        const createAccount = await createUserWithEmailAndPassword(auth, emailSignUp, passwordSignUp);
        if (createAccount.user) {
          const uploadPhoto = await uploadBytes(storageRef, photoToUpload);
          if (uploadPhoto.metadata) {
            const starsRef = ref(storage, `${uniquePhotoId}`);
            const photoURLFromStorage = await getDownloadURL(starsRef);
            alert(`Account Created ${usernameSignUp}`);
            const userInfo = {
              email: emailSignUp,
              userID: createAccount.user.uid,
              username: usernameSignUp,
              photoURL: photoURLFromStorage,
              googleAccount: false,
              likedTweets: [],
              followerID: [],
              followingID: [],
            };
            const docRef = await setDoc(doc(db, "users", `${createAccount.user.uid}`), userInfo);
            login(userInfo);
          }
        }
      } else {
        alert("passwords didn't match!");
      }
      setAccountBeingCreated(false);
    } catch (error) {
      console.log(error);
      alert(`${error}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const signIn = await signInWithEmailAndPassword(auth, emailLogin, passwordLogin);
      if (signIn.user) {
        const { uid } = signIn.user;
        const docRef = doc(db, "users", `${uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          login(docSnap.data());
        }
      } else {
        alert("Email or Password incorrect");
      }
    } catch (error) {
      console.log(error);
      alert(`${error}`);
    }
  };

  const handleGoogleLogin = async (e) => {
    try {
      e.preventDefault();
      const googleSignIn = await signInWithPopup(auth, provider);
      if (googleSignIn.user) {
        const docRef = doc(db, "users", `${googleSignIn.user.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          login(docSnap.data());
        } else {
          const { displayName, email, photoURL, uid } = googleSignIn.user;
          const userInfo = {
            email: email,
            userID: uid,
            username: displayName,
            photoURL: photoURL,
            googleAccount: true,
            likedTweets: [],
            followerID: [],
            followingID: [],
          };
          const docRef = await setDoc(doc(db, "users", `${uid}`), userInfo);
          login(userInfo);
        }
      }
    } catch (error) {
      console.log(error);
      alert(`${error}`);
    }
  };

  return (
    <div>
      {isSignUp && (
        <>
          {accountBeingCreated ? (
            <div className={styles.loadSpinner}></div>
          ) : (
            <div className={styles.wrapper}>
              <div className={styles.signUpHeader}>Sign Up!</div>
              <form className={styles.form} onSubmit={handleSignUp}>
                <label className={styles.label}>Username</label>
                <input
                  className={styles.input}
                  required
                  type="text"
                  value={usernameSignUp}
                  onChange={handleUsernameSignUp}
                  placeholder="enter username"
                />
                <label className={styles.label}>Email</label>
                <input className={styles.input} required type="text" value={emailSignUp} onChange={handleEmailSignUp} placeholder="enter email" />
                <label className={styles.label}>Password</label>
                <input
                  className={styles.input}
                  required
                  type="password"
                  value={passwordSignUp}
                  onChange={handlePasswordSignUp}
                  placeholder="enter password"
                />
                <label className={styles.label}>Re Password</label>
                <input
                  className={styles.input}
                  required
                  type="password"
                  value={rePasswordSignUp}
                  onChange={handleRePasswordSignUp}
                  placeholder="repeat password"
                />
                <label className={styles.label}>Profile Picture</label>
                <input type="file" accept="image/png, image/gif, image/jpeg" required ref={fileInputRef} />
                <button type="submit" className={styles.submit}>
                  Sign Up
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {!isSignUp && (
        <div>
          <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleLogin}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} required type="text" value={emailLogin} onChange={handleEmailLogin} placeholder="enter email" />
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                required
                type="password"
                value={passwordLogin}
                onChange={handlePasswordLogin}
                placeholder="enter password"
              />
              <button type="submit" className={styles.submit}>
                Login
              </button>
            </form>
          </div>
          <div className={styles.googleLogin} onClick={handleGoogleLogin}>
            Login with Google
          </div>
        </div>
      )}
    </div>
  );
}
