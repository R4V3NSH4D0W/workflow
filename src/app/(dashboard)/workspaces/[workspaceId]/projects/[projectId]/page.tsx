import { Button } from "@/components/ui/button";
import { getCurrent } from "@/features/auth/queries";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { getProject } from "@/features/projects/queries";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface ProjectIdPageParms {
  params: {
    projectId: string;
  };
}

async function ProjectIdPage({ params }: ProjectIdPageParms) {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValue = await getProject({
    projectId: params.projectId,
  });

  if (!initialValue) {
    throw new Error("Project not found");
  }

  return (
    <div className=" flex flex-col gap-y-4">
      <div className=" flex items-center justify-between">
        <div className=" flex items-center gap-x-2">
          <ProjectAvatar
            name={initialValue?.name}
            image={initialValue.imageUrl}
            className=" size-8"
          />
          <p className=" text-lg font-semibold">{initialValue.name}</p>
        </div>
        <div>
          <Button variant="secondary" asChild size="sm">
            <Link
              href={`/workspaces/${initialValue.workspaceId}/projects/${initialValue.$id}/settings`}
            >
              <PencilIcon className=" size-4" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher />
    </div>
  );
}

export default ProjectIdPage;
