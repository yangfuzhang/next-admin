import { Separator } from "@/components/ui/separator";
import { BackButton } from "./back-button";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-screen h-screen">
      <div className="flex items-center justify-center gap-2">
        <span className="text-lg font-medium">403</span>
        <Separator orientation="vertical" className="h-8" />
        <p className="text-sm">暂无访问权限，请联系管理员</p>
      </div>

      <BackButton />
    </div>
  );
}
