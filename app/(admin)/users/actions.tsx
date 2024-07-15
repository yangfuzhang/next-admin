"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { PenLine, Trash2, Key } from "lucide-react";
import { User } from "@/types/user";
import { useApi } from "@/hooks";
import { IconWithTooltip } from "@/components/icons";
import { ConfirmModal } from "@/components/modal";
import { EditModal } from "./edit-modal";
import { ResetPasswordModal } from "./reset-password-modal";
import { toastError, toastSuccess } from "@/lib/toast";

export interface ActionsProps {
  item: User;
}

export function Actions(props: ActionsProps) {
  const { item } = props;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { del, useMutation, useQueryClient } = useApi();
  const queryClient = useQueryClient();
  const delMutation = useMutation({
    mutationFn: (id: string) => {
      return del("/users", { id });
    },
  });
  const handleDelete = () => {
    delMutation.mutate(item.id, {
      onSuccess: () => {
        toastSuccess("删除成功");
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
      onError: (error) => {
        toastError(error.message ?? "删除失败");
      },
    });
  };

  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="flex items-center gap-2">
      <IconWithTooltip
        icon={<PenLine className="w-4 h-4" />}
        tooltip="编辑"
        variant="outline"
        disabled={!!item.isSuper && !user?.isSuper}
        onClick={() => setShowEditModal(true)}
      />
      <IconWithTooltip
        icon={<Key className="w-4 h-4" />}
        tooltip="重置密码"
        variant="outline"
        disabled={!!item.isSuper && !user?.isSuper}
        onClick={() => setShowResetModal(true)}
      />
      <IconWithTooltip
        icon={<Trash2 className="w-4 h-4" />}
        tooltip="删除"
        variant="outline"
        disabled={!!item.isSuper}
        onClick={() => setShowDeleteModal(true)}
      />

      <>
        {showEditModal && (
          <EditModal
            data={item}
            open={showEditModal}
            onOpenChange={(isOpen) => {
              setShowEditModal(isOpen);
            }}
          />
        )}
        {showResetModal && (
          <ResetPasswordModal
            userId={item.id}
            open={showResetModal}
            onOpenChange={(isOpen) => setShowResetModal(isOpen)}
          />
        )}
        {showDeleteModal && (
          <ConfirmModal
            loading={delMutation.isPending}
            title={
              <div>
                确认删除账号{" "}
                <span className="text-medium text-primary">{item.name}</span>{" "}
                吗？
              </div>
            }
            open={showDeleteModal}
            onOpenChange={(isOpen) => setShowDeleteModal(isOpen)}
            onConfirm={handleDelete}
          />
        )}
      </>
    </div>
  );
}
