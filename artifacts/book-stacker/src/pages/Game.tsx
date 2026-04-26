import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { levels } from "@/game/levels";
import type { BookData, Level, PlacedBook } from "@/game/types";
import { canPlace, computeStars, isLevelWon } from "@/game/gameLogic";
import { Shelf } from "@/components/Shelf";
import { BookTray } from "@/components/BookTray";
import { HUD } from "@/components/HUD";
import { CompleteOverlay } from "@/components/CompleteOverlay";
import { recordLevelResult } from "@/lib/storage";
import { Button } from "@/components/ui/button";

type State = {
  placed: PlacedBook[];
  pending: BookData[];
  heldId: string | null;
  heldRotated: boolean;
  moves: number;
  status: "playing" | "won" | "lost";
  reason?: string;
  history: PlacedBook[][];
  startedAt: number;
  finishedAt?: number;
};

type Action =
  | { type: "init"; level: Level }
  | { type: "pickUp"; bookId: string }
  | { type: "lift"; bookId: string }
  | { type: "rotate" }
  | { type: "place"; shelfId: string; x: number; y: number; level: Level }
  | { type: "undo" }
  | { type: "tick"; now: number; level: Level }
  | { type: "fail"; reason: string };

function init(level: Level): State {
  return {
    placed: [],
    pending: [...level.books],
    heldId: null,
    heldRotated: false,
    moves: 0,
    status: "playing",
    history: [],
    startedAt: Date.now(),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "init":
      return init(action.level);

    case "pickUp": {
      if (state.status !== "playing") return state;
      const book = state.pending.find((b) => b.id === action.bookId);
      if (!book) return state;
      return { ...state, heldId: book.id, heldRotated: false };
    }

    case "lift": {
      if (state.status !== "playing" || state.heldId) return state;
      const placed = state.placed.find((p) => p.book.id === action.bookId);
      if (!placed) return state;
      return {
        ...state,
        placed: state.placed.filter((p) => p.book.id !== action.bookId),
        pending: [...state.pending, placed.book],
        heldId: placed.book.id,
        heldRotated: placed.rotated,
      };
    }

    case "rotate": {
      if (!state.heldId) return state;
      const book =
        state.pending.find((b) => b.id === state.heldId) ??
        state.placed.find((p) => p.book.id === state.heldId)?.book;
      if (!book?.rotatable) return state;
      return { ...state, heldRotated: !state.heldRotated };
    }

    case "place": {
      if (!state.heldId) return state;
      const book = state.pending.find((b) => b.id === state.heldId);
      if (!book) return state;
      const shelf = action.level.shelves.find((s) => s.id === action.shelfId);
      if (!shelf) return state;
      if (
        !canPlace(
          shelf,
          state.placed,
          book,
          state.heldRotated,
          action.x,
          action.y,
        )
      ) {
        return state;
      }
      // Fragile: must be on bottom row of shelf (no books beneath needed; just bottom)
      const rotated = state.heldRotated;
      const h = rotated ? book.width : book.height;
      if (book.fragile) {
        if (action.y + h !== shelf.height) return state;
      }
      // Heavy: cannot rest on top of fragile book
      if (book.heavy) {
        const w = rotated ? book.height : book.width;
        for (let dx = 0; dx < w; dx++) {
          const cx = action.x + dx;
          const belowY = action.y + h;
          if (belowY >= shelf.height) continue;
          const supporting = state.placed.find(
            (p) =>
              p.shelfId === shelf.id &&
              cx >= p.x &&
              cx < p.x + (p.rotated ? p.book.height : p.book.width) &&
              belowY >= p.y &&
              belowY < p.y + (p.rotated ? p.book.width : p.book.height),
          );
          if (supporting?.book.fragile) return state;
        }
      }

      const newPlaced: PlacedBook[] = [
        ...state.placed,
        {
          book,
          shelfId: action.shelfId,
          x: action.x,
          y: action.y,
          rotated,
        },
      ];
      const newPending = state.pending.filter((b) => b.id !== book.id);
      const won = newPending.length === 0 && isLevelWon(action.level, newPlaced);
      return {
        ...state,
        placed: newPlaced,
        pending: newPending,
        heldId: null,
        heldRotated: false,
        moves: state.moves + 1,
        history: [...state.history, state.placed],
        status: won ? "won" : "playing",
        finishedAt: won ? Date.now() : state.finishedAt,
      };
    }

    case "undo": {
      if (state.status !== "playing" || state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      // Determine which book was added by diff
      const lastIds = new Set(state.placed.map((p) => p.book.id));
      const prevIds = new Set(prev.map((p) => p.book.id));
      const addedBook = state.placed.find((p) => !prevIds.has(p.book.id));
      if (!addedBook) {
        return {
          ...state,
          placed: prev,
          history: state.history.slice(0, -1),
        };
      }
      return {
        ...state,
        placed: prev,
        pending: [...state.pending, addedBook.book],
        history: state.history.slice(0, -1),
        heldId: null,
        heldRotated: false,
      };
      void lastIds;
    }

    case "tick": {
      if (state.status !== "playing") return state;
      const elapsed = (action.now - state.startedAt) / 1000;
      const limit = action.level.constraints?.timeLimit;
      if (limit && elapsed >= limit) {
        return { ...state, status: "lost", reason: "Time ran out.", finishedAt: action.now };
      }
      const moveLimit = action.level.constraints?.moveLimit;
      if (moveLimit && state.moves >= moveLimit && state.pending.length > 0) {
        return { ...state, status: "lost", reason: "No moves left.", finishedAt: action.now };
      }
      return state;
    }

    case "fail":
      return { ...state, status: "lost", reason: action.reason, finishedAt: Date.now() };

    default:
      return state;
  }
}

function useElapsed(startedAt: number, finishedAt: number | undefined, status: string) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (status !== "playing") return;
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, [status]);
  return ((finishedAt ?? now) - startedAt) / 1000;
}

