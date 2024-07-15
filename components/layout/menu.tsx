"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { MENUS } from "@/lib/menus";
import { RolesEnum } from "@/types/enums";

export function Menu() {
  const pathname = usePathname();
  const session = useSession();
  const role = session.data?.user.role;
  const permittedMenus = MENUS.filter((menu) => {
    return menu.roles.includes(role as RolesEnum);
  });

  return (
    <>
      {permittedMenus.map((menu) => {
        const isActive = pathname === menu.href;
        const activeCls = isActive ? "bg-accent text-primary font-medium" : "";

        return (
          <Link href={menu.href} key={menu.href}>
            <div
              className={cn(
                "w-24 h-full flex flex-col items-center gap-1 py-4 hover:bg-accent hover:text-primary transition-all",
                activeCls
              )}
            >
              {menu.icon}
              <span className="text-sm">{menu.label}</span>
            </div>
          </Link>
        );
      })}
    </>
  );
}
