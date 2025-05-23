import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { clinet } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType= InferResponseType<typeof clinet.api.auth.logout["$post"]>


export const useLogout =()=>{

    const router = useRouter();
    const queryClinet = useQueryClient();
    const mutation= useMutation<ResponseType,Error>({
        mutationFn:async()=>{
            const response = await clinet.api.auth.logout["$post"]();
            if(!response.ok){
                throw new Error("Failed to log out");
            }
            return await response.json();

        },
        onSuccess:()=>{
            toast.success("Logged out");
            router.refresh();
            queryClinet.invalidateQueries({queryKey:["current"]});
            queryClinet.invalidateQueries({queryKey:["workspaces"]});
        },
        onError:()=>{
            toast.error("Failed to log out");
        }
    })
    return mutation;
}