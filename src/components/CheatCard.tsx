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
      className="group w-full text-left transition active:scale-[0.97]"
    >
      <article
        className="overflow-hidden rounded-lg border border-white/[0.08] bg-pitch-dark/50 shadow-sm transition group-hover:border-gold/35 group-hover:shadow-[0_0_24px_rgba(244,208,63,0.14)]"
      >
        <CheatOrbitCover flagSrc={flagSrc} leagueLogoUrl={leagueLogoUrl} />
        <h3
          className="break-words px-1.5 py-2 text-[10px] font-medium leading-snug text-pitch-line/90 sm:text-xs"
        >
          {cheat.title}
        </h3>
      </article>
    </button>
  );
}
