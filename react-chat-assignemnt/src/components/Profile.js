import styles from "../styles/Profile.module.css";
import { useState, useContext, useEffect, createRef } from "react";
import { getDownloadURL, ref, getStorage, uploadBytes } from "firebase/storage";
import { AuthContext } from "./AuthContext";
import { doc, updateDoc, getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { FirebaseContext } from "../utils/Firebase";
import { getAuth, updatePassword } from "firebase/auth";

function Profile({ username, setUsername }) {
  const [newUsername, setNewUsername] = useState(username);
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [profilePhotoURL, setProfilePhotoURL] = useState("");
  const { authInfo, setAuthInfo } = useContext(AuthContext);

  const auth = getAuth();
  const user = auth.currentUser;
  const firebase = useContext(FirebaseContext);
  const db = getFirestore(firebase);
  const fileInputRef = createRef();
  const storage = getStorage();

  useEffect(async () => {
    setProfilePhotoURL(authInfo.photoURL);
  }, []);

  const handleNewUsername = (e) => {
    setNewUsername(e.target.value);
  };
  const handleNewPassowrd = (e) => {
    setNewPassword(e.target.value);
  };
  const handleRePassowrd = (e) => {
    setRePassword(e.target.value);
  };

  const saveUsername = async (e) => {
    e.preventDefault();
    try {
      setUsername(newUsername);
      const usernameRef = doc(db, "users", `${authInfo.userID}`);
      await updateDoc(usernameRef, {
        username: newUsername,
      });
      authInfo.username = newUsername;
      setAuthInfo(authInfo);
      const q = query(collection(db, "tweets"), where("userID", "==", `${authInfo.userID}`));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        const tweetRef = doc(db, "tweets", `${document.id}`);
        await updateDoc(tweetRef, {
          username: newUsername,
        });
      });
      alert("Username Saved!");
    } catch (error) {
      console.log(error);
    }
  };

  const uploadNewPhoto = async (e) => {
    e.preventDefault();
    try {
      const photoToUpload = fileInputRef.current.files[0];
      const uniquePhotoId = `id${photoToUpload.name}` + Math.random().toString(16).slice(2);
      const storageRef = ref(storage, uniquePhotoId);
      const uploadPhoto = await uploadBytes(storageRef, photoToUpload);
      if (uploadPhoto.metadata) {
        const starsRef = ref(storage, `${uniquePhotoId}`);
        const photoURLFromStorage = await getDownloadURL(starsRef);
        await updateDoc(doc(db, "users", `${authInfo.userID}`), {
          photoURL: photoURLFromStorage,
        });
        const q = query(collection(db, "tweets"), where("userID", "==", `${authInfo.userID}`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
          const photoRef = doc(db, "tweets", `${document.id}`);
          await updateDoc(photoRef, {
            userPhotoURL: photoURLFromStorage,
          });
        });
        alert("Photo Saved!");
        authInfo.photoURL = photoURLFromStorage;
        setProfilePhotoURL(photoURLFromStorage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("Please enetr at least 6 digit password");
    } else if (newPassword === rePassword) {
      updatePassword(user, newPassword)
        .then(() => {
          alert("Password Changed Succesfully!");
          setNewPassword("");
          setRePassword("");
        })
        .catch((error) => {
          alert(`${error}`);
        });
    } else {
      alert("Passwords Didn't Match!");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.profile}>Profile</h1>
      <img className={styles.image} src={profilePhotoURL} />
      <form onSubmit={uploadNewPhoto} className={styles.form}>
        <label className={styles.username}>Change Profile Photo:</label>
        <input className={styles.file} type="file" accept="image/png, image/gif, image/jpeg" required ref={fileInputRef} />
        <button className={styles.submit} type="submit">
          Upload!
        </button>
      </form>
      <form onSubmit={saveUsername} className={styles.form}>
        <label className={styles.username}>Change User Name:</label>
        <input className={styles.input} type="text" value={newUsername} onChange={handleNewUsername} placeholder="enter username" />
        <button className={styles.submit} type="submit">
          Save
        </button>
      </form>
      {!authInfo.googleAccount && (
        <form onSubmit={changePassword} className={styles.form}>
          <label className={styles.username}>Change Password:</label>
          <input className={styles.input} type="password" value={newPassword} onChange={handleNewPassowrd} placeholder="enter new password" />
          <label className={styles.username}>Repeat Password:</label>
          <input className={styles.input} type="password" value={rePassword} onChange={handleRePassowrd} placeholder="repeat new username" />
          <button className={styles.submit} type="submit">
            Save
          </button>
        </form>
      )}
    </div>
  );
}
export default Profile;
