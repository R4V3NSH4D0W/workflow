import { getCurrent } from "@/features/auth/queries";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { redirect } from "next/navigation";
import React from "react";

async function SignUpPage() {
  const user = await getCurrent();
  if (user) {
    redirect("/");
  }
  return <SignUpCard />;
}

export default SignUpPage;
