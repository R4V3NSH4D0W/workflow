import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import React from "react";

async function WorkspaceIdPage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <div>WorkspaceIdPage</div>;
}

export default WorkspaceIdPage;
