"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof clinet.api.auth.login["$post"]>;
type RequestType = InferRequestType<typeof clinet.api.auth.login["$post"]>;

export const useLogin = () => {
  const router = useRouter();
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await clinet.api.auth.login["$post"]({ json });
      if(!response.ok){
        throw new Error("Failed to log in");
    }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logged in")
      router.refresh();
      queryClinet.invalidateQueries({ queryKey: ["current"] });
    },
    onError:()=>{
      toast.error("Failed to log in");
    }
  });

  return mutation;
};
