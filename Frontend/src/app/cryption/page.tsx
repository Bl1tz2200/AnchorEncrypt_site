"use client"

// Imports
import Image from "next/image";
import styles from "./cryptionPage.module.css";
import { useEffect, useRef, useState } from "react";
import { checkToken, getCookieValue } from "@/tokenHooks/OnClientTokenInteractions";
import { useRouter } from "next/navigation";
import { decrypt, encrypt, getKey } from "./requestsToServer";

export default function CryptionPage() {
  const router = useRouter() // Create router

  // Load div states
  var [isVanished, setIsVanished] = useState(styles.load)
  var [isHalfVanished, setIsHalfVanished] = useState("")

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

  // Work state
  var [isEncrypting, setIsEncrypting] = useState(true)

  // Button styles (depends on work state)
  var [encryptButtonStyles, setEncryptButtonStyles] = useState(styles.whatsNow)
  var [decryptButtonStyles, setDecryptButtonStyles] = useState(styles.decryptNotChosen)

  // Button text that shows work state
  var [whatsDoing, setWhatsDoing] = useState("Encrypt")

  // Show file name with text when file attached
  var [isShowingFileName, setIsShowingFileName] = useState(false)

  // Get file name
  var [fileName, setFileName] = useState("")

  // Styles of text inside drop box
  var [neededAutoMargin, setNeededAutoMargin] = useState("") // Sets automargin to default text when file's been attached(to make it look better)
  var [isElementShown, setIsElementShown] = useState(styles.removeItem) // Shows file name if file's been attached

  // Get file (from file input)
  var [file, setFile] = useState<File | null>()

  // Creating drop zone
  var dropZone = useRef<HTMLHeadingElement | null>(null)
  var [isDropping, setIsDropping] = useState("") // Make dop dox blue, if file is been dropping to drop box

  useEffect(() => {
    if (isShowingFileName && file) { // If file's been attached, it will display text and apply styles
      setFileName(`Your file is: ${file.name}`)
      setNeededAutoMargin(styles.autoTopMargin)
      setIsElementShown("")
    } else {
      setFileName(`Your file is: File isn't chosen`)
      setNeededAutoMargin("")
      setIsElementShown(styles.removeItem)
    }
  }, [file])

  useEffect(() => { // Set styles that depends on work state
    if (isEncrypting) {
      setEncryptButtonStyles(styles.whatsNow)
      setDecryptButtonStyles(styles.decryptNotChosen)
      setWhatsDoing("Encrypt")
    } else {
      setEncryptButtonStyles(styles.encryptNotChosen)
      setDecryptButtonStyles(styles.whatsNow)
      setWhatsDoing("Decrypt")
    }
  }, [isEncrypting])

  useEffect(() => { // drop zone states
    if (getCookieValue("shortToken") !== "NotFound"){ // If user not allowed to this page
      setIsVanished(`${styles.load} ${styles.vanish}`);
    } else {
      router.push("/agent")
    }

    if(dropZone.current){
      dropZone.current.addEventListener("drop", (droppedFile) => { // If file is dropped
        droppedFile.preventDefault()
        setIsDropping("")
        setFile(droppedFile.dataTransfer?.files[0])
        setIsShowingFileName(true)
       })
      dropZone.current.addEventListener("dragover", function(dragedFile) { // If file is dragovered
        dragedFile.preventDefault()
        setIsDropping(styles.blue)
       });
      dropZone.current.addEventListener("dragleave", function(dragedFile) { // If drag has left the drop box
        dragedFile.preventDefault()
        setIsDropping("")
      });
      }
  }, []);


  async function crypt(){ // Encryption/decryption
    if (file != null){ // If file provided

      file.name.split(".")[file.name.split(".").length - 1]
      if (!file.name.split(".")[file.name.split(".").length - 1].includes("Enc") && !isEncrypting){ // If file should decrypt, it should ends with Enc
        setAlert({isShown: true, message: "You can decrypt only .*format*Enc files!"})
        return
      }
      
      await checkToken(router) // Checks shork jwt token, and updates it if it's expired
      setIsHalfVanished(styles.halfVanished) // Should download div

      
      var response = await getKey(getCookieValue("shortToken")) // Get crypt key
      switch (response.message) {
        case "Ok": 
            if (isEncrypting){ // Encryption

              // Ecryption proccess by reading file as byte array and encrypt it
              var reader = new FileReader();
              reader.onload = async () => {
                if (reader.result && typeof(reader.result) != "string"){

                  var fileEnc = await encrypt(reader.result, response.key)

                  var a = document.createElement("a");
                  var url = window.URL.createObjectURL(fileEnc);

                  if(!file){ 
                    setIsHalfVanished(""); 
                    setAlert({isShown: true, message: "Something's gone wrong!"})
                    return 
                  }
                  var extensionOfFile = file.name.split(".")[file.name.split(".").length - 1]
                  var filename = `${file.name.replace(`.${extensionOfFile}`, "")}.${extensionOfFile}Enc`; // File will be in .*format*Enc extension
                  a.href = url;
                  a.download = filename;
                  a.click();
                  window.URL.revokeObjectURL(url);
                  setIsHalfVanished("")
        
                } else {
                  setIsHalfVanished(""); 
                  setAlert({isShown: true, message: "Something's gone wrong!"})
                  return 
                }
              }
              reader.readAsArrayBuffer(file);
              setIsHalfVanished("")

            } else { // Decryption

              // Decryption proccess by reading encrypted byte array saved as text, decrypt it, and restore file back
              var reader = new FileReader();
              reader.onload = async () => {
                if (typeof(reader.result) == "string"){

                  var fileDec = await decrypt(reader.result, response.key)

                  var a = document.createElement("a");
                  var url = window.URL.createObjectURL(fileDec);

                  if(!file){ 
                    setIsHalfVanished(""); 
                    setAlert({isShown: true, message: "Something's gone wrong!"})
                    return 
                  }

                  var filename = file.name.slice(0, -3); // Delete Enc letters from extension
                  a.href = url;
                  a.download = filename;
                  a.click();
                  window.URL.revokeObjectURL(url);
                  setIsHalfVanished("")
        
                } else {
                  setIsHalfVanished(""); 
                  setAlert({isShown: true, message: "Something's gone wrong!"})
                  return 
                }
              }
              reader.readAsText(file);
              setIsHalfVanished("")
            }
            return
  
        case "DBError": 
          setIsHalfVanished(""); 
          setAlert({isShown: true, message: "Something's wrong with DB on server!"})
          return 
  
        case "NoUserFounded":
          document.cookie = `longToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          document.cookie = `shortToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          router.push("/agent")
          setIsHalfVanished(""); 
          setAlert({isShown: true, message: "Something's wrong! Log in again!"})
          return 
  
        default: 
          setIsHalfVanished(""); 
          setAlert({isShown: true, message: "Something's wrong with server!"})
          return 
  
      }

    } else {
      setAlert({isShown: true, message: "Enter File!"})
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
              <h1 className={styles.blue}>
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
      <div className={styles.cryption}>
        <header>
          <button title="Encryption" type="button" className={`${styles.encryptionButton} ${encryptButtonStyles}`} onClick={() => setIsEncrypting(true)}>Encryption</button>
          <button title="Decryption" type="button" className={`${styles.decryptionButton} ${decryptButtonStyles}`} onClick={() => setIsEncrypting(false)}>Decryption</button>
        </header>
        <div className={styles.wrapper}>
          <div className={`${styles.fileDropper} ${isDropping}`} ref={dropZone}>
            <h1 className={neededAutoMargin}>
              Drop file in this box
              <br/>
              Or
              <br/>
              <label>
                Browse
                <input type="file" title="FileToEncrypt" accept="all" className={styles.removeItem} onChange={(event) => {if(event.target.files){setFile(event.target.files[0])}; setIsShowingFileName(true)}}/>
                <span></span>
              </label>
            </h1>
            <h2 className={isElementShown}><span>{fileName}</span></h2>
          </div>
          <button title="sendButton" type="button" className={styles.sender} onClick={crypt}>{whatsDoing} File</button>
        </div>
      </div>
    </>
  );
}
