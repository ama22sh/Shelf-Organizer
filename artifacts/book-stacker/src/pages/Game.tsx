import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { levels } from "@/game/levels";
import type { BookData, Level, PlacedBook } from "@/game/types";
import {
  anyBookFits,
  canPlace,
  computeStars,
  isLevelWon,
} from "@/game/gameLogic";
import { Shelf } from "@/components/Shelf";
import { BookTray } from "@/components/BookTray";
import { HUD } from "@/components/HUD";
import { CompleteOverlay } from "@/components/CompleteOverlay";
import { AmbientDust } from "@/components/AmbientDust";
import { CozyRoom } from "@/components/CozyRoom";
import { Book } from "@/components/Book";
import { getBookDims } from "@/game/gameLogic";
import { recordLevelResult, loadProgress } from "@/lib/storage";
import { audio } from "@/lib/audio";
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
  lastPlacedId?: string | null;
};

type PlaceResult = "ok" | "invalid";

type Action =
  | { type: "init"; level: Level }
  | { type: "pickUp"; bookId: string }
  | { type: "lift"; bookId: string }
  | { type: "rotate" }
  | { type: "place"; shelfId: string; x: number; y: number; level: Level; result?: { value: PlaceResult } }
  | { type: "drop" }
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
    lastPlacedId: null,
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

    case "drop":
      return { ...state, heldId: null, heldRotated: false };

    case "place": {
      if (!state.heldId) {
        if (action.result) action.result.value = "invalid";
        return state;
      }
      const book = state.pending.find((b) => b.id === state.heldId);
      if (!book) {
        if (action.result) action.result.value = "invalid";
        return state;
      }
      const shelf = action.level.shelves.find((s) => s.id === action.shelfId);
      if (!shelf) {
        if (action.result) action.result.value = "invalid";
        return state;
      }
      const rotated = state.heldRotated;
      if (
        !canPlace(shelf, state.placed, book, rotated, action.x, action.y)
      ) {
        if (action.result) action.result.value = "invalid";
        return state;
      }
      const h = rotated ? book.width : book.height;
      const w = rotated ? book.height : book.width;
      // Fragile: must rest on the bottom row
      if (book.fragile && action.y + h !== shelf.height) {
        if (action.result) action.result.value = "invalid";
        return state;
      }
      // Heavy: cannot rest directly on top of a fragile book
      if (book.heavy) {
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
          if (supporting?.book.fragile) {
            if (action.result) action.result.value = "invalid";
            return state;
          }
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
      if (action.result) action.result.value = "ok";
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
        lastPlacedId: book.id,
      };
    }

    case "undo": {
      if (state.status !== "playing" || state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
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
    }

    case "tick": {
      if (state.status !== "playing") return state;
      const elapsed = (action.now - state.startedAt) / 1000;
      const limit = action.level.constraints?.timeLimit;
      if (limit && elapsed >= limit) {
        return {
          ...state,
          status: "lost",
          reason: "Time ran out.",
          finishedAt: action.now,
        };
      }
      const moveLimit = action.level.constraints?.moveLimit;
      if (moveLimit && state.moves >= moveLimit && state.pending.length > 0) {
        return {
          ...state,
          status: "lost",
          reason: "No moves left.",
          finishedAt: action.now,
        };
      }
      return state;
    }

    case "fail":
      return {
        ...state,
        status: "lost",
        reason: action.reason,
        finishedAt: Date.now(),
      };

    default:
      return state;
  }
}

