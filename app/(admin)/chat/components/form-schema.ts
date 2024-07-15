import * as z from "zod";

export const FormSchema = z.object({
  name: z
    .string({ required_error: "请输入Bot名称" })
    .trim()
    .pipe(z.string().min(1, { message: "请输入Bot名称" })),
  botId: z
    .string({ required_error: "请输入Bot ID" })
    .trim()
    .pipe(z.string().min(1, { message: "请输入Bot ID" })),
  sort: z.number({ required_error: "请输入排序" }),
  remark: z.string().optional(),
});
