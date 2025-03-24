
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";
type ResponseType = InferResponseType<typeof clinet.api.projects["$post"],200>;
type RequestType = InferRequestType<typeof clinet.api.projects["$post"]>;

export const useCreateProject = () => {
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await clinet.api.projects["$post"]({ form });
      if(!response.ok){
        throw new Error("Failed to create project");
    }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("project Created")
      queryClinet.invalidateQueries({ queryKey: ["projects"] });
    },
    onError:()=>{
      toast.error("Failed to create project")
    }
  });

  return mutation;
};