function useElapsed(
  startedAt: number,
  finishedAt: number | undefined,
  status: string,
) {
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
  void setLocation;
  const [state, dispatch] = useReducer(reducer, level ?? levels[0], init);
  const [cellSize, setCellSize] = useState(48);
  const containerRef = useRef<HTMLDivElement>(null);
  const recordedRef = useRef(false);
  const lastFailRef = useRef(0);

  // Drag state
  const [dragging, setDragging] = useState(false);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverCell, setHoverCell] = useState<{ shelfId: string; x: number; y: number } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDragRef = useRef(false);

  // Reset on level change
  useEffect(() => {
    if (level) {
      recordedRef.current = false;
      dispatch({ type: "init", level });
      setHoverCell(null);
      setDragging(false);
      setPointerPos(null);
    }
  }, [id, level]);

  // Audio bootstrap is handled at the App level (works on any page).
  // Here we only re-sync the current sound preference each time the
  // game page mounts, in case the user toggled it elsewhere.
  useEffect(() => {
    const { settings } = loadProgress();
    audio.setEnabled(settings.sound);
  }, []);

  // Responsive cell size
  useEffect(() => {
    const calc = () => {
      if (!level) return;
      const maxW = containerRef.current?.clientWidth ?? 600;
      const widest = Math.max(...level.shelves.map((s) => s.width));
      const target = Math.floor((maxW - 60) / widest);
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

  // Game-over: no remaining book fits anywhere
  useEffect(() => {
    if (!level || state.status !== "playing") return;
    if (state.pending.length === 0) return;
    if (!anyBookFits(level, state.placed, state.pending)) {
      dispatch({ type: "fail", reason: "No remaining space fits any book." });
    }
  }, [level, state.status, state.placed, state.pending]);

  // Centralised win/lose audio cue — fires on any path into those states.
  useEffect(() => {
    if (state.status === "won") {
      audio.win();
    } else if (state.status === "lost") {
      audio.lose();
    }
  }, [state.status]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!level) return;
      if (e.key === "r" || e.key === "R") {
        dispatch({ type: "rotate" });
      } else if (e.key === "Escape") {
        dispatch({ type: "init", level });
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

  // Pointer-driven drag from tray or placed book
  const startDrag = (bookId: string, e: React.PointerEvent, fromTray: boolean) => {
    if (state.status !== "playing") return;
    if (fromTray) {
      dispatch({ type: "pickUp", bookId });
    } else {
      dispatch({ type: "lift", bookId });
    }
    audio.pick();
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    isDragRef.current = true;
    setDragging(true);
    setPointerPos({ x: e.clientX, y: e.clientY });
  };

  // The ghost is centered on the cursor with translate(-50%,-50%).
  // To find the cell that the ghost's TOP-LEFT corner sits over, we
  // probe at cursor - ((W-1)/2, (H-1)/2) in pixels. This yields the
  // top-left cell index directly via elementsFromPoint.
  const probeTopLeftCell = (clientX: number, clientY: number) => {
    if (!heldBook) return null;
    const { w, h } = getBookDims(heldBook, state.heldRotated);
    const px = clientX - ((w - 1) * cellSize) / 2;
    const py = clientY - ((h - 1) * cellSize) / 2;
    const elements = document.elementsFromPoint(px, py);
    const cell = elements.find(
      (el) => el instanceof HTMLElement && el.dataset.cell === "1",
    ) as HTMLElement | undefined;
    if (!cell) return null;
    return {
      shelfId: cell.dataset.shelfId!,
      x: parseInt(cell.dataset.cx!, 10),
      y: parseInt(cell.dataset.cy!, 10),
    };
  };

  const tryPlaceFromPointer = (clientX: number, clientY: number) => {
    if (!level) return false;
    const target = probeTopLeftCell(clientX, clientY);
    if (!target) return false;
    const result = { value: "invalid" as PlaceResult };
    dispatch({
      type: "place",
      shelfId: target.shelfId,
      x: target.x,
      y: target.y,
      level,
      result,
    });
    if (result.value === "ok") {
      audio.place();
      return true;
    } else {
      const now = Date.now();
      if (now - lastFailRef.current > 200) {
        audio.invalid();
        lastFailRef.current = now;
      }
      return false;
    }
  };

  // Global pointer handlers while dragging
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      setPointerPos({ x: e.clientX, y: e.clientY });
      // Update hover cell using the same offset-aware probe so the
      // ghost preview on the shelf matches where the floating book
      // will actually land on release.
      if (level && heldBook) {
        const target = probeTopLeftCell(e.clientX, e.clientY);
        setHoverCell(target);
      }
    };
    const onUp = (e: PointerEvent) => {
      const start = dragStartRef.current;
      const moved =
        start &&
        Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6;
      isDragRef.current = false;
      setDragging(false);
      setPointerPos(null);
      if (moved) {
        // Drag release: try to place; if not, drop (deselect).
        const placed = tryPlaceFromPointer(e.clientX, e.clientY);
        if (!placed) {
          dispatch({ type: "drop" });
          setHoverCell(null);
        }
      }
      // If it was a tap (no movement), keep book held → click-to-place mode.
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, level, heldBook]);

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
    <div className="min-h-screen flex flex-col relative">
      <CozyRoom />
      <AmbientDust />

      <div className="relative z-10 flex flex-col flex-1">
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
          className="flex-1 w-full max-w-5xl mx-auto px-3 py-4 sm:py-6 flex flex-col gap-6 camera-breathe"
          onClick={() => {
            // Clicking empty space drops a held book (cancel).
            if (state.heldId && !dragging) {
              dispatch({ type: "drop" });
              setHoverCell(null);
            }
          }}
        >
          {/* Shelves */}
          <div className="flex flex-col items-center gap-8">
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
                  hoverCell={hoverCell}
                  justPlacedId={state.lastPlacedId ?? null}
                  onCellEnter={(shelfId, x, y) =>
                    setHoverCell({ shelfId, x, y })
                  }
                  onCellLeave={() => {
                    if (!dragging) setHoverCell(null);
                  }}
                  onPlace={(shelfId, x, y) => {
                    const result = { value: "invalid" as PlaceResult };
                    dispatch({
                      type: "place",
                      shelfId,
                      x,
                      y,
                      level,
                      result,
                    });
                    if (result.value === "ok") {
                      audio.place();
                      setHoverCell(null);
                    } else {
                      audio.invalid();
                    }
                  }}
                  onPickUpPlaced={(bookId, e) => startDrag(bookId, e, false)}
                />
              </motion.div>
            ))}
          </div>

          {/* Tray */}
          <div className="mt-auto">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-sans mb-2 px-1">
              Books to shelve · {state.pending.length}
            </div>
            <BookTray
              books={state.pending}
              heldBookId={state.heldId}
              onBookPointerDown={(bid, e) => startDrag(bid, e, true)}
              cellSize={cellSize}
            />
            {heldBook && (
              <div className="text-xs text-muted-foreground italic font-serif mt-2 text-center">
                Holding "{heldBook.title}" — drag to a shelf, or click a cell
                {heldBook.rotatable ? " · press R to rotate" : ""}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating drag ghost */}
      {dragging && heldBook && pointerPos && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: pointerPos.x,
            top: pointerPos.y,
            transform: "translate(-50%, -50%)",
            opacity: 0.92,
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,.6))",
          }}
        >
          <Book
            book={heldBook}
            rotated={state.heldRotated}
            cellSize={cellSize}
          />
        </div>
      )}

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
