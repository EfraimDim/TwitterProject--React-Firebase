import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import styles from "../styles/WhoImFollowing.module.css";
import { getFirestore, collection, orderBy, query, getDocs, where } from "firebase/firestore";
import { FirebaseContext } from "../utils/Firebase";

function WhoImFollowing({ myFollowing }) {
  const { setViewedUserID, setViewAnotherUser, setUsersTweetList, setViewUsersTweets, setViewUsersUsername, isMyFollowersPage } =
    useContext(AuthContext);
  const firebase = useContext(FirebaseContext);
  const db = getFirestore(firebase);

  const viewUserProfile = (userID) => {
    setViewedUserID(`${userID}`);
    setViewAnotherUser(true);
  };
  const viewUsersTweets = async (userID, username) => {
    const usersTweets = [];
    const q = query(collection(db, "tweets"), where("userID", "==", `${userID}`), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
      usersTweets.push({ id: document.id, ...document.data() });
    });
    setUsersTweetList(usersTweets);
    setViewUsersTweets(true);
    setViewUsersUsername(username);
  };

  return (
    <div>
      <h1 className={styles.header}>{isMyFollowersPage ? <>Followers</> : <>Following</>}</h1>
      <div className={styles.usersWrapper}>
        {myFollowing.map((user, index) => {
          return (
            <>
              <div className={styles.user} key={user.userID}>
                <img className={styles.image} src={user.photoURL} />
                <div className={styles.statsWrapper}>
                  <div className={styles.username} onClick={() => viewUserProfile(user.userID)}>
                    {user.username}
                  </div>
                  <div className={styles.stats}>
                    Following: {user.following} Followers: {user.followers}
                  </div>
                </div>
                <div className={styles.viewTweets} onClick={() => viewUsersTweets(user.userID, user.username)}>
                  View Tweets
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
export default WhoImFollowing;
