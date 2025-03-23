"use server";

import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { AUTH_COOKIE } from "./constants";

export const getCurrent = async()=>{
    try{
    const clinet = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APP_WRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APP_WRITE_PROJECT!);


    const session = (await cookies()).get(AUTH_COOKIE);
    if (!session) {
        return null;
    }
    clinet.setSession(session.value);

    const account = new Account(clinet);

    return await account.get();
    }catch{
        return null;
    }

}