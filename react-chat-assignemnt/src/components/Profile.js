import styles from '../styles/Profile.module.css'
import {useState} from 'react'


function Profile( {username, setUsername} ) {

        const [newUsername, setNewUsername] = useState(username)

        const handleNewUsername = (e) => {
        setNewUsername(e.target.value)
    }

        const saveUsername = (e) => {
        e.preventDefault();
        setUsername(newUsername)
        alert("Username Saved!")
    }
   
    
    return <div className={styles.wrapper}>
                <h1 className={styles.profile}>Profile</h1>
                <form onSubmit={saveUsername} className={styles.form}>
                        <label className={styles.username}>User Name</label>
                        <input className={styles.input} type="text" value={newUsername} onChange={handleNewUsername} placeholder="enter username" />
                        <button className={styles.submit} type="submit">Save</button>
                </form>
            </div>
    }
    export default Profile