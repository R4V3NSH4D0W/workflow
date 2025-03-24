
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
type ResponseType = InferResponseType<typeof clinet.api.workspaces[":workspaceId"]["$patch"],200>;
type RequestType = InferRequestType<typeof clinet.api.workspaces[":workspaceId"]["$patch"]>;

export const useUpdateWorkspace = () => {
  const router= useRouter();
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form,param }) => {
      const response = await clinet.api.workspaces[":workspaceId"]["$patch"]({ form, param });
      if(!response.ok){
        throw new Error("Failed to Update workspace");
    }
      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success("Workspace Updated");
      router.refresh();
      queryClinet.invalidateQueries({ queryKey: ["workspaces"] });
      queryClinet.invalidateQueries({ queryKey: ["workspace",data.$id] });
    },
    onError:()=>{
      toast.error("Failed to update workspace")
    }
  });

  return mutation;
};
