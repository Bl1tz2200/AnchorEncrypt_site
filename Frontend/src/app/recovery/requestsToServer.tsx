"use server"

// Imports
import CryptoJS from 'crypto-js';
import { apiAddress} from '../layout';
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

export async function sendResetData(password: string, newPassword: string, token: string): Promise<string> { // Fetch to backend to change pasword (with out changing other user data)

    const response = fetch(`${apiAddress}/change`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({

        "username": "Nothing",
        "password": `${CryptoJS.AES.encrypt(password, key)}`,
        "newPassword": `${CryptoJS.AES.encrypt(newPassword, key)}`,
        "email": "Nothing",
        "shortToken": token

        }),
    }).then(data => {
        return data.text()
    }).then(serverAnswer => {
        return serverAnswer
    })
    return response
} 