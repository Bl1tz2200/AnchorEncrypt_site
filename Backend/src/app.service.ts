import { Injectable } from '@nestjs/common';
import { pool } from "./db"
import { authenticationDTO, changeDTO, checkShortTokenDTO, getKeyDTO, getUserInfoDTO, registrationDTO, resetPasswordDTO, updateShortTokenDTO } from './DTOs';
import { AES, enc } from "crypto-js"
import { sign, verify } from 'jsonwebtoken'
import { createTransport} from "nodemailer"
import { config } from 'dotenv';
import { mineIpAddress } from './main';
config()

// Get signs for jwt from env vars
const signature_for_15_days = process.env.SIGND15
const signature_for_15_minutes = process.env.SIGNM15

// Creates transporter for sending email
const transporter = createTransport({
  host: process.env.POST_HOST,
  port: parseInt(process.env.POST_PORT),
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.POST_USER,
    pass: process.env.POST_PASSWORD,
  },
});

// Creating JWT types to read and send data
type JWTUser = {
  email: string
}

type JWTTokenResponse = {
  message: string,
  token: string,
  exptTime: number
}

type JWTCheckTokenResponse = {
  message: string
}

type JWTUserInfo = {
  message: string,
  username: string,
  email: string
}

type keyAnsw = {
  message: string
  key: string
}


// Get's key to encrypt and decrypt user's credentials
var key: string

if (process.env.CIPHER_KEY){
    
  key = process.env.CIPHER_KEY //key

} else {
  key = "default_key_XD"
  console.log("NO CIPHER_KEY PROVIDED!")
}


async function generateUniqueKey(): Promise<string> { // generates unique user's crypt key
  let randomKey: string | PromiseLike<string>
  let isKeyUnique = false

  const letters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let word = ''

  for (let i = 0; i < 15; i++) {
      word += letters.charAt(Math.floor(Math.random() * letters.length))
  }

  randomKey = word.slice(0, 5).toUpperCase() + '-' + word.slice(5, 10).toUpperCase() + '-' + word.slice(10, 15).toUpperCase() // Generates from string slice

  // Save key into db
  try {

    const result = await pool.query('SELECT * FROM users');
    if (result.rows.length != 0){

      for (let user of result.rows) {

        if (user.key === randomKey){

          randomKey = word.slice(0, 5).toUpperCase() + '-' + word.slice(5, 10).toUpperCase() + '-' + word.slice(10, 15).toUpperCase()

        } else {

          isKeyUnique = true

        }
      }

    } else {
      return randomKey
    }

    if(isKeyUnique){
      return randomKey
    }
      
  } catch (err) {

    console.log("Catched error in generateUniqueKey() while generating key: ", err.message);

  }
}

async function emailNotExist(email: string): Promise<boolean> { // Checks if user with that email exists
  let boolVar = true

  // Trying to find user with that email
  try {

    const result = await pool.query('SELECT * FROM users');

    for (let user of result.rows) {
       if (user.email === email){

        boolVar = false // If user founded

      }
    }

    return boolVar // If user with that email don't exist
    
  } catch (err) {

    console.log("Catched error in emailNotExist() while checking email: ", err.message);

  }
}


function generateTokenD15(user: JWTUser): string { // generates long jwt token from user's email

  const data =  {
    email: user.email
  };

  const expiration = '300h' // long token has 300h to expire

  return sign({ data, }, signature_for_15_days, { expiresIn: expiration });
}

function generateTokenM15(user: JWTUser): string { // generates short jwt token

  const data =  {
    email: user.email
  };
  
  const expiration = '900s'; // short token has 15 minutes to expire

  return sign({ data, }, signature_for_15_minutes, { expiresIn: expiration });
}


@Injectable() // Creating services for backend endpoints
export class AppService {

  async registrate(dto: registrationDTO): Promise<string> { // Sign in users, adds them into db

    if(await emailNotExist(dto.email)){
        try {

          // Adds user info into db
          await pool.query('INSERT INTO Users (username, password, email, key) VALUES ($1, $2, $3, $4)', [dto.username, dto.password, dto.email, await generateUniqueKey()]);
          return "Ok"
          
        } catch (err) {

          console.log("Catched error in registrate() while adding user to db: ", err.message);
          return "DBError"

        }
    } else {
      return "EmailExists"
    }
  }

  async authenticate(dto: authenticationDTO): Promise<JWTTokenResponse> { // If user's credentials are right, will return long token to log them
    try {

      // Get all users from db
      const result = await pool.query('SELECT * FROM users');

      // Finding user with same username and password in db
      for (let user of result.rows) {

        if (user.username === dto.username && AES.decrypt(user.password, key).toString(enc.Utf8) === AES.decrypt(dto.password, key).toString(enc.Utf8)){

          let jwtuser: JWTUser = {
            email: user.email
          }

          return {message: "Ok", token: generateTokenD15(jwtuser), exptTime: 1296000}

        }
      }

      return {message: "UserNotFound", token: "", exptTime: 0}
      
    } catch (err) {

      console.log("Catched error in authenticate() while authenticate user: ", err.message);
      return {message: "DBError", token: "", "exptTime": 0}

    }
  }

