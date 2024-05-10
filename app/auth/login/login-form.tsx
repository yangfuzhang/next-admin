"use client";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import SliderCaptcha, { ActionType, Status } from "rc-slider-captcha";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SvgIcons } from "@/components/icons/svg-icons";
import { useApi } from "@/hooks";
import { setUser } from "@/store/app";
import { toastError } from "@/lib/toast";
import { setClientAuthToken, setClientRefreshToken } from "@/lib/client";
import { setAuthSuccess } from "@/server-actions/auth";

const FormSchema = z.object({
  email: z
    .string({
      required_error: "请输入邮箱",
    })
    .email({
      message: "邮箱格式不正确",
    }),
  password: z
    .string({ required_error: "请输入密码" })
    .min(1, { message: "请输入密码" }),
});

export default function LoginForm() {
  const actionRef = useRef<ActionType>();
  const { post, useMutation } = useApi();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof FormSchema>) => {
      return post("/auth/login", values);
    },
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    if (!(actionRef.current?.status === Status.Success)) {
      toastError("请完成滑块验证");
      return;
    }
    mutation.mutate(values, {
      onSuccess: async ({ token, refresh_token, user }: any) => {
        await setAuthSuccess();
        setClientAuthToken(token);
        setClientRefreshToken(refresh_token);
        setUser(user);
        window.location.href = "/";
      },
      onError: (error) => {
        console.log(error);
        toastError(error.message);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>账号</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入邮箱地址"
                  autoComplete="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SliderCaptcha
          mode="slider"
          actionRef={actionRef}
          tipText={{
            default: "请按住滑块，拖动到最右边",
            moving: "请按住滑块，拖动到最右边",
            error: "验证失败，请重新操作",
            success: "验证成功",
          }}
          onVerify={(data) => {
            if (data.x === 260) {
              return Promise.resolve();
            }
            return Promise.reject();
          }}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && (
            <SvgIcons.spinner className="mr-2 w-4 h-4 animate-spin" />
          )}
          登录
        </Button>
      </form>
    </Form>
  );
}
