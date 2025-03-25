
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";
type ResponseType = InferResponseType<typeof clinet.api.tasks[":taskId"]["$delete"],200>;
type RequestType = InferRequestType<typeof clinet.api.tasks[":taskId"]["$delete"]>;

export const useDeleteTask = () => {
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await clinet.api.tasks[":taskId"]["$delete"]({ param });
      if(!response.ok){
        throw new Error("Failed to Delete task");
    }
      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success("task Deleted");
      queryClinet.invalidateQueries({ queryKey: ["tasks",data.$id] });
    },
    onError:()=>{
      toast.error("Failed to delete task")
    }
  });

  return mutation;
};
