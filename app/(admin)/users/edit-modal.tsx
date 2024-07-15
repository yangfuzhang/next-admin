import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useApi } from "@/hooks";
import { toastSuccess, toastError } from "@/lib/toast";
import { RolesEnum } from "@/types/enums";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SvgIcons } from "@/components/icons/svg-icons";
import { User, RolesOptions } from "@/types/user";
import { EditFormSchema as FormSchema } from "./form-schema";

export interface EditModalProps {
  data: User;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditModal(props: EditModalProps) {
  const { data, open, onOpenChange } = props;
  const { patch, useMutation, useQueryClient } = useApi();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data.name,
      email: data.email,
      role: data.role,
      status: String(data.status),
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof FormSchema>) => {
      return patch(`/users`, {
        id: data.id,
        ...values,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    mutation.mutate(values, {
      onSuccess() {
        toastSuccess("账号更新成功");
        form.reset();
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
      onError(error) {
        console.log(error);
        toastError(error.message ?? "更新失败");
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑账号</DialogTitle>
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
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>角色</FormLabel>
                  <Select
                    disabled={!!data.isSuper}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择角色" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RolesOptions.map((role) => {
                        return (
                          <SelectItem
                            key={role.value}
                            value={role.value}
                            disabled={role.value === RolesEnum.SUPER}
                          >
                            {role.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>状态</FormLabel>
                  <Select
                    disabled={!!data.isSuper}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择状态" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">禁用</SelectItem>
                      <SelectItem value="1">启用</SelectItem>
                    </SelectContent>
                  </Select>
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
