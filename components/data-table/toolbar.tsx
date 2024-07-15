import { RotateCw, Settings } from "lucide-react";
import { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconWithTooltip } from "@/components/icons";
import { PlainObject } from "@/types";

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  title: string;
  columnsCnText?: PlainObject;
  renderButtons?: (table: Table<TData>) => React.ReactNode;
  onRefresh?: () => void;
}

export function DataTableToolbar<TData>(props: DataTableToolbarProps<TData>) {
  const { title, columnsCnText, table, renderButtons, onRefresh } = props;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-medium">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {renderButtons?.(table)}

        <div className="flex items-center">
          <IconWithTooltip
            icon={<RotateCw className="w-[1.2rem] h-[1.2rem]" />}
            tooltip="刷新"
            onClick={onRefresh}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-[1.2rem] h-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {columnsCnText?.[column.id] || column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
