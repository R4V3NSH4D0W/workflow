import { useQuery } from "@tanstack/react-query";

import { clinet } from "@/lib/rpc";
import { InferResponseType } from "hono";

interface useWorkspaceAnalyticsProps{
    workspaceId:string;
}

export type AnalyticsResponseType =InferResponseType<typeof clinet.api.workspaces[":workspaceId"]["analytics"]["$get"],200>

export const useWorkspaceAnalytics= ({workspaceId}:useWorkspaceAnalyticsProps)=>{
    const query =useQuery({
        queryKey:["workspace-analytics",workspaceId],
        queryFn:async()=>{
            const response = await clinet.api.workspaces[":workspaceId"]["analytics"].$get({
                param:{
                    workspaceId
                },
            });
            if(!response.ok){
               throw new Error("Failed to fetch workspace analytics")
            }

            const {data}= await response.json();

            return data;
        }

    })
    return query;
}