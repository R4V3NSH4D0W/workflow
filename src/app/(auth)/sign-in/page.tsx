import { getCurrent } from "@/featured/auth/actions";
import { SignInCard } from "@/featured/auth/components/sign-in-card";
import { redirect } from "next/navigation";

import React from "react";

async function SignInPage() {
  const user = await getCurrent();
  if (user) {
    redirect("/");
  }
  return <SignInCard />;
}

export default SignInPage;
