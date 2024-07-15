"use client";
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  type ColumnDef,
  type VisibilityState,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
  type ColumnSizingState,
  type ColumnPinningState,
  type ExpandedState,
} from "@tanstack/react-table";
import { DEFAULT_PAGESIZE } from "@/lib/constants";

interface UseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  pinningColumns?: ColumnPinningState;
  data: TData[];
  pageCount?: number;
}

export default function useDataTable<TData, TValue>({
  columns,
  pinningColumns,
  data,
  pageCount,
}: UseDataTableProps<TData, TValue>) {
  // 行选择逻辑
  const [rowSelection, setRowSelection] = useState({});
  // 列可见性配置
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // 排序
  const [sorting, setSorting] = useState<SortingState>([]);
  // 过滤
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
    pinningColumns || { left: ["select", "name"], right: ["actions"] }
  );
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // 分页逻辑
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGESIZE,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const dataTable = useReactTable({
    state: {
      rowSelection,
      columnVisibility,
      sorting,
      columnFilters,
      pagination,
      columnPinning,
      columnSizing,
      expanded,
    },
    data,
    columns,
    pageCount: pageCount ?? -1,
    enableRowSelection: true,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    enableSortingRemoval: true,
    enablePinning: true,
    enableColumnPinning: true,
    getSubRows: (row) => (row as any).subRows,
    getRowId: (originalRow) => (originalRow as any).id.toString(),
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
  });

  return { dataTable, pagination, columnFilters, sorting };
}
