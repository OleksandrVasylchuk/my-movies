export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-9 w-32 bg-bg-secondary rounded-xl mb-6" />
      <div className="h-12 bg-bg-secondary rounded-2xl mb-5" />
      <div className="flex gap-2 mt-5 mb-6">
        <div className="h-10 w-36 bg-bg-secondary rounded-xl" />
        <div className="h-10 w-28 bg-bg-secondary rounded-xl" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[2/3] rounded-xl bg-bg-secondary" />
            <div className="h-3 bg-bg-secondary rounded mt-2" />
            <div className="h-2.5 w-10 bg-bg-tertiary rounded mt-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
