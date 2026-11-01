/** Tüm kartlarda ortak animasyonlu orbit kapak — her zaman lig | bayrak (2 hücre) */
type Props = {
  flagSrc?: string | null;
  leagueLogoUrl?: string | null;
};

function CoverPlaceholder({ variant }: { variant: "flag" | "league" }) {
  const isLeague = variant === "league";
  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-1 bg-neutral-100">
      <div
        className={`flex h-[42%] max-h-10 w-[42%] max-w-10 items-center justify-center rounded-md border border-dashed border-neutral-300 text-neutral-400`}
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
      <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400">
        {isLeague ? "lig" : "ülke"}
      </span>
    </div>
  );
}

function CoverFlagCell({ src }: { src: string | null }) {
  if (!src) {
    return <CoverPlaceholder variant="flag" />;
  }
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center bg-white p-[10%]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="max-h-full max-w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function CoverLeagueCell({ src }: { src: string | null }) {
  if (!src) {
    return (
      <div className="h-full min-h-0 border-r border-neutral-200">
        <CoverPlaceholder variant="league" />
      </div>
    );
  }
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center border-r border-neutral-200 bg-white p-[10%]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="max-h-full max-w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export function CheatOrbitCover({ flagSrc = null, leagueLogoUrl = null }: Props) {
  return (
    <div
      className="cheat-orbit-cover group/cover relative aspect-square w-full overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a2218] via-[#061410] to-[#020806]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 40%, rgba(74,222,128,0.15), transparent 55%)",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="10"
          stroke="rgba(244,208,63,0.2)"
          strokeWidth="0.8"
        />
        <circle cx="50" cy="50" r="34" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
      </svg>

      <div className="cheat-orbit-spin-slow absolute inset-[12%] rounded-full border border-white/[0.07]" />
      <div
        className="cheat-orbit-spin-mid absolute inset-[20%] rounded-full border border-dashed border-emerald-400/20"
      >
        <span
          className="absolute left-1/2 top-0 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]"
        />
      </div>
      <div className="cheat-orbit-spin-fast absolute inset-[28%] rounded-full border border-gold/25">
        <span
          className="absolute bottom-0 left-1/2 h-[5px] w-[5px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gold shadow-[0_0_10px_rgba(244,208,63,0.85)]"
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-[16%]">
        <div className="cheat-orbit-core grid h-full w-full min-h-0 grid-cols-2 overflow-hidden rounded-lg border border-gold/35 bg-white shadow-[0_0_20px_rgba(0,0,0,0.35)]">
          <CoverLeagueCell src={leagueLogoUrl} />
          <CoverFlagCell src={flagSrc} />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent"
      />
    </div>
  );
}
