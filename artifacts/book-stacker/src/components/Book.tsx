import { useMemo } from "react";
import type { BookData } from "@/game/types";
import { Feather, Anchor } from "lucide-react";

const COLOR_MAP: Record<string, { main: string; dark: string; light: string }> = {
  "bg-amber-700":   { main: "hsl(35 65% 38%)", dark: "hsl(30 65% 25%)", light: "hsl(38 70% 52%)" },
  "bg-amber-800":   { main: "hsl(30 65% 32%)", dark: "hsl(25 65% 20%)", light: "hsl(33 70% 46%)" },
  "bg-amber-900":   { main: "hsl(25 65% 25%)", dark: "hsl(22 65% 15%)", light: "hsl(28 70% 38%)" },
  "bg-red-800":     { main: "hsl(0 55% 32%)",  dark: "hsl(0 55% 20%)",  light: "hsl(5 60% 44%)"  },
  "bg-red-900":     { main: "hsl(0 55% 25%)",  dark: "hsl(0 55% 14%)",  light: "hsl(5 60% 36%)"  },
  "bg-emerald-800": { main: "hsl(150 35% 25%)", dark: "hsl(150 38% 16%)", light: "hsl(150 35% 36%)" },
  "bg-emerald-900": { main: "hsl(150 38% 18%)", dark: "hsl(150 40% 10%)", light: "hsl(150 35% 28%)" },
  "bg-blue-800":    { main: "hsl(215 45% 30%)", dark: "hsl(215 45% 20%)", light: "hsl(215 45% 42%)" },
  "bg-blue-900":    { main: "hsl(215 45% 22%)", dark: "hsl(215 45% 14%)", light: "hsl(215 45% 34%)" },
  "bg-stone-600":   { main: "hsl(30 8% 38%)",  dark: "hsl(30 8% 26%)",  light: "hsl(30 10% 50%)"  },
  "bg-stone-700":   { main: "hsl(30 10% 28%)", dark: "hsl(30 10% 18%)", light: "hsl(30 10% 40%)"  },
  "bg-stone-800":   { main: "hsl(30 10% 20%)", dark: "hsl(30 10% 12%)", light: "hsl(30 10% 32%)"  },
  "bg-stone-900":   { main: "hsl(30 10% 14%)", dark: "hsl(30 10% 8%)",  light: "hsl(30 10% 26%)"  },
};

function hashTilt(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  // -1.5 .. 1.5 deg
  return (((h % 100) / 100) - 0.5) * 3;
}

type Props = {
  book: BookData;
  rotated?: boolean;
  cellSize: number;
  selected?: boolean;
  ghost?: boolean;
  invalid?: boolean;
  tilt?: boolean;
  justPlaced?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
};

