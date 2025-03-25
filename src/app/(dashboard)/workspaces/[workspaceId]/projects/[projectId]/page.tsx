import { getCurrent } from "@/features/auth/queries";

import { redirect } from "next/navigation";
import React from "react";
import ProjectIDClinet from "./client";

async function ProjectIdPage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <ProjectIDClinet />;
}

export default ProjectIdPage;
