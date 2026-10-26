type LogoProps = {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md";
};

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const icon = size === "sm" ? 36 : 44;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0 drop-shadow-md"
      >
        <circle cx="32" cy="32" r="30" fill="#1a4d2e" stroke="#f4d03f" strokeWidth="2.5" />
        <circle cx="32" cy="32" r="22" fill="#2d6a4f" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <path
          d="M32 14 L38 22 L32 28 L26 22 Z M32 36 L38 44 L32 50 L26 44 Z M18 32 L26 26 L26 38 Z M46 32 L38 26 L38 38 Z"
          fill="rgba(255,255,255,0.35)"
        />
        <text
          x="32"
          y="37"
          textAnchor="middle"
          fill="#f4d03f"
          fontSize="18"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
        >
          G
        </text>
      </svg>
      {showText && (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-bold tracking-wide text-gold sm:text-base">
            Griddy Games
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-pitch-line/75 sm:text-xs">
            Cheat Engine
          </span>
        </span>
      )}
    </span>
  );
}
