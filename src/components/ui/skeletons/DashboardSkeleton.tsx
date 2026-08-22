import { Skeleton } from '@/components/ui';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 border rounded-lg shadow-sm bg-card">
            <div className="flex items-center justify-between space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 p-6 border rounded-lg shadow-sm bg-card">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="col-span-3 p-6 border rounded-lg shadow-sm bg-card">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="p-6 border rounded-lg shadow-sm bg-card">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {/* Table Header */}
      <div className="flex items-center space-x-4 p-4 border-b">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
      
      {/* Table Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border-b last:border-0">
          {[...Array(5)].map((_, j) => (
            <Skeleton key={j} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-2xl mx-auto p-6">
      <Skeleton className="h-8 w-1/3" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
