"use client";
import { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  ColumnDef,
  type ColumnPinningState,
  Table,
  flexRender,
} from "@tanstack/react-table";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import useDataTable from "@/hooks/useDataTable";
import { cn, getPinnedStyle } from "@/lib/utils";
import { LoadingSpinner } from "@/components/loading";
import Filters from "./filters";
import Pagination from "./table-pagination";
import {
  DataTableFilterableColumn,
  DataTableSearchableColumns,
  FilterOption,
  PlainObject,
} from "@/types";

interface DataTableProps<TData, TValue> {
  scroll?: { x?: number; y?: number };
  leftFixedColumnsSize?: number;
  rightFixedColumnsSize?: number;
  loading?: boolean;
  columns: ColumnDef<TData, TValue>[];
  pinningColumns?: ColumnPinningState;
  data: TData[];
  pageCount?: number;
  filterableColumns?: DataTableFilterableColumn<TData>[];
  searchableColumns?: DataTableSearchableColumns<TData>[];
  renderTopFilters?: (table: Table<TData>) => React.ReactNode;
  renderToolbar?: (table: Table<TData>) => React.ReactNode;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onFiltersChange?: (filters: PlainObject) => void;
  onSortingChange?: (sorting: PlainObject[]) => void;
  onRefresh?: () => void;
}

function DataTable<TData, TValue>(
  {
    scroll = { x: 1000, y: 1000 },
    leftFixedColumnsSize = 100,
    rightFixedColumnsSize = 60,
    loading,
    columns,
    pinningColumns = { left: ["select", "name"], right: ["actions"] },
    data,
    pageCount = -1,
    filterableColumns = [],
    searchableColumns = [],
    renderTopFilters,
    renderToolbar,
    onPaginationChange,
    onFiltersChange,
    onSortingChange,
    onRefresh,
  }: DataTableProps<TData, TValue>,
  ref: any
) {
  const [isHeaderHovered, setIsHeaderHovered] = useState<boolean>(false);
  const [hoverId, setHoverId] = useState<string>("0");
  const {
    dataTable: table,
    pagination,
    columnFilters,
    sorting,
  } = useDataTable({
    data,
    columns,
    pinningColumns,
    pageCount,
  });

  useEffect(() => {
    onPaginationChange?.(pagination.pageIndex + 1, pagination.pageSize);
  }, [pagination, onPaginationChange]);

  useEffect(() => {
    const filters: PlainObject = {};

    columnFilters.forEach((filter) => {
      const searchableColumn = searchableColumns.find(
        (column) => column.id === filter.id
      );
      if (searchableColumn) {
        if (searchableColumn.type === "daterange") {
          filters[filter.id] = {
            gte: (filter.value as DateRange)["from"],
            lte: (filter.value as DateRange)["to"],
          };
        } else {
          filters[filter.id] = {
            contains: filter.value,
            mode: "insensitive",
          };
        }
      } else {
        const filterableColumn = filterableColumns.find(
          (column) => column.id === filter.id
        );

        if (filterableColumn) {
          if (filterableColumn.type === "multi-select") {
            filters["OR"] = (filter.value as FilterOption[]).map((value) => {
              return {
                [filter.id]: {
                  equals: value,
                },
              };
            });
          } else if (
            filterableColumn.type === "relational-multi-select" ||
            filterableColumn.type === "tree-select"
          ) {
            filters[filter.id] = {
              some: {
                id: {
                  in: filter.value,
                },
              },
            };
          } else {
            if (filterableColumn.valueType) {
              filters[filter.id] =
                filterableColumn.valueType === "number"
                  ? Number(filter.value)
                  : filter.value;
            } else {
              filters[filter.id] = filter.value;
            }
          }
        }
      }
    });

    onFiltersChange?.(filters);
  }, [onFiltersChange, columnFilters, searchableColumns, filterableColumns]);

  useEffect(() => {
    const changedSorting = sorting.map((item) => {
      return { [`${item.id}`]: item.desc ? "desc" : "asc" };
    });
    onSortingChange?.(changedSorting);
  }, [sorting, onSortingChange]);

  const handleRefresh = () => {
    onRefresh?.();
  };

  useImperativeHandle(ref, () => ({
    resetPage() {
      table.setPageIndex(0);
    },
    resetSelection() {
      table.resetRowSelection();
    },
  }));

  return (
    <div className="w-full flex flex-col gap-4">
      {renderTopFilters?.(table)}

      <Filters
        loading={loading}
        table={table}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        onQuery={handleRefresh}
      />

      <Card className="overflow-auto">
        <CardContent>
          {renderToolbar?.(table)}

          <div className="relative flex rounded-md border">
            {loading && <LoadingSpinner />}

            <ShadcnTable
              style={{ minWidth: `${scroll.x}px` }}
              leftFixedColumnsSize={leftFixedColumnsSize}
              rightFixedColumnsSize={rightFixedColumnsSize}
            >
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    onMouseMove={() => setIsHeaderHovered(true)}
                    onMouseOut={() => setIsHeaderHovered(false)}
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          style={getPinnedStyle(header.column)}
                          className={isHeaderHovered ? "!bg-muted" : ""}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      className="h-[55px]"
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onMouseOver={() => setHoverId(row.id)}
                      onMouseOut={() => setHoverId("0")}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell
                            key={cell.id}
                            data-state={row.getIsSelected() && "selected"}
                            style={getPinnedStyle(cell.column)}
                            className={cn(
                              "data-[state=selected]:!bg-muted",
                              hoverId === row.id ? "!bg-muted" : ""
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {!loading ? "暂无结果" : ""}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ShadcnTable>
          </div>

          <Pagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}

export default forwardRef<any, DataTableProps<any, any>>(DataTable);
