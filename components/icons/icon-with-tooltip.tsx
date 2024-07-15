"use client";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function IconWithTooltip({
  disabled,
  icon,
  tooltip,
  className,
  variant,
  onClick,
}: {
  disabled?: boolean;
  icon: React.ReactNode;
  tooltip: string;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  onClick?: () => void;
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant ?? "ghost"}
            size="icon"
            className={cn("", className)}
            disabled={disabled}
            onClick={() => {
              onClick?.();
            }}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
