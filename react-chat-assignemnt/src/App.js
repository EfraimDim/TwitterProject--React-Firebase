import { useState, useEffect, useContext } from "react"
import styles from "./styles/App.module.css"
import TwitterPage from './components/TwitterPage'
import Login from "./components/Login"
import { AuthContext } from "./components/AuthContext"
import { FirebaseContext } from "./utils/Firebase"
import { getAuth, onAuthStateChanged, signOut  } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query, startAfter, limit, getDocs, endAt, doc, getDoc, where } from "firebase/firestore"

// Project Console: https://console.firebase.google.com/project/twitter-react-project/overview
// Hosting URL: https://twitter-react-project.web.app

function App() {
  const [authInfo, setAuthInfo] = useState(null)
  const [tweetList, setTweetList] = useState([])
  const [searchedTweetList, setSearchedTweetList] = useState([])
  const [isSearchedList, setIsSearchedList] = useState(false)
  const [isUserSearch, setIsUserSearch] = useState(false)
  const [isauthfinished, setIsauthfinished] = useState(false)
  const [isHome, setIsHome] = useState(true)
  const [isSignUp, setIsSignUp] = useState(false)
  const [tweetSearch, setTweetSearch] = useState('')
  const [userSearch, setUserSearch] = useState('')

  const auth = getAuth();
  const firebase = useContext(FirebaseContext)
  const db = getFirestore(firebase)

  useEffect(() => {
    onAuthStateChanged(auth, async(user) => {
      if (user){ 
        const {uid} = user
        const docRef = doc(db, "users", `${uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setAuthInfo(docSnap.data());}
        } 
      setIsauthfinished(true)
});
  },[])

  const logout = () => {
    signOut(auth).then(() => {
      alert("Logout Success!")
      setAuthInfo(null)
    }).catch((error) => {
      console.log(error)
      alert(`${error}`)
    });
  }

  const navHome = () => {
    setIsHome(true)
  }

  const navProfile = () => {
    setIsHome(false)
  }

  const navSignUp = () => {
    setIsSignUp(true)
  }

  const navLogin = () => {
    setIsSignUp(false)
  }

  const handleTweetSearch = (e) => {
    setTweetSearch(e.target.value)
  }
  const handleUserSearch = (e) => {
    setUserSearch(e.target.value)
  }

  const searchTweet = async() => {
    if(tweetSearch === ''){
      return
    }else{
    const searchedTweets = []
    const q = query(collection(db, "tweets"), where("content", "==", `${tweetSearch}`), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
      searchedTweets.push({ id: document.id, ...document.data()})
    })
    setIsSearchedList(true)
    setSearchedTweetList(searchedTweets)
    setTweetSearch('')
  }}

  const searchUser = async() => {
    if(userSearch === ''){
      return
    }else{
    const searchedUserTweets = []
    const q = query(collection(db, "tweets"), where("username", "==", `${userSearch}`), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
      searchedUserTweets.push({ id: document.id, ...document.data()})
    })
    setIsSearchedList(true)
    setSearchedTweetList(searchedUserTweets)
    setUserSearch('')
  }}

  const changeSearch = () => {
    setIsUserSearch(!isUserSearch)
  }



  return (
    < >
      {isauthfinished ?
    <div>
      <AuthContext.Provider value={{
        authInfo,
        login: (userInfo) => setAuthInfo(userInfo),
        logout,
        setAuthInfo,
        isHome,
        setIsHome,
        isSignUp,
        setIsSignUp,
        tweetSearch,
        handleTweetSearch,
        tweetList,
        setTweetList,
        searchedTweetList,
        isSearchedList,
        setIsSearchedList
      }}>
        
       {authInfo && <nav className={styles.navBar}>
        <div onClick={navHome} className={isHome ? styles.home : styles.homeUnselected}> 
        Home
       </div>
        <div onClick={navProfile} className={isHome ? styles.profileUnselected : styles.profile}>
        Profile
        </div>
        {isUserSearch ? 
        <div className={styles.searchWrapper}><input className={styles.input} type="text" value={userSearch} onChange={handleUserSearch} placeholder="search user"/>
        <div className={styles.search} onClick={searchUser}>Search Users</div><div className={styles.searchChange} onClick={changeSearch}>change to tweet search</div></div>
         :
        <div className={styles.searchWrapper}><input className={styles.input} type="text" value={tweetSearch} onChange={handleTweetSearch} placeholder="search tweet"/>
        <div className={styles.search} onClick={searchTweet}>Search Tweets</div><div className={styles.searchChange} onClick={changeSearch}>change to user search</div></div>}

        <div onClick={logout} className={styles.signOut}>
        Sign Out
         </div>
         </nav>}
        {!authInfo && <nav className={styles.navBar}><div onClick={navSignUp} className={isSignUp ? styles.home : styles.homeUnselected}> 
        SignUp
        </div>
        <div onClick={navLogin} className={isSignUp ? styles.profileUnselected : styles.profile}>
        Login
        </div>
       </nav> }
    
        {!authInfo && <Login />}
        {authInfo && <TwitterPage />}
      </AuthContext.Provider>
    </div>
     : 
     <div>
       Loading...
     </div>}
     </>
);
}
export default App;