export default function Game({ levelId }: { levelId: string }) {
  const id = parseInt(levelId, 10);
  const level = levels.find((l) => l.id === id);
  const [, setLocation] = useLocation();
  const [state, dispatch] = useReducer(reducer, level ?? levels[0], init);
  const [cellSize, setCellSize] = useState(48);
  const containerRef = useRef<HTMLDivElement>(null);
  const recordedRef = useRef(false);

  // Reset on level change
  useEffect(() => {
    if (level) {
      recordedRef.current = false;
      dispatch({ type: "init", level });
    }
  }, [id, level]);

  // Responsive cell size — fit shelves to container width
  useEffect(() => {
    const calc = () => {
      if (!level) return;
      const maxW = containerRef.current?.clientWidth ?? 600;
      const widest = Math.max(...level.shelves.map((s) => s.width));
      const target = Math.floor((maxW - 40) / widest);
      setCellSize(Math.max(28, Math.min(64, target)));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [id, level]);

  const elapsed = useElapsed(state.startedAt, state.finishedAt, state.status);

  // Tick for time/move limits
  useEffect(() => {
    if (!level || state.status !== "playing") return;
    const t = setInterval(() => {
      dispatch({ type: "tick", now: Date.now(), level });
    }, 250);
    return () => clearInterval(t);
  }, [level, state.status]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        dispatch({ type: "rotate" });
      } else if (e.key === "Escape") {
        dispatch({ type: "init", level: level! });
      } else if ((e.key === "z" && (e.ctrlKey || e.metaKey)) || e.key === "u") {
        e.preventDefault();
        dispatch({ type: "undo" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [level]);

  // Save result on win
  useEffect(() => {
    if (state.status === "won" && level && !recordedRef.current) {
      recordedRef.current = true;
      const stars = computeStars(level, state.moves, elapsed);
      recordLevelResult(
        level.id,
        {
          stars,
          bestMoves: state.moves,
          bestTime: elapsed,
          completed: true,
        },
        levels.length,
      );
    }
  }, [state.status, level, state.moves, elapsed]);

  const heldBook = useMemo<BookData | null>(() => {
    if (!state.heldId) return null;
    return state.pending.find((b) => b.id === state.heldId) ?? null;
  }, [state.heldId, state.pending]);

  if (!level) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="font-serif text-2xl mb-4">Chapter not found.</h1>
        <Link href="/levels">
          <Button>Back to library</Button>
        </Link>
      </div>
    );
  }

  const stars =
    state.status === "won" ? computeStars(level, state.moves, elapsed) : 0;
  const nextLevel = levels.find((l) => l.id === level.id + 1);

  return (
    <div
      className="min-h-screen flex flex-col"
      onClick={() => {
        // Click outside shelves cancels held book
        // (Shelf clicks stop propagation.)
      }}
    >
      <HUD
        levelId={level.id}
        levelName={level.name}
        moves={state.moves}
        elapsed={elapsed}
        timeLimit={level.constraints?.timeLimit}
        moveLimit={level.constraints?.moveLimit}
        canRotate={!!heldBook?.rotatable}
        canUndo={state.history.length > 0 && state.status === "playing"}
        onRotate={() => dispatch({ type: "rotate" })}
        onUndo={() => dispatch({ type: "undo" })}
        onRestart={() => dispatch({ type: "init", level })}
      />

      <main
        ref={containerRef}
        className="flex-1 w-full max-w-5xl mx-auto px-3 py-4 sm:py-6 flex flex-col gap-6"
      >
        {/* Shelves */}
        <div className="flex flex-col items-center gap-6">
          {level.shelves.map((shelf, i) => (
            <motion.div
              key={shelf.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Shelf
                shelf={shelf}
                placed={state.placed}
                cellSize={cellSize}
                heldBook={heldBook}
                heldRotated={state.heldRotated}
                onPlace={(shelfId, x, y) =>
                  dispatch({ type: "place", shelfId, x, y, level })
                }
                onPickUp={(bookId) => dispatch({ type: "lift", bookId })}
              />
            </motion.div>
          ))}
        </div>

        {/* Tray */}
        <div className="mt-auto">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-sans mb-2 px-1">
            Books to shelve
          </div>
          <BookTray
            books={state.pending}
            heldBookId={state.heldId}
            onPickUp={(id) => dispatch({ type: "pickUp", bookId: id })}
            cellSize={cellSize}
          />
          {heldBook && (
            <div className="text-xs text-muted-foreground italic font-serif mt-2 text-center">
              Holding "{heldBook.title}" — click a shelf cell to place
              {heldBook.rotatable ? " · press R to rotate" : ""}
            </div>
          )}
        </div>
      </main>

      {state.status !== "playing" && (
        <CompleteOverlay
          status={state.status}
          stars={stars}
          moves={state.moves}
          elapsed={elapsed}
          reason={state.reason}
          hasNext={!!nextLevel}
          nextHref={nextLevel ? `/play/${nextLevel.id}` : undefined}
          onRestart={() => dispatch({ type: "init", level })}
        />
      )}
    </div>
  );
}
