"use client";

import { DottedSeprator } from "@/components/dotted-sperator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceIds } from "../hooks/use-workspace-id";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
  initalValues: {
    name: string;
  };
}

export const JoinWorkspaceForm = ({ initalValues }: JoinWorkspaceFormProps) => {
  const router = useRouter();
  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceIds();
  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };
  return (
    <Card className=" w-full h-full border-none shadow-none">
      <CardHeader className="px-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{initalValues.name}</strong>{" "}
          workspace
        </CardDescription>
      </CardHeader>
      <div className=" px-7">
        <DottedSeprator />
      </div>
      <CardContent className=" px-7">
        <div className=" flex items-center flex-col lg:flex-row gap-y-2 justify-between">
          <Button
            asChild
            size="lg"
            className=" w-full lg:w-fit"
            variant="secondary"
            type="button"
            disabled={isPending}
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            size="lg"
            className=" w-full lg:w-fit"
            type="button"
            onClick={onSubmit}
            disabled={isPending}
          >
            Join workflow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
