import type { BookData } from "@/game/types";
import { Book } from "./Book";

type Props = {
  books: BookData[];
  heldBookId: string | null;
  onBookPointerDown: (id: string, e: React.PointerEvent) => void;
  cellSize: number;
};

export function BookTray({
  books,
  heldBookId,
  onBookPointerDown,
  cellSize,
}: Props) {
  // Slightly smaller in the tray so a wide book doesn't overflow visually.
  const traySize = Math.max(24, Math.round(cellSize * 0.85));

  return (
    <div className="relative w-full" data-testid="book-tray">
      <div
        className="absolute inset-0 wood-grain"
        style={{
          borderRadius: 8,
          boxShadow:
            "0 8px 20px rgba(0,0,0,.4), inset 0 0 0 1px rgba(0,0,0,.3), inset 0 0 0 2px hsl(35 50% 28%)",
        }}
      />
      <div
        className="absolute left-2 right-2 top-1 wood-grain"
        style={{ height: 4, borderRadius: 2, opacity: 0.7 }}
      />
      <div className="relative p-3 sm:p-4 pt-5 flex flex-wrap items-end gap-3 min-h-[110px]">
        {books.length === 0 && (
          <div className="text-amber-100/80 italic font-serif text-sm w-full text-center py-6">
            All books shelved.
          </div>
        )}
        {books.map((book) => (
          <Book
            key={book.id}
            book={book}
            cellSize={traySize}
            tilt
            selected={book.id === heldBookId}
            onPointerDown={(e) => {
              e.stopPropagation();
              onBookPointerDown(book.id, e);
            }}
          />
        ))}
      </div>
    </div>
  );
}
