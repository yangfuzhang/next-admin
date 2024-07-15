import * as z from "zod";

export const CreateFormSchema = z.object({
  name: z
    .string({
      required_error: "请输入姓名",
    })
    .trim()
    .pipe(
      z
        .string()
        .min(2, { message: "姓名不能少于2个字符" })
        .max(30, { message: "姓名不能多于30个字符" })
    ),
  email: z
    .string({
      required_error: "请输入邮箱",
    })
    .trim()
    .pipe(
      z.string().email({
        message: "邮箱格式不正确",
      })
    ),
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
  role: z.string({
    required_error: "请选择角色",
  }),
  status: z.string({
    required_error: "请选择状态",
  }),
});

export const EditFormSchema = z.object({
  name: z
    .string({
      required_error: "请输入姓名",
    })
    .trim()
    .pipe(
      z
        .string()
        .min(2, { message: "姓名不能少于2个字符" })
        .max(30, { message: "姓名不能多于30个字符" })
    ),
  email: z
    .string({
      required_error: "请输入邮箱",
    })
    .trim()
    .pipe(
      z.string().email({
        message: "邮箱格式不正确",
      })
    ),
  role: z.string({
    required_error: "请选择角色",
  }),
  status: z.string({
    required_error: "请选择状态",
  }),
});
