import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import CreateWorkspaceModel from "@/features/workspaces/components/create-workspace-model";
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className=" min-h-screen">
      <CreateWorkspaceModel />
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
