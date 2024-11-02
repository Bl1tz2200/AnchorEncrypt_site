"use server"

// Imports
import CryptoJS from 'crypto-js';
import { apiAddress, JWTTokenResponse } from '../layout';
import { config } from "dotenv";
config()

// Key to encrypt credentials
var key: string

if (process.env.CIPHER_KEY){
    
    key = process.env.CIPHER_KEY

} else {
    key = "default_key_XD"
    console.log("NO CIPHER_KEY PROVIDED!")
}

export async function sendDataToServer(username: string, password: string, email: string): Promise<string> { // Fetch to backend to sign in
    const response = fetch(`${apiAddress}/registration`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({

        "username": `${username}`,
        "password": `${CryptoJS.AES.encrypt(password, key)}`,
        "email": `${email}`

        }),
    }).then(data => {
        return data.text()
    }).then(serverAnswer => {
        return serverAnswer
    })
    return response
} 

export async function logIn(username: string, password: string): Promise<JWTTokenResponse> { // Fetch to backend to log in
    const response = fetch(`${apiAddress}/authentication`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({

        "username": username,
        "password": `${CryptoJS.AES.encrypt(password, key)}`,

        }),
    }).then(data => {
        return data.json()
    }).then(serverAnswer => {
        return serverAnswer
    })
    return response
} 

