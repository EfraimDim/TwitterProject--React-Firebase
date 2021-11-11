import { useContext, useEffect, useState } from "react"
import { FirebaseContext } from "../utils/Firebase"
import {AuthContext} from "./AuthContext"
import styles from "../styles/ViewAnotherUser.module.css"
import { getFirestore, getDoc, updateDoc, arrayUnion, arrayRemove, doc} from "firebase/firestore"


function ViewAnotherUser() {

    const [viewedProfileURL, setViewedProfileURL] = useState('')
    const [viewedProfileUsername, setViewedProfileUsername] = useState('')
    const [viewdFollowersStats, setViewedFollowersStats] = useState('')
    const [viewFollowedStats, setViewFollowedStats] = useState('')
  

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
        setViewFollowedStats(usersProfile.followerID.length)
        setViewedFollowersStats(usersProfile.followingID.length)
        }catch(error){
            console.log(error)
        }}
       ,[]) 

       const followUser = async(userID) => {
        try{
        authInfo.followingID.push(userID)
        setViewFollowedStats(viewFollowedStats+1)

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
        const userDisplayInfo = {photoURL: user.photoURL, userID:userID, username:user.username, followers: user.followerID.length, following: user.followingID.length}
        setMyFollowing([...myFollowing, userDisplayInfo])

      setFollowStatus(true)
    }catch(error){
        console.log(error)
    }}

    const unfollowUser = async(userID) => {
        try{
        setViewFollowedStats(viewFollowedStats-1)
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
        <div className={styles.userWrapper}>
        <img className={styles.image} src={viewedProfileURL}/>
        <div className={styles.textWrapper}>
                <label className={styles.username}>User Name:</label>
                <label className={styles.input}>{viewedProfileUsername}</label><br></br>
                <label className={styles.username}>Stats:</label>
                <label className={styles.input}>Followers: {viewFollowedStats} Following: {viewdFollowersStats}</label>
                </div>
                </div>
                {viewedUserID === authInfo.userID ? <></> :
                     <>{followStatus ? 
                    <div className={styles.following} onClick={() => unfollowUser(viewedUserID)} >Unfollow</div> 
                    :  <div className={styles.unfollow} onClick={() => followUser(viewedUserID)} >Follow</div>}
                    </>}
               
      
    </div>
    )

    }
    export default ViewAnotherUser