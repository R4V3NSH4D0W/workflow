import React from "react";
import Sidebar from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

import CreateProjectModel from "@/features/projects/components/create-project-model";
import CreateWorkspaceModel from "@/features/workspaces/components/create-workspace-model";
import { CreateTaskModel } from "@/features/tasks/components/create-task-modal";
import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className=" min-h-screen">
      <CreateWorkspaceModel />
      <CreateProjectModel />
      <EditTaskModal />
      <CreateTaskModel />
      <div className=" flex w-full h-full">
        <div className=" fixed left-0 top-o hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className=" lg:pl-[264px] w-full ">
          <Navbar />
          <div className=" mx-auto max-w-screen-2xl h-full">
            <main className=" h-full py-8 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
