"use client"

// Imports
import Image from "next/image";
import styles from "./department.module.css";
import { useEffect, useRef, useState } from "react";
import { sendDataToReset } from "./requestsToServer";

export default function CryptionPage() {

  // Load div states
  var [isVanished, setIsVanished] = useState(styles.load)

  // Custom alert div
  var [alertAgent, setAlert] = useState({isShown: false, message: "Alert"})
  var [showAlert, setShowAlert] = useState(styles.noAlert)

  useEffect(() => {
    if (alertAgent.isShown) { // Set visible state of alert div
      setShowAlert("")
    } else {
      setShowAlert(styles.noAlert)
    }
  }, [alertAgent])

  useEffect(() => {
    setIsVanished(`${styles.load} ${styles.vanish}`);
  }, []);

  var emailInput = useRef<HTMLInputElement | null>(null)

  async function sendLetterToReset() {
    if(emailInput.current?.value){

      var response = await sendDataToReset(emailInput.current?.value)
      switch (response){
        case "Ok": 
              setAlert({isShown: true, message: "Letter has been sent!"})
              return

            case "EmailError": 
              setAlert({isShown: true, message: "Something's wrong with DB on server!"})
              return

            case "EmailNotFound": 
              setAlert({isShown: true, message: "Invalid username or password!"})
              return

            default: 
              setAlert({isShown: true, message: "Something's wrong with server!"})
              return
      }

    } else {
      setAlert({isShown: true, message: "Enter email!"})
      return
    }
  }

  return (
    <>
    <div className={`${styles.alert} ${showAlert}`}>
        <button title="Alert" type="button" onClick={() => setAlert({isShown: false, message: alertAgent.message})}>{alertAgent.message}<br/>(Click on me to close!)</button>
     </div>
     <div className={isVanished}>
      <Image src="/loading.gif" width={64} height={64} alt="Loading..." />
     </div>
     <nav className={styles.navBar}>
       <ul>
           <li>
           <div className={styles.icon} >
             <Image src="/icon.svg" width={50} height={50} alt="AnchorEncrypt"/>
           </div>
          </li>
          <li className={styles.special}>
            <a href="/">
              <h1>
                Greeting
              </h1>
            </a>
          </li>
         <li className={styles.special}>
            <a href="/">
              <h1>
                How it works?
              </h1>
            </a>
          </li>
          <li className={styles.special}>
            <a href="/">
              <h1>
                About Us
              </h1>
            </a>
          </li>
          <li>
            <a href="/cryption"> 
              <h1>
                Сryption
             </h1>
            </a>
         </li>
         <li>
           <a href="/profile">
             <h1 className={`${styles.lastLi} ${styles.blue}`}>
               Profile
             </h1>
            </a>
          </li>
        </ul>
      </nav>
      <div className={styles.department}>
        <div className={styles.userInfo}>
          <h1>Send letter to reset your password</h1>
          <div>
            <h2>Email:</h2>
            <input ref={emailInput} type="email" placeholder="Your email..."></input>
          </div>
        </div>
        <footer>
          <button title="sendButton" type="button" className={`${styles.send}`} onClick={sendLetterToReset}>Send</button>
        </footer>
      </div>
    </>
  );
}
