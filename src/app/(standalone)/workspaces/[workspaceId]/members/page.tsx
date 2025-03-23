import { getCurrent } from "@/features/auth/queries";
import { MemberLists } from "@/features/workspaces/components/member-list";
import { redirect } from "next/navigation";
import React from "react";

async function WorkspaceIdMembersPage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className=" w-full lg:max-w-xl">
      <MemberLists />
    </div>
  );
}

export default WorkspaceIdMembersPage;
