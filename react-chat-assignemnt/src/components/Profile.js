import styles from '../styles/Profile.module.css'
import {useState, useContext, useEffect} from 'react'
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import { AuthContext } from "./AuthContext"
import { doc, updateDoc, getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { FirebaseContext } from "../utils/Firebase"


function Profile( {username, setUsername} ) {

        const [newUsername, setNewUsername] = useState(username)
        const [profilePhotoURL, setProfilePhotoURL] = useState("");
        const { authInfo, setAuthInfo } = useContext(AuthContext);
      

        const storage = getStorage();
        const firebase = useContext(FirebaseContext)
        const db = getFirestore(firebase)
        
        
        useEffect(async() => {
            setProfilePhotoURL(authInfo.photoURL)
        },[])

        const handleNewUsername = (e) => {
        setNewUsername(e.target.value)
    }

        const saveUsername = async(e) => {
        e.preventDefault();
        setUsername(newUsername)
        const usernameRef = doc(db, "users", `${authInfo.userID}`);
        await updateDoc(usernameRef, {
                username: newUsername
                });
        authInfo.username = newUsername
        setAuthInfo(authInfo)
        const q = query(collection(db, "tweets"), where("userID", "==", `${authInfo.userID}`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async(document) => {
            const tweetRef = doc(db, "tweets", `${document.id}`);
            await updateDoc(tweetRef, {
                username: newUsername
                });
});
        alert("Username Saved!")
    }
   
    
    return <div className={styles.wrapper}>
                <h1 className={styles.profile}>Profile</h1>
                <img className={styles.image} src={profilePhotoURL}/>
                <form onSubmit={saveUsername} className={styles.form}>
                        <label className={styles.username}>User Name</label>
                        <input className={styles.input} type="text" value={newUsername} onChange={handleNewUsername} placeholder="enter username" />
                        <button className={styles.submit} type="submit">Save</button>
                </form>
            </div>
    }
    export default Profile