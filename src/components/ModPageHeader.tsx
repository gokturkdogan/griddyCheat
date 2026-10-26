type ModPageHeaderProps = {
  modLabel: string;
  title: string;
  count?: number;
};

export function ModPageHeader({ modLabel, title, count }: ModPageHeaderProps) {
  return (
    <header className="mod-page-header relative mb-4 overflow-hidden rounded-xl border border-white/[0.08] px-4 py-3 sm:px-5 sm:py-3.5">
      <div
        className="pointer-events-none absolute inset-0 bg-[rgba(6,18,12,0.65)] backdrop-blur-md"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent"
        aria-hidden
      />
      <div className="relative flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-emerald-400/70">
            {modLabel}
          </p>
          <h1
            className="truncate text-lg font-bold leading-tight sm:text-xl"
          >
            <span className="bg-gradient-to-r from-gold via-[#fff6d8] to-emerald-200/90 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
        </div>
        {count !== undefined && (
          <span
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-wide text-white/45"
          >
            {count} kayıt
          </span>
        )}
      </div>
    </header>
  );
}
