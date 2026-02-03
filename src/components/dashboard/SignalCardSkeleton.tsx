import { motion } from "framer-motion";

const SignalCardSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="h-4 w-12 bg-muted rounded animate-pulse" />
          <div className="h-4 w-px bg-border" />
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Match Skeleton */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <div className="h-6 w-28 bg-muted rounded animate-pulse" />
          <div className="h-4 w-6 bg-muted rounded animate-pulse" />
          <div className="h-6 w-28 bg-muted rounded animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-secondary/50 rounded-xl p-4">
            <div className="h-3 w-12 bg-muted rounded mx-auto mb-2 animate-pulse" />
            <div className="h-8 w-16 bg-muted rounded mx-auto animate-pulse" />
          </div>
          <div className="bg-secondary/50 rounded-xl p-4">
            <div className="h-3 w-20 bg-muted rounded mx-auto mb-2 animate-pulse" />
            <div className="h-8 w-14 bg-muted rounded mx-auto animate-pulse" />
          </div>
        </div>

        {/* AI Tag Skeleton */}
        <div className="mb-5 p-3 bg-secondary/30 rounded-xl">
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex gap-3">
          <div className="flex-1 h-10 bg-muted rounded-lg animate-pulse" />
          <div className="flex-1 h-10 bg-primary/20 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SignalCardSkeleton;