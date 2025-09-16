
import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/lib/toast";

export interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: "alert" | "toast";
  className?: string;
}

export function ErrorMessage({
  title = "Error",
  message,
  variant = "alert",
  className,
}: ErrorMessageProps) {
  React.useEffect(() => {
    if (variant === "toast") {
      toast.error(message, {
        description: title !== "Error" ? title : undefined,
      });
    }
  }, [message, title, variant]);

  if (variant === "toast") {
    return null;
  }

  return (
    <Alert
      variant="destructive"
      className={cn("border-destructive/50", className)}
    >
      <XCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

// Utility function for showing error toasts without rendering component
ErrorMessage.showToast = (message: string, title?: string) => {
  toast.error(message, {
    description: title,
  });
};
