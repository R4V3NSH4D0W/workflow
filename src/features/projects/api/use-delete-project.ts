
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { clinet } from "@/lib/rpc";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
type ResponseType = InferResponseType<typeof clinet.api.projects[":projectId"]["$delete"],200>;
type RequestType = InferRequestType<typeof clinet.api.projects[":projectId"]["$delete"]>;

export const useDeleteProject = () => {
  const router= useRouter();
  const queryClinet = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await clinet.api.projects[":projectId"]["$delete"]({ param });
      if(!response.ok){
        throw new Error("Failed to delete project");
    }
      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success("Project Deleted")
      router.refresh();
      queryClinet.invalidateQueries({ queryKey: ["projects"] });
      queryClinet.invalidateQueries({ queryKey: ["project",data.$id] });
    },
    onError:()=>{
      toast.error("Failed to delete project")
    }
  });

  return mutation;
};
