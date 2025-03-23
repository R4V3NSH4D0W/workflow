// "use server";
import "server-only";
import {Client, Account,Storage,Databases,Users} from "node-appwrite";

export async function createAdminClinet(){
    const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APP_WRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APP_WRITE_PROJECT!)
    .setKey(process.env.NEXT_APP_WRITE_KEY!);

    return{
        get account(){
            return new Account(client);
        }
    }
}
