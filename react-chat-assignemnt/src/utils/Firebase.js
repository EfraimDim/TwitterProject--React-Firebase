// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createContext } from "react"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcUGkBU04jpyN0rMKxJvV7Og4ELpQCy6M",
  authDomain: "twitter-react-project.firebaseapp.com",
  projectId: "twitter-react-project",
  storageBucket: "twitter-react-project.appspot.com",
  messagingSenderId: "507208774657",
  appId: "1:507208774657:web:5526f56907d4afc7e3fc00"
};

export const FirebaseContext = createContext(null)




export default function Firebase({ children }) {
// Initialize Firebase

const app = initializeApp(firebaseConfig);

    return (
       <FirebaseContext.Provider value={app}>
           { children }
       </FirebaseContext.Provider>

    )
}