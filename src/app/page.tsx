import { getCurrent } from "@/featured/auth/actions";
import { UserButton } from "@/featured/auth/components/user-button";
import { redirect } from "next/navigation";

import React from "react";

export default async function Home() {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div>
      <UserButton />
    </div>
  );
}
