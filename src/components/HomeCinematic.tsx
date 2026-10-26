import { Logo } from "@/components/Logo";

function HudCorner({ className }: { className: string }) {
  return (
    <svg className={className} width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M8 4H4v4M44 4h-4v4M4 44v-4h4M44 44v-4h-4"
        stroke="rgba(244,208,63,0.35)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M8 4h12M40 4H28M8 44h10M40 44H30" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    </svg>
  );
}

export function HomeCinematic() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="home-cinematic-base absolute inset-0" />
        <div className="home-cinematic-spotlight absolute inset-0" />
        <div className="home-pitch-grid-wrap absolute inset-x-0 bottom-0 h-[58%]">
          <div className="home-pitch-grid" />
        </div>
        <div className="home-scanline absolute inset-0" />
        <div className="home-vignette absolute inset-0" />
        <div className="home-grain absolute inset-0" />

        <div className="home-node home-node-1" />
        <div className="home-node home-node-2" />
        <div className="home-node home-node-3" />
        <div className="home-node home-node-4" />
        <div className="home-node home-node-5" />
        <div className="home-node home-node-6" />

        <svg
          className="home-hud-ring absolute left-1/2 top-[38%] h-[min(88vw,22rem)] w-[min(88vw,22rem)] -translate-x-1/2 -translate-y-1/2"
          viewBox="0 0 400 400"
          fill="none"
        >
          <circle cx="200" cy="200" r="168" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <g className="home-ring-spin" style={{ transformOrigin: "200px 200px" }}>
            <circle
              cx="200"
              cy="200"
              r="168"
              stroke="url(#homeArc)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="40 220"
            />
          </g>
          <circle cx="200" cy="200" r="120" stroke="rgba(74,222,128,0.12)" strokeWidth="1" strokeDasharray="2 6" />
          <defs>
            <linearGradient id="homeArc" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#f4d03f" stopOpacity="0" />
              <stop offset="0.5" stopColor="#f4d03f" stopOpacity="0.9" />
              <stop offset="1" stopColor="#4ade80" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <HudCorner className="absolute left-3 top-3 opacity-80 sm:left-5 sm:top-5" />
        <HudCorner className="absolute right-3 top-3 rotate-90 opacity-80 sm:right-5 sm:top-5" />
        <HudCorner className="absolute bottom-[5.5rem] left-3 -rotate-90 opacity-60 sm:bottom-24 sm:left-5" />
        <HudCorner className="absolute bottom-[5.5rem] right-3 rotate-180 opacity-60 sm:bottom-24 sm:right-5" />

        <p
          className="absolute left-5 top-[4.5rem] hidden font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400/50 sm:block"
        >
          griddy.sys / online
        </p>
        <p
          className="absolute right-5 top-[4.5rem] hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/25 sm:block"
        >
          v1.0 · neon
        </p>
      </div>

      <div
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] pt-2 lg:pb-8"
      >
        <div className="home-hero-enter relative w-full max-w-md">
          <div
            className="pointer-events-none absolute -inset-px rounded-[1.35rem] home-card-border opacity-80"
            aria-hidden
          />
          <div
            className="relative overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-[rgba(6,18,12,0.55)] px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl sm:px-9 sm:py-10"
          >
            <div
              className="pointer-events-none absolute -left-20 top-0 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-16 bottom-0 h-28 w-28 rounded-full bg-gold/10 blur-3xl"
              aria-hidden
            />

            <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
              <div className="home-orbit-ring absolute inset-0 rounded-full border border-dashed border-white/10" />
              <div className="home-orbit-dot absolute inset-0">
                <span
                  className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_14px_rgba(244,208,63,0.9)]"
                />
              </div>
              <div className="home-orbit-dot home-orbit-dot-rev absolute inset-2">
                <span
                  className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                />
              </div>
              <div className="relative scale-[1.15]">
                <Logo showText={false} size="md" />
              </div>
            </div>

            <h1 className="text-center">
              <span
                className="block bg-gradient-to-r from-gold via-[#fff7d6] to-emerald-200 bg-clip-text text-[1.65rem] font-extrabold tracking-tight text-transparent sm:text-4xl"
              >
                Griddy Games
              </span>
              <span
                className="mt-1 block text-xl font-semibold tracking-[0.35em] text-white/90 sm:text-2xl"
              >
                CHEATS
              </span>
            </h1>

            <div
              className="mt-5 flex flex-wrap items-center justify-center gap-2"
              aria-hidden
            >
              {["SON 7", "DRAFT", "KARİYER", "HEDEF"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] tracking-widest text-white/45"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="home-pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <p className="font-mono text-xs tracking-wide text-white/55 sm:text-sm">
                Eğlence amaçlıdır
              </p>
            </div>

            <p className="mt-2 text-center text-[10px] uppercase tracking-[0.32em] text-gold/45">
              Cheat Engine
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
