import * as React from "react"
import { cn } from "@/lib/utils"

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns = 1, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4",
          `grid-cols-${columns}`,
          className
        )}
        {...props}
      />
    )
  }
)
Grid.displayName = "Grid"

export interface GridItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  span?: number
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, span = 1, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "col-span-full",
          span > 1 ? `col-span-${span}` : "",
          className
        )}
        {...props}
      />
    )
  }
)
GridItem.displayName = "GridItem"

export { Grid, GridItem }
