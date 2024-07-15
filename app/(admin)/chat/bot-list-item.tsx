"use client";
import { PenLine, Trash2 } from "lucide-react";
import { useIsAdmin } from "@/hooks";
import { cn } from "@/lib/utils";
import { IconWithTooltip } from "@/components/icons";
import { Bot } from "@/types/bot";
export function BotListItem({
  bot,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}: {
  bot: Bot;
  isActive?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const isAdmin = useIsAdmin();

  return (
    <div key={bot.id} className="flex items-center gap-2">
      <div
        className={cn(
          "p-2 text-sm bg-secondary rounded hover:opacity-90 transition-all cursor-pointer",
          isAdmin ? "w-40" : "w-full",
          isActive ? "bg-primary text-white font-medium" : ""
        )}
        onClick={onSelect}
      >
        {bot.name}
      </div>

      {isAdmin && (
        <div className="flex items-center">
          <IconWithTooltip
            icon={<PenLine className="w-4 h-4" />}
            tooltip="编辑"
            onClick={onEdit}
          />
          <IconWithTooltip
            icon={<Trash2 className="w-4 h-4" />}
            tooltip="删除"
            onClick={onDelete}
          />
        </div>
      )}
    </div>
  );
}
