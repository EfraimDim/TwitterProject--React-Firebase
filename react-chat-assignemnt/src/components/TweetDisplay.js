import { useContext } from "react"
import { getFirestore, updateDoc, arrayUnion, arrayRemove, doc} from "firebase/firestore"
import { FirebaseContext } from "../utils/Firebase"
import {AuthContext} from "./AuthContext"
import styles from "../styles/Home.module.css"

function DisplayTweet({tweet, reRenderFunction}) {

    const firebase = useContext(FirebaseContext)
    const db = getFirestore(firebase)
    const { authInfo  } = useContext(AuthContext);

    const likeTweet = async(tweet) => {
        const tweetRef = doc(db, "tweets", `${tweet.id}`);
        const userRef = doc(db, "users", `${authInfo.userID}`);
        await updateDoc(tweetRef, {
        likersID: arrayUnion(`${authInfo.userID}`)}) 
        await updateDoc(userRef, {
            likedTweets: arrayUnion(`${tweet.id}`)
})
reRenderFunction()
};

    const unlikeTweet = async(tweet) => {
        const tweetRef = doc(db, "tweets", `${tweet.id}`);
        const userRef = doc(db, "users", `${authInfo.userID}`);
        await updateDoc(tweetRef, {
        likersID: arrayRemove(`${authInfo.userID}`)
    })
        await updateDoc(userRef, {
            likedTweets: arrayRemove(`${tweet.id}`)
    })
    reRenderFunction()
    };
    
    return < >
                <div className={styles.usernameDateWrapper}>
                    <div className={styles.username}>{tweet.username}</div>
                    <div className={styles.date}>{tweet.date}</div>
                </div>
                <div className={styles.usernameDateWrapper}>
                    <div className={styles.tweet}>{tweet.content}</div>
                    {tweet.likersID.includes(`${authInfo.userID}`) ? <div className={styles.unlikeButton} onClick={() => unlikeTweet(tweet)}>Unlike</div> 
                    : <div className={styles.likeButton}  onClick={() =>likeTweet(tweet)}>Like</div> }
                </div>
</>
    }
    export default DisplayTweet