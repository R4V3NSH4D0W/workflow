import { useMutation } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";

import { clinet } from "@/lib/rpc";

type ResponseType= InferResponseType<typeof clinet.api.auth.register["$post"]>

type RequestType = InferRequestType<typeof clinet.api.auth.register["$post"]>;

export const useRegister =()=>{
    const mutation= useMutation<ResponseType,Error,RequestType>({
        mutationFn:async({json})=>{
            const response = await clinet.api.auth.register["$post"]({json});
            return await response.json();

        }
    })
    return mutation;
}