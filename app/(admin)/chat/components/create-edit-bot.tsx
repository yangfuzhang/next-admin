import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useApi } from "@/hooks";
import { toastError, toastSuccess } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/form";
import { SvgIcons } from "@/components/icons";
import { Bot } from "@/types/bot";
import { FormSchema } from "./form-schema";

export interface CreateEditBotProps {
  bot?: Bot;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}
export function CreateEditBot(props: CreateEditBotProps) {
  const { bot, open, onOpenChange } = props;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      botId: "",
      sort: 0,
      remark: "",
    },
  });

  useEffect(() => {
    if (bot) {
      const { name, botId, sort, remark } = bot;

      form.reset({
        name,
        botId,
        sort,
        remark,
      });
    }
  }, [form, bot]);

  const { useMutation, useQueryClient, post, patch } = useApi();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof FormSchema>) => {
      if (bot) {
        return patch("/bots", { id: bot.id, ...values });
      }

      return post("/bots", { ...values });
    },
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onOpenChange?.(false);
        form.reset();
        toastSuccess("保存成功");
        queryClient.invalidateQueries({ queryKey: ["bots"] });
      },
      onError: (error) => {
        toastError(error.message ?? "保存失败");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{bot ? "编辑Bot" : "新建Bot"}</DialogTitle>
          <DialogDescription>Coze平台添加的Bot</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入Bot名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="botId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入Coze后台创建的Bot ID"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>排序</FormLabel>
                  <FormControl>
                    <InputNumber placeholder="请输入排序" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>备注（选填）</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入备注" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
              >
                取消
              </Button>
              <Button type="submit">
                {mutation.isPending && (
                  <SvgIcons.spinner className="mr-2 w-4 h-4 animate-spin" />
                )}
                保存
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
