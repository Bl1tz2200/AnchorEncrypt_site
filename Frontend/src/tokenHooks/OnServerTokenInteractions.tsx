"use server"

import { apiAddress, JWTCheckTokenResponse, JWTTokenResponse } from "../app/layout";

export async function updateShortToken(token: string): Promise<JWTTokenResponse> {
     const response = fetch(`${apiAddress}/update`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
    
        "longToken": token,
    
        }),
    }).then(data => {
        return data.json()
    }).then(serverAnswer => {
        return serverAnswer
    })
    return response
} 

export async function checkShortToken(token: string): Promise<JWTCheckTokenResponse> {
    const response = fetch(`${apiAddress}/check`, {
       method: "POST",
       headers: {"Content-Type": "application/json"},
       body: JSON.stringify({
   
       "shortToken": token,
   
       }),
   }).then(data => {
       return data.json()
   }).then(serverAnswer => {
       return serverAnswer
   })
   return response
} 
  