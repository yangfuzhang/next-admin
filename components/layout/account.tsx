"use client";
import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions";

export default function Account() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="py-4">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Avatar className="w-12 h-12">
            <AvatarImage src="/images/avatar.png" alt="avatar" />
            <AvatarFallback>
              {session.data?.user?.name?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent
          side="right"
          align="end"
          alignOffset={4}
          className="w-56 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <span className="font-medium">{user?.name}</span>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 text-red-600"
              onClick={async () => {
                await logout();
              }}
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
