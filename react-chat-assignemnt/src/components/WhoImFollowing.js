// import { useContext, useEffect, useState } from "react"
// import { getFirestore, getDoc, doc} from "firebase/firestore"
// import { FirebaseContext } from "../utils/Firebase"
// import {AuthContext} from "./AuthContext"
import styles from "../styles/WhoImFollowing.module.css"


function WhoImFollowing({myFollowing}) {

    


    
    return <div >  
        <div className={styles.usersWrapper}>
                {myFollowing.map((user, index) => {
                    return (
                        <div className={styles.user} key={index}>
                            <img className={styles.image} src={user.photoURL}/>
                            <div className={styles.username}>{user.username}</div>
                           
                        </div>
                    )
                })}
                </div>
</div>
    }
    export default WhoImFollowing