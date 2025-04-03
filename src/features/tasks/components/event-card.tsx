import { Project } from "@/features/projects/types";
import { PriorityStatus, TaskStatus } from "../types";
import { cn } from "@/lib/utils";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceIds } from "@/features/workspaces/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { Member } from "@/features/members/types";
import { TaskPriority } from "./task-priority";

interface EventCardProps {
  title: string;
  assignee: Member;
  project: Project;
  status: TaskStatus;
  priority: PriorityStatus | undefined;
  id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-pink-500",
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-emarald-500",
};

export const EventCard = ({
  title,
  assignee,
  project,
  status,
  id,
  priority,
}: EventCardProps) => {
  const workspaceId = useWorkspaceIds();
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };
  return (
    <div onClick={onClick} className=" px-2">
      <div
        className={cn(
          " p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col cursor-pointer gap-y-1.5 hover:opacity-75 transition",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>
        <div className=" flex items-center gap-x-1">
          <MemberAvatar name={assignee?.name} />
          <div className=" size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar name={project?.name} image={project?.imageUrl} />
          <div className=" size-1 rounded-full bg-neutral-300" />
          <TaskPriority value={priority} className=" text-xs" />
        </div>
      </div>
    </div>
  );
};
