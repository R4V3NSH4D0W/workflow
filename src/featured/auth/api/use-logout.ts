import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { clinet } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType= InferResponseType<typeof clinet.api.auth.logout["$post"]>


export const useLogout =()=>{

    const router = useRouter();
    const queryClinet = useQueryClient();
    const mutation= useMutation<ResponseType,Error>({
        mutationFn:async()=>{
            const response = await clinet.api.auth.logout["$post"]();
            return await response.json();

        },
        onSuccess:()=>{
            router.refresh();
            queryClinet.invalidateQueries({queryKey:["current"]});
        }
    })
    return mutation;
}