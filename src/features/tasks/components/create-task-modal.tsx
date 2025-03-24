"use client";
import { ResponsiveModel } from "@/components/responsive-model";
import { useCreateTaskModel } from "../hooks/user-create-task-modal";
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";

export const CreateTaskModel = () => {
  const { isOpen, setIsOpen, close } = useCreateTaskModel();

  return (
    <ResponsiveModel open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModel>
  );
};
