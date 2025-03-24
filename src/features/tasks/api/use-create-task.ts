
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";
type ResponseType = InferResponseType<typeof clinet.api.tasks["$post"],200>;
type RequestType = InferRequestType<typeof clinet.api.tasks["$post"]>;

export const useCreateTask = () => {
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await clinet.api.tasks["$post"]({ json });
      if(!response.ok){
        throw new Error("Failed to create task");
    }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("task Created")
      queryClinet.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError:()=>{
      toast.error("Failed to create task")
    }
  });

  return mutation;
};
