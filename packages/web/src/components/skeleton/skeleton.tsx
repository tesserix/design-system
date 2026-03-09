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

const SkeletonShimmer = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-md bg-muted",
          "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-[shimmer_2s_infinite]",
          className
        )}
        {...props}
      />
    )
  }
)
SkeletonShimmer.displayName = "SkeletonShimmer"

interface TextSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  lastLineWidth?: string
}

const TextSkeleton = React.forwardRef<HTMLDivElement, TextSkeletonProps>(
  ({ className, lines = 3, lastLineWidth = "60%", ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 w-full"
          style={i === lines - 1 ? { width: lastLineWidth } : undefined}
        />
      ))}
    </div>
  )
)
TextSkeleton.displayName = "TextSkeleton"

interface SizeSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const AvatarSkeleton = React.forwardRef<HTMLDivElement, SizeSkeletonProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" }
    return (
      <Skeleton
        ref={ref}
        className={cn("rounded-full", sizeClasses[size], className)}
        {...props}
      />
    )
  }
)
AvatarSkeleton.displayName = "AvatarSkeleton"

const ButtonSkeleton = React.forwardRef<HTMLDivElement, SizeSkeletonProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = { sm: "h-9 w-20", md: "h-10 w-24", lg: "h-12 w-32" }
    return (
      <Skeleton
        ref={ref}
        className={cn("rounded-lg", sizeClasses[size], className)}
        {...props}
      />
    )
  }
)
ButtonSkeleton.displayName = "ButtonSkeleton"

interface TableRowSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number
}

const TableRowSkeleton = React.forwardRef<HTMLDivElement, TableRowSkeletonProps>(
  ({ className, columns = 4, ...props }, ref) => (
    <div ref={ref} className={cn("grid gap-2", className)} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }} {...props}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-full" />
      ))}
    </div>
  )
)
TableRowSkeleton.displayName = "TableRowSkeleton"

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

export {
  Skeleton,
  SkeletonShimmer,
  TextSkeleton,
  AvatarSkeleton,
  ButtonSkeleton,
  TableRowSkeleton,
  DataTableSkeleton,
  DataGridSkeleton,
  PanelSkeleton,
}
