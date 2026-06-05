export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-[45vh] bg-bg-secondary" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10">
        <div className="flex gap-6 sm:gap-8 items-start">
          <div className="w-36 sm:w-48 flex-shrink-0">
            <div className="aspect-[2/3] rounded-2xl bg-bg-tertiary ring-2 ring-white/5 shadow-2xl" />
          </div>
          <div className="flex-1 min-w-0 pt-4 sm:pt-8 space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-14 bg-gold/10 rounded-md" />
              <div className="h-5 w-12 bg-bg-secondary rounded-md" />
              <div className="h-5 w-16 bg-bg-secondary rounded-md" />
              <div className="h-5 w-14 bg-gold/10 rounded-md" />
            </div>
            <div className="h-10 w-3/4 bg-bg-secondary rounded-xl" />
            <div className="h-4 w-full bg-bg-secondary rounded" />
            <div className="h-4 w-5/6 bg-bg-secondary rounded" />
            <div className="h-4 w-2/3 bg-bg-secondary rounded" />
            <div className="flex gap-1.5 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-7 w-16 bg-bg-secondary rounded-full" />
              ))}
            </div>
            <div className="h-9 w-40 bg-gold/10 rounded-xl mt-3" />
          </div>
        </div>
        <div className="mt-6 w-full max-w-4xl aspect-video bg-bg-secondary rounded-2xl" />
      </div>
    </div>
  );
}
