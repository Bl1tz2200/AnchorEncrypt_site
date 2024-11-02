"use server"

import CryptoJS from 'crypto-js';
import { apiAddress, keyResp } from '../layout';
import { config } from "dotenv";
config()


// Key for decrypt and encrypt credentials
var key: string

if (process.env.CIPHER_KEY){
    
    key = process.env.CIPHER_KEY

} else {
    key = "default_key_XD"
    console.log("NO CIPHER_KEY PROVIDED!")
}

function convertWordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray) { // Convert text byte array into Int8 byte array
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index=0, word, i;
    for (i=0; i<length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
  }


export async function getKey(token: string): Promise<keyResp> { // get crypt key from backend
    
    const response = fetch(`${apiAddress}/getkey`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({

            "shortToken": token, 

            }),
    }).then(data => {
        return data.json()
    }).then(serverAnswer => {
        
        if(serverAnswer.message == "Ok"){
            serverAnswer.key = CryptoJS.AES.decrypt(serverAnswer.key, key).toString(CryptoJS.enc.Utf8)
        }
        return serverAnswer
    })

    return response
} 

export async function encrypt(toEncrypt: ArrayBuffer, key: string) { // Encryption func using CryptoJs to encrypt

    var wordArray = CryptoJS.lib.WordArray.create(toEncrypt);           // Convert: ArrayBuffer -> WordArray
    var encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();        // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)

    var fileEnc = new Blob([encrypted]);                                    // Create blob from string
    return fileEnc

} 

export async function decrypt(toDecrypt: string, key: string) { // Decryption func using CryptoJs to decrypt
        var decrypted = CryptoJS.AES.decrypt(toDecrypt, key);               // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
        var typedArray = convertWordArrayToUint8Array(decrypted);               // Convert: WordArray -> typed array

        var fileDec = new Blob([typedArray]);                                   // Create blob from typed array
        return fileDec

}
