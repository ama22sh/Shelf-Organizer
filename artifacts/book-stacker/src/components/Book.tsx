import type { BookData } from "@/game/types";
import { Feather, Anchor } from "lucide-react";

const COLOR_MAP: Record<string, string> = {
  "bg-amber-700": "hsl(35 65% 38%)",
  "bg-amber-800": "hsl(30 65% 32%)",
  "bg-amber-900": "hsl(25 65% 25%)",
  "bg-red-800": "hsl(0 55% 32%)",
  "bg-red-900": "hsl(0 55% 25%)",
  "bg-emerald-800": "hsl(150 35% 25%)",
  "bg-emerald-900": "hsl(150 38% 18%)",
  "bg-blue-800": "hsl(215 45% 30%)",
  "bg-blue-900": "hsl(215 45% 22%)",
  "bg-stone-600": "hsl(30 8% 38%)",
  "bg-stone-700": "hsl(30 10% 28%)",
  "bg-stone-800": "hsl(30 10% 20%)",
  "bg-stone-900": "hsl(30 10% 14%)",
};

type Props = {
  book: BookData;
  rotated?: boolean;
  cellSize: number;
  selected?: boolean;
  ghost?: boolean;
  invalid?: boolean;
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
  onPointerDown,
  onClick,
  className = "",
  style,
}: Props) {
  const w = (rotated ? book.height : book.width) * cellSize;
  const h = (rotated ? book.width : book.height) * cellSize;
  const bg = COLOR_MAP[book.color] ?? "hsl(20 30% 30%)";
  const isHorizontal = w > h;

  const patternClass =
    book.pattern && book.pattern !== "none" ? `pattern-${book.pattern}` : "";

  return (
    <div
      onPointerDown={onPointerDown}
      onClick={onClick}
      data-testid={`book-${book.id}`}
      className={`relative book-spine book-spine-gold-edge select-none transition-all duration-150 ${patternClass} ${
        selected ? "ring-4 ring-amber-400 ring-offset-2 ring-offset-transparent z-30" : ""
      } ${ghost ? "opacity-60 pointer-events-none" : ""} ${
        invalid ? "ring-4 ring-red-500" : ""
      } ${onPointerDown || onClick ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
      style={{
        width: w,
        height: h,
        background: `linear-gradient(180deg, ${bg}, color-mix(in srgb, ${bg} 80%, black))`,
        borderRadius: 3,
        ...style,
      }}
    >
      {/* Title */}
      <div
        className="absolute inset-0 flex items-center justify-center font-serif text-white/90 px-1 overflow-hidden"
        style={{
          writingMode: isHorizontal ? "horizontal-tb" : "vertical-rl",
          transform: isHorizontal ? "none" : "rotate(180deg)",
          fontSize: Math.max(9, Math.min(cellSize * 0.32, 14)),
          textShadow: "0 1px 2px rgba(0,0,0,.6)",
          letterSpacing: "0.02em",
        }}
      >
        <span className="truncate text-center" style={{ maxWidth: "95%" }}>
          {book.title}
        </span>
      </div>

      {/* Trait badges */}
      {(book.fragile || book.heavy || book.rotatable) && (
        <div className="absolute top-0.5 right-0.5 flex gap-0.5 z-10">
          {book.fragile && (
            <span
              className="rounded-full bg-amber-300/90 text-amber-900 p-0.5"
              title="Fragile"
            >
              <Feather className="w-2.5 h-2.5" strokeWidth={2.5} />
            </span>
          )}
          {book.heavy && (
            <span
              className="rounded-full bg-stone-200/90 text-stone-800 p-0.5"
              title="Heavy"
            >
              <Anchor className="w-2.5 h-2.5" strokeWidth={2.5} />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
