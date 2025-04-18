import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteIcon, ExternalLinkIcon, PencilIcon } from "lucide-react";
import React from "react";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useWorkspaceIds } from "@/features/workspaces/hooks/use-workspace-id";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

interface TaskActionProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

function TaskAction({ id, projectId, children }: TaskActionProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceIds();

  const [ConfirmDialouge, confirm] = useConfirm(
    "Delete Task",
    "This action cannot be undone",
    "destructive"
  );

  const { open } = useEditTaskModal();

  const { mutate, isPending } = useDeleteTask();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return null;

    mutate({
      param: {
        taskId: id,
      },
    });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  return (
    <div className=" flex justify-end">
      <ConfirmDialouge />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className=" w-48">
          <DropdownMenuItem
            onClick={onOpenTask}
            className=" font-medium p-[10px]"
          >
            <ExternalLinkIcon className=" size-4 mr-4 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            className=" font-medium p-[10px]"
          >
            <ExternalLinkIcon className=" size-4 mr-4 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            className=" font-medium p-[10px]"
          >
            <PencilIcon className=" size-4 mr-4 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className=" font-medium p-[10px] text-amber-700 focus:text-amber-700"
          >
            <DeleteIcon className=" size-4 mr-4 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default TaskAction;
