
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";
type ResponseType = InferResponseType<typeof clinet.api.workspaces[":workspaceId"]["join"]["$post"],200>;
type RequestType = InferRequestType<typeof clinet.api.workspaces[":workspaceId"]["join"]["$post"]>;

export const useJoinWorkspace = () => {
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await clinet.api.workspaces[":workspaceId"]["join"]["$post"]({ param ,json});
      if(!response.ok){
        throw new Error("Failed to join workspace");
    }
      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success("Joined workspace")
      queryClinet.invalidateQueries({ queryKey: ["workspaces"] });
      queryClinet.invalidateQueries({ queryKey: ["workspace",data.$id] });
    },
    onError:()=>{
      toast.error("Failed to join workspace")
    }
  });

  return mutation;
};
