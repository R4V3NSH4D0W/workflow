import { useQuery } from "@tanstack/react-query";

import { clinet } from "@/lib/rpc";
import { TaskStatus } from "../types";

interface useGetTasksProps{
    workspaceId:string;
    projectId?:string|null;
    status?:TaskStatus | null;
    assigneeId?:string | null;
    search?:string | null;
    dueDate?:string | null;
}


export const useGetTasks= ({workspaceId,projectId,status,search,assigneeId,dueDate}:useGetTasksProps)=>{
    const query =useQuery({
        queryKey:[
            "tasks",
            workspaceId,
            projectId,
            status,
            search,
            assigneeId,
            dueDate
        ],
        queryFn:async()=>{
            const response = await clinet.api.tasks.$get({
                query:{
                    workspaceId,
                    projectId: projectId ?? undefined,
                    status: status ?? undefined,
                    assigneeId: assigneeId ?? undefined,
                    search: search ?? undefined,
                    dueDate: dueDate ?? undefined,
                },
            });
            if(!response.ok){
               throw new Error("Failed to fetch tasks")
            }

            const {data}= await response.json();

            return data;
        }

    })
    return query;
}