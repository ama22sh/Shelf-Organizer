/**
 * Decorative cozy reading room rendered behind the gameplay.
 * Pure SVG/CSS — no images. Designed to read as warm, dim ambience
 * without competing visually with the bookshelves.
 */
export function CozyRoom() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Wall + floor wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 38%, hsl(32 55% 22% / 0.55), transparent 70%), linear-gradient(180deg, hsl(22 35% 9%) 0%, hsl(22 35% 9%) 62%, hsl(20 30% 7%) 62.1%, hsl(20 30% 6%) 100%)",
        }}
      />
      {/* Floor line */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "62%",
          height: 2,
          background:
            "linear-gradient(90deg, transparent, hsl(30 35% 18%) 25%, hsl(30 35% 22%) 50%, hsl(30 35% 18%) 75%, transparent)",
          opacity: 0.7,
        }}
      />

      {/* Window centered on back wall — soft warm light through panes */}
      <svg
        className="absolute"
        style={{ left: "50%", top: "6%", transform: "translateX(-50%)" }}
        width="360"
        height="240"
        viewBox="0 0 360 240"
      >
        <defs>
          <radialGradient id="windowGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="hsl(38 85% 65%)" stopOpacity="0.55" />
            <stop offset="60%" stopColor="hsl(28 70% 40%)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(28 70% 40%)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="curtain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(15 35% 22%)" />
            <stop offset="100%" stopColor="hsl(12 40% 12%)" />
          </linearGradient>
        </defs>
        {/* Outer halo bleed */}
        <ellipse cx="180" cy="120" rx="260" ry="170" fill="url(#windowGlow)" />
        {/* Window frame */}
        <rect
          x="60"
          y="20"
          width="240"
          height="200"
          rx="6"
          fill="hsl(25 30% 14%)"
          stroke="hsl(30 35% 22%)"
          strokeWidth="3"
        />
        {/* Inner light panes */}
        <rect
          x="72"
          y="32"
          width="100"
          height="92"
          fill="hsl(40 80% 55% / 0.28)"
        />
        <rect
          x="188"
          y="32"
          width="100"
          height="92"
          fill="hsl(40 80% 55% / 0.28)"
        />
        <rect
          x="72"
          y="140"
          width="100"
          height="68"
          fill="hsl(40 80% 55% / 0.22)"
        />
        <rect
          x="188"
          y="140"
          width="100"
          height="68"
          fill="hsl(40 80% 55% / 0.22)"
        />
        {/* Mullions */}
        <rect x="178" y="20" width="4" height="200" fill="hsl(28 30% 18%)" />
        <rect x="60" y="128" width="240" height="4" fill="hsl(28 30% 18%)" />
        {/* Window sill */}
        <rect
          x="50"
          y="218"
          width="260"
          height="10"
          rx="2"
          fill="hsl(28 35% 20%)"
        />
        {/* Curtains */}
        <path
          d="M 0 0 Q 30 60 25 220 L 60 220 L 60 0 Z"
          fill="url(#curtain)"
          opacity="0.95"
        />
        <path
          d="M 360 0 Q 330 60 335 220 L 300 220 L 300 0 Z"
          fill="url(#curtain)"
          opacity="0.95"
        />
        {/* Curtain folds */}
        <path
          d="M 18 10 Q 14 110 22 220"
          stroke="hsl(15 30% 9%)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 38 10 Q 34 110 42 220"
          stroke="hsl(15 30% 9%)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M 322 10 Q 326 110 318 220"
          stroke="hsl(15 30% 9%)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M 342 10 Q 346 110 338 220"
          stroke="hsl(15 30% 9%)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* Floor lamp on left — warm halo with subtle flicker */}
      <div
        className="absolute lamp-flicker"
        style={{
          left: "3%",
          top: "20%",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, hsl(38 90% 60% / 0.35), hsl(28 60% 35% / 0.12) 55%, transparent 70%)",
        }}
      />
      <svg
        className="absolute"
        style={{ left: "5%", top: "16%" }}
        width="120"
        height="380"
        viewBox="0 0 120 380"
      >
        {/* Lamp shade */}
        <path
          d="M 20 20 L 100 20 L 90 90 L 30 90 Z"
          fill="hsl(35 65% 35%)"
          stroke="hsl(35 50% 22%)"
          strokeWidth="1.5"
        />
        <path
          d="M 22 22 L 98 22 L 92 28 L 28 28 Z"
          fill="hsl(40 75% 55% / 0.55)"
        />
        {/* Pole */}
        <rect x="58" y="90" width="4" height="240" fill="hsl(28 25% 18%)" />
        {/* Base */}
        <ellipse cx="60" cy="338" rx="34" ry="6" fill="hsl(25 30% 14%)" />
        <ellipse cx="60" cy="332" rx="32" ry="6" fill="hsl(28 35% 20%)" />
      </svg>

      {/* Indoor plant — bottom left corner */}
      <svg
        className="absolute"
        style={{ left: "2%", bottom: "0%" }}
        width="180"
        height="220"
        viewBox="0 0 180 220"
      >
        <defs>
          <linearGradient id="leaf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(95 35% 32%)" />
            <stop offset="100%" stopColor="hsl(110 40% 18%)" />
          </linearGradient>
          <linearGradient id="pot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(20 45% 30%)" />
            <stop offset="100%" stopColor="hsl(15 50% 18%)" />
          </linearGradient>
        </defs>
        {/* Leaves — cluster of curved blades */}
        <path d="M 90 130 Q 40 60 30 20" stroke="url(#leaf)" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M 90 130 Q 60 50 65 10" stroke="url(#leaf)" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M 90 130 Q 90 50 90 5" stroke="url(#leaf)" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M 90 130 Q 120 50 125 10" stroke="url(#leaf)" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M 90 130 Q 140 60 150 25" stroke="url(#leaf)" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M 90 130 Q 30 100 10 90" stroke="url(#leaf)" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.85" />
        <path d="M 90 130 Q 150 100 170 90" stroke="url(#leaf)" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.85" />
        {/* Pot */}
        <path
          d="M 50 140 L 130 140 L 122 210 L 58 210 Z"
          fill="url(#pot)"
          stroke="hsl(15 35% 12%)"
          strokeWidth="1.5"
        />
        <ellipse cx="90" cy="140" rx="40" ry="6" fill="hsl(20 30% 14%)" />
      </svg>

      {/* Side table + cup — bottom right */}
      <svg
        className="absolute"
        style={{ right: "3%", bottom: "0%" }}
        width="220"
        height="200"
        viewBox="0 0 220 200"
      >
        <defs>
          <linearGradient id="table" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(25 45% 28%)" />
            <stop offset="100%" stopColor="hsl(20 45% 16%)" />
          </linearGradient>
        </defs>
        {/* Table top */}
        <ellipse cx="110" cy="78" rx="100" ry="14" fill="url(#table)" />
        <ellipse cx="110" cy="74" rx="100" ry="12" fill="hsl(28 50% 32%)" />
        {/* Legs */}
        <rect x="32" y="80" width="6" height="110" fill="hsl(20 40% 18%)" />
        <rect x="182" y="80" width="6" height="110" fill="hsl(20 40% 18%)" />
        <rect x="105" y="86" width="6" height="104" fill="hsl(20 40% 14%)" opacity="0.7" />
        {/* Teacup */}
        <ellipse cx="80" cy="64" rx="18" ry="6" fill="hsl(35 25% 80% / 0.75)" />
        <path d="M 62 64 Q 64 84 80 84 Q 96 84 98 64 Z" fill="hsl(35 25% 78% / 0.85)" />
        <path d="M 96 68 Q 108 70 106 78 Q 104 84 96 80" fill="none" stroke="hsl(35 20% 70%)" strokeWidth="1.5" />
        {/* Steam */}
        <path
          className="steam"
          d="M 76 56 Q 72 48 78 40 Q 84 32 80 22"
          fill="none"
          stroke="hsl(35 30% 80% / 0.45)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          className="steam steam-2"
          d="M 86 56 Q 90 48 84 40 Q 78 32 82 22"
          fill="none"
          stroke="hsl(35 30% 80% / 0.35)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Stack of small books on table */}
        <rect x="130" y="58" width="50" height="6" fill="hsl(8 55% 35%)" />
        <rect x="132" y="52" width="46" height="6" fill="hsl(200 40% 30%)" />
        <rect x="135" y="46" width="42" height="6" fill="hsl(40 50% 35%)" />
      </svg>

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 75% at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%)",
        }}
      />
    </div>
  );
}
