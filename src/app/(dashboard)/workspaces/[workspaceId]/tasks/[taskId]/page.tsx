import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import React from "react";
import { TaskIdClient } from "./clinet";

async function TaskIdPage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return <TaskIdClient />;
}

export default TaskIdPage;
