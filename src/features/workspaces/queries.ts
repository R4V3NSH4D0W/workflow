"use server";
import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config";
import { getMember } from "../members/utils";
import { Workspace } from "./types";
import { createSessionClinet } from "@/lib/app-write";

export const getWorkspaces = async()=>{
    try{
   const {account,databases}= await createSessionClinet();
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

    const {account,databases}= await createSessionClinet();
  
    const user = await account.get();

    const member = await getMember({databases, userId:user.$id,workspaceId});
    if(!member){
       throw new Error("unAuthroized");
    }

    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,WORKSPACE_ID,workspaceId
    );

    return workspace;

}

interface getWorkspaceInfoProps{
    workspaceId:string
}

export const getWorkspaceInfo = async({workspaceId}:getWorkspaceInfoProps)=>{
    const {databases}= await createSessionClinet();
  

    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,WORKSPACE_ID,workspaceId
    );

    return {
        name:workspace.name
    };
 

}