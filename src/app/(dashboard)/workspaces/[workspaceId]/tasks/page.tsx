import { getCurrent } from "@/features/auth/queries";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { redirect } from "next/navigation";
import React from "react";

async function TaskPage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className=" w-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  );
}

export default TaskPage;
