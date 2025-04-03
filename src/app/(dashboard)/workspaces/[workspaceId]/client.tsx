"use client";
import Analytics from "@/components/analytics";
import { DottedSeprator } from "@/components/dotted-sperator";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Member } from "@/features/members/types";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModel } from "@/features/projects/hooks/use-create-project-model";
import { Project } from "@/features/projects/types";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { TaskPriority } from "@/features/tasks/components/task-priority";
import { useCreateTaskModel } from "@/features/tasks/hooks/user-create-task-modal";
import { Task } from "@/features/tasks/types";
import { useWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useWorkspaceIds } from "@/features/workspaces/hooks/use-workspace-id";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";

export const WorkspaceIdClinet = () => {
  const workspaceId = useWorkspaceIds();
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingMembers ||
    isLoadingProjects ||
    isLoadingTasks;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!analytics || !tasks || !projects || !members) {
    return <PageError message="Failed to load workspace data" />;
  }
  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={analytics} />
      <div className=" grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
        <MemberList data={members.documents} total={members.total} />
      </div>
    </div>
  );
};

interface TaskListProps {
  data: Task[];
  total: number;
}

export const TaskList = ({ data, total }: TaskListProps) => {
  const { open: createTask } = useCreateTaskModel();
  const workspaceId = useWorkspaceIds();

  return (
    <div className=" flex flex-col gap-y-4 col-span-1">
      <div className=" bg-muted rounded-lg p-4">
        <div className=" flex items-center justify-between">
          <p className=" text-lg font-semibold">Tasks ({total})</p>
          <Button variant="muted" size="icon" onClick={createTask}>
            <PlusIcon className=" size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeprator className=" my-4" />
        <ul className=" flex flex-col gap-y-4">
          {data.slice(0, 3).map((task) => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className=" p-4 ">
                    <p className=" text-lg truncate font-medium">{task.name}</p>
                    <div className=" flex items-center gap-x-2">
                      <div className=" flex flex-row items-center gap-2">
                        <ProjectAvatar
                          name={task.project?.name}
                          image={task.project?.imageUrl}
                        />
                        <p>{task.project?.name}</p>
                      </div>
                      <div className=" size-1 rounded-full bg-neutral-300" />
                      <div className=" text-sm  text-muted-foreground flex items-center">
                        <CalendarIcon className=" size-3 mr-1" />
                        <span className=" truncate">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                      <div className=" size-1 rounded-full bg-neutral-300" />
                      <TaskPriority value={task.priority} className="text-xs" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className=" text-sm text-muted-foreground text-center hidden first-of-type:block">
            No task found
          </li>
        </ul>
        <Button variant="muted" className=" mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
  total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
  const { open: createProject } = useCreateProjectModel();

  const workspaceId = useWorkspaceIds();

  return (
    <div className=" flex flex-col gap-y-4 col-span-1">
      <div className=" bg-white border rounded-lg p-4">
        <div className=" flex items-center justify-between">
          <p className=" text-lg font-semibold">Project ({total})</p>
          <Button variant="secondary" size="icon" onClick={createProject}>
            <PlusIcon className=" size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeprator className=" my-4" />
        <ul className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className=" p-4 flex items-center gap-x-2.5 ">
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className=" size-12 "
                      fallbackClassName=" text-lg"
                    />
                    <p className=" text-lg font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className=" text-sm text-muted-foreground text-center hidden first-of-type:block">
            No project found
          </li>
        </ul>
      </div>
    </div>
  );
};

interface MemberListProps {
  data: Member[];
  total: number;
}

export const MemberList = ({ data, total }: MemberListProps) => {
  const workspaceId = useWorkspaceIds();

  return (
    <div className=" flex flex-col gap-y-4 col-span-1">
      <div className=" bg-white border rounded-lg p-4">
        <div className=" flex items-center justify-between">
          <p className=" text-lg font-semibold">Members ({total})</p>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className=" size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeprator className=" my-4" />
        <ul className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className=" p-3 flex flex-col items-center gap-x-2 ">
                  <MemberAvatar
                    name={member.name}
                    className=" size-12 "
                    fallbackClassName=" text-lg"
                  />
                  <div className=" flex flex-col items-center overflow-hidden">
                    <p className=" text-lg font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className=" text-sm text-muted-foreground line-clamp-1">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className=" text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Member found
          </li>
        </ul>
      </div>
    </div>
  );
};
