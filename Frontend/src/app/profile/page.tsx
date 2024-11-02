"use client"

// Imports
import Image from "next/image";
import styles from "./profilePage.module.css";
import { useEffect, useRef, useState } from "react";
import { checkToken, getCookieValue } from "@/tokenHooks/OnClientTokenInteractions";
import { useRouter } from "next/navigation";
import { changeDataOnServer, getUserInfoFromServer } from "./requestsToServer";

export default function CryptionPage() {
  const router = useRouter() // Create router

  // Custom alert div
  var [alertAgent, setAlert] = useState({isShown: false, message: "Alert"})
  var [showAlert, setShowAlert] = useState(styles.noAlert)

  useEffect(() => { // Set visible state of alert div
    if (alertAgent.isShown) {
      setShowAlert("")
    } else {
      setShowAlert(styles.noAlert)
    }
  }, [alertAgent])

  // Load div states
  var [isVanished, setIsVanished] = useState(styles.load)
  var [isHalfVanished, setIsHalfVanished] = useState("")

  // Dinamically set button styles 
  var [shouldSave, setShouldSave] = useState(styles.shouldNotSave)
  var [shouldRoundBorder, setShouldRoundBorder] = useState(styles.roundRightBorder)

  var userName = useRef<HTMLInputElement | null>(null)
  var currPasswordInput = useRef<HTMLInputElement | null>(null)
  var newPasswordInput = useRef<HTMLInputElement | null>(null)
  var emailInput = useRef<HTMLInputElement | null>(null)

  var handleChange = () => { // Make save button active if user changed something
    setShouldSave("")
    setShouldRoundBorder("")
  }

  var [isRed, setIsRed] = useState("") // Coloring text into red

  var handleInputChange = () => { // Will color text over inputs if they are same
    if(currPasswordInput.current?.value === newPasswordInput.current?.value){
      setIsRed(styles.red)
    } else {
      setIsRed("")
    }
  }

  // Show texted user info (username, email (are gotten from backend))
  var [defUserName, setDefUserName] = useState("No Info")
  var [defEmailInput, setDefEmailInput] = useState("No Info")

  async function getUserInfo(){ // Get user info

    await checkToken(router) // Checks shork jwt token, and updates it if it's expired
    const response = await getUserInfoFromServer(getCookieValue("shortToken")) // gets user info from backend

    switch (response.message) {
      case "Ok":
          setDefUserName(response.username)
          setDefEmailInput(response.email)
          setIsVanished(`${styles.load} ${styles.vanish}`);
          return

      case "DBError": 
        setIsVanished(`${styles.load} ${styles.vanish}`);
        setAlert({isShown: true, message: "Something's wrong with DB on server!"})
        return

      case "NoUserFounded": 
        document.cookie = `longToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `shortToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        router.push("/agent")
        setIsVanished(`${styles.load} ${styles.vanish}`);
        setAlert({isShown: true, message: "Something's wrong! Log in again!"})
        return

      default: 
        setIsVanished(`${styles.load} ${styles.vanish}`);
        setAlert({isShown: true, message: "Something's wrong with server!"})
        return

    }
  }

  useEffect(() => {
    if (getCookieValue("shortToken") !== "NotFound"){ // Only logged user can accept this page (by short token, updated with long token)
      getUserInfo()
    } else {
      router.push("/agent")
    }
  }, []);

  function logOut() { // Delet tokens from cookies to log out user
    document.cookie = `longToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `shortToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    router.push("/agent")
  }

  async function changer() { // Change user info

      if (userName.current?.value && currPasswordInput.current?.value && emailInput.current?.value){ // If inputs aren't empty
        
        if (isRed === ""){ // If passwords aren't same
            setIsHalfVanished(styles.halfVanished) // Show loading div

            if (!newPasswordInput.current?.value){ // If user don't change password
              var newPassword = "Nothing"
            } else {
              var newPassword = newPasswordInput.current?.value
            }

            await checkToken(router) // Checks shork jwt token, and updates it if it's expired
            var response = await changeDataOnServer(`${userName.current?.value}`, `${currPasswordInput.current?.value}`, newPassword, `${emailInput.current?.value}`, getCookieValue("shortToken")) // Change user info on backend
            switch (response) {
              case "Ok": 
                document.cookie = `longToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
                document.cookie = `shortToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
                router.push("/agent")
                setIsHalfVanished("")
                setAlert({isShown: true, message: "Changed!"})
                return

              case "DBError": 
                setIsHalfVanished("")
                setAlert({isShown: true, message: "Something's wrong with DB on server!"})
                return

              case "UserAccessError": 
                setIsHalfVanished("")
                setAlert({isShown: true, message: "Password is incorrect!"})
                return
              
              case "EmailExists": 
                setIsHalfVanished("")
                setAlert({isShown: true, message: "Email is already in use!"})
                return

              default: 
                setIsHalfVanished("")
                setAlert({isShown: true, message: "Something's wrong with server!"})
                return

            }
        } else {
          setAlert({isShown: true, message: "Passwords are same!"})
          return
        }
          
      } else {
          setAlert({isShown: true, message: "Enter username, email and password fields!"})
          return
      }

  }

  return (
    <>
    <div className={`${styles.alert} ${showAlert}`}>
        <button title="Alert" type="button" onClick={() => setAlert({isShown: false, message: alertAgent.message})}>{alertAgent.message}<br/>(Click on me to close!)</button>
     </div>
     <div className={`${isVanished} ${isHalfVanished}`}>
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
      <div className={styles.profile}>
        <div className={styles.userInfo}>
          <h1>Your profile information</h1>
          <div>
            <h2>Username:</h2>
            <input ref={userName} type="text" placeholder="Your new username..." onChange={handleChange} defaultValue={defUserName}></input>
          </div>
          <div>
            <h2>Email:</h2>
            <input ref={emailInput} type="email" placeholder="Your new email..." onChange={handleChange} defaultValue={defEmailInput}></input>
          </div>
          <div>
            <h2 className={isRed}>Current password:</h2>
            <input ref={currPasswordInput} type="password" placeholder="Your password..." onChange={() => {handleChange(); handleInputChange()}}></input>
          </div>
          <div>
            <h2 className={isRed}>New password:</h2>
            <input ref={newPasswordInput} type="password" placeholder="Your new password..." onChange={() => {handleChange(); handleInputChange()}}></input>
          </div>
        </div>
        <footer>
          <button title="logOutButton" type="button" className={`${styles.logOut} ${shouldRoundBorder}`} onClick={logOut}>LogOut</button>
          <button title="saveButton" type="button" className={`${styles.save} ${shouldSave}` } onClick={changer}>Save</button>
        </footer>
      </div>
    </>
  );
}
