"use client"

import Image from "next/image";
import styles from "./recovery.module.css";
import { useEffect, useRef, useState } from "react";
import { sendResetData } from "./requestsToServer";

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

  // Refs to inputs
  var repeatNewPasswordInput = useRef<HTMLInputElement | null>(null)
  var newPasswordInput = useRef<HTMLInputElement | null>(null)

  var [isRed, setIsRed] = useState("") // Coloring text into red

  var handleInputChange = () => { // Will color text over inputs if they are same
    if(repeatNewPasswordInput.current?.value === newPasswordInput.current?.value){
      setIsRed(styles.red)
    } else {
      setIsRed("")
    }
  }

  useEffect(() => {
    setIsVanished(`${styles.load} ${styles.vanish}`);
  }, []);

  async function resetPassword(){ // reset's password on backend

    // Get token from query string
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if(!token){ // If token not provided
      setAlert({isShown: true, message: "No token provided!"})
      return
    }

    if (repeatNewPasswordInput.current?.value && newPasswordInput.current?.value){ // if inputs aren't empty

      var response = await sendResetData(`${newPasswordInput.current?.value}`, `${repeatNewPasswordInput.current?.value}`, token) // Send passwrods to backend (to change it)
      switch (response) {
        case "Ok": 
          setAlert({isShown: true, message: "Changed!"})
          return

        case "DBError": 
          setAlert({isShown: true, message: "Something's wrong with DB on server!"})
          return

        case "UserAccessError": 
          setAlert({isShown: true, message: "Password is incorrect!"})
          return
        
        case "EmailExists": 
          setAlert({isShown: true, message: "Email is already in use!"})
          return

        default: 
          setAlert({isShown: true, message: "Something's wrong with server!"})
          return

      }

    } else {
      setAlert({isShown: true, message: "Enter passwords!"})
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
      <div className={styles.recovery}>
        <div className={styles.userInfo}>
          <h1>Change your password</h1>
          <div>
            <h2 className={isRed}>New Password:</h2>
            <input ref={newPasswordInput} type="password" placeholder="Your new password..." onChange={() => {handleInputChange()}}></input>
          </div>
          <div>
            <h2 className={isRed}>Repeat password:</h2>
            <input ref={repeatNewPasswordInput} type="password" placeholder="Repeat new password..." onChange={() => {handleInputChange()}}></input>
          </div>
        </div>
        <footer>
          <button title="changeButton" type="button" onClick={resetPassword}>Change</button>
        </footer>
      </div>
    </>
  );
}
