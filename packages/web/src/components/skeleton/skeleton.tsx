import * as React from "react"

import { cn } from "../../lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("animate-pulse rounded-md bg-muted", className)}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

interface DataSurfaceSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number
}

const DataTableSkeleton = React.forwardRef<HTMLDivElement, DataSurfaceSkeletonProps>(
  ({ className, rows = 5, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2 rounded-lg border p-3", className)} {...props}>
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid grid-cols-4 gap-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      ))}
    </div>
  )
)
DataTableSkeleton.displayName = "DataTableSkeleton"

const DataGridSkeleton = React.forwardRef<HTMLDivElement, DataSurfaceSkeletonProps>(
  ({ className, rows = 4, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-3 rounded-lg border p-3", className)} {...props}>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  )
)
DataGridSkeleton.displayName = "DataGridSkeleton"

const PanelSkeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-3 rounded-lg border p-3", className)} {...props}>
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-2/3" />
    </div>
  )
)
PanelSkeleton.displayName = "PanelSkeleton"

export { Skeleton, DataTableSkeleton, DataGridSkeleton, PanelSkeleton }
