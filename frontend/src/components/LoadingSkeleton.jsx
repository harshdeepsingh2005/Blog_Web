export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="space-y-4">
        {items.map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="skeleton h-48 w-full rounded-xl mb-4" />
            <div className="skeleton h-3 w-16 rounded mb-3" />
            <div className="skeleton h-6 w-3/4 rounded mb-2" />
            <div className="skeleton h-4 w-full rounded mb-1" />
            <div className="skeleton h-4 w-2/3 rounded mb-4" />
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="skeleton w-7 h-7 rounded-full" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
              <div className="skeleton h-3 w-12 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'post') {
    return (
      <div className="animate-pulse max-w-reading mx-auto">
        <div className="skeleton h-10 w-3/4 rounded mb-4" />
        <div className="skeleton h-10 w-1/2 rounded mb-6" />
        <div className="flex items-center gap-3 mb-8">
          <div className="skeleton w-10 h-10 rounded-full" />
          <div>
            <div className="skeleton h-4 w-24 rounded mb-1" />
            <div className="skeleton h-3 w-32 rounded" />
          </div>
        </div>
        <div className="skeleton h-64 w-full rounded-card mb-8" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-4 w-full rounded mb-3" />
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="skeleton w-24 h-24 rounded-full" />
        <div className="skeleton h-6 w-32 rounded" />
        <div className="skeleton h-4 w-48 rounded" />
      </div>
    );
  }

  if (type === 'table-row') {
    return (
      <div className="space-y-3">
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4 px-6 border-b border-border/50 dark:border-border-dark/50 animate-pulse">
            <div className="skeleton w-8 h-8 rounded-full shrink-0" />
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-4 w-48 rounded hidden md:block" />
            <div className="skeleton h-4 w-24 rounded hidden sm:block ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
