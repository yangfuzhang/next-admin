import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 p-8 border rounded">
        <Skeleton className="w-[40px] h-[40px] rounded-full" />
        <Skeleton className="w-[300px] h-8" />
        <Skeleton className="w-[120px] h-8" />
        <Skeleton className="w-[300px] h-12" />
        <Skeleton className="w-[120px] h-8" />
        <Skeleton className="w-[300px] h-12" />
      </div>
    </div>
  );
}
