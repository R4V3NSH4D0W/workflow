import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import React from "react";
import { WorkspaceIdJoinClientPage } from "./client";

async function WorkspaceIdJoinPage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <WorkspaceIdJoinClientPage />;
}

export default WorkspaceIdJoinPage;
