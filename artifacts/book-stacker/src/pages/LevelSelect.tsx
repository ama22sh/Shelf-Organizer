import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { levels } from "@/game/levels";
import { loadProgress } from "@/lib/storage";

export default function LevelSelect() {
  const progress = loadProgress();

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" data-testid="button-home">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Home
          </Button>
        </Link>
        <h1 className="font-serif text-3xl text-primary">The Library</h1>
      </div>

      <p className="font-serif italic text-muted-foreground mb-6">
        Choose a chapter to begin shelving.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {levels.map((lvl, idx) => {
          const result = progress.levels[lvl.id];
          const locked = lvl.id > progress.highestUnlocked;
          const stars = result?.stars ?? 0;

          return (
            <motion.div
              key={lvl.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              {locked ? (
                <div
                  className="aspect-square rounded-md border border-dashed border-border bg-card/40 flex flex-col items-center justify-center p-3 opacity-60"
                  data-testid={`level-${lvl.id}-locked`}
                >
                  <Lock className="w-8 h-8 text-muted-foreground mb-2" />
                  <div className="text-sm text-muted-foreground">
                    Level {lvl.id}
                  </div>
                </div>
              ) : (
                <Link href={`/play/${lvl.id}`}>
                  <button
                    className="w-full aspect-square rounded-md border-2 border-primary/40 bg-card hover-elevate active-elevate-2 flex flex-col items-center justify-center p-3 text-center transition-all hover:border-primary"
                    data-testid={`level-${lvl.id}`}
                  >
                    <div className="font-serif text-3xl text-primary mb-1">
                      {lvl.id}
                    </div>
                    <div className="text-xs font-serif text-foreground/80 leading-tight mb-2 line-clamp-2">
                      {lvl.name}
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i <= stars
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </button>
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
