import { useQuery } from "@tanstack/react-query";

import { clinet } from "@/lib/rpc";
interface useGetTaskProps{
   taskId:string;
}


export const useGetTask= ({taskId}:useGetTaskProps)=>{
    const query =useQuery({
        queryKey:[ "task",taskId ],
        queryFn:async()=>{
            const response = await clinet.api.tasks[":taskId"].$get({
                param:{
                    taskId
                }
            });
            if(!response.ok){
               throw new Error("Failed to fetch task")
            }

            const data = await response.json();

            return data;
        }

    })
    return query;
}