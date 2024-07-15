import { FilterOption } from "@/types";
import { RolesEnum } from "./enums";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  role: RolesEnum;
  isSuper: number;
  status: UserStatusEnum;
  createdAt?: string;
  updatedAt?: string;
}

export enum UserStatusEnum {
  DISABLED = 0,
  ENABLED = 1,
}

export const UserStatusText = {
  [UserStatusEnum.DISABLED]: "禁用",
  [UserStatusEnum.ENABLED]: "启用",
};

export const UserStatusOptions: FilterOption[] = [
  {
    label: UserStatusText[UserStatusEnum.DISABLED],
    value: UserStatusEnum.DISABLED,
  },
  {
    label: UserStatusText[UserStatusEnum.ENABLED],
    value: UserStatusEnum.ENABLED,
  },
];

export const RolesText = {
  [RolesEnum.SUPER]: "超级管理员",
  [RolesEnum.ADMIN]: "管理员",
  [RolesEnum.USER]: "普通用户",
};

export const RolesOptions = [
  {
    label: RolesText[RolesEnum.SUPER],
    value: RolesEnum.SUPER,
  },
  {
    label: RolesText[RolesEnum.ADMIN],
    value: RolesEnum.ADMIN,
  },
  {
    label: RolesText[RolesEnum.USER],
    value: RolesEnum.USER,
  },
];
