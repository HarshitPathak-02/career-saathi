import type React from "react";

export interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", style }) => {
  return (
    <div
      style={style}
      className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`}
    />
  );
};

export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
  lineClassName?: string;
}> = ({ lines = 3, className = "space-y-2.5", lineClassName = "h-4" }) => {
  return (
    <div className={`w-full ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`${lineClassName} ${
            i === lines - 1 && lines > 1 ? "w-3/5" : "w-full"
          }`}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar: React.FC<{
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}> = ({ size = "md", className = "" }) => {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
    xl: "h-20 w-20",
  };
  return <Skeleton className={`rounded-full ${sizeMap[size]} ${className}`} />;
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-1/3 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-4">
        <SkeletonText lines={2} />
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  );
};

export default Skeleton;
