import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import AnalyticsCard from "./analytics-card";
import { DottedSeprator } from "./dotted-sperator";

function Analytics({ data }: ProjectAnalyticsResponseType) {
  return (
    <ScrollArea className="border rounded-lg w-full">
      <div className="flex w-full overflow-x-auto md:overflow-hidden">
        <div className="flex items-center flex-1 min-w-[200px]">
          <AnalyticsCard
            title="Total Task"
            value={data.tasks.count}
            varient={data.tasks.difference > 0 ? "up" : "down"}
            increaseValue={data.tasks.difference}
          />
          <DottedSeprator direction="vertical" />
        </div>
        <div className="flex items-center flex-1 min-w-[200px]">
          <AnalyticsCard
            title="Assigned Task"
            value={data.assignedTasks.count}
            varient={data.assignedTasks.difference > 0 ? "up" : "down"}
            increaseValue={data.assignedTasks.difference}
          />
          <DottedSeprator direction="vertical" />
        </div>
        <div className="flex items-center flex-1 min-w-[200px]">
          <AnalyticsCard
            title="Completed Task"
            value={data.completedTasks.count}
            varient={data.completedTasks.difference > 0 ? "up" : "down"}
            increaseValue={data.completedTasks.difference}
          />
          <DottedSeprator direction="vertical" />
        </div>
        <div className="flex items-center flex-1 min-w-[200px]">
          <AnalyticsCard
            title="Overdue Task"
            value={data.overdueTasks.count}
            varient={data.overdueTasks.difference > 0 ? "up" : "down"}
            increaseValue={data.overdueTasks.difference}
          />
          <DottedSeprator direction="vertical" />
        </div>
        <div className="flex items-center flex-1 min-w-[200px]">
          <AnalyticsCard
            title="Incomplete Task"
            value={data.incompleteTasks.count}
            varient={data.incompleteTasks.difference > 0 ? "up" : "down"}
            increaseValue={data.incompleteTasks.difference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default Analytics;
