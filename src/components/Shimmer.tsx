export function ShimmerBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-700/50 rounded-lg ${className}`} />
  );
}

export function ShimmerCard() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4 animate-pulse">
      <ShimmerBlock className="h-4 w-1/3" />
      <ShimmerBlock className="h-3 w-2/3" />
      <ShimmerBlock className="h-2 w-full" />
      <ShimmerBlock className="h-2 w-full" />
      <ShimmerBlock className="h-2 w-4/5" />
    </div>
  );
}

export function ShimmerTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3 animate-pulse">
      <ShimmerBlock className="h-4 w-1/4 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <ShimmerBlock className="h-3 w-32" />
          <ShimmerBlock className="h-3 w-20" />
          <ShimmerBlock className="h-3 flex-1" />
          <ShimmerBlock className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}
