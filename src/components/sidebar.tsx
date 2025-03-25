import Link from "next/link";
import React from "react";
import { DottedSeprator } from "./dotted-sperator";
import Navigation from "./navigation";
import WorkspaceSwitcher from "./workspace-switcher";
import Projects from "./projects";
import { LayoutGrid } from "lucide-react";

function Sidebar() {
  return (
    <aside className=" h-full bg-neutral-100 p-4 w-full">
      <Link href="/">
        <div className=" flex flex-row items-center">
          <LayoutGrid className="h-6 w-6 text-blue-500 mr-2" />
          <span className="text-2xl font-bold">Workflow</span>
        </div>
      </Link>
      <DottedSeprator className=" my-4" />
      <WorkspaceSwitcher />
      <DottedSeprator className=" my-4" />
      <Navigation />
      <DottedSeprator className=" my-4" />
      <Projects />
    </aside>
  );
}

export default Sidebar;
