import React from "react";
import { Task } from "../types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import Link from "next/link";
import { useWorkspaceIds } from "@/features/workspaces/hooks/use-workspace-id";
import { ChevronRightIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project } from "@/features/projects/types";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

function TaskBreadcrumbs({ project, task }: TaskBreadcrumbsProps) {
  const workspaceId = useWorkspaceIds();
  const { mutate, isPending } = useDeleteTask();
  const router = useRouter();
  const [ConfirmDialouge, confirm] = useConfirm(
    "Delete Task",
    "This action cannot be undone.",
    "destructive"
  );

  const handelDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate(
      {
        param: { taskId: task.$id },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };
  return (
    <div className=" flex items-center gap-x-2">
      <ConfirmDialouge />
      <ProjectAvatar
        name={project?.name}
        image={project?.imageUrl}
        className=" size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project?.$id}`}>
        <p className=" text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project?.name}
        </p>
      </Link>
      <ChevronRightIcon className=" size-4 lg:size-5 text-muted-foreground" />
      <p className=" text-sm lg:text-lg font-semibold">{task?.name}</p>
      <Button
        onClick={handelDeleteTask}
        disabled={isPending}
        className=" ml-auto text-white"
        variant="destructive"
        size="sm"
      >
        <Trash className="size-4" />
        <span className=" hidden lg:block">Delete</span>
      </Button>
    </div>
  );
}

export default TaskBreadcrumbs;
