"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { useWorkspaceIds } from "@/features/workspaces/hooks/use-workspace-id";

export const WorkspaceIdJoinClientPage = () => {
  const workspaceId = useWorkspaceIds();
  const { data: initalValues, isLoading } = useGetWorkspaceInfo({
    workspaceId,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!initalValues) {
    return <PageError message="Project not found" />;
  }
  return (
    <div className=" w-full lg:max-w-xl">
      <JoinWorkspaceForm initalValues={initalValues} />
    </div>
  );
};
