"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { EditWorkSpaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { useWorkspaceIds } from "@/features/workspaces/hooks/use-workspace-id";

export const WorkspaceSettingClientPage = () => {
  const workspaceId = useWorkspaceIds();
  const { data: initalValues, isLoading } = useGetWorkspace({
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
      <EditWorkSpaceForm initalValues={initalValues} />
    </div>
  );
};
