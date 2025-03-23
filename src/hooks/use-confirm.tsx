import { Button, type ButtonProps } from "@/components/ui/button";
import { ResponsiveModel } from "@/components/responsive-model";
import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const useConfirm = (
  title: string,
  message: string,
  variant: ButtonProps["variant"] = "primary"
) => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => {
    return promise ? (
      <ResponsiveModel open={true} onOpenChange={handleClose}>
        <Card className="w-full h-full border-none shadow-none">
          <CardHeader className="pt-8">
            <CardTitle className="p-0">{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center px-4 justify-end">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full lg:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant={variant}
              className="w-full lg:w-auto text-white"
            >
              Confirm
            </Button>
          </div>
        </Card>
      </ResponsiveModel>
    ) : null;
  };

  return [ConfirmationDialog, confirm] as const;
};
