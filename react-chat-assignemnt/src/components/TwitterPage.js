import styles from "../styles/App.module.css"
import Home from './Home'
import Profile from './Profile'
import { useState, useEffect, useContext} from "react"
import Tweets from './TweetsContext'
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query, startAfter, limit, getDocs, endAt, doc, getDoc, where } from "firebase/firestore"
import { FirebaseContext } from "../utils/Firebase"
import { AuthContext } from "./AuthContext"
import { getAuth } from "firebase/auth";

// Project Console: https://console.firebase.google.com/project/twitter-react-project/overview
// Hosting URL: https://twitter-react-project.web.app

function TwitterPage() {

const firebase = useContext(FirebaseContext)
const db = getFirestore(firebase)
const auth = getAuth()
const user = auth.currentUser

const { authInfo } = useContext(AuthContext);

  const [tweetList, setTweetList] = useState([])
  const [yourTweetList, setYourTweetList] = useState([])
  const [yourTweetListSelected, setYourTweetListSelected] = useState(false)
  const [username, setUsername] = useState(authInfo.username)
  const [isHome, setIsHome] = useState(true)
  const [loading, setLoading] = useState(false)
  const [lastKey, setLastKey] = useState("");
  const [tenthTweet, setTenthTweet] = useState("");


  const { logout } = useContext(AuthContext);

// the two next useEffect make it so that when a new tweet is added, the scroll position doesnt go back to the first 10,
//it stays where you were scrolled to :)

//also rules have been changed in firebase console to only allow users to read or write
async function getFirstTenTweets(){
  const querySnapshot = query(collection(db, "tweets"), orderBy("date", "desc"), limit(10));
    const newTweets = []
    const documentSnapshots = await getDocs(querySnapshot);
    documentSnapshots.forEach((doc) => newTweets.push({ id:doc.id, ...doc.data()}))
    setTweetList([...tweetList, ...newTweets])
    setTenthTweet(newTweets[9])
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
    setLastKey(lastVisible)
}
useEffect(async() => {
  getFirstTenTweets()
},[])

useEffect(() => {
    const first = query(collection(db, "tweets"), orderBy("date", "desc"), endAt(lastKey));
    const unsubscribe = onSnapshot(first, (querySnapshot) => {
        const tweets = []
        querySnapshot.forEach((doc) => tweets.push({ id:doc.id, ...doc.data()}))
        setTweetList(tweets)
      })
        return () => {
        unsubscribe()
        }
  }, [lastKey]);

  const navHome = () => {
    setIsHome(true)
  }

  const navProfile = () => {
    setIsHome(false)
  }
  
  const addTweet = async(newTweet) => {
    try {
      setLoading(true)
      const docRefUsers = doc(db, "users", `${user.uid}`);
      const docSnap = await getDoc(docRefUsers);
        const docRefTweet = await addDoc(collection(db, "tweets"), {
          username: docSnap.data().username,
          date: newTweet.date,
          content: newTweet.content,
          userID: authInfo.userID,
          tweetID: newTweet.tweetID
        });
      if(docRefTweet.id){
        setLoading(false)
      }
    }catch (error) {
      console.error("Error adding document: ", error);
      alert(`${error}`)
      setLoading(false)
    }
  }
  
  const loadMoreTweets = async() => {
    const nextTen = query(collection(db, "tweets"), orderBy("date", "desc"), startAfter(lastKey), limit(10));
    const querySnapshot = await getDocs(nextTen)
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
    setLastKey(lastVisible)
    const newTweets = []
    querySnapshot.forEach((doc) => newTweets.push({ id:doc.id, ...doc.data()}))
    setTweetList([...tweetList, ...newTweets])
    setTenthTweet(newTweets[9])
    
  }


  const viewYourTweets = async() => {
    if(yourTweetListSelected === false){  
    const yourTweets = []
    const q = query(collection(db, "tweets"), where("userID", "==", `${authInfo.userID}`), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
      yourTweets.push({ id:document.id, ...document.data()})  
});
    setYourTweetList(yourTweets)
    setYourTweetListSelected(true)
}else{
  setYourTweetListSelected(false)
}}
 


  return (
    <div style={yourTweetListSelected ? {background:"rgba(240, 250, 250, 0.2)"} : {}}>
      <nav className={styles.navBar}>
        <div onClick={navHome} className={isHome ? styles.home : styles.homeUnselected}> 
        Home
        </div>
        <div onClick={navProfile} className={isHome ? styles.profileUnselected : styles.profile}>
        Profile
        </div>
        <div onClick={logout} className={styles.signOut}>
        Sign Out
        </div>
      </nav>
      <div onClick={viewYourTweets}>{yourTweetListSelected ? <div className={styles.yourListSelected}>All Tweets</div> : <div className={styles.yourListUnselected}>My Tweets</div>}</div>
      <Tweets.Provider value={{tweetList, addTweet, loading, loadMoreTweets, tenthTweet, yourTweetListSelected, yourTweetList}}>
      {isHome && <Home/>}
     </Tweets.Provider>
      {!isHome && <Profile username = {username} setUsername = {setUsername} />}
    </div>
  );
}

export default TwitterPage;