function LoaderBlock({ className }) {
  return <div className={`loading-shimmer rounded-2xl ${className}`} aria-hidden="true" />;
}

export function CardGridLoader({ count = 3, variant = "package", columnsClassName = "" }) {
  return (
    <div className={columnsClassName} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <article key={`${variant}-${index}`} className="glass-panel overflow-hidden p-6">
          {variant === "car" ? (
            <>
              <LoaderBlock className="h-56 w-full rounded-[24px]" />
              <div className="space-y-4 pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <LoaderBlock className="h-3 w-20" />
                    <LoaderBlock className="h-9 w-40" />
                  </div>
                  <LoaderBlock className="h-10 w-24 rounded-full" />
                </div>
                <LoaderBlock className="h-4 w-full" />
                <LoaderBlock className="h-4 w-5/6" />
                <div className="flex gap-3">
                  <LoaderBlock className="h-10 flex-1 rounded-full" />
                  <LoaderBlock className="h-10 flex-1 rounded-full" />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-5">
              <LoaderBlock className="h-48 w-full rounded-[24px]" />
              <LoaderBlock className="h-3 w-24" />
              <LoaderBlock className="h-10 w-3/4" />
              <LoaderBlock className="h-4 w-full" />
              <LoaderBlock className="h-4 w-11/12" />
              <div className="grid gap-3">
                <LoaderBlock className="h-12 w-full" />
                <LoaderBlock className="h-12 w-full" />
                <LoaderBlock className="h-12 w-full" />
              </div>
              <div className="flex gap-3">
                <LoaderBlock className="h-10 flex-1 rounded-full" />
                <LoaderBlock className="h-10 flex-1 rounded-full" />
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

export function InlineFieldLoader({ label }) {
  return (
    <div className="rounded-2xl border border-dune/20 bg-dune/5 px-4 py-3 text-sm text-stone-600" aria-live="polite">
      {label}
    </div>
  );
}