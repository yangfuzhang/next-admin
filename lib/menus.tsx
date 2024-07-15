import { RolesEnum } from "@/types/enums";
import { Users, MessageSquareMore } from "lucide-react";

export const MENUS = [
  {
    label: "账号",
    icon: <Users className="w-6 h-6" />,
    href: "/users",
    roles: [RolesEnum.SUPER, RolesEnum.ADMIN],
  },
  {
    label: "对话",
    icon: <MessageSquareMore className="w-6 h-6" />,
    href: "/chat",
    roles: [RolesEnum.SUPER, RolesEnum.ADMIN, RolesEnum.USER],
  },
];
