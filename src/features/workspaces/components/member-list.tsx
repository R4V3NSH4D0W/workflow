"use client";
import Link from "next/link";
import { Fragment } from "react";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceIds } from "../hooks/use-workspace-id";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { DottedSeprator } from "@/components/dotted-sperator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MemberRole } from "@/features/members/types";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdatemember } from "@/features/members/api/use-update-member";

export const MemberLists = () => {
  const workspaceId = useWorkspaceIds();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove Member",
    "This Member will be removed from the workspace",
    "destructive"
  );
  const { data } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isupdatingMember } =
    useUpdatemember();

  const handelUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: {
        memberId,
      },
    });
  };

  const handelDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;
    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className=" flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon />
            Back
          </Link>
        </Button>
        <CardTitle className=" text-xl font-bold">Member list</CardTitle>
      </CardHeader>
      <div className=" px-7">
        <DottedSeprator />
      </div>
      <CardContent className=" p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className=" flex items-center gap-2">
              <MemberAvatar
                className=" size-10"
                fallbackClassName=" text-lg"
                name={member.name}
              />
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">
                  {member.name} ({snakeCaseToTitleCase(member.role)})
                </p>
                <p className=" text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className=" ml-auto" variant="secondary" size="icon">
                    <MoreVerticalIcon className=" size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className=" font-medium"
                    onClick={() =>
                      handelUpdateMember(member.$id, MemberRole.ADMIN)
                    }
                    disabled={isupdatingMember}
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className=" font-medium"
                    onClick={() =>
                      handelUpdateMember(member.$id, MemberRole.MEMBER)
                    }
                    disabled={isupdatingMember}
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className=" font-medium text-amber-700"
                    onClick={() => handelDeleteMember(member.$id)}
                    disabled={isDeletingMember}
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 && (
              <Separator className=" my-2.5" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
