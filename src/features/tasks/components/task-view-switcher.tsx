"use client";
import { DottedSeprator } from "@/components/dotted-sperator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";

import React from "react";
import { useCreateTaskModel } from "../hooks/user-create-task-modal";
import { useGetTasks } from "../api/use-get-tasks";
import { useWorkspaceIds } from "@/features/workspaces/hooks/use-workspace-id";
import { useQueryState } from "nuqs";
import { DataFilters } from "./data-filters";
import { useTaskFilters } from "../hooks/use-task-filter";
import { DataTable } from "./data-table";
import { colums } from "./colums";
function TaskViewSwitcher() {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const workspaceId = useWorkspaceIds();
  const { open } = useCreateTaskModel();

  const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();

  const { data: tasks, isLoading: isTaskLoading } = useGetTasks({
    workspaceId,
    projectId,
    assigneeId,
    status,
    dueDate,
  });

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className=" flex-1 w-full border rounded-lg"
    >
      <div className=" h-full flex flex-col overflow-auto p-4">
        <div className=" flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className=" w-full lg:w-auto">
            <TabsTrigger className=" h-8 w-full lg:w-auto " value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className=" h-8 w-full lg:w-auto " value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className=" h-8 w-full lg:w-auto " value="Calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className=" w-full lg:w-auto" onClick={open}>
            <PlusIcon className=" size-4" />
            New
          </Button>
        </div>
        <DottedSeprator className=" my-4" />
        <DataFilters />
        <DottedSeprator className=" my-4" />
        {isTaskLoading ? (
          <div className=" w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className=" size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className=" mt-0">
              <DataTable columns={colums} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="Kanban" className=" mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent value="Calandar" className=" mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}

export default TaskViewSwitcher;
