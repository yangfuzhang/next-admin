import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from '@/lib/utils'
import photo from '@/public/images/auth/macbook-air-on-desk.jpg'
import LoginForm from "./login-form"

export default function Page() {
  return (
    <section className="relative flex items-center h-[454px]">
      <div className="relative hidden md:inline-block aspect-square xl:aspect-[3/2] h-full">
        <Image
          src={photo}
          className="rounded-l"
          alt="Next admin"
          priority
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          style={{
            objectFit: "cover",
          }}
        />
      </div>
   
      <Card className={cn("w-[360px] h-[454px] max-w-[100%] flex flex-col items-start justify-center sm:rounded md:rounded-none md:rounded-r")}>
        <CardHeader>
          <CardTitle>管理员登录</CardTitle>
          <CardDescription>账号密码登录</CardDescription>
        </CardHeader>
        
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </section>
  )
}
