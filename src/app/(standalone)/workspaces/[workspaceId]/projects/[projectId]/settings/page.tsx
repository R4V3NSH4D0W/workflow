import { getCurrent } from "@/features/auth/queries";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";
import React from "react";

interface ProjectIdSettingPageProps {
  params: {
    projectId: string;
  };
}

async function ProjectIdSettingPage({ params }: ProjectIdSettingPageProps) {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initalValues = await getProject({
    projectId: params.projectId,
  });

  return (
    <div className=" w-full lg:max-w-xl">
      <EditProjectForm initalValues={initalValues} />
    </div>
  );
}

export default ProjectIdSettingPage;
