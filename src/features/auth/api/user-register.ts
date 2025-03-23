import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";

import { clinet } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType= InferResponseType<typeof clinet.api.auth.register["$post"]>

type RequestType = InferRequestType<typeof clinet.api.auth.register["$post"]>;

export const useRegister =()=>{
    const router = useRouter();
    const queryClinet = useQueryClient();
    const mutation= useMutation<ResponseType,Error,RequestType>({
        mutationFn:async({json})=>{
            const response = await clinet.api.auth.register["$post"]({json});

            if(!response.ok){
                throw new Error("Failed to Register");
            }
            
            return await response.json();

        },
        onSuccess:()=>{
            toast.success("Regisered");
            router.refresh();
            queryClinet.invalidateQueries({queryKey:["current"]});

        },
        onError:()=>{
            toast.error("Failed to Register")
        }
    })
    return mutation;
}