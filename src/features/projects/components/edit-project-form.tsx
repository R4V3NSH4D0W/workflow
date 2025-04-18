"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Project } from "../types";
import { useConfirm } from "@/hooks/use-confirm";
import { useUpdateProject } from "../api/use-update-project";
import { updateProjectSchema } from "../schemas";
import { useDeleteProject } from "../api/use-delete-project";

interface EditProjectFromProps {
  onCancel?: () => void;
  initalValues: Project;
}
export const EditProjectForm = ({
  onCancel,
  initalValues,
}: EditProjectFromProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();

  const [DeleteDialouge, confirmDelete] = useConfirm(
    "Delete Project",
    "This Action cannot be undone",
    "destructive"
  );

  const handelDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;
    deleteProject(
      {
        param: {
          projectId: initalValues.$id,
        },
      },
      {
        onSuccess: () => {
          window.location.href = `/workspaces/${initalValues.workspaceId}`;
        },
      }
    );
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initalValues,
      image: initalValues.imageUrl ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate({ form: finalValues, param: { projectId: initalValues.$id } });
  };

  const handelImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <div className=" flex flex-col gap-y-4">
      <DeleteDialouge />
      <Card className="h-full w-full border-none shadow-none">
        <CardHeader className=" flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => {
                    router.push(
                      `/workspaces/${initalValues.workspaceId}/projects/${initalValues.$id}`
                    );
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
        <CardContent className="p-7">
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
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter project name" />
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
                          <p className=" text-sm">Project Icon</p>
                          <p className=" text-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG, max 1MB
                          </p>
                          <input
                            className=" hidden"
                            type="file"
                            accept=".png, .jpg, .jpeg, .svg"
                            ref={inputRef}
                            onChange={handelImageChange}
                            disabled={isPending}
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
                  <Button type="submit" size="lg" disabled={isPending}>
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
            <h3>Danger Zone</h3>
            <p className=" text-sm text-muted-foreground">
              Deleting a project is irreversible an will remove all associated
              data
            </p>
            <DottedSeprator className="py-7" />
            <Button
              className=" w-fit ml-auto text-white"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isDeletingProject}
              onClick={handelDelete}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
