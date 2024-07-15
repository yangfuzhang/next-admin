import { useRef } from "react";
import { toastInfo } from "@/lib/toast";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Table } from "@tanstack/react-table";

interface PaginationProps<TData> {
  table: Table<TData>;
}

export default function TablePagination<TData>({
  table,
}: PaginationProps<TData>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleJump = () => {
    const value = inputRef.current?.value;

    if (value) {
      if (Number(value) > table.getPageCount()) {
        toastInfo("页码超出范围");
        return;
      }
      table.setPageIndex(Number(value) - 1);
    }
  };

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        本页选中{table.getFilteredSelectedRowModel().rows.length}项， 共
        {table.getFilteredRowModel().rows.length}项
      </div>
      <div className="flex items-center gap-2">
        <p className="mr-4 text-sm">
          第
          {table.getPageCount() > 0
            ? table.getState().pagination.pageIndex + 1
            : 0}
          页 / 共{table.getPageCount()}页
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>

        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(val: string) => {
            table.setPageSize(Number(val));
          }}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="每页显示" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize}条/页
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="hidden lg:flex max-w-sm items-center space-x-2">
          <Input
            ref={inputRef}
            type="number"
            min={1}
            className="w-20"
            placeholder="页码"
          />
          <Button onClick={handleJump}>跳转</Button>
        </div>
      </div>
    </div>
  );
}
