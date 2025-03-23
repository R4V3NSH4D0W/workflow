import { useParams } from "next/navigation";

export const useInviteCode=()=>{
    const parms =useParams();
    return parms.inviteCode as string;
}