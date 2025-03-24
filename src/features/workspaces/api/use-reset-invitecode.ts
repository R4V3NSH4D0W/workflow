
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
type ResponseType = InferResponseType<typeof clinet.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"],200>;
type RequestType = InferRequestType<typeof clinet.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]>;

export const useResetInviteCode = () => {
  const queryClinet = useQueryClient();
  const router= useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await clinet.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]({ param });
      if(!response.ok){
        throw new Error("Failed to reset invite code");
    }
      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success("Invite code Generate");
      router.refresh();
      queryClinet.invalidateQueries({ queryKey: ["workspaces"] });
      queryClinet.invalidateQueries({ queryKey: ["workspace",data.$id] });
    },
    onError:()=>{
      toast.error("Failed to reset invite code")
    }
  });

  return mutation;
};
