"use client";
import { useState, useMemo } from "react";
import { Plus, HardDrive } from "lucide-react";
import { useApi, useIsAdmin } from "@/hooks";
import { toastSuccess, toastError } from "@/lib/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot } from "@/types/bot";
import { ConfirmModal } from "@/components/modal";
import { LoadingSpinner } from "@/components/loading";
import { CreateEditBot } from "./components/create-edit-bot";
import { BotListItem } from "./bot-list-item";

export function BotList({
  loading,
  bots,
  currentBot,
  onSelect,
}: {
  loading?: boolean;
  bots: Bot[];
  currentBot: Bot | undefined;
  onSelect?: (bot: Bot) => void;
}) {
  const [targetBot, setTargetBot] = useState<Bot>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { del, useMutation, useQueryClient } = useApi();
  const queryClient = useQueryClient();
  const delMutation = useMutation({
    mutationFn: (id: string) => {
      return del("/bots", { id });
    },
  });

  const handleDelete = () => {
    if (!targetBot) {
      return;
    }

    delMutation.mutate(targetBot.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        toastSuccess("删除成功");
        queryClient.invalidateQueries({ queryKey: ["bots"] });
      },
      onError: (error) => {
        toastError(error.message ?? "删除失败");
      },
    });
  };

  const isAdmin = useIsAdmin();
  const MemoizedBotList = useMemo(() => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (bots.length === 0) {
      return (
        <div className="flex flex-col items-center gap-1">
          <HardDrive className="w-12 h-12 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">暂无数据</span>
        </div>
      );
    }

    return (
      <>
        {bots.map((bot) => {
          const isActive = bot.botId === currentBot?.botId;

          return (
            <BotListItem
              key={bot.id}
              bot={bot}
              isActive={isActive}
              onSelect={() => onSelect?.(bot)}
              onEdit={() => {
                setTargetBot(bot);
                setShowEditModal(true);
              }}
              onDelete={() => {
                setTargetBot(bot);
                setShowDeleteModal(true);
              }}
            />
          );
        })}
      </>
    );
  }, [loading, bots, currentBot?.botId, onSelect]);

  return (
    <Card className="h-screen flex flex-col border-0 border-r rounded-none overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg">Bot列表</CardTitle>
        <CardDescription>Coze平台创建的Bot列表</CardDescription>
        {isAdmin && (
          <div className="w-full flex justify-end">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:opacity-90 transition-all"
              onClick={() => {
                setShowAddModal(true);
              }}
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        )}
      </CardHeader>

      <CardContent className="relative w-72 flex-1 flex flex-col gap-2 overflow-y-auto">
        {MemoizedBotList}

        <>
          {showAddModal && (
            <CreateEditBot
              open={showAddModal}
              onOpenChange={(isOpen) => {
                setShowAddModal(isOpen);
              }}
            />
          )}

          {targetBot && showEditModal && (
            <CreateEditBot
              bot={targetBot}
              open={showEditModal}
              onOpenChange={(isOpen) => {
                setShowEditModal(isOpen);
              }}
            />
          )}

          {targetBot && showDeleteModal && (
            <ConfirmModal
              loading={delMutation.isPending}
              title={
                <div>
                  确认删除Bot{" "}
                  <span className="text-medium text-primary">
                    {targetBot.name}
                  </span>{" "}
                  吗？
                </div>
              }
              open={showDeleteModal}
              onOpenChange={(isOpen) => {
                setShowDeleteModal(isOpen);
              }}
              onConfirm={handleDelete}
            />
          )}
        </>
      </CardContent>
    </Card>
  );
}
