import { countryFlagEmojiFallback, countryFlagSvgUrl } from "@/lib/country-display";

type CountryFlagProps = {
  country: string;
  size?: "card" | "modal" | "sm" | "tile";
  className?: string;
};

const SIZE_CLASS = {
  sm: "h-6 w-9",
  card: "h-11 w-[4.125rem]",
  modal: "h-14 w-[5.25rem]",
  tile: "h-full w-full min-h-[2.5rem]",
} as const;

const IMG_FIT_CLASS = {
  sm: "object-cover",
  card: "object-contain",
  modal: "object-contain",
  tile: "object-contain",
} as const;

export function CountryFlag({
  country,
  size = "card",
  className = "",
}: CountryFlagProps) {
  const src = countryFlagSvgUrl(country);
  const box = SIZE_CLASS[size];
  const layout =
    size === "tile" ? "flex h-full w-full" : "inline-flex";

  if (!src) {
    return (
      <span
        className={`${layout} ${box} items-center justify-center rounded-md border border-white/10 bg-pitch-dark/50 text-2xl leading-none ${className}`}
        aria-hidden
      >
        {countryFlagEmojiFallback(country)}
      </span>
    );
  }

  return (
    <span
      className={`${layout} overflow-hidden rounded-md border border-white/15 bg-neutral-100/95 shadow-sm ${box} ${className} ${
        size === "tile" ? "[&_img]:h-full [&_img]:w-full" : ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={132}
        height={88}
        className={`h-full w-full ${IMG_FIT_CLASS[size]}`}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
