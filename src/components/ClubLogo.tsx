import { clubLogoUrl } from "@/lib/club-logo";

type ClubLogoProps = {
  team: string;
  size?: "card" | "modal" | "sm" | "tile";
  className?: string;
};

const SIZE_CLASS = {
  sm: "h-6 w-6",
  card: "h-11 w-11",
  modal: "h-14 w-14",
  tile: "h-full w-full min-h-[2.5rem]",
} as const;

function ClubMonogram({ team, className }: { team: string; className: string }) {
  const letter = team.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      className={`flex items-center justify-center rounded-md border border-white/15 bg-white/10 text-sm font-bold text-white/80 ${className}`}
      aria-hidden
    >
      {letter}
    </span>
  );
}

export function ClubLogo({ team, size = "card", className = "" }: ClubLogoProps) {
  const src = clubLogoUrl(team);
  const box = SIZE_CLASS[size];
  const layout =
    size === "tile" ? "flex h-full w-full" : "inline-flex";

  if (!src) {
    return (
      <ClubMonogram
        team={team}
        className={`${layout} ${box} ${className}`}
      />
    );
  }

  return (
    <span
      className={`${layout} ${box} ${className} ${
        size === "tile" ? "[&_img]:h-full [&_img]:w-full" : ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={128}
        height={128}
        className="h-full w-full object-contain p-[6%] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
