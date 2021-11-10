import { useContext, useEffect, useState } from "react"
import { FirebaseContext } from "../utils/Firebase"
import {AuthContext} from "./AuthContext"
import styles from "../styles/ViewAnotherUser.module.css"
import { getFirestore, getDoc, updateDoc, arrayUnion, arrayRemove, doc} from "firebase/firestore"


function ViewAnotherUser() {

    const [viewedProfileURL, setViewedProfileURL] = useState('')
    const [viewedProfileUsername, setViewedProfileUsername] = useState('')
  

    const { viewedUserID, authInfo, myFollowing, setMyFollowing  } = useContext(AuthContext);
    const [followStatus, setFollowStatus] = useState(authInfo.followingID.includes(`${viewedUserID}`))

    const firebase = useContext(FirebaseContext)
    const db = getFirestore(firebase)


    useEffect(async() => {
        try{
        const docRef = doc(db, "users", `${viewedUserID}`);
        const docSnap = await getDoc(docRef);
        const usersProfile = docSnap.data()
        setViewedProfileUsername(usersProfile.username)
            setViewedProfileURL(usersProfile.photoURL)
        }catch(error){
            console.log(error)
        }}
       ,[]) 

       const followUser = async(userID) => {
        try{
        authInfo.followingID.push(userID)
        const followingRef = doc(db, "users", `${authInfo.userID}`);
        await updateDoc(followingRef, {
        followingID: arrayUnion(`${userID}`)
    })  
        const followerRef = doc(db, "users", `${userID}`);
        
        await updateDoc(followerRef, {
        followerID: arrayUnion(`${authInfo.userID}`)
    })  
        const docSnap = await getDoc(followerRef);
        const user = docSnap.data()
        const userDisplayInfo = {photoURL: user.photoURL, userID:userID, username:user.username}
        setMyFollowing([...myFollowing, userDisplayInfo])

      setFollowStatus(true)
    }catch(error){
        console.log(error)
    }}

    const unfollowUser = async(userID) => {
        try{
        authInfo.followingID.filter(followingID => followingID !== `${userID}`)
        const unfollowRef = doc(db, "users", `${authInfo.userID}`);
        await updateDoc(unfollowRef, {
        followingID: arrayRemove(`${userID}`)
    })  
        const removeFollowerRef = doc(db, "users", `${userID}`);
        await updateDoc(removeFollowerRef, {
        followerID: arrayRemove(`${authInfo.userID}`)
    })  
        const removeFollowerList = myFollowing
        const newFollowingList = removeFollowerList.filter(user => user.userID !== userID)
        setMyFollowing(newFollowingList)
        setFollowStatus(false)    
    }catch(error){
        console.log(error)
    }}
    
    
    return (    
    
    <div className={styles.wrapper}>
        <h1 className={styles.profile}>User Profile:</h1>
        <img className={styles.image} src={viewedProfileURL}/>
                <label className={styles.username}>User Name:</label>
                <label className={styles.input}>{viewedProfileUsername}</label>
                {viewedUserID === authInfo.userID ? <></> :
                     <>{followStatus ? 
                    <div className={styles.following} onClick={() => unfollowUser(viewedUserID)} >Unfollow</div> 
                    :  <div className={styles.unfollow} onClick={() => followUser(viewedUserID)} >Follow</div>}
                    </>}
               
      
    </div>
    )

    }
    export default ViewAnotherUser