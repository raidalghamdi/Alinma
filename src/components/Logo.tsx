export function Logo({ size = 28, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-label="Data & Intelligence Portfolio"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B84D7" />
            <stop offset="100%" stopColor="#FFA38B" />
          </linearGradient>
        </defs>
        {/* Outer hexagon — governance */}
        <path
          d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z"
          stroke="url(#lg)"
          strokeWidth="2"
          fill="none"
        />
        {/* Inner stacked bars — data layers */}
        <rect x="13" y="22" width="3.5" height="8"  rx="1" fill="#8B84D7" />
        <rect x="18.25" y="17" width="3.5" height="13" rx="1" fill="#CFCCEF" />
        <rect x="23.5"  y="12" width="3.5" height="18" rx="1" fill="#FFA38B" />
        {/* Spark dot — intelligence */}
        <circle cx="25.25" cy="10" r="2" fill="#8B84D7" />
      </svg>
      {withWordmark && (
        <div className="leading-tight">
          <div className="font-display font-bold text-[15px] tracking-tight">
            D&amp;I Portfolio
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-current/60">
            Performance Portal
          </div>
        </div>
      )}
    </div>
  );
}