  async updateShortToken(dto: updateShortTokenDTO): Promise<JWTTokenResponse> { // Updates short token with long token
    try {

      // Verifies long token
      var decodedJWT = verify(dto.longToken, signature_for_15_days)
      if (typeof(decodedJWT) == "string"){return {message: "TokenNotValid", token: "", exptTime: 0}}

      try {

        // Returns user email decoded into short token
        const result = await pool.query('SELECT * FROM users');

        for (let user of result.rows) {
          if (decodedJWT.data.email === user.email){
            let jwtuser: JWTUser = {
              email: user.email
            }
            return {message: "Ok", token: generateTokenM15(jwtuser), exptTime: 900}
  
          } 
        }

        return {message: "TokenNotValid", token: "", exptTime: 0}

      } catch (err) {
  
        console.log("Catched error in updateShortToken() while getting user from DB: ", err.message);
        return {message: "DBError", token: "", exptTime: 0}
  
      }
      
    } catch (err) {

      console.log("Catched error in updateShortToken() while updating token: ", err.message);
      return {message: "TokenNotValid", token: "", "exptTime": 0}

    }
  }

  async checkShortToken(dto: checkShortTokenDTO): Promise<JWTCheckTokenResponse> { // Check's valid of short token
    try {

      // Verifies short token
      var decodedJWT = verify(dto.shortToken, signature_for_15_minutes)
      if (typeof(decodedJWT) == "string"){return {message: "TokenNotValid"}}

  
      try {
        
        // Checks: is this token contains someone's email
        const result = await pool.query('SELECT * FROM users');
  
        for (let user of result.rows) {
          if (decodedJWT.data.email === user.email){
            return {message: "Ok"}
  
          } 
        }
  
        return {message: "TokenNotValid"}
  
      } catch (err) {
  
        console.log("Catched error in checkShortToken() while getting user from DB: ", err.message);
        return {message: "DBError"}
  
      }
      
    } catch (err) {
  
      return {message: "TokenNotValid"}
  
    }
  }

  async changeUserInfo(dto: changeDTO): Promise<string> { // Changes user info 
      try {

        // Verifies short token
        var decodedJWT = verify(dto.shortToken, signature_for_15_minutes)
        if (typeof(decodedJWT) == "string"){return "TokenNotValid"}

        // Get user by his email decoded in token
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [decodedJWT.data.email]);
        let user = result.rows[0]

        if ((AES.decrypt(user.password, key).toString(enc.Utf8) === AES.decrypt(dto.password, key).toString(enc.Utf8)) || (dto.username === "Nothing" && dto.email === "Nothing")){ // If user provided right password or he want's to reset password
          if(emailNotExist(dto.email)){

            if(dto.username === "Nothing" && dto.email === "Nothing"){ // If user resets password

              await pool.query('UPDATE users SET password = $1 WHERE email = $2', [dto.newPassword, decodedJWT.data.email]);
              return "Ok"

            } else if (dto.newPassword === "Nothing"){ // If user just wants to change username or email (or both)

              await pool.query('UPDATE users SET username = $1, email = $2 WHERE email = $3', [dto.username, dto.email, decodedJWT.data.email]);
              return "Ok"
  
            } else { // If user changes password too

              await pool.query('UPDATE users SET username = $1, email = $2, password= $3 WHERE email = $4', [dto.username, dto.email, dto.newPassword, decodedJWT.data.email]);
              return "Ok"

            }

          } else {
            return "EmailExists"
          }
        }

        return "UserAccessError"
        
      } catch (err) {

        console.log("Catched error in changeUserInfo() while changing user info in DB: ", err.message);
        return "DBError"

      }
  }

  async getUserInfo(dto: getUserInfoDTO): Promise<JWTUserInfo>{  // Returns user info by short token
    try {
      
      // Verifies short token
      var decodedJWT = verify(dto.shortToken, signature_for_15_minutes)
      if (typeof(decodedJWT) == "string"){return {message: "TokenNotValid", username: "", email: ""}}

      // Gets user from db and sends his info
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [decodedJWT.data.email]);
      let user = result.rows[0]

      if (user.length != 0){
        return {message: "Ok", username: `${user.username}`, email: `${user.email}`}

      }
      
      return {message: "NoUserFounded", username: "", email: ""}
      
    } catch (err) {

      console.log("Catched error in getUserInfo() while changing user info in DB: ", err.message);
      return {message: "DBError", username: "", email: ""}

    }
  } 

  async getKey(dto: getKeyDTO): Promise<keyAnsw> { // Returns user's crypt key 
    try {
      
      // Verifies short token
      var decodedJWT = verify(dto.shortToken, signature_for_15_minutes)
      if (typeof(decodedJWT) == "string"){return {message: "TokenNotValid", key: ""}}

      // Gets user from db by email decoded in jwt token
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [decodedJWT.data.email]);
      let user = result.rows[0]

      if (user.length != 0){
        return {message: "Ok", key: `${AES.encrypt(user.key, key).toString()}`} // Returns encrypted user's crypt key

      }
      
      return {message: "NoUserFounded", key: ""}
      
    } catch (err) {

      console.log("Catched error in getUserInfo() while changing user info in DB: ", err.message);
      return {message: "DBError", key: ""}

    }
  }

  async sendMailToResetPassword(dto: resetPasswordDTO): Promise<string> { // Sends url with short token in query string to change password
    if(await emailNotExist(dto.email) == false) {
      try {
        
        // Send email to user by created transporter
        await transporter.sendMail({
          from: `"NoReplyAnchor-Encrypt" <${process.env.POST_USER}>`,
          to: `${dto.email}`, // List of receivers
          subject: "Reset password", // Subject line
          text: `To reset your password please follow this link: ${mineIpAddress}?token=${generateTokenM15({email: dto.email})}`, // Plain text body
        });

        return "Ok"
  
      }
      catch {

        return "EmailError"

      }
    } else {
      
        return "EmailNotFound"

      }
  }
}
