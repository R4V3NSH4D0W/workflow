"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className=" h-screen flex items-center flex-col gap-y-4 justify-center">
      <AlertTriangle className=" size-6 text-muted-foreground" />
      <p className=" text-sm">Something went wrong</p>
      <Button variant="secondary" asChild size="sm">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
