import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import LoginForm from "./login-form";

export default function Page() {
  return (
    <section className="relative flex items-center ">
      <Card
        className={cn(
          "w-[360px] max-w-full flex flex-col items-start justify-center rounded"
        )}
      >
        <CardHeader>
          <CardTitle>管理员登录</CardTitle>
          <CardDescription>输入账号密码登录</CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </section>
  );
}
