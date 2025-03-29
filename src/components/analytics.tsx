import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import AnalyticsCard from "./analytics-card";
import { DottedSeprator } from "./dotted-sperator";

function Analytics({ data }: ProjectAnalyticsResponseType) {
  return (
    <ScrollArea className=" border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className=" flex flex-row w-full">
        <div className=" flex items-center flex-1">
          <AnalyticsCard
            title="Total Task"
            value={data.tasks.count}
            varient={data.tasks.difference > 0 ? "up" : "down"}
            increaseValue={data.tasks.difference}
          />
          <DottedSeprator direction="vertical" />
        </div>
        <div className=" flex items-center flex-1">
          <AnalyticsCard
            title="Assigned Task"
            value={data.assignedTasks.count}
            varient={data.assignedTasks.difference > 0 ? "up" : "down"}
            increaseValue={data.assignedTasks.difference}
          />
          <DottedSeprator direction="vertical" />
        </div>
        <div className=" flex items-center flex-1">
          <AnalyticsCard
            title="Compleated Task"
            value={data.completedTasks.count}
            varient={data.completedTasks.difference > 0 ? "up" : "down"}
            increaseValue={data.completedTasks.difference}
          />
          <DottedSeprator direction="vertical" />
        </div>
        <div className=" flex items-center flex-1">
          <AnalyticsCard
            title="Over Due Task"
            value={data.overdueTasks.count}
            varient={data.overdueTasks.difference > 0 ? "up" : "down"}
            increaseValue={data.overdueTasks.difference}
          />
          <DottedSeprator direction="vertical" />
        </div>
        <div className=" flex items-center flex-1">
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
