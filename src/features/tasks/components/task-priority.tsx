import { cn, GetPriority } from "@/lib/utils";
import { PriorityStatus } from "../types";

interface TaskPriorityProps {
  value: PriorityStatus | undefined;
  className?: string;
}

export const TaskPriority = ({ value, className }: TaskPriorityProps) => {
  let backgroundColor = "text-muted-foreground";
  if (value === PriorityStatus.HIGH) {
    backgroundColor = "bg-red-500";
  } else if (value === PriorityStatus.LOW) {
    backgroundColor = "bg-green-500";
  }

  return (
    <div className={cn("rounded-sm", backgroundColor)}>
      <span className={cn("px-2 text-white", className)}>
        {GetPriority(value)}
      </span>
    </div>
  );
};
