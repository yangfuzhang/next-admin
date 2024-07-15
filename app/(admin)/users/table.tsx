"use client";
import { useState, useRef, useMemo } from "react";
import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useDebounceFn } from "ahooks";
import { isEqual } from "@/lib/utils";
import { DEFAULT_PAGESIZE } from "@/lib/constants";
import { PlainObject } from "@/types";
import { useApi } from "@/hooks";
import CreateModal from "./create-modal";
import {
  columns,
  searchableColumns,
  filterableColumns,
  ColumnsCnText,
} from "./columns";

export function Table() {
  const MemoizedCreateModal = useMemo(() => <CreateModal />, []);
  const tableRef = useRef<{ resetPage: () => void }>();
  const [params, setParams] = useState({
    page: 1,
    pageSize: DEFAULT_PAGESIZE,
    filters: {},
    sorting: [] as PlainObject[],
  });
  const { page, pageSize, filters, sorting } = params;

  const { useQueryClient, useQuery, get } = useApi();
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery({
    queryKey: ["users", { page, pageSize, filters, sorting }],
    queryFn: () => {
      return get("/users", params);
    },
  });

  const handlePaginationChange = (changedPage: number, changedSize: number) => {
    if (changedPage === page && changedSize === pageSize) return;

    setParams({
      ...params,
      page: changedPage,
      pageSize: changedSize,
    });
  };

  const { run: handleFiltersChange } = useDebounceFn(
    (changedFilters: PlainObject) => {
      if (isEqual(changedFilters, filters)) return;

      setParams({
        ...params,
        page: 1,
        filters: changedFilters,
      });
      tableRef.current?.resetPage();
    },
    { wait: 500 }
  );

  const { run: handleSortingChange } = useDebounceFn(
    (changedSorting: PlainObject[]) => {
      if (isEqual(changedSorting, sorting)) return;

      setParams({
        ...params,
        sorting: changedSorting,
      });
    },
    { wait: 500 }
  );

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <DataTable
      ref={tableRef}
      scroll={{ x: 1200 }}
      leftFixedColumnsSize={130}
      rightFixedColumnsSize={70}
      loading={isFetching}
      columns={columns}
      searchableColumns={searchableColumns}
      filterableColumns={filterableColumns}
      renderToolbar={(table) => {
        return (
          <DataTableToolbar
            table={table}
            title="账号列表"
            columnsCnText={ColumnsCnText}
            onRefresh={handleRefresh}
            renderButtons={() => {
              return <>{MemoizedCreateModal}</>;
            }}
          />
        );
      }}
      data={data ? data.items : []}
      pageCount={data ? Math.ceil(data.total / data.pageSize) : 0}
      onPaginationChange={handlePaginationChange}
      onFiltersChange={handleFiltersChange}
      onSortingChange={handleSortingChange}
      onRefresh={handleRefresh}
    />
  );
}
