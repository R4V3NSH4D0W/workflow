import { UserButton } from "@/features/auth/components/user-button";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import React from "react";

interface StandAloneLayoutProps {
  children: React.ReactNode;
}

function StandAloneLayout({ children }: StandAloneLayoutProps) {
  return (
    <main className=" bg-neutral-100 min-h-screen">
      <div className=" mx-auto max-w-screen-2xl p-4">
        <nav className=" flex justify-between items-center h-[73px]">
          <Link href="/">
            <div className=" flex flex-row items-center">
              <LayoutGrid className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">Workflow</span>
            </div>
          </Link>
          <UserButton />
        </nav>
        <div className=" flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}

export default StandAloneLayout;
