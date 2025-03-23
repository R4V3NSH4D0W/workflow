
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";
type ResponseType = InferResponseType<typeof clinet.api.members[":memberId"]["$patch"],200>;
type RequestType = InferRequestType<typeof clinet.api.members[":memberId"]["$patch"]>;

export const useUpdatemember = () => {
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param,json }) => {
      const response = await clinet.api.members[":memberId"]["$patch"]({ param,json });
      if(!response.ok){
        throw new Error("Failed to update member");
    }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Member Updated")
      queryClinet.invalidateQueries({ queryKey: ["members"] });
    },
    onError:()=>{
      toast.error("Failed to update member")
    }
  });

  return mutation;
};
