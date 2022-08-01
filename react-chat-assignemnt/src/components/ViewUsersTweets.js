import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import styles from "../styles/Home.module.css";
import DisplayTweet from "./TweetDisplay";

function ViewUsersTweets() {
  const { usersTweetList, setUsersTweetList, viewUsersUsername, setLikedTweetsList, likedTweetsList } = useContext(AuthContext);

  return (
    <div>
      <h1 className={styles.header}>{viewUsersUsername}'s Tweets:</h1>
      <div className={styles.div}>
        {" "}
        {usersTweetList.map((tweet, index) => {
          return (
            <div className={styles.tweetHolder} key={index}>
              <DisplayTweet
                tweet={tweet}
                index={index}
                setTweetList={setUsersTweetList}
                tweetList={usersTweetList}
                likedTweetsList={likedTweetsList}
                setLikedTweetsList={setLikedTweetsList}
                viewingLikedTweets={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default ViewUsersTweets;
