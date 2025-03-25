"use client";
import { UserButton } from "@/features/auth/components/user-button";
import { MobileSidebar } from "./mobile-sidebar";
import { usePathname } from "next/navigation";

const PathnameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all of your tasks here",
  },
  projects: {
    title: "My Projects",
    description: "View tasks of your project here",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of our tasks and project here",
};

export const Navbar = () => {
  const pathname = usePathname();

  const pathnameParts = pathname.split("/");
  const pathnamekey = pathnameParts[3] as keyof typeof PathnameMap;

  const { title, description } = PathnameMap[pathnamekey] || defaultMap;
  return (
    <nav className=" pt-4 px-6 flex  items-center justify-between">
      <div className="  flex-col hidden lg:flex">
        <h1 className=" text-2xl font-semibold">{title}</h1>
        <p className=" text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
