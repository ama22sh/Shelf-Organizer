import { Clock, Move, ArrowLeft, RotateCw, Undo2, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type Props = {
  levelId: number;
  levelName: string;
  moves: number;
  elapsed: number;
  timeLimit?: number;
  moveLimit?: number;
  canRotate: boolean;
  canUndo: boolean;
  onRotate: () => void;
  onUndo: () => void;
  onRestart: () => void;
};

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function HUD({
  levelId,
  levelName,
  moves,
  elapsed,
  timeLimit,
  moveLimit,
  canRotate,
  canUndo,
  onRotate,
  onUndo,
  onRestart,
}: Props) {
  const timeLeft = timeLimit ? Math.max(0, timeLimit - elapsed) : null;
  const movesLeft = moveLimit ? Math.max(0, moveLimit - moves) : null;
  const timeWarn = timeLeft !== null && timeLeft <= 10;
  const movesWarn = movesLeft !== null && movesLeft <= 2;

  return (
    <header className="w-full bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
        <Link href="/levels">
          <Button variant="ghost" size="sm" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-[120px]">
          <div className="text-xs text-muted-foreground font-sans">
            Level {levelId}
          </div>
          <div
            className="font-serif text-lg leading-tight"
            data-testid="text-level-name"
          >
            {levelName}
          </div>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background/60 border border-border ${
            timeWarn ? "text-destructive animate-pulse" : ""
          }`}
          data-testid="hud-time"
        >
          <Clock className="w-4 h-4" />
          <span className="font-mono tabular-nums text-sm">
            {timeLeft !== null ? fmt(timeLeft) : fmt(elapsed)}
          </span>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background/60 border border-border ${
            movesWarn ? "text-destructive" : ""
          }`}
          data-testid="hud-moves"
        >
          <Move className="w-4 h-4" />
          <span className="font-mono tabular-nums text-sm">
            {movesLeft !== null ? `${movesLeft}` : moves}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRotate}
          disabled={!canRotate}
          title="Rotate (R)"
          data-testid="button-rotate"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
          data-testid="button-undo"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRestart}
          title="Restart"
          data-testid="button-restart"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
