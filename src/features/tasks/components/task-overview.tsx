import React from "react";
import { Task } from "../types";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { DottedSeprator } from "@/components/dotted-sperator";
import OverViewProperty from "./over-view-property";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
interface TaskOverviewProps {
  task: Task;
}
function TaskOverview({ task }: TaskOverviewProps) {
  const { open } = useEditTaskModal();
  return (
    <div className=" flex flex-col gap-y-4 col-span-1">
      <div className=" bg-muted rounded-lg p-4">
        <div className=" flex items-center justify-between">
          <p className=" font-semibold text-lg">Overview</p>
          <Button onClick={() => open(task.$id)} size="sm" variant="secondary">
            <PencilIcon className="size-4" />
            Edit
          </Button>
        </div>
        <DottedSeprator className=" my-4" />
        <div className=" flex flex-col gap-y-4">
          <OverViewProperty label="Assignee">
            <MemberAvatar name={task.assignee.name} className=" size-6" />
            <p className=" text-sm font-medium">{task.assignee.name}</p>
          </OverViewProperty>
          <OverViewProperty label="Due Date">
            <TaskDate value={task.dueDate} className=" text-sm font-medium" />
          </OverViewProperty>
          <OverViewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverViewProperty>
        </div>
      </div>
    </div>
  );
}

export default TaskOverview;