export function Book({
  book,
  rotated = false,
  cellSize,
  selected,
  ghost,
  invalid,
  tilt = false,
  justPlaced = false,
  onPointerDown,
  onClick,
  className = "",
  style,
}: Props) {
  const w = (rotated ? book.height : book.width) * cellSize;
  const h = (rotated ? book.width : book.height) * cellSize;
  const colors = COLOR_MAP[book.color] ?? {
    main: "hsl(20 30% 30%)",
    dark: "hsl(20 30% 18%)",
    light: "hsl(20 30% 42%)",
  };
  const isHorizontal = w > h;

  const patternClass =
    book.pattern && book.pattern !== "none" ? `pattern-${book.pattern}` : "";

  const tiltDeg = useMemo(() => (tilt ? hashTilt(book.id) : 0), [tilt, book.id]);

  // For horizontal books that are wider, draw multiple "stacked book" segments
  // along the long axis to suggest a small pile rather than a single block.
  const longAxisCells = isHorizontal ? w / cellSize : h / cellSize;
  const stackSegments = Math.max(1, Math.round(longAxisCells));

  return (
    <div
      onPointerDown={onPointerDown}
      onClick={onClick}
      data-testid={`book-${book.id}`}
      className={`relative book-spine select-none ${patternClass} ${
        selected ? "ring-4 ring-amber-300 ring-offset-2 ring-offset-transparent z-30 book-glow" : ""
      } ${ghost ? "opacity-70 pointer-events-none" : ""} ${
        invalid ? "ring-4 ring-red-500" : ""
      } ${justPlaced ? "book-pop" : ""} ${
        onPointerDown || onClick ? "cursor-grab active:cursor-grabbing" : ""
      } ${className}`}
      style={{
        width: w,
        height: h,
        background: `linear-gradient(${
          isHorizontal ? "180deg" : "90deg"
        }, ${colors.light} 0%, ${colors.main} 35%, ${colors.main} 65%, ${colors.dark} 100%)`,
        borderRadius: 4,
        transform: `rotate(${tiltDeg}deg)`,
        transformOrigin: "bottom center",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        ...style,
      }}
    >
      {/* Stacked-book segment dividers */}
      {stackSegments > 1 && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isHorizontal
              ? `repeating-linear-gradient(90deg,
                  transparent 0,
                  transparent ${(w / stackSegments) - 2}px,
                  rgba(0,0,0,0.35) ${(w / stackSegments) - 2}px,
                  rgba(0,0,0,0.35) ${w / stackSegments}px,
                  rgba(255,255,255,0.10) ${w / stackSegments}px,
                  rgba(255,255,255,0.10) ${(w / stackSegments) + 1}px)`
              : `repeating-linear-gradient(0deg,
                  transparent 0,
                  transparent ${(h / stackSegments) - 2}px,
                  rgba(0,0,0,0.35) ${(h / stackSegments) - 2}px,
                  rgba(0,0,0,0.35) ${h / stackSegments}px,
                  rgba(255,255,255,0.10) ${h / stackSegments}px,
                  rgba(255,255,255,0.10) ${(h / stackSegments) + 1}px)`,
          }}
        />
      )}

      {/* Gold edge bands — like gilded book caps */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          borderRadius: "inherit",
          ...(isHorizontal
            ? {
                borderLeft: "2px solid hsl(38 75% 55% / 0.55)",
                borderRight: "2px solid hsl(38 75% 55% / 0.55)",
              }
            : {
                borderTop: "2px solid hsl(38 75% 55% / 0.55)",
                borderBottom: "2px solid hsl(38 75% 55% / 0.55)",
              }),
        }}
      />

      {/* Inner highlight stripe — adds dimension to the spine */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          ...(isHorizontal
            ? { left: 0, right: 0, top: "12%", height: 2 }
            : { top: 0, bottom: 0, left: "12%", width: 2 }),
          background: "rgba(255,255,255,0.18)",
          borderRadius: 2,
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          ...(isHorizontal
            ? { left: 0, right: 0, bottom: "12%", height: 2 }
            : { top: 0, bottom: 0, right: "12%", width: 2 }),
          background: "rgba(0,0,0,0.30)",
          borderRadius: 2,
        }}
      />

      {/* Title */}
      <div
        className="absolute inset-0 flex items-center justify-center font-serif text-white/95 px-1 overflow-hidden"
        style={{
          writingMode: isHorizontal ? "horizontal-tb" : "vertical-rl",
          transform: isHorizontal ? "none" : "rotate(180deg)",
          fontSize: Math.max(9, Math.min(cellSize * 0.30, 14)),
          textShadow: "0 1px 2px rgba(0,0,0,.7)",
          letterSpacing: "0.03em",
        }}
      >
        <span className="truncate text-center" style={{ maxWidth: "92%" }}>
          {book.title}
        </span>
      </div>

      {/* Trait badges */}
      {(book.fragile || book.heavy) && (
        <div className="absolute top-0.5 right-0.5 flex gap-0.5 z-10">
          {book.fragile && (
            <span
              className="rounded-full bg-amber-300/95 text-amber-900 p-0.5 shadow"
              title="Fragile — bottom row only"
            >
              <Feather className="w-2.5 h-2.5" strokeWidth={2.5} />
            </span>
          )}
          {book.heavy && (
            <span
              className="rounded-full bg-stone-200/95 text-stone-800 p-0.5 shadow"
              title="Heavy — cannot rest on fragile"
            >
              <Anchor className="w-2.5 h-2.5" strokeWidth={2.5} />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
