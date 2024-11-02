"use server"

// Imports
import CryptoJS from 'crypto-js';
import { apiAddress, JWTUserInfo } from '../layout';
import { config } from "dotenv";
config()


// Key to encrypt credentials
var key: string

if (process.env.CIPHER_KEY){
    
    key = process.env.CIPHER_KEY //key

} else {
    key = "default_key_XD"
    console.log("NO CIPHER_KEY PROVIDED!")
}

export async function changeDataOnServer(username: string, password: string, newPassword: string, email: string, token: string): Promise<string> { // Fetch to backend to change user info (username, email)
    
    if (newPassword !== "Nothing"){
        var sendingNewPassword = `${CryptoJS.AES.encrypt(newPassword, key)}`
    } else {
        var sendingNewPassword = newPassword
    }

    const response = fetch(`${apiAddress}/change`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({

        "username": `${username}`,
        "password": `${CryptoJS.AES.encrypt(password, key)}`,
        "newPassword": sendingNewPassword,
        "email": `${email}`,
        "shortToken": token

        }),
    }).then(data => {
        return data.text()
    }).then(serverAnswer => {
        return serverAnswer
    })
    return response
} 

export async function getUserInfoFromServer(token: string): Promise<JWTUserInfo> { // Fetch to backend to get user info from backend
    

    const response = fetch(`${apiAddress}/getinfo`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({

        "shortToken": token

        }),
    }).then(data => {
        return data.json()
    }).then(serverAnswer => {
        return serverAnswer
    })

    return response
} 
