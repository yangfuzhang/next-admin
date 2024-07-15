"use client";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import {
  ColumnSortingHeader,
  ColumnFilterHeader,
} from "@/components/data-table";
import { DataTableSearchableColumns, DataTableFilterableColumn } from "@/types";
import {
  User,
  UserStatusEnum,
  UserStatusOptions,
  UserStatusText,
  RolesText,
} from "@/types/user";
import { RolesEnum } from "@/types/enums";
import { Actions } from "./actions";

export const ColumnsCnText = {
  id: "ID",
  name: "姓名",
  email: "Email",
  role: "角色",
  status: "状态",
  createdAt: "创建时间",
  updatedAt: "更新时间",
};

export const columns: ColumnDef<User>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ColumnsCnText["name"],
    enableHiding: false,
    size: 130,
  },
  {
    id: "email",
    accessorKey: "email",
    header: ColumnsCnText["email"],
  },
  {
    id: "role",
    accessorKey: "role",
    header: ColumnsCnText["role"],
    cell: ({ row }) => {
      return <span>{RolesText[row.getValue("role") as RolesEnum]}</span>;
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ table, column }) => (
      <ColumnFilterHeader
        title={ColumnsCnText["status"]}
        defaultOptions={UserStatusOptions}
        column={column}
        table={table}
        className="w-[60px]"
      />
    ),
    cell: ({ row }) => (
      <div>{UserStatusText[row.getValue("status") as UserStatusEnum]}</div>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <ColumnSortingHeader
        className="min-w-[150px]"
        column={column}
        title={ColumnsCnText["createdAt"]}
      />
    ),
    cell: ({ row }) => (
      <div>
        {format(new Date(row.getValue("createdAt")), "yyyy-MM-dd HH:mm:ss")}
      </div>
    ),
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <ColumnSortingHeader
        className="min-w-[150px]"
        column={column}
        title={ColumnsCnText["updatedAt"]}
      />
    ),
    cell: ({ row }) => (
      <div>
        {format(new Date(row.getValue("updatedAt")), "yyyy-MM-dd HH:mm:ss")}
      </div>
    ),
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "操作",
    cell: ({ row }) => <Actions item={row.original} />,
    enableHiding: false,
    size: 70,
  },
];

export const searchableColumns: DataTableSearchableColumns<User>[] = [
  {
    id: "name",
    title: ColumnsCnText["name"],
    type: "text",
  },
  {
    id: "email",
    title: ColumnsCnText["email"],
    type: "text",
  },
  {
    id: "createdAt",
    title: ColumnsCnText["createdAt"],
    type: "daterange",
  },
];

export const filterableColumns: DataTableFilterableColumn<User>[] = [
  {
    id: "status",
    title: ColumnsCnText["status"],
    type: "multi-select",
    options: UserStatusOptions,
  },
];
