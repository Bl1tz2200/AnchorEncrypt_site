"use client"

// Imports
import Image from "next/image";
import styles from "./agentPage.module.css";
import { useEffect, useRef, useState } from "react";
import { logIn, sendDataToServer } from "./requestsToServer";
import { getCookieValue, updateShortTokenOnClientSide } from "@/tokenHooks/OnClientTokenInteractions";
import { useRouter } from "next/navigation";

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

  // Creating refs to inputs
  var userName = useRef<HTMLInputElement | null>(null)
  var emailInput = useRef<HTMLInputElement | null>(null)
  var passwordInput = useRef<HTMLInputElement | null>(null)
  var repeatPasswordInput = useRef<HTMLInputElement | null>(null)

  var [isRed, setIsRed] = useState("") // Coloring text into red

  var handleInputChange = () => { // Will color text over inputs if they aren't same
    if (!loggingIn){
      if(passwordInput.current?.value !== repeatPasswordInput.current?.value){
        setIsRed(styles.red)
      } else {
        setIsRed("")
      }
    }
  }
  
  // Log state
  var [loggingIn, setLoggingIn] = useState(true)

  // Set styles that depends on log state
  var [logInButtonStyles, setLogInButtonStyles] = useState(styles.whatsNow)
  var [signInButtonStyles, setSignInButtonStyles] = useState(styles.signInNotChosen)
  var [signInfoSeen, setSignInfoSeen] = useState(styles.removeItem)

  // Set button text that depends on log state
  var [whatsDoing, setWhatsDoing] = useState("Log in")
  var [whatsDoingForButtonTitle, setWhatsDoingForButtonTitle] = useState("logIn")

  useEffect(() => {
    if (loggingIn) { // Apply styles on log state change
      setLogInButtonStyles(styles.whatsNow)
      setSignInButtonStyles(styles.signInNotChosen)
      setWhatsDoing("Log in")
      setWhatsDoingForButtonTitle("logIn")
      setIsRed("")
      setSignInfoSeen(styles.removeItem)
    } else {
      setLogInButtonStyles(styles.logInNotChosen)
      setSignInButtonStyles(styles.whatsNow)
      setWhatsDoingForButtonTitle("signIn")
      setWhatsDoing("Sign in")
      setSignInfoSeen("")
    }
  }, [loggingIn])

  // Loading div styles
  var [isVanished, setIsVanished] = useState(styles.load)
  var [isHalfVanished, setIsHalfVanished] = useState("")

  useEffect(() => {
    if (getCookieValue("longToken") == "NotFound"){ // User can accept this only of he isn't logged in (don't have long token to update short token)
      setIsVanished(`${styles.load} ${styles.vanish}`);
    } else {
      router.push("/profile") // If user already logged, he will see his profile
    }
  }, []);

  async function sender() {  // Sign in account
      
      if (!loggingIn){
        if (userName.current?.value && passwordInput.current?.value && repeatPasswordInput.current?.value && emailInput.current?.value){ // If all inputs aren't empty
          if (isRed === ""){ // If passwords are same

            setIsHalfVanished(styles.halfVanished) // Show loading div
            var response = await sendDataToServer(`${userName.current?.value}`, `${passwordInput.current?.value}`, `${emailInput.current?.value}`) // Sign account on backend

             switch (response){
              case "Ok": 
                setIsHalfVanished("")
                setAlert({isShown: true, message: "Created!"})
                return

              case "DBError": 
                setIsHalfVanished("")
                setAlert({isShown: true, message: "Something's wrong with DB on server!"})
                return

               case "EmailExists": 
                setIsHalfVanished("")
                setAlert({isShown: true, message: "User with that email exists!"})
                return

              default: 
                setIsHalfVanished("")
                setAlert({isShown: true, message: "Something's wrong with server!"})
                return

            }
          } else {
            setAlert({isShown: true, message: "Passwords aren't same!"})
            return
          }
            
        } else {
            setAlert({isShown: true, message: "Enter all fields!"})
            return
        }
      }

    }

  

  async function logIntoAccout() { // Log in account

    if(loggingIn){
      if(userName.current?.value && passwordInput.current?.value){ // If all username and password aren't empty
        
          setIsHalfVanished(styles.halfVanished)
          var response = await logIn(userName.current?.value, passwordInput.current?.value) // Get long token from backend

          switch (response.message){
            case "Ok": 
              document.cookie = `longToken=${response.token}; max-age=${response.expTime}`; // Save gotten token to cookies
              await updateShortTokenOnClientSide(response.token, router)
              router.push("/profile") // redirect to profile
              setIsHalfVanished("")
              return

            case "DBError": 
              setIsHalfVanished("")
              setAlert({isShown: true, message: "Something's wrong with DB on server!"})
              return

            case "UserNotFound": 
              setIsHalfVanished("")
              setAlert({isShown: true, message: "Invalid username or password!"})
              return

            default: 
              setIsHalfVanished("")
              setAlert({isShown: true, message: "Something's wrong with server!"})
              return
          }
        
      } else {
        setAlert({isShown: true, message: "Enter all fields!"})
        return
      }
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
      <div className={styles.agentManager}>
        <header>
          <button title="LogIn" type="button" className={`${styles.logInButton} ${logInButtonStyles}`} onClick={() => setLoggingIn(true)}>Log in</button>
          <button title="SignIn" type="button" className={`${styles.signInButton} ${signInButtonStyles}`} onClick={() => setLoggingIn(false)}>Sign in</button>
        </header>
          <div className={styles.userInfo}>
           <h1>{whatsDoing} your account</h1>
           <div>
             <h2>Username:</h2>
             <input ref={userName} className={styles.textInput} type="text" placeholder="Your username..."></input>
           </div>
           <div>
             <h2>Password:</h2>
             <input className={styles.textInput} ref={passwordInput} type="password" placeholder="Your password..." onChange={() => {handleInputChange()}}></input>
           </div>
           <div className={signInfoSeen}>
             <h2 className={isRed}>Repeat password:</h2>
             <input className={styles.textInput} ref={repeatPasswordInput} type="password" placeholder="Repeat password..." onChange={() => {handleInputChange()}}></input>
          </div>
          <div className={signInfoSeen}>
            <h2>Email:</h2>
            <input ref={emailInput} className={styles.textInput} type="email" placeholder="Your email..."></input>
          </div>
          <button title={`${whatsDoingForButtonTitle}Button`} type="button" className={styles.sender} onClick={() => {sender(); logIntoAccout()}}>{whatsDoing}</button>
        </div>
      </div>
      <h3 className={styles.forgot}><a href="/department">Forgot your password?</a><span className={styles.line}/></h3>
    </>
  );
}
