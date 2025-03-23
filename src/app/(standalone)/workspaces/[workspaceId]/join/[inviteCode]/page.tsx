import { getCurrent } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";
import React from "react";

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string;
  };
}

async function WorkspaceIdJoinPage({ params }: WorkspaceIdJoinPageProps) {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initalValues = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
  });

  if (!initalValues) {
    redirect("/");
  }
  return (
    <div className=" w-full lg:max-w-xl">
      <JoinWorkspaceForm initalValues={initalValues} />
    </div>
  );
}

export default WorkspaceIdJoinPage;
