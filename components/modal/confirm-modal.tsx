import { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SvgIcons } from "@/components/icons";

export interface ConfirmModalProps {
  loading?: boolean;
  title?: string | ReactNode;
  description?: string;
  open: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onConfirm?: () => void;
}

export function ConfirmModal(props: ConfirmModalProps) {
  const {
    loading,
    open,
    title = "确认删除吗？",
    description = "删除后数据将无法恢复，请谨慎操作",
    onOpenChange,
    onConfirm,
  } = props;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="break-all">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <Button disabled={loading} type="button" onClick={onConfirm}>
            {loading && (
              <SvgIcons.spinner className="mr-2 w-4 h-4 animate-spin" />
            )}
            确定
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
