import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useApi } from "@/hooks";
import { toastSuccess, toastError } from "@/lib/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/form/password-input";
import { SvgIcons } from "@/components/icons/svg-icons";

const FormSchema = z
  .object({
    password: z
      .string({
        required_error: "请输入密码",
      })
      .trim()
      .pipe(
        z
          .string()
          .min(8, {
            message: "密码至少8位",
          })
          .regex(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/, {
            message: "必须同时包含英文字母和数字",
          })
      ),
    confirmPassword: z
      .string({
        required_error: "请输入密码",
      })
      .trim()
      .pipe(
        z
          .string()
          .min(8, {
            message: "密码至少8位",
          })
          .regex(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/, {
            message: "必须同时包含英文字母和数字",
          })
      ),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "确认密码与新密码不相同",
        path: ["confirmPassword"],
      });
    }
  });

export function ResetPasswordModal({
  userId,
  open,
  onOpenChange,
}: {
  userId: string;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const { post, useMutation, useQueryClient } = useApi();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof FormSchema>) => {
      return post("/users/resetPassword", {
        id: userId,
        ...values,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
    mutation.mutate(values, {
      onSuccess() {
        onOpenChange?.(false);
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toastSuccess("密码重置成功");
      },
      onError(error) {
        toastError(error.message ?? "操作失败");
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>重置密码</DialogTitle>
          <DialogDescription>
            密码长度至少8位，必须同时包含英文字母和数字
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid space-y-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新密码</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="请输入新密码" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>确认密码</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="请输入确认密码"
                      defaultValue={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <SvgIcons.spinner className="mr-2 w-4 h-4 animate-spin" />
              )}
              保存
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
