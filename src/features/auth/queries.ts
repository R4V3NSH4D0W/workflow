import { createSessionClinet } from "@/lib/app-write";

export const getCurrent = async()=>{
    try{
 const {account}= await createSessionClinet();

    return await account.get();
    }catch{
        return null;
    }

}