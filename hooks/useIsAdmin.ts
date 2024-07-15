"use client";
import { useSession } from "next-auth/react";
import { RolesEnum } from "@/types/enums";

export function useIsAdmin() {
  const session = useSession();
  const role = session.data?.user.role;

  return role === RolesEnum.SUPER || role === RolesEnum.ADMIN;
}
