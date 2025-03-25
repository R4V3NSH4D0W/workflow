
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";
type ResponseType = InferResponseType<typeof clinet.api.tasks["bulk-update"]["$post"],200>;
type RequestType = InferRequestType<typeof clinet.api.tasks["bulk-update"]["$post"]>;

export const useBulkUpdateTasks = () => {
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await clinet.api.tasks["bulk-update"]["$post"]({ json});
      if(!response.ok){
        throw new Error("Failed to update tasks");
    }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("tasks updated")
      queryClinet.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError:()=>{
      toast.error("Failed to update tasks")
    }
  });

  return mutation;
};
