import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 p-6 md:p-8">
      {/* Dashboard header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-[180px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[100px] rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <div key={`stat-${index}`} className="rounded-lg border p-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-7 w-[120px]" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="mt-3">
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 1 */}
        <div className="rounded-lg border p-4">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-[150px]" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-[220px] w-full rounded-md" />
        </div>

        {/* Chart 2 */}
        <div className="rounded-lg border p-4">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-[150px]" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-[220px] w-full rounded-md" />
        </div>
      </div>

      {/* Recent activity / Table */}
      <div className="rounded-lg border p-4">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-5 w-[150px]" />
          <Skeleton className="h-8 w-[120px] rounded-md" />
        </div>

        {/* Table header */}
        <div className="mb-2 hidden md:grid md:grid-cols-4 md:gap-4 md:px-4 md:py-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>

        {/* Table rows */}
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <div
              key={`row-${index}`}
              className="mb-2 grid grid-cols-2 gap-2 rounded-md border p-3 md:grid-cols-4 md:gap-4"
            >
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
      </div>
    </div>
  )
}
