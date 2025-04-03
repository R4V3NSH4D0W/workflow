import React from "react";
import Sidebar from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

import CreateProjectModel from "@/features/projects/components/create-project-model";
import CreateWorkspaceModel from "@/features/workspaces/components/create-workspace-model";
import { CreateTaskModel } from "@/features/tasks/components/create-task-modal";
import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";
import Footer from "@/components/footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <CreateWorkspaceModel />
      <CreateProjectModel />
      <EditTaskModal />
      <CreateTaskModel />
      <div className="flex w-full h-full flex-1">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full flex flex-col min-h-screen">
          <Navbar />
          <div className="mx-auto max-w-screen-2xl w-full flex flex-col flex-1">
            <main className="flex-1 w-full py-6 px-6">{children}</main>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
