import { useState } from "react";
import { Table, type Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterOption } from "@/types";

export interface ColumnFilterHeaderProps<TData> {
  title: string;
  column: Column<TData>;
  table: Table<TData>;
  className?: string;
  defaultOptions?: FilterOption[];
}

export function ColumnFilterHeader<TData>(
  props: ColumnFilterHeaderProps<TData>
) {
  const { title, column, defaultOptions, className } = props;
  const selectedValues = new Set(
    column?.getFilterValue() as (string | number)[]
  );

  const options = defaultOptions ?? [];
  const [searchValue, setSearchValue] = useState<string>("");
  const displayOptions = searchValue.trim()
    ? options.filter((option) => {
        return option.label.toLowerCase().includes(searchValue.toLowerCase());
      })
    : options;

  return (
    <div className={cn("flex items-center", className)}>
      {title}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="px-2 hover:bg-transparent">
            <Filter
              className={cn(
                "w-[1rem] h-[1rem]",
                selectedValues.size > 0 ? "text-primary" : ""
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0" align="center">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={title}
              value={searchValue}
              onValueChange={(value) => {
                setSearchValue(value);
              }}
            />

            <CommandList>
              {displayOptions.length === 0 && (
                <CommandEmpty>暂无结果</CommandEmpty>
              )}
              <CommandGroup>
                {displayOptions.map((option) => {
                  const isSelected = selectedValues.has(option.value);

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        if (isSelected) {
                          selectedValues.delete(option.value);
                        } else {
                          selectedValues.add(option.value);
                        }
                        const filterValues = Array.from(selectedValues);
                        column?.setFilterValue(
                          !!filterValues.length ? filterValues : undefined
                        );
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className={cn("h-4 w-4")} aria-hidden="true" />
                      </div>
                      {option.icon && (
                        <option.icon
                          className="mr-2 h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setSearchValue("");
                        column?.setFilterValue(undefined);
                      }}
                      className="justify-center text-center"
                    >
                      重置
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
