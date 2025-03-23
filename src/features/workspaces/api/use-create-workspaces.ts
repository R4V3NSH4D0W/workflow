
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";
type ResponseType = InferResponseType<typeof clinet.api.workspaces["$post"]>;
type RequestType = InferRequestType<typeof clinet.api.workspaces["$post"]>;

export const useCreateWorkspaces = () => {
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await clinet.api.workspaces["$post"]({ form });
      if(!response.ok){
        throw new Error("Failed to create workspace");
    }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace Created")
      queryClinet.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError:()=>{
      toast.error("Failed to create workspace")
    }
  });

  return mutation;
};
