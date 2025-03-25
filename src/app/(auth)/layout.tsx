"use client";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}
function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();

  return (
    <div className=" bg-neutral-100 min-h-screen">
      <div className=" mx-auto max-w-screen-2xl p-4">
        <nav className=" flex justify-between items-center">
          <div className=" flex flex-row items-center">
            <LayoutGrid className="h-6 w-6 text-blue-500" />
            <span className="text-2xl font-bold">Workflow</span>
          </div>

          <Button asChild variant="secondary">
            <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
              {pathname === "/sign-in" ? "Sign Up" : "Login"}
            </Link>
          </Button>
        </nav>
        <div className=" flex flex-col items-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
