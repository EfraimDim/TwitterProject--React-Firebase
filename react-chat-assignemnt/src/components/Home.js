import styles from "../styles/Home.module.css"
import { useState, useContext } from "react"
import Tweets from '../components/TweetsContext'
import {BottomScrollListener} from 'react-bottom-scroll-listener';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from "./AuthContext"

import DisplayTweet from "./TweetDisplay"

function Home() {

    const [tweet, setTweet] = useState('')
    const [isDisabled, setIsDisabled] = useState(true)
    const { addTweet, loading, loadMoreTweets, tenthTweet, yourTweetList } = useContext(Tweets);
    const { tweetList,  searchedTweetList, isSearchedList,  likedTweetsList, showLikedTweets, yourTweetListSelected } = useContext(AuthContext);

   

    const handleTweet = (e) => {
        const currentTweet = e.target.value
        setTweet(currentTweet)
        if(currentTweet === "" || currentTweet.length >= 140){
            setIsDisabled(true)
        }else {
            setIsDisabled(false)
        }
    }

    const submitTweet = (e) => {
        e.preventDefault();
        const content = tweet
        const date = new Date().toISOString()
        const tweetID = uuidv4()
        const newTweet = {content: content, date: date, tweetID: tweetID}
        addTweet(newTweet)
        setTweet('')
        setIsDisabled(true)
    }
    const loadTenMore = () => {
        if(tenthTweet === undefined){
            return
        }else{
        loadMoreTweets()}
    }


   
    
    return <div>
        {loading ? <div className={styles.loadSpinner}></div> : 
                <form className={styles.form} onSubmit={submitTweet}>
                    <textarea minLength='1' className={styles.textArea} placeholder="what you have in mind?" value={tweet} onChange={handleTweet}/>
                    <button className={styles.submit} disabled={isDisabled} type="submit">Tweet</button>
                </form>}
                {showLikedTweets && <div className={styles.div}> {likedTweetsList.map((tweet, index) => { return   (
                            <div className={styles.tweetHolder} key={index}>
                               <DisplayTweet tweet= {tweet}/>
                            </div>
                            )})}</div>}
               {isSearchedList && !showLikedTweets && <div className={styles.div}> {searchedTweetList.map((tweet, index) => { return   (
                            <div className={styles.tweetHolder} key={index}>
                               <DisplayTweet tweet= {tweet}/>
                            </div>
                            )})}</div>}
                {!isSearchedList && !showLikedTweets && <div>
                {yourTweetListSelected ? <div> {yourTweetList.map((tweet, index) => { 
                    
                    return   (
                            <div className={styles.tweetHolder} style={yourTweetListSelected && {background:"rgba(240, 250, 250, 0.2)"}} key={index}>
                            <DisplayTweet tweet= {tweet}/>
                            </div>
                            )})}</div>  :
                <BottomScrollListener  onBottom={loadTenMore}>
                <div className={styles.tweetListContainer}>
                    {tweetList.map((tweet, index) => { 
                      
                        return   (
                            <div className={styles.tweetHolder} key={index}>
                                <DisplayTweet tweet= {tweet}/>
                            </div>
                            )})}
                </div>
                </BottomScrollListener>}</div>}
                {tenthTweet === undefined ? <div className={styles.upToDate}>Up To Date</div> : <div></div> }

            </div>
    }
    export default Home