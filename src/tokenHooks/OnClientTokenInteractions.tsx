"use client"

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { checkShortToken, updateShortToken } from "./OnServerTokenInteractions";

export function getCookieValue(name: string) {
    const cookies = document.cookie.split(';');
    const token = cookies.find(c => c.includes(name))

    if (token) {
       return token.substring(token.indexOf('=') + 1);
    }

    return "NotFound"
}

export async function updateShortTokenOnClientSide(token: string, router: AppRouterInstance) {

    if (getCookieValue("longToken") !== "NotFound") {
        var response = await updateShortToken(token)
        switch (response.message){
        case "Ok": 
            document.cookie = `shortToken=${response.token}; max-age=${response.expTime}`;
            return

        case "DBError": 
            alert("Something's wrong with DB on server!")
            return

        case "TokenNotValid": 
            document.cookie = `longToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            router.push("/profile")
            return

        default: 
            alert("Something's wrong with server!")
            return

        }
    } else {
        router.push("/profile")
        return
    }
}

export async function checkToken(router: AppRouterInstance){
    if (getCookieValue("shortToken") !== "NotFound") {

        var response = await checkShortToken(getCookieValue("shortToken"))
        switch (response.message){
        case "Ok": 

            return

        case "DBError": 
            alert("Something's wrong with DB on server!")
            return

        case "TokenNotValid": 
            document.cookie = `shortToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            await updateShortTokenOnClientSide(getCookieValue("longToken"), router)
            return

        default: 
            alert("Something's wrong with server!")
            return

        }
    } else {
        await updateShortTokenOnClientSide(getCookieValue("longToken"), router)
        return
    }
}