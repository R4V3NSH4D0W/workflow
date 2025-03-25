import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import React from "react";
import { WorkspaceSettingClientPage } from "./client";

async function WorkspaceIdSettingsPage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <WorkspaceSettingClientPage />;
}

export default WorkspaceIdSettingsPage;
