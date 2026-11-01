type PlaceholderVariant = "flag" | "league";

function CoverPlaceholder({
  variant,
  compact,
}: {
  variant: PlaceholderVariant;
  compact?: boolean;
}) {
  const isLeague = variant === "league";
  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-0.5 bg-gradient-to-b from-neutral-50 to-neutral-100">
      <div
        className={`flex items-center justify-center rounded-md border border-dashed border-neutral-300/90 bg-white/80 text-neutral-400 shadow-sm ${
          compact ? "h-7 w-7" : "h-[42%] max-h-10 w-[42%] max-w-10"
        }`}
      >
        <svg
          className="h-1/2 w-1/2"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M8 12h8M12 8v8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
      <span
        className={`font-mono uppercase tracking-wider text-neutral-400 ${
          compact ? "text-[7px]" : "text-[8px]"
        }`}
      >
        {isLeague ? "lig" : "ülke"}
      </span>
    </div>
  );
}

function CoverLeagueCell({
  src,
  compact,
  animateImages,
}: {
  src: string | null;
  compact?: boolean;
  animateImages?: boolean;
}) {
  if (!src) {
    return (
      <div className="h-full min-h-0 border-r border-neutral-200/80">
        <CoverPlaceholder variant="league" compact={compact} />
      </div>
    );
  }
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center border-r border-neutral-200/80 bg-gradient-to-b from-white to-neutral-50 p-[10%]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={`max-h-full max-w-full object-contain ${animateImages ? "cheat-orbit-cell-img" : ""}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function CoverFlagCell({
  src,
  compact,
  animateImages,
}: {
  src: string | null;
  compact?: boolean;
  animateImages?: boolean;
}) {
  if (!src) {
    return <CoverPlaceholder variant="flag" compact={compact} />;
  }
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center bg-gradient-to-b from-white to-neutral-50 p-[10%]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={`max-h-full max-w-full object-contain ${animateImages ? "cheat-orbit-cell-img" : ""}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export type CheatTwinCoverProps = {
  leagueLogoUrl?: string | null;
  flagSrc?: string | null;
  className?: string;
  compact?: boolean;
  animateImages?: boolean;
};

/** Lig | milliyet ikili kapak (kart, modal) */
export function CheatTwinCover({
  leagueLogoUrl = null,
  flagSrc = null,
  className = "",
  compact = false,
  animateImages = false,
}: CheatTwinCoverProps) {
  return (
    <div
      className={`grid min-h-0 grid-cols-2 overflow-hidden bg-white ring-1 ring-black/5 ${className}`}
    >
      <CoverLeagueCell
        src={leagueLogoUrl}
        compact={compact}
        animateImages={animateImages}
      />
      <CoverFlagCell src={flagSrc} compact={compact} animateImages={animateImages} />
    </div>
  );
}
