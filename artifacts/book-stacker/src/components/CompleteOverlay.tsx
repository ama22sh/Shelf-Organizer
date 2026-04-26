import { motion } from "framer-motion";
import { Star, ArrowRight, RefreshCw, List } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type Props = {
  status: "won" | "lost";
  stars: number;
  moves: number;
  elapsed: number;
  reason?: string;
  hasNext: boolean;
  nextHref?: string;
  onRestart: () => void;
};

export function CompleteOverlay({
  status,
  stars,
  moves,
  elapsed,
  reason,
  hasNext,
  nextHref,
  onRestart,
}: Props) {
  const won = status === "won";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      data-testid={won ? "overlay-won" : "overlay-lost"}
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="bg-card border-2 border-primary rounded-lg shadow-2xl p-8 max-w-md w-full text-center"
      >
        <h2 className="font-serif text-3xl mb-2 text-primary">
          {won ? "Shelved!" : "Out of Order"}
        </h2>
        <p className="text-muted-foreground font-serif italic mb-6">
          {won
            ? "Every volume found its place."
            : reason ?? "The shelf was not completed."}
        </p>

        {won && (
          <>
            <div className="flex justify-center gap-2 mb-6" data-testid="stars-display">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2 + i * 0.15, type: "spring" }}
                >
                  <Star
                    className={`w-12 h-12 ${
                      i <= stars
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center gap-6 text-sm font-mono mb-6">
              <div>
                <div className="text-muted-foreground text-xs">MOVES</div>
                <div className="text-lg">{moves}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">TIME</div>
                <div className="text-lg">
                  {Math.floor(elapsed / 60)}:
                  {(Math.floor(elapsed) % 60).toString().padStart(2, "0")}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onRestart}
            className="flex-1"
            data-testid="button-overlay-restart"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href="/levels" className="flex-1">
            <Button variant="outline" className="w-full" data-testid="button-overlay-levels">
              <List className="w-4 h-4 mr-2" />
              Levels
            </Button>
          </Link>
          {won && hasNext && nextHref && (
            <Link href={nextHref} className="flex-1">
              <Button className="w-full" data-testid="button-overlay-next">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
