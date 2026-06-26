import { DashboardShell } from "@/components/dashboard/DashboardShell"

export default function Loading() {
  return (
    <DashboardShell>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-white rounded-xl border border-[#E8E0D5] animate-pulse" />
        ))}
      </div>
    </DashboardShell>
  )
}
