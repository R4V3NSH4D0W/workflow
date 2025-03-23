
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";
type ResponseType = InferResponseType<typeof clinet.api.members[":memberId"]["$delete"],200>;
type RequestType = InferRequestType<typeof clinet.api.members[":memberId"]["$delete"]>;

export const useDeleteMember = () => {
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await clinet.api.members[":memberId"]["$delete"]({ param });
      if(!response.ok){
        throw new Error("Failed to delete member");
    }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Member Deleted")
      queryClinet.invalidateQueries({ queryKey: ["members"] });
    },
    onError:()=>{
      toast.error("Failed to delete member")
    }
  });

  return mutation;
};
