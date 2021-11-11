import { useContext } from "react"
import {AuthContext} from "./AuthContext"
import styles from "../styles/Home.module.css"
import DisplayTweet from "./TweetDisplay"



function ViewUsersTweets() {

    const { usersTweetList, viewUsersUsername } = useContext(AuthContext);


    return <div >
                <h1 className={styles.header}>{viewUsersUsername}'s Tweets:</h1>
                <div className={styles.div}> {usersTweetList.map((tweet, index) => { return   (
                        <div className={styles.tweetHolder} key={index}>
                               <DisplayTweet tweet= {tweet} />
                            </div>)})}</div>
                </div>

    }
    export default ViewUsersTweets