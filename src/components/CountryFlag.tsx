import { countryFlagEmojiFallback, countryFlagSvgUrl } from "@/lib/country-display";

type CountryFlagProps = {
  country: string;
  size?: "card" | "modal" | "sm";
  className?: string;
};

const SIZE_CLASS = {
  sm: "h-6 w-9",
  card: "h-11 w-[4.125rem]",
  modal: "h-14 w-[5.25rem]",
} as const;

export function CountryFlag({
  country,
  size = "card",
  className = "",
}: CountryFlagProps) {
  const src = countryFlagSvgUrl(country);
  const box = SIZE_CLASS[size];

  if (!src) {
    return (
      <span
        className={`inline-flex ${box} items-center justify-center rounded-md border border-white/10 bg-pitch-dark/50 text-2xl leading-none ${className}`}
        aria-hidden
      >
        {countryFlagEmojiFallback(country)}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex overflow-hidden rounded-md border border-white/15 bg-pitch-dark/30 shadow-sm ${box} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={132}
        height={88}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
