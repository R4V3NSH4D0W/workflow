import { useQuery } from "@tanstack/react-query";

import { clinet } from "@/lib/rpc";

interface useGetWorkspaceProps{
    workspaceId:string;
}


export const useGetWorkspace= ({workspaceId}:useGetWorkspaceProps)=>{
    const query =useQuery({
        queryKey:["workspace",workspaceId],
        queryFn:async()=>{
            const response = await clinet.api.workspaces[":workspaceId"].$get({
                param:{
                    workspaceId
                },
            });
            if(!response.ok){
               throw new Error("Failed to fetch workspace")
            }

            const {data}= await response.json();

            return data;
        }

    })
    return query;
}