import {
  type Column,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

function getNextSortingText(sort: false | string) {
  if (!sort) return '取消排序'
  if (sort === 'desc') return '点击降序'
  return '点击升序'
}

export function ColumnSortingHeader<TData>(
  { column, title, className }: { column: Column<TData>, title: string, className?: string}
) {
  return (
    <div className={cn('flex items-center', className)}>
      { title }
      <Button
        className='px-2 hover:bg-transparent'
        variant="ghost"
        onClick={() => {
          if (!column.getNextSortingOrder()) return column.toggleSorting()
          return column.toggleSorting(column.getIsSorted() === 'asc')
        }}
      >
        { !column.getIsSorted() && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <ArrowUpDown className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{getNextSortingText(column.getNextSortingOrder())}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        { column.getIsSorted() === "asc" && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <ArrowUp className="h-4 w-4 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{getNextSortingText(column.getNextSortingOrder())}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> 
        )}
        { column.getIsSorted() === "desc" && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <ArrowDown className="h-4 w-4 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{getNextSortingText(column.getNextSortingOrder())}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> 
        )}
      </Button>
    </div>
  )
}