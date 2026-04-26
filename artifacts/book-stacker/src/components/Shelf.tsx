import { useState } from "react";
import type { BookData, PlacedBook, ShelfData } from "@/game/types";
import { canPlace, getBookDims, isCellBlocked } from "@/game/gameLogic";
import { Book } from "./Book";

type Props = {
  shelf: ShelfData;
  placed: PlacedBook[];
  cellSize: number;
  heldBook: BookData | null;
  heldRotated: boolean;
  onPlace: (shelfId: string, x: number, y: number) => void;
  onPickUp: (bookId: string) => void;
};

export function Shelf({
  shelf,
  placed,
  cellSize,
  heldBook,
  heldRotated,
  onPlace,
  onPickUp,
}: Props) {
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  const onShelf = placed.filter((p) => p.shelfId === shelf.id);
  const woodTrim = 10;

  const hoverValid =
    hover && heldBook
      ? canPlace(shelf, placed, heldBook, heldRotated, hover.x, hover.y)
      : false;

  return (
    <div
      className="relative inline-block"
      style={{ padding: woodTrim }}
    >
      {/* Wood frame */}
      <div
        className="absolute inset-0 wood-grain rounded-sm"
        style={{ borderRadius: 6 }}
      />
      {/* Shelf interior — back panel */}
      <div
        className="relative"
        style={{
          width: shelf.width * cellSize,
          height: shelf.height * cellSize,
          background:
            "linear-gradient(180deg, hsl(25 40% 20% / 0.95), hsl(20 35% 14% / 0.95))",
          boxShadow:
            "inset 0 4px 8px rgba(0,0,0,.5), inset 0 -2px 4px rgba(0,0,0,.4)",
          borderRadius: 2,
        }}
      >
        {/* Cell grid */}
        {Array.from({ length: shelf.height }).map((_, y) =>
          Array.from({ length: shelf.width }).map((_, x) => {
            const blocked = isCellBlocked(shelf, x, y);
            const isHover =
              hover &&
              heldBook &&
              (() => {
                const { w, h } = getBookDims(heldBook, heldRotated);
                return (
                  x >= hover.x &&
                  x < hover.x + w &&
                  y >= hover.y &&
                  y < hover.y + h
                );
              })();
            return (
              <div
                key={`${x}-${y}`}
                data-testid={`cell-${shelf.id}-${x}-${y}`}
                className="absolute"
                style={{
                  left: x * cellSize,
                  top: y * cellSize,
                  width: cellSize,
                  height: cellSize,
                  borderRight:
                    x < shelf.width - 1 ? "1px dashed rgba(255,255,255,.04)" : undefined,
                  borderBottom:
                    y < shelf.height - 1
                      ? "1px dashed rgba(255,255,255,.04)"
                      : undefined,
                  background: blocked
                    ? "repeating-linear-gradient(45deg, hsl(20 25% 8%), hsl(20 25% 8%) 4px, hsl(20 25% 12%) 4px, hsl(20 25% 12%) 8px)"
                    : isHover
                    ? hoverValid
                      ? "hsl(140 50% 40% / 0.30)"
                      : "hsl(0 60% 40% / 0.30)"
                    : "transparent",
                  cursor: heldBook && !blocked ? "pointer" : "default",
                }}
                onMouseEnter={() => heldBook && !blocked && setHover({ x, y })}
                onMouseLeave={() => setHover(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!heldBook || blocked) return;
                  onPlace(shelf.id, x, y);
                  setHover(null);
                }}
              />
            );
          }),
        )}

        {/* Placed books */}
        {onShelf.map((p) => (
          <div
            key={p.book.id}
            className="absolute z-10"
            style={{ left: p.x * cellSize, top: p.y * cellSize }}
          >
            <Book
              book={p.book}
              rotated={p.rotated}
              cellSize={cellSize}
              onClick={(e) => {
                e.stopPropagation();
                if (!heldBook) onPickUp(p.book.id);
              }}
            />
          </div>
        ))}

        {/* Hover ghost preview */}
        {hover && heldBook && (
          <div
            className="absolute pointer-events-none z-20"
            style={{
              left: hover.x * cellSize,
              top: hover.y * cellSize,
              opacity: 0.55,
            }}
          >
            <Book
              book={heldBook}
              rotated={heldRotated}
              cellSize={cellSize}
              ghost
              invalid={!hoverValid}
            />
          </div>
        )}
      </div>

      {/* Bottom shelf board (lip) */}
      <div
        className="absolute left-0 right-0 wood-grain"
        style={{
          bottom: 0,
          height: woodTrim,
          borderRadius: "0 0 6px 6px",
          boxShadow: "0 4px 8px rgba(0,0,0,.4)",
        }}
      />
    </div>
  );
}
