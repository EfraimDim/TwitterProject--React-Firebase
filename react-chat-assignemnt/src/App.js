import styles from "./styles/App.module.css"
import Home from './components/Home'
import Profile from './components/Profile'
import { useState, useEffect, createContext} from "react"
import localforage from "localforage"
import axios from 'axios';
import Tweets from './components/TweetsContext'


// Project Console: https://console.firebase.google.com/project/twitter-react-project/overview
// Hosting URL: https://twitter-react-project.web.app

function App() {

  const [tweetList, setTweetList] = useState([])
  const [username, setUsername] = useState('')
  const [isHome, setIsHome] = useState(true)
  const [loading, setLoading] = useState(false)

  async function saveUsernameToLocal() {
  const saveUsernameToLocal = await localforage.setItem("username", username)
  }

  async function getUsernameFromLocal() {
  const getUsernameFromLocal = await localforage.getItem("username") 
  if(getUsernameFromLocal){
    setUsername(getUsernameFromLocal)
  }}

  async function getTweetsFromSever() { 
    const usernameFromServer = await axios.get("https://micro-blogging-dot-full-stack-course-services.ew.r.appspot.com/tweet")
    setTweetList(usernameFromServer.data.tweets)
  }

 
  useEffect(() => {
    getTweetsFromSever()
    const interval = setInterval(() => {
      getTweetsFromSever()
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveUsernameToLocal();
  }, [username]);

  useEffect(() => {
    getUsernameFromLocal();
   }, []);
  
  const navHome = () => {
    setIsHome(true)
  }

  const navProfile = () => {
    setIsHome(false)
  }
  
  const addTweet = async(newTweet) => {
    try {
      if(username === ''){
        newTweet.userName = "Anonymous"
      }else{
      newTweet.userName = username
      }
      const newTweetArray= [newTweet, ...tweetList];
      setLoading(true)
        const addTweet = await axios.post("https://micro-blogging-dot-full-stack-course-services.ew.r.appspot.com/tweet", {
        userName: newTweet.userName,
        date: newTweet.date,
        content: newTweet.content
      })
      if(addTweet.data){
        setLoading(false)
        setTweetList(newTweetArray);
      }
    }catch (error) {
      console.log(error)
      alert(`${error}`)
      setLoading(false)
    }
  }

  return (
    <div>
      <nav className={styles.navBar}>
        <div onClick={navHome} className={isHome ? styles.home : styles.homeUnselected}> 
        Home
        </div>
        <div onClick={navProfile} className={isHome ? styles.profileUnselected : styles.profile}>
        Profile
        </div>
      </nav>
      <Tweets.Provider value={{tweetList, addTweet, loading}}>
      {isHome && <Home/>}
     </Tweets.Provider>
      {!isHome && <Profile username = {username} setUsername = {setUsername} />}
    </div>
  );
}

export default App;
