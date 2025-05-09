import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import React from "react";
import { ProjectIdSettingClient } from "./client";

async function ProjectIdSettingPage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <ProjectIdSettingClient />;
}

export default ProjectIdSettingPage;
