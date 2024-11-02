"use server"

import { apiAddress } from '../layout';


export async function sendDataToReset(email: string): Promise<string> { // Fetch to backend to send email for reset password
    const response = fetch(`${apiAddress}/resetpassword`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({

        "email": `${email}`

        }),
    }).then(data => {
        return data.text()
    }).then(serverAnswer => {
        return serverAnswer
    })
    return response
} 
