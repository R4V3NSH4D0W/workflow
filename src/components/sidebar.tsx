import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DottedSeprator } from "./dotted-sperator";
import Navigation from "./navigation";
import WorkspaceSwitcher from "./workspace-switcher";
import Projects from "./projects";

function Sidebar() {
  return (
    <aside className=" h-full bg-neutral-100 p-4 w-full">
      <Link href="/">
        <Image src="/logo.svg" alt="Logo" width={164} height={48} />
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
