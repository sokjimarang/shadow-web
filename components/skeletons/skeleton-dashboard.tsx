import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonBehaviourGraph() {
  return (
    <div className="h-[400px] flex flex-col gap-3 p-4">
      <div className="flex items-center justify-center gap-4">
        <Skeleton variant="circular" width="80px" height="80px" />
        <Skeleton variant="circular" width="80px" height="80px" />
        <Skeleton variant="circular" width="80px" height="80px" />
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <Skeleton variant="circular" width="80px" height="80px" />
        <Skeleton variant="circular" width="80px" height="80px" />
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <Skeleton variant="circular" width="80px" height="80px" />
      </div>
    </div>
  );
}

export function SkeletonOutputResult() {
  return (
    <div className="p-4 space-y-3">
      <Skeleton variant="text" width="40%" height="16px" />
      <Skeleton variant="text" width="90%" height="16px" />
      <Skeleton variant="text" width="85%" height="16px" />
      <Skeleton variant="text" width="75%" height="16px" />
      <div className="mt-4" />
      <Skeleton variant="text" width="60%" height="16px" />
      <Skeleton variant="text" width="80%" height="16px" />
      <Skeleton variant="text" width="70%" height="16px" />
    </div>
  );
}

export function SkeletonDocumentation() {
  return (
    <div className="space-y-4">
      <Skeleton variant="text" width="60%" height="28px" />
      <div className="space-y-2 mt-4">
        <Skeleton variant="text" width="100%" height="16px" />
        <Skeleton variant="text" width="95%" height="16px" />
        <Skeleton variant="text" width="90%" height="16px" />
        <Skeleton variant="text" width="85%" height="16px" />
      </div>
      <div className="mt-6" />
      <Skeleton variant="text" width="50%" height="24px" />
      <div className="space-y-2 mt-3">
        <Skeleton variant="text" width="100%" height="16px" />
        <Skeleton variant="text" width="92%" height="16px" />
        <Skeleton variant="text" width="88%" height="16px" />
      </div>
      <div className="mt-6" />
      <Skeleton variant="text" width="55%" height="24px" />
      <div className="space-y-2 mt-3">
        <Skeleton variant="text" width="100%" height="16px" />
        <Skeleton variant="text" width="97%" height="16px" />
        <Skeleton variant="text" width="93%" height="16px" />
        <Skeleton variant="text" width="80%" height="16px" />
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          <Skeleton variant="text" width="40%" height="24px" className="mb-4" />
          <SkeletonBehaviourGraph />
        </div>

        <div className="border rounded-lg p-6">
          <Skeleton variant="text" width="35%" height="24px" className="mb-4" />
          <SkeletonOutputResult />
        </div>
      </div>

      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          <Skeleton variant="text" width="40%" height="24px" className="mb-4" />
          <SkeletonDocumentation />
        </div>
      </div>
    </div>
  );
}
