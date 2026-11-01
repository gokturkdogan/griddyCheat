import { CheatOrbitCover } from "@/components/CheatOrbitCover";
import {
  cheatTitleFlagCode,
  cheatTitleFlagImageUrl,
} from "@/lib/cheat-title-flag";
import { cheatTitleLeagueLogoUrl } from "@/lib/cheat-title-league";
import type { Cheat } from "@/lib/types";

type Props = {
  cheat: Cheat;
  onOpen: () => void;
};

export function CheatCard({ cheat, onOpen }: Props) {
  const flagSrc = cheatTitleFlagImageUrl(cheatTitleFlagCode(cheat.title));
  const leagueLogoUrl = cheatTitleLeagueLogoUrl(cheat.title);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group cheat-card w-full text-left outline-none transition-[transform,filter] duration-300 active:scale-[0.96] focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch-dark"
    >
      <article className="cheat-card-shell relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[linear-gradient(165deg,rgba(12,32,22,0.92)_0%,rgba(4,14,10,0.98)_100%)] shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-gold/40 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_32px_rgba(244,208,63,0.12)]">
        <span
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
        <CheatOrbitCover flagSrc={flagSrc} leagueLogoUrl={leagueLogoUrl} />
        <div className="relative border-t border-white/[0.06] px-2.5 py-2.5 sm:px-3 sm:py-3">
          <h3 className="line-clamp-3 break-words text-[10px] font-semibold leading-snug tracking-tight text-pitch-line/85 transition-colors duration-300 group-hover:text-white sm:text-xs">
            {cheat.title}
          </h3>
        </div>
      </article>
    </button>
  );
}
