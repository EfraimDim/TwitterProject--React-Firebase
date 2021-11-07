
import { useState, useEffect, useContext } from "react"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import TwitterPage from './components/TwitterPage'
import Login from "./components/Login"
import { AuthContext } from "./components/AuthContext"
import { FirebaseContext } from "./utils/Firebase"
import { getAuth, onAuthStateChanged, signOut  } from "firebase/auth";

// Project Console: https://console.firebase.google.com/project/twitter-react-project/overview
// Hosting URL: https://twitter-react-project.web.app

function App() {
  const [authInfo, setAuthInfo] = useState(null)
  const [isauthfinished, setIsauthfinished] = useState(false)

  const auth = getAuth();
  const firebase = useContext(FirebaseContext)
  const db = getFirestore(firebase)

  const logout = () => {
    signOut(auth).then(() => {
      alert("Logout Success!")
      setAuthInfo(null)
    }).catch((error) => {
      console.log(error)
      alert(`${error}`)
    });
  }
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
  return (
    < >
      {isauthfinished ?
    <div>
      <AuthContext.Provider value={{
        authInfo,
        login: (userInfo) => setAuthInfo(userInfo),
        logout,
        setAuthInfo
      }}>
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
