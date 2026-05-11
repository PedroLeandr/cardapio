"use client"

import { DashboardShell } from "./DashboardShell"

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-[#E8E0D5] ${className ?? ""}`} />
  )
}

export function DashboardSkeleton() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page heading */}
        <div className="space-y-2">
          <Shimmer className="h-3.5 w-28" />
          <Shimmer className="h-7 w-52" />
        </div>

        {/* Main content blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Shimmer className="h-28" />
            <div className="grid grid-cols-2 gap-3">
              <Shimmer className="h-24" />
              <Shimmer className="h-24" />
            </div>
            <Shimmer className="h-36" />
          </div>
          <Shimmer className="h-80" />
        </div>
      </div>
    </DashboardShell>
  )
}

export function DashboardListSkeleton() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header + button */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Shimmer className="h-7 w-40" />
            <Shimmer className="h-3.5 w-56" />
          </div>
          <Shimmer className="h-9 w-36 rounded-lg" />
        </div>

        {/* List rows */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Shimmer key={i} className="h-16" />
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}

export function DashboardSettingsSkeleton() {
  return (
    <DashboardShell>
      <div className="space-y-6 max-w-lg">
        <div className="space-y-2">
          <Shimmer className="h-7 w-44" />
          <Shimmer className="h-3.5 w-64" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Shimmer className="h-3.5 w-24 rounded-lg" />
              <Shimmer className="h-10" />
            </div>
          ))}
        </div>

        <Shimmer className="h-10 w-32 rounded-lg" />
      </div>
    </DashboardShell>
  )
}
