"use client";
import { ResponsiveModel } from "@/components/responsive-model";
import React from "react";
import { CreateWorkSpaceForm } from "./create-workspace-form";
import { useCreateWorkspaceModel } from "../hooks/use-create-workspace-model";

function CreateWorkspaceModel() {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModel();
  return (
    <ResponsiveModel open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkSpaceForm onCancel={close} />
    </ResponsiveModel>
  );
}

export default CreateWorkspaceModel;
