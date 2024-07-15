import { Theme } from "@/lib/theme";

export interface ThemeConfig {
  theme: Theme["name"];
  radius: number;
}

export type PlainObject = { [key: string]: any };

export type FilterOption = {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
};

export interface DataTableSearchableColumns<TData> {
  id: keyof TData;
  title: string;
  placeholder?: string;
  type?:
    | "text"
    | "date"
    | "datetime"
    | "daterange"
    | "number"
    | "single-select"
    | "multi-select"
    | "relational-multi-select"
    | "tree-select";
  valueType?: "number" | "string";
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumns<TData> {
  options: any[];
}
