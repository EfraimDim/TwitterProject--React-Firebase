import styles from "../styles/Home.module.css"
import {useState, useContext} from "react"
import Tweets from '../components/TweetsContext'

function Home( ) {

    const [tweet, setTweet] = useState('')
    const [isDisabled, setIsDisabled] = useState(true)
    const { tweetList, addTweet, loading } = useContext(Tweets);
    

    const handleTweet = (e) => {
        setTweet(e.target.value)
        if(tweet.length >= 140){
            setIsDisabled(true)
        }else {
            setIsDisabled(false)
        }
    }

    const submitTweet = (e) => {
        e.preventDefault();
        if(tweet === ''){
            return
        }else{
        const content = tweet
        const date = new Date().toISOString()
        // const id = "id" + Math.random().toString(16).slice(2)
        const newTweet = {content: content, date: date}
        addTweet(newTweet)
        setTweet('')
    }}
    
    return <div>
        {loading ? <div className={styles.loadSpinner}></div> : 
                <form className={styles.form} onSubmit={submitTweet}>
                    <textarea minLength='1' className={styles.textArea} placeholder="what you have in mind?" value={tweet} onChange={handleTweet}/>
                    <button className={styles.submit} disabled={isDisabled} type="submit">Tweet</button>
                </form>}

                <div className={styles.tweetListContainer}>
                    {tweetList.map((tweet, index) => { return   (
                            <div className={styles.tweetHolder} key={index}>
                                <div className={styles.usernameDateWrapper}>
                                    <div className={styles.username}>{tweet.userName}</div>
                                    <div className={styles.date}>{tweet.date}</div>
                                </div>
                                <div className={styles.tweet}>{tweet.content}</div>
                            </div>
                            )})}
                </div>

            </div>
    }
    export default Home