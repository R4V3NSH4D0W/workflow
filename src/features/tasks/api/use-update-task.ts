
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
type ResponseType = InferResponseType<typeof clinet.api.tasks[":taskId"]["$patch"],200>;
type RequestType = InferRequestType<typeof clinet.api.tasks[":taskId"]["$patch"]>;

export const useUpdateTask = () => {
    const router= useRouter();
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json,param }) => {
      const response = await clinet.api.tasks[":taskId"]["$patch"]({ json ,param});
      if(!response.ok){
        throw new Error("Failed to update task");
    }
      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success("task updated")
      router.refresh();
      queryClinet.invalidateQueries({ queryKey: ["tasks"] });
      queryClinet.invalidateQueries({ queryKey: ["task",data.$id] });
    },
    onError:()=>{
      toast.error("Failed to update task")
    }
  });

  return mutation;
};
