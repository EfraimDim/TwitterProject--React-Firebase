import styles from "../styles/Home.module.css"
import { useState, useContext, useEffect } from "react"
import Tweets from '../components/TweetsContext'
import {BottomScrollListener} from 'react-bottom-scroll-listener';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from "./AuthContext"
import { Routes, Route, useLocation } from "react-router-dom";
import DisplayTweet from "./TweetDisplay"
import Following from "./WhoImFollowing" 
import ViewUsersTweets from "./ViewUsersTweets"
import Profile from "./Profile"



function Home({username, setUsername}) {

    const [tweet, setTweet] = useState('')
    const [isDisabled, setIsDisabled] = useState(true)

   

    const { addTweet, loading, loadMoreTweets, tenthTweet, yourTweetList} = useContext(Tweets);
    const { tweetList, setLikedTweetsList, likedTweetsList,  searchedTweetList,  yourTweetListSelected, setShowLikedTweets, setViewUsersTweets, setYourTweetListSelected, isUserSearch, searchUser, searchTweet, myFollowing, myFollowers, viewUsersTweets, viewYourTweets, setYourTweetList } = useContext(AuthContext)

    const location = useLocation()
    
    useEffect(() => {
    if(location.pathname === "/myTweets")
    setYourTweetListSelected(true)
    if(location.pathname === "/likedTweets")
    setShowLikedTweets(true)
    setViewUsersTweets(false)
    if(location.pathname === "/whoImFollowing")
    setYourTweetListSelected(true)
    },[])

  
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
                <Routes>   
            <Route path="/profile" element={<Profile username = {username} setUsername = {setUsername}/>}></Route> 
               <Route path="/whoImFollowing" element={<>{viewUsersTweets ? <ViewUsersTweets/> :<Following myFollowing={myFollowing} />}</>}></Route>
               <Route path="/myFollowers" element={<>{viewUsersTweets ? <ViewUsersTweets/> :<Following myFollowing={myFollowers} />}</>}></Route>
                <Route path="/likedTweets" element={<div className={styles.div}> {likedTweetsList.map((tweet, index) => { return   (
                        <div className={styles.tweetHolder} key={index}>
                               <DisplayTweet viewingLikedTweets={true} tweet= {tweet} index={index} setTweetList={setLikedTweetsList} tweetList={likedTweetsList} likedTweetsList={likedTweetsList} setLikedTweetsList={setLikedTweetsList}/>
                            </div>)})}</div>}/>
                <Route path="/searchTweets" element={<> {searchedTweetList.map((tweet, index) => { return   (
                            <div className={styles.tweetHolder} key={index}>
                               <DisplayTweet viewingLikedTweets={false} tweet= {tweet} likedTweetsList={likedTweetsList} setLikedTweetsList={setLikedTweetsList} reRenderFunction={isUserSearch ? searchUser : searchTweet}/> 
                            </div>
                            )})}</>}/>
                 
                <Route path="/myTweets" element={<div> {yourTweetList.map((tweet, index) => {  
                    return   (
                            <div className={styles.tweetHolder} style={yourTweetListSelected ? {background:"rgba(240, 250, 250, 0.2)"} : {}} key={index}>
                            <DisplayTweet  tweet= {tweet} index={index} setTweetList={setYourTweetList} tweetList={yourTweetList} likedTweetsList={likedTweetsList} setLikedTweetsList={setLikedTweetsList} viewingLikedTweets={false}/>
                            </div>
                            )})}</div>}/>
                 <Route path="/" element={
            <> 
            {loading ? <div className={styles.loadSpinner}></div> : 
                <form className={styles.form} onSubmit={submitTweet}>
                    <textarea minLength='1' className={styles.textArea} placeholder="what you have in mind?" value={tweet} onChange={handleTweet}/>
                    <button className={styles.submit} disabled={isDisabled} type="submit">Tweet</button>
                </form>}

                 <BottomScrollListener  onBottom={loadTenMore}>
                <div className={styles.tweetListContainer}>
                    {tweetList.map((tweet, index) => { 
                      
                        return   (
                            <div className={styles.tweetHolder} key={index}>
                                <DisplayTweet tweet= {tweet} likedTweetsList={likedTweetsList} setLikedTweetsList={setLikedTweetsList} viewingLikedTweets={false}/>
                            </div>
                            )})}
                </div>
                </BottomScrollListener>
              <>{tenthTweet === undefined ? <div className={styles.upToDate}>Up To Date</div> : <div></div> }</>
              </>}/>
                </Routes>
              

            </div>
    }
    export default Home