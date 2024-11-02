"use client"

// Imports
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  // Load div state
  var [isVanished, setIsVanished] = useState(styles.load)

  // Styles of navBar buttons
  var [isGreetBlue, setIsGreetBlue] = useState(`${styles.blue}`)
  var [isWorkBlue, setIsWorkBlue] = useState("")
  var [isInfoBlue, setIsInfoBlue] = useState("")

  // Refs to navBar buttons
  const greet = useRef<HTMLHeadingElement|null>(null)
  const work = useRef<HTMLHeadingElement|null>(null)
  const info = useRef<HTMLHeadingElement|null>(null)

  const executeScrollToGreet = () => { // Scroll to part with greet
    if(greet.current){
      greet.current.scrollIntoView()
      setIsGreetBlue(styles.blue)
      setIsWorkBlue("")
      setIsInfoBlue("")
    }
  } 
  const executeScrollToWork = () => { // Scroll to part with work info
    if (work.current){
      work.current.scrollIntoView()
      setIsGreetBlue("")
      setIsWorkBlue(styles.blue)
      setIsInfoBlue("")
    }
  }   
  const executeScrollToInfo = () => { // Scroll to part with author and site info
    if (info.current){
      info.current.scrollIntoView()
      setIsGreetBlue("")
      setIsWorkBlue("")
      setIsInfoBlue(styles.blue)
    }
  }   

  const listenScrollEvent = () => { // Color navBar's buttons into blue if their part is seen by user
    if (window.scrollY > 1030) { // If author and site info are shown
      setIsGreetBlue("")
      setIsWorkBlue("")
      setIsInfoBlue(styles.blue)
    } else if (window.scrollY > 350) { // If work info is shown
      setIsGreetBlue("")
      setIsWorkBlue(styles.blue)
      setIsInfoBlue("")
    } else if (window.scrollY > 0) { // If greets is shown
      setIsGreetBlue(styles.blue)
      setIsWorkBlue("")
      setIsInfoBlue("")
    } 
  }
  
  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent); // create scroll listener to see: how many pixels has been scrolled
    setIsVanished(`${styles.load} ${styles.vanish}`);
  }, []);

  return (
    <>
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
            <a onClick={executeScrollToGreet}>
              <h1 className={isGreetBlue}>
                Greeting
              </h1>
            </a>
          </li>
         <li className={styles.special}>
            <a onClick={executeScrollToWork}>
              <h1 className={isWorkBlue}>
                How it works?
              </h1>
            </a>
          </li>
          <li className={styles.special}>
            <a onClick={executeScrollToInfo}>
              <h1 className={isInfoBlue}>
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
             <h1 className={styles.lastLi}>
               Profile
             </h1>
            </a>
          </li>
        </ul>
      </nav>
      <div className={styles.greets}>
        <span ref={greet}/>
        <h1>
          AnchorEncrypt
        </h1>
        <h2>
          Encryption anchored on your profile!
        </h2>
        <div className={styles.videoWrapper}>
          <video src="/background.mp4" playsInline autoPlay muted loop poster="/image.jpg" />
        </div>
      </div>
      <div className={styles.workPrinciple}>
        <span ref={work}/>
        <ul>
          <li>
            <Image src="/lock.gif" width={100} height={100} alt="LockPic"/>
            <h2>
              Encryption is done on the server side by AES (Advanced Encryption Standard) with key.
            </h2>
          </li>
          <li>
            <Image src="/database.gif" width={100} height={100} alt="DataBasePic"/>
            <h2>
              Site transmits all account's credentials encrypted, the encryption key are stored in server's credentials and sended only in crypting processes.
              <br/>
              You can encrypt and decrypt files only from your account.
            </h2>
          </li>
          <li>
            <Image src="/approved.gif" width={100} height={100} alt="ApprovedPic"/>
            <h2>
              AnchorEncrypt doesn't save your files to keep your information confidential.
              <br/> 
              All account credetials are sent to the server's api in the encrypted post requests. They are stored encrypted too.
            </h2>
          </li>
          <li>
            <Image src="/register.gif" width={100} height={100} alt="ApprovedPic"/>
            <h2>
              Registration isn't hard and requires your email to reset password if you forgot it.
            </h2>
          </li>
          <li>
            <Image src="/support.gif" width={100} height={100} alt="ApprovedPic"/>
            <h2>
              For all support and feedback, please use the contacts below.
              <br/>
              It would be nice if you left information about bugs and errors.
            </h2>
          </li>
          <li>
            <Image src="/help.gif" width={100} height={100} alt="ApprovedPic"/>
            <h2>
              It is opensource project too. 
              <br/>
              If you interested in it's code you can find link to repository below.               
            </h2>
          </li>
        </ul>
      </div>
      <footer className={styles.basement}>
        <ul>
          <li>
            <div className={styles.iconEmail}>
              <Image src="/email.png" width={50} height={50} alt="Email: "/>
            </div>
            <h3>
              <a href="mailto:yaroslavkazan2008@gmail.com
         ?subject=Giving%20feedback%20about%20AnchorEncrypt
         &body=Hello%20there,%20this%20is%20my%20feedback:">
          yaroslavkazan2008@gmail.com</a>
              <span></span>
            </h3>
          </li>
          <li>
            <div className={styles.iconGitHub}>
              <Image src="/github.png" width={50} height={50} alt="GitHub: "/>
            </div>
            <h3>
              <a href="https://github.com/Bl1tz2200">Bl1tz2200</a>
              <span></span>
            </h3>
          </li>
          <li>
            <div className={styles.iconDiscord}>
              <Image src="/discord.png" width={50} height={50} alt="Discord: "/>
            </div>
            <h3>
              <a href="https://discord.gg/637926492898328577">bl1tz2200</a>
              <span></span>
            </h3>
          </li>
          <li>
            <div className={styles.iconTelegram}>
              <Image src="/telegram.png" width={50} height={50} alt="Telegram: "/>
            </div>
            <h3 ref={info}>
              <a href="https://t.me/Blitz_2200">@Blitz_2200</a>
              <span></span>
            </h3>
          </li>
        </ul>
      </footer>
    </>
  );
}
