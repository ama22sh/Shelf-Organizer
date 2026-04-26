import type { BookData, PlacedBook, ShelfData } from "@/game/types";
import { canPlace, getBookDims, isCellBlocked } from "@/game/gameLogic";
import { Book } from "./Book";

type HoverCell = { shelfId: string; x: number; y: number } | null;

type Props = {
  shelf: ShelfData;
  placed: PlacedBook[];
  cellSize: number;
  heldBook: BookData | null;
  heldRotated: boolean;
  hoverCell: HoverCell;
  justPlacedId?: string | null;
  onCellEnter: (shelfId: string, x: number, y: number) => void;
  onCellLeave: () => void;
  onPlace: (shelfId: string, x: number, y: number) => void;
  onPickUpPlaced: (bookId: string, e: React.PointerEvent) => void;
};

export function Shelf({
  shelf,
  placed,
  cellSize,
  heldBook,
  heldRotated,
  hoverCell,
  justPlacedId,
  onCellEnter,
  onCellLeave,
  onPlace,
  onPickUpPlaced,
}: Props) {
  const onShelf = placed.filter((p) => p.shelfId === shelf.id);
  const woodTrim = 14;
  const hover =
    hoverCell && hoverCell.shelfId === shelf.id
      ? { x: hoverCell.x, y: hoverCell.y }
      : null;

  const hoverValid =
    hover && heldBook
      ? canPlace(shelf, placed, heldBook, heldRotated, hover.x, hover.y)
      : false;

  return (
    <div className="relative inline-block" style={{ padding: woodTrim }}>
      {/* Cupboard frame — outer wood */}
      <div
        className="absolute inset-0 wood-grain"
        style={{
          borderRadius: 8,
          boxShadow:
            "0 12px 32px rgba(0,0,0,.45), 0 0 0 1px rgba(0,0,0,.3), inset 0 0 0 2px hsl(35 50% 28%)",
        }}
      />
      {/* Top crown lip (a thin wood band on top) */}
      <div
        className="absolute wood-grain"
        style={{
          left: 4,
          right: 4,
          top: 4,
          height: 6,
          borderRadius: "4px 4px 0 0",
          opacity: 0.85,
        }}
      />
      {/* Bottom base lip (heavier) */}
      <div
        className="absolute wood-grain"
        style={{
          left: 0,
          right: 0,
          bottom: -3,
          height: 10,
          borderRadius: "0 0 8px 8px",
          boxShadow: "0 6px 12px rgba(0,0,0,.5)",
        }}
      />

      {/* Shelf interior — back panel */}
      <div
        className="relative"
        style={{
          width: shelf.width * cellSize,
          height: shelf.height * cellSize,
          background:
            "linear-gradient(180deg, hsl(25 40% 18% / 0.97), hsl(20 35% 11% / 0.97))",
          boxShadow:
            "inset 0 6px 14px rgba(0,0,0,.65), inset 0 -3px 6px rgba(0,0,0,.5)",
          borderRadius: 3,
        }}
      >
        {/* Horizontal shelf dividers (wood planks) */}
        {Array.from({ length: shelf.height - 1 }).map((_, i) => (
          <div
            key={`div-${i}`}
            className="absolute left-0 right-0 wood-grain pointer-events-none"
            style={{
              top: (i + 1) * cellSize - 2,
              height: 4,
              borderRadius: 1,
              boxShadow: "0 2px 3px rgba(0,0,0,.5)",
              zIndex: 5,
              opacity: 0.95,
            }}
          />
        ))}

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
                data-cell="1"
                data-shelf-id={shelf.id}
                data-cx={x}
                data-cy={y}
                className="absolute"
                style={{
                  left: x * cellSize,
                  top: y * cellSize,
                  width: cellSize,
                  height: cellSize,
                  borderRight:
                    x < shelf.width - 1
                      ? "1px dashed rgba(255,255,255,.05)"
                      : undefined,
                  background: blocked
                    ? "repeating-linear-gradient(45deg, hsl(20 25% 8%), hsl(20 25% 8%) 4px, hsl(20 25% 12%) 4px, hsl(20 25% 12%) 8px)"
                    : isHover
                    ? hoverValid
                      ? "radial-gradient(hsl(140 55% 45% / 0.45), hsl(140 55% 30% / 0.25))"
                      : "radial-gradient(hsl(0 65% 45% / 0.45), hsl(0 65% 30% / 0.25))"
                    : "transparent",
                  cursor: heldBook && !blocked ? "pointer" : "default",
                  transition: "background-color 120ms ease",
                }}
                onMouseEnter={() => heldBook && !blocked && onCellEnter(shelf.id, x, y)}
                onMouseLeave={() => onCellLeave()}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!heldBook || blocked) return;
                  onPlace(shelf.id, x, y);
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
              tilt
              justPlaced={p.book.id === justPlacedId}
              onPointerDown={(e) => {
                if (!heldBook) {
                  e.stopPropagation();
                  onPickUpPlaced(p.book.id, e);
                }
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
    </div>
  );
}
