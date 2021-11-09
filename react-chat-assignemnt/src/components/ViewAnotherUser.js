import { useContext, useEffect, useState } from "react"
import { getFirestore, getDoc, doc} from "firebase/firestore"
import { FirebaseContext } from "../utils/Firebase"
import {AuthContext} from "./AuthContext"
import styles from "../styles/ViewAnotherUser.module.css"


function ViewAnotherUser() {

    const [viewedProfileURL, setViewedProfileURL] = useState('')
    const [viewedProfileUsername, setViewedProfileUsername] = useState('')

    const {  viewedUserID  } = useContext(AuthContext);

    const firebase = useContext(FirebaseContext)
    const db = getFirestore(firebase)


    useEffect(async() => {
        const docRef = doc(db, "users", `${viewedUserID}`);
        const docSnap = await getDoc(docRef);
        const usersProfile = docSnap.data()
        setViewedProfileUsername(usersProfile.username)
            setViewedProfileURL(usersProfile.photoURL)
        }
       ,[]) 
    
    
    return (    
    
    <div className={styles.wrapper}>
        <h1 className={styles.profile}>User Profile:</h1>
        <img className={styles.image} src={viewedProfileURL}/>
                <label className={styles.username}>User Name:</label>
                <label className={styles.input}>{viewedProfileUsername}</label>
               
      
    </div>
    )

    }
    export default ViewAnotherUser