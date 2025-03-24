"use client";
import { ResponsiveModel } from "@/components/responsive-model";
import React from "react";
import { useCreateProjectModel } from "../hooks/use-create-project-model";
import { CreateProjectForm } from "./create-project-form";

function CreateProjectModel() {
  const { isOpen, setIsOpen, close } = useCreateProjectModel();
  return (
    <ResponsiveModel open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModel>
  );
}

export default CreateProjectModel;
