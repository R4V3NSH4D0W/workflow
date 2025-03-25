import React from "react";

interface OverViewPropertyProps {
  label: string;
  children: React.ReactNode;
}

function OverViewProperty({ label, children }: OverViewPropertyProps) {
  return (
    <div className=" flex items-start gap-x-2">
      <div className=" min-w-[100px]">
        <p className=" text-sm text-muted-foreground">{label}</p>
      </div>
      <div className=" flex items-center gap-x-2">{children}</div>
    </div>
  );
}

export default OverViewProperty;
