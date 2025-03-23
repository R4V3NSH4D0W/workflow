"use server";

import { cookies } from "next/headers";
import {  Account, Client, Databases, Query } from "node-appwrite";
import { AUTH_COOKIE } from "../auth/constants";
import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config";
import { getMember } from "../members/utils";
import { Workspace } from "./types";

export const getWorkspaces = async()=>{
    try{
    const clinet = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APP_WRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APP_WRITE_PROJECT!);


    const session = (await cookies()).get(AUTH_COOKIE);
    if (!session) {
        return ({
            documents:[],
            total:0
        })
    }
    clinet.setSession(session.value);

    const databases = new Databases(clinet);
    const account = new Account(clinet);
    const user = await account.get();

    const members =await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("userId",user.$id)]
    )
    if(members.total ===0){
        return ({
            documents:[],
            total:0
        })
    }

    const workspacesIds = members.documents.map((member)=>member.workspaceId);

    const workspaces = await databases.listDocuments(
        DATABASE_ID,WORKSPACE_ID,[Query.orderDesc("$createdAt"),
            Query.contains("$id",workspacesIds)]
    );

    return workspaces;
    }catch{
        return ({
            documents:[],
            total:0
        })
    }

}

interface getWorkspaceProps{
    workspaceId:string
}

export const getWorkspace = async({workspaceId}:getWorkspaceProps)=>{
    try{
    const clinet = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APP_WRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APP_WRITE_PROJECT!);


    const session = (await cookies()).get(AUTH_COOKIE);
    if (!session) {
        return null;
    }
    clinet.setSession(session.value);

    const databases = new Databases(clinet);
    const account = new Account(clinet);
    const user = await account.get();

    const member = await getMember({databases, userId:user.$id,workspaceId});
    if(!member){
        return null;
    }

    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,WORKSPACE_ID,workspaceId
    );

    return workspace;
    }catch{
        return null;
    }

}