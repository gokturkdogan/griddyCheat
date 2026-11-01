/** Tüm kartlarda ortak animasyonlu orbit kapak — her zaman lig | bayrak (2 hücre) */
import { CheatTwinCover } from "@/components/CheatTwinCover";

type Props = {
  flagSrc?: string | null;
  leagueLogoUrl?: string | null;
};

export function CheatOrbitCover({ flagSrc = null, leagueLogoUrl = null }: Props) {
  return (
    <div
      className="cheat-orbit-cover relative aspect-square w-full overflow-hidden"
      aria-hidden
    >
      <div className="cheat-orbit-mesh absolute inset-0" />
      <div className="cheat-orbit-aurora absolute inset-0 opacity-70" />
      <div className="cheat-orbit-grid absolute inset-0 opacity-[0.35]" />

      <div className="cheat-orbit-spin-slow cheat-orbit-ring-glow absolute inset-[10%] rounded-full border border-white/[0.08]" />
      <div className="cheat-orbit-spin-mid cheat-orbit-ring-glow absolute inset-[18%] rounded-full border border-dashed border-emerald-400/25">
        <span className="cheat-orbit-satellite cheat-orbit-satellite-emerald absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.95)]" />
        <span className="cheat-orbit-satellite cheat-orbit-satellite-delay absolute bottom-[12%] right-[8%] h-1 w-1 rounded-full bg-white/50 shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
      </div>
      <div className="cheat-orbit-spin-fast cheat-orbit-ring-gold absolute inset-[26%] rounded-full border border-gold/30">
        <span className="cheat-orbit-satellite absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-gold shadow-[0_0_12px_rgba(244,208,63,0.9)]" />
      </div>

      <div className="cheat-orbit-shimmer pointer-events-none absolute inset-0" />

      <div className="absolute inset-0 flex items-center justify-center p-[13%]">
        <div className="cheat-orbit-core-wrap h-full w-full">
          <CheatTwinCover
            leagueLogoUrl={leagueLogoUrl}
            flagSrc={flagSrc}
            animateImages
            className="cheat-orbit-core h-full w-full rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/[0.06] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
    </div>
  );
}
