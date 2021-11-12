import { useState, useEffect, useContext } from "react"
import styles from "./styles/App.module.css"
import TwitterPage from './components/TwitterPage'
import Login from "./components/Login"
import { AuthContext } from "./components/AuthContext"
import { FirebaseContext } from "./utils/Firebase"
import { getAuth, onAuthStateChanged, signOut  } from "firebase/auth";
import { getFirestore, collection, orderBy, query, getDocs, doc, getDoc, where } from "firebase/firestore"
import { Link } from "react-router-dom";

// Project Console: https://console.firebase.google.com/project/twitter-react-project/overview
// Hosting URL: https://twitter-react-project.web.app

function App() {
  const [authInfo, setAuthInfo] = useState(null)
  const [tweetList, setTweetList] = useState([])
  const [searchedTweetList, setSearchedTweetList] = useState([])
  const [yourTweetListSelected, setYourTweetListSelected] = useState(false)
  const [yourTweetList, setYourTweetList] = useState([])
  const [viewAnotherUser, setViewAnotherUser] = useState(false)
  const [viewedUserID, setViewedUserID] = useState('')
  const [isUserSearch, setIsUserSearch] = useState(false)
  const [showLikedTweets, setShowLikedTweets] = useState(false)
  const [likedTweetsList, setLikedTweetsList] = useState([])
  const [isauthfinished, setIsauthfinished] = useState(false)
  const [isHome, setIsHome] = useState(true)
  const [isHomeNav, setIsHomeNav] = useState(true)
  const [isSignUp, setIsSignUp] = useState(false)
  const [tweetSearch, setTweetSearch] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [myFollowing, setMyFollowing] = useState([])
  const [myFollowers, setMyFollowers] = useState([])
  const [usersTweetList, setUsersTweetList] = useState([])
  const [viewUsersTweets, setViewUsersTweets] = useState(false)
  const [viewUsersUsername, setViewUsersUsername] = useState('')
  const [isMyFollowersPage, setIsMyFollowersPage] = useState(false)


  const auth = getAuth();
  const firebase = useContext(FirebaseContext)
  const db = getFirestore(firebase)

  const displayLikedTweets = async(uid) => {
    try{
    const likedTweets = []
    const docRef = doc(db, "users", `${uid}`);
    const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const likedTweetsID = docSnap.data().likedTweets
              likedTweetsID.forEach(async(tweetID)=>{
                const tweetRef = doc(db, "tweets", `${tweetID}`);
                const docSnap = await getDoc(tweetRef)
                const tweet = { id:docSnap.id, ...docSnap.data()}
                likedTweets.push(tweet)
                
              })
              setLikedTweetsList([...likedTweets])
            }
       
    }catch(error){
      console.log(error)
  } } 

  const viewYourTweets = async(uid) => { 
    try{
    const yourTweets = []
    const q = query(collection(db, "tweets"), where("userID", "==", `${uid}`), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
      yourTweets.push({ id:document.id, ...document.data()})  
  });
    setYourTweetList(yourTweets)
    
  }catch(error){
    console.log(error)
}}
 

  useEffect(() => {
    onAuthStateChanged(auth, async(user) => {
      try{
      if (user){ 
        const {uid} = user
        const docRef = doc(db, "users", `${uid}`);
        const docSnap = await getDoc(docRef);
        const myFollowingList = []
        const myFollowersList = []
        if (docSnap.exists()) {
          viewYourTweets(uid)
          displayLikedTweets(uid)
            setAuthInfo(docSnap.data());
            const followingList = docSnap.data().followingID
            followingList.forEach(async(userID) => {
             const docRefFollowing = doc(db, "users", `${userID}`);
             const docSnap = await getDoc(docRefFollowing);
             const user = docSnap.data()
             const userDisplayInfo = {photoURL: user.photoURL, userID:userID, username:user.username, following: user.followingID.length, followers: user.followerID.length}
             myFollowingList.push(userDisplayInfo)
               
        })
        setMyFollowing([...myFollowingList])  
        const myFollowers = docSnap.data().followerID
        if(myFollowers.length !== 0){
        myFollowers.forEach(async(userID) => {
          const docRefFollowing = doc(db, "users", `${userID}`);
          const docSnap = await getDoc(docRefFollowing);
          const user = docSnap.data()
          const userDisplayInfo = {photoURL: user.photoURL, userID:userID, username:user.username, following: user.followingID.length, followers: user.followerID.length}
          myFollowersList.push(userDisplayInfo)
         
       })
       setMyFollowers([...myFollowersList])
      }} 
}setIsauthfinished(true) 
}catch(error){
    console.log(error)
}})
},[])

 
  const logout = () => {
    signOut(auth).then(() => {
      alert("Logout Success!")
      setAuthInfo(null)
      setIsSignUp(false)
      setViewUsersTweets(false)
    }).catch((error) => {
      console.log(error)
      alert(`${error}`)
    });
  }

  const navHome = () => {
    setIsHomeNav(true)
  }

  const navProfile = () => {
    setIsHomeNav(false)
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
    try{
      setViewUsersTweets(false)
    if(tweetSearch === ''){
      return
    }else{
    const searchedTweets = []
    const q = query(collection(db, "tweets"), where("content", "==", `${tweetSearch}`), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
      searchedTweets.push({ id: document.id, ...document.data()})
    })
    setSearchedTweetList(searchedTweets)
  }}catch(error){
    console.log(error)
}}

  const searchUser = async() => {
    try{
      setViewUsersTweets(false)
    if(userSearch === ''){
      return
    }else{
    const searchedUserTweets = []
    const q = query(collection(db, "tweets"), where("username", "==", `${userSearch}`), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
      searchedUserTweets.push({ id: document.id, ...document.data()})
    })
    setSearchedTweetList(searchedUserTweets)
  }}catch(error){
    console.log(error)
}}

  const changeSearch = () => {
    setIsUserSearch(!isUserSearch)
  }

    const displayAllTweets = () => {
          setShowLikedTweets(false)
            }
    
    const returnToTweets = () => {
      setViewAnotherUser(false)
    }
    const showAllTweetsButton = () => {
    setYourTweetListSelected(true)
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
        yourTweetListSelected,
        setYourTweetListSelected,
        yourTweetList,
        setYourTweetList,
        likedTweetsList,
        showLikedTweets,
        setShowLikedTweets,
        isUserSearch,
        searchUser,
        searchTweet,
        viewAnotherUser,
        setViewAnotherUser,
        viewedUserID,
        setViewedUserID,
        myFollowing,
        setMyFollowing,
        myFollowers,
        setMyFollowers,
        usersTweetList,
        setUsersTweetList,
        viewUsersTweets,
        setViewUsersTweets,
        viewUsersUsername,
        setViewUsersUsername,
        isMyFollowersPage,
        viewYourTweets,
        setLikedTweetsList,
        likedTweetsList
        
      }}>
       {authInfo && viewAnotherUser && <nav className={styles.navBar}>
        <div onClick={returnToTweets} className={styles.home }> 
        Return
       </div>
        {/* <div onClick={logout} className={styles.signOut}>
        Sign Out
         </div> */}
         </nav>} 
       {authInfo && !viewAnotherUser && <nav className={styles.navBar}>
        <Link onClick={navHome} to="/"> <div  className={isHomeNav ? styles.home : styles.homeUnselected}> 
        Home
       </div></Link>
        <Link onClick={navProfile} to="/profile"><div  className={isHomeNav ? styles.profileUnselected : styles.profile}>
        Profile
        </div></Link>
        {isUserSearch ? 
        <div className={styles.searchWrapper}><input className={styles.input} type="text" value={userSearch} onChange={handleUserSearch} placeholder="search user"/>
        <Link to="/searchTweets" ><div className={styles.search} onClick={searchUser}>Search Users</div></Link><div className={styles.searchChange} onClick={changeSearch}>change to tweet search</div></div>
         :
        <div className={styles.searchWrapper}><input className={styles.input} type="text" value={tweetSearch} onChange={handleTweetSearch} placeholder="search tweet"/>
        <Link to="/searchTweets"><div className={styles.search} onClick={searchTweet}>Search Tweets</div></Link><div className={styles.searchChange} onClick={changeSearch}>change to user search</div></div>}
        {showLikedTweets ? <Link  onClick={displayAllTweets} to="/"><div className={styles.searchChange}>All Tweets</div></Link> : <Link onClick={() => setShowLikedTweets(true)} to="/likedTweets"><div className={styles.searchChange} >Liked Tweets</div> </Link>}
        <Link to="/whoImFollowing"><div onClick={showAllTweetsButton} onClick={() => setIsMyFollowersPage(false)} className={styles.searchChange}>Following</div></Link>
        <Link to="/myFollowers"><div onClick={showAllTweetsButton} onClick={() => setIsMyFollowersPage(true)} className={styles.search}>Followers</div></Link>
        <div onClick={logout} className={styles.signOut}>
        Sign Out
         </div>
         </nav>}
        {!authInfo && <nav className={styles.navBar}>
        <div onClick={navSignUp} className={isSignUp ? styles.home : styles.homeUnselected}> 
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
     <div className={styles.loading}>
       Loading...
     </div>}
     </>
);
}
export default App;
