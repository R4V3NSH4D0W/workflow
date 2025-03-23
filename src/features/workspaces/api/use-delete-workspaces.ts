
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";
type ResponseType = InferResponseType<typeof clinet.api.workspaces[":workspaceId"]["$delete"],200>;
type RequestType = InferRequestType<typeof clinet.api.workspaces[":workspaceId"]["$delete"]>;

export const useDeleteWorkspaces = () => {
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await clinet.api.workspaces[":workspaceId"]["$delete"]({ param });
      if(!response.ok){
        throw new Error("Failed to delete workspace");
    }
      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success("Workspace Deleted")
      queryClinet.invalidateQueries({ queryKey: ["workspaces"] });
      queryClinet.invalidateQueries({ queryKey: ["workspace",data.$id] });
    },
    onError:()=>{
      toast.error("Failed to delete workspace")
    }
  });

  return mutation;
};
