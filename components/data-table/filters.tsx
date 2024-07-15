import { DateRange } from "react-day-picker";
import type { Table } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/date-picker";
import { SvgIcons } from "@/components/icons/svg-icons";
import { DataTableFilterableColumn, DataTableSearchableColumns } from "@/types";

interface FiltersProps<TData> {
  loading?: boolean;
  table: Table<TData>;
  searchableColumns?: DataTableSearchableColumns<TData>[];
  filterableColumns?: DataTableFilterableColumn<TData>[];
  onQuery?: () => void;
}

export default function Filters<TData>(props: FiltersProps<TData>) {
  const { loading, table, searchableColumns, filterableColumns, onQuery } =
    props;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4 pt-6">
          {searchableColumns?.map((column) => {
            if (column.type === "text") {
              return (
                <Input
                  key={column.id as string}
                  placeholder={`请输入${column.title}`}
                  value={
                    (table
                      .getColumn(column.id as string)
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) => {
                    table
                      .getColumn(column.id as string)
                      ?.setFilterValue(event.target.value);
                  }}
                  className="max-w-sm"
                />
              );
            } else if (column.type === "daterange") {
              return (
                <DatePickerWithRange
                  key={column.id as string}
                  placeholder={column.placeholder ?? "请选择创建时间"}
                  className="max-w-sm"
                  date={
                    table
                      .getColumn(column.id as string)
                      ?.getFilterValue() as DateRange
                  }
                  onSelect={(date) => {
                    table.getColumn(column.id as string)?.setFilterValue(date);
                  }}
                />
              );
            }
          })}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onQuery?.()}>
            {loading && (
              <SvgIcons.spinner className="mr-2 w-4 h-4 animate-spin" />
            )}
            查询
          </Button>
          <Button size="sm" onClick={() => table.resetColumnFilters()}>
            重置
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
