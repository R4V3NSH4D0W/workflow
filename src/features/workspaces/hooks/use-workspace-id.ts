import { useParams } from "next/navigation";

export const useWorkspaceIds=()=>{
    const parms =useParams();
    return parms.workspaceId as string;
}