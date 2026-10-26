/** Tüm kartlarda ortak animasyonlu orbit kapak */
export function CheatOrbitCover() {
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

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="cheat-orbit-core relative flex h-[38%] w-[38%] items-center justify-center rounded-full border border-gold/30 bg-[rgba(6,24,16,0.85)] shadow-[inset_0_0_20px_rgba(74,222,128,0.12)]">
          <svg className="h-[55%] w-[55%]" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="18" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
            <path
              d="M24 10 L28 18 L24 22 L20 18 Z M24 26 L28 34 L24 38 L20 34 Z M12 24 L18 20 L18 28 Z M36 24 L30 20 L30 28 Z"
              fill="rgba(244,208,63,0.35)"
            />
            <circle cx="24" cy="24" r="3" fill="rgba(244,208,63,0.9)" className="cheat-orbit-pulse" />
          </svg>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent"
      />
    </div>
  );
}
