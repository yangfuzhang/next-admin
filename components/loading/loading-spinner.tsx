import { SvgIcons } from "@/components/icons/svg-icons";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 z-10 w-full h-full bg-background/60 flex items-center justify-center",
        className
      )}
    >
      <SvgIcons.spinner className="w-[1.5rem] h-[1.5rem] animate-spin" />
    </div>
  );
}
