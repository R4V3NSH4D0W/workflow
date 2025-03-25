
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";

type ResponseType = InferResponseType<typeof clinet.api.projects[":projectId"]["$patch"],200>;
type RequestType = InferRequestType<typeof clinet.api.projects[":projectId"]["$patch"]>;

export const useUpdateProject = () => {
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form,param }) => {
      const response = await clinet.api.projects[":projectId"]["$patch"]({ form,param });
      if(!response.ok){
        throw new Error("Failed to create update");
    }
      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success("project updated")
      queryClinet.invalidateQueries({ queryKey: ["projects"] });
      queryClinet.invalidateQueries({ queryKey: ["project",data.$id] });
    },
    onError:()=>{
      toast.error("Failed to update project")
    }
  });

  return mutation;
};
