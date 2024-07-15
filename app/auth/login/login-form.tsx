"use client";
import { useState, useRef } from "react";
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
import { toastError } from "@/lib/toast";
import { signIn } from "next-auth/react";

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
  const [loading, setLoading] = useState(false);
  const actionRef = useRef<ActionType>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (!(actionRef.current?.status === Status.Success)) {
      toastError("请完成滑块验证");
      return;
    }

    try {
      setLoading(true);

      const { email, password } = values;
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toastError("认证失败");
        return;
      }

      window.location.href = "/chat";
    } catch (err) {
      toastError("认证失败");
    } finally {
      setLoading(false);
    }
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

        <Button type="submit" disabled={loading}>
          {loading && (
            <SvgIcons.spinner className="mr-2 w-4 h-4 animate-spin" />
          )}
          登录
        </Button>
      </form>
    </Form>
  );
}
