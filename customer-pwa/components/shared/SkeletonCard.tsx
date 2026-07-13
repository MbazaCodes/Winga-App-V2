export default function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-input-bg" />
        <div className="flex-1">
          <div className="h-3 bg-input-bg rounded-full mb-2 w-3/4" />
          <div className="h-3 bg-input-bg rounded-full w-1/2" />
        </div>
      </div>
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <div key={i} className="h-3 bg-input-bg rounded-full mb-2" style={{ width: `${70 + i * 10}%` }} />
      ))}
    </div>
  )
}
