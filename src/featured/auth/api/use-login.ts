"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof clinet.api.auth.login["$post"]>;
type RequestType = InferRequestType<typeof clinet.api.auth.login["$post"]>;

export const useLogin = () => {
  const router = useRouter();
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await clinet.api.auth.login["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
      queryClinet.invalidateQueries({ queryKey: ["current"] });
    },
  });

  return mutation;
};
