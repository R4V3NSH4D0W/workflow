"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateWorkspaceSchema } from "../schemas";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRef } from "react";
import { DottedSeprator } from "@/components/dotted-sperator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspaces } from "../api/use-delete-workspaces";
import { toast } from "sonner";
import { useResetInviteCode } from "../api/use-reset-invitecode";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceIds } from "../hooks/use-workspace-id";
import { useCurrent } from "@/features/auth/api/use-current";
import { MemberRole } from "@/features/members/types";
import LoadingPage from "@/app/loading";

interface EditWorkSpaceFormProps {
  onCancel?: () => void;
  initalValues: Workspace;
}
export const EditWorkSpaceForm = ({
  onCancel,
  initalValues,
}: EditWorkSpaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspaces();
  const { mutate: resetInviteCode, isPending: isResetingInviteCode } =
    useResetInviteCode();
  const [DeleteDialouge, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This Action cannot be undone",
    "destructive"
  );
  const [ResetDialouge, confirmReset] = useConfirm(
    "Reset invite link",
    "This will invalidate current invite link",
    "destructive"
  );

  const workspaceId = useWorkspaceIds();
  const { data: membersData, isLoading: MemberLoading } = useGetMembers({
    workspaceId,
  });
  const { data: user, isLoading: CurrnetLoading } = useCurrent();

  const isLoading = MemberLoading || CurrnetLoading;

  const isAdmin =
    membersData?.documents.find((doc) => doc.userId === user?.$id)?.role ===
    MemberRole.ADMIN;

  const handelDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;
    deleteWorkspace(
      {
        param: {
          workspaceId: initalValues.$id,
        },
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  const handelResetInviteCode = async () => {
    const ok = await confirmReset();

    if (!ok) return;
    resetInviteCode({
      param: {
        workspaceId: initalValues.$id,
      },
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initalValues,
      image: initalValues.imageUrl ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate({ form: finalValues, param: { workspaceId: initalValues.$id } });
  };

  const handelImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initalValues.$id}/join/${initalValues.inviteCode}`;

  const handelCopyInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Copied to clipbaord"));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className=" flex flex-col gap-y-4">
      <DeleteDialouge />
      <ResetDialouge />
      <Card className="h-full w-full border-none shadow-none">
        <CardHeader className=" flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => {
                    router.push(`/workspaces/${initalValues.$id}`);
                  }
            }
          >
            <ArrowLeftIcon className=" size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initalValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeprator />
        </div>
        <CardContent className="px-7">
          <Form {...form}>
            <div className="flex flex-col gap-y-4">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter workspace name"
                          disabled={!isAdmin}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className=" flex flex-col gap-y-2 ">
                      <div className=" flex items-center gap-x-5">
                        {field.value ? (
                          <div className=" size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              fill
                              className=" object-cover"
                              alt="Logo"
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                            />
                          </div>
                        ) : (
                          <Avatar className=" size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className=" size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className=" flex flex-col">
                          <p className=" text-sm">Workspace Icon</p>
                          <p className=" text-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG, max 1MB
                          </p>
                          <input
                            className=" hidden"
                            type="file"
                            accept=".png, .jpg, .jpeg, .svg"
                            ref={inputRef}
                            onChange={handelImageChange}
                            disabled={isPending || !isAdmin}
                          />
                          <Button
                            type="button"
                            disabled={isPending}
                            variant="teritary"
                            size="xs"
                            className=" w-fit mt-2"
                            onClick={() => {
                              inputRef.current?.click();
                            }}
                          >
                            Upload Image
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                />
                <DottedSeprator className="py-7" />
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    size="lg"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isPending}
                    className={cn(!onCancel && " invisible")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending || !isAdmin}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </Form>
        </CardContent>
      </Card>
      <Card className=" w-full h-full border-none shadow-none">
        <CardContent className=" p-7">
          <div className=" flex flex-col ">
            <h3>Invite Members</h3>
            <p className=" text-sm text-muted-foreground">
              Use the invite link to add member in your workspace
            </p>
            <div className=" mt-4">
              <div className=" flex items-center gap-x-2">
                <Input disabled value={fullInviteLink} />
                <Button
                  onClick={handelCopyInviteLink}
                  variant="secondary"
                  className=" size-12"
                >
                  <CopyIcon className=" size-5" />
                </Button>
              </div>
            </div>
            <DottedSeprator className="py-7" />
            <Button
              className=" w-fit ml-auto text-white"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isResetingInviteCode || !isAdmin}
              onClick={handelResetInviteCode}
            >
              Reset invite Link
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className=" w-full h-full border-none shadow-none">
        <CardContent className=" p-7">
          <div className=" flex flex-col ">
            <h3>Danger Zone</h3>
            <p className=" text-sm text-muted-foreground">
              Deleting a workspace is irreversible an will remove all associated
              data
            </p>
            <DottedSeprator className="py-7" />
            <Button
              className=" w-fit ml-auto text-white"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isDeletingWorkspace || !isAdmin}
              onClick={handelDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
