import { useContext } from "react";
import { getFirestore, updateDoc, arrayUnion, arrayRemove, doc } from "firebase/firestore";
import { FirebaseContext } from "../utils/Firebase";
import { AuthContext } from "./AuthContext";
import styles from "../styles/Home.module.css";

function DisplayTweet({ tweet, setTweetList, tweetList, index, reRenderFunction, setLikedTweetsList, likedTweetsList, viewingLikedTweets }) {
  const firebase = useContext(FirebaseContext);
  const db = getFirestore(firebase);
  const { authInfo, setViewAnotherUser, setViewedUserID } = useContext(AuthContext);

  const likeTweet = async (tweet) => {
    try {
      const tweetRef = doc(db, "tweets", `${tweet.id}`);
      const userRef = doc(db, "users", `${authInfo.userID}`);
      if (tweetList) {
        tweet.likersID.push(`${authInfo.userID}`);
        tweetList[index] = tweet;
        setTweetList(tweetList);
      }
      setLikedTweetsList([tweet, ...likedTweetsList]);
      await updateDoc(tweetRef, {
        likersID: arrayUnion(`${authInfo.userID}`),
      });
      await updateDoc(userRef, {
        likedTweets: arrayUnion(`${tweet.id}`),
      });
      if (reRenderFunction) {
        reRenderFunction();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unlikeTweet = async (tweet) => {
    try {
      const tweetRef = doc(db, "tweets", `${tweet.id}`);
      const userRef = doc(db, "users", `${authInfo.userID}`);
      await updateDoc(tweetRef, {
        likersID: arrayRemove(`${authInfo.userID}`),
      });
      await updateDoc(userRef, {
        likedTweets: arrayRemove(`${tweet.id}`),
      });
      if (tweetList) {
        tweetList[index].likersID = tweet.likersID.filter((e) => e !== authInfo.userID);
        setTweetList(tweetList);
      }

      const newLikedTweetList = likedTweetsList.filter((twe) => twe.tweetID !== tweet.tweetID);
      setLikedTweetsList(newLikedTweetList);

      if (reRenderFunction) {
        reRenderFunction();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const viewUserProfile = (userID) => {
    setViewedUserID(`${userID}`);
    setViewAnotherUser(true);
  };

  return (
    <>
      {" "}
      <div className={styles.photoWrapper}>
        <img className={styles.profileImage} src={tweet.userPhotoURL} />
        <div>
          <div className={styles.usernameDateWrapper}>
            <div className={styles.usernameDateWrapper}>
              <div onClick={() => viewUserProfile(tweet.userID)} className={styles.username}>
                {tweet.username}
              </div>
              {tweet.userID === authInfo.userID ? (
                <></>
              ) : (
                <>{authInfo.followingID.includes(`${tweet.userID}`) ? <div className={styles.unfollow}>Following</div> : <></>}</>
              )}
            </div>
            <div className={styles.date}>{tweet.date}</div>
          </div>
          <div className={styles.usernameDateWrapper}>
            <div className={styles.tweet}>{tweet.content}</div>
            {viewingLikedTweets ? (
              <div className={styles.unlikeButton} onClick={() => unlikeTweet(tweet)}>
                Unlike
              </div>
            ) : (
              <>
                {tweet.likersID.includes(`${authInfo.userID}`) ? (
                  <div className={styles.unlikeButton} onClick={() => unlikeTweet(tweet)}>
                    Unlike
                  </div>
                ) : (
                  <div className={styles.likeButton} onClick={() => likeTweet(tweet)}>
                    Like
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default DisplayTweet;
