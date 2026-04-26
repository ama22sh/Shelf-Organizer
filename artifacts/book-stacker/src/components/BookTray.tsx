import type { BookData } from "@/game/types";
import { Book } from "./Book";

type Props = {
  books: BookData[];
  heldBookId: string | null;
  onPickUp: (id: string) => void;
  cellSize: number;
};

export function BookTray({ books, heldBookId, onPickUp, cellSize }: Props) {
  return (
    <div className="relative w-full" data-testid="book-tray">
      <div className="absolute inset-0 wood-grain rounded-md" />
      <div className="relative p-3 sm:p-4 flex flex-wrap items-end gap-3 min-h-[100px]">
        {books.length === 0 && (
          <div className="text-amber-100/70 italic font-serif text-sm w-full text-center py-4">
            All books shelved.
          </div>
        )}
        {books.map((book) => (
          <Book
            key={book.id}
            book={book}
            cellSize={cellSize}
            selected={book.id === heldBookId}
            onClick={(e) => {
              e.stopPropagation();
              onPickUp(book.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
