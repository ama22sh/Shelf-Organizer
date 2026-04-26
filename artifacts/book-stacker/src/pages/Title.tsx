import { Link } from "wouter";
import { motion } from "framer-motion";
import { Play, List, BookOpen, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadProgress } from "@/lib/storage";
import { levels } from "@/game/levels";

export default function Title() {
  const progress = loadProgress();
  const continueLevel = Math.min(progress.highestUnlocked, levels.length);
  const completed = Object.values(progress.levels).filter((l) => l.completed).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative"
          >
            <BookOpen className="w-20 h-20 text-primary" strokeWidth={1.5} />
          </motion.div>
        </div>
        <h1 className="font-serif text-6xl sm:text-7xl text-primary mb-2 tracking-tight">
          Book Stacker
        </h1>
        <p className="font-serif italic text-muted-foreground text-lg">
          A cozy puzzle of shelves and stories.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        <Link href={`/play/${continueLevel}`}>
          <Button
            size="lg"
            className="w-full text-base h-12"
            data-testid="button-play"
          >
            <Play className="w-5 h-5 mr-2" />
            {completed > 0 ? "Continue" : "Begin Reading"}
          </Button>
        </Link>
        <Link href="/levels">
          <Button
            size="lg"
            variant="secondary"
            className="w-full text-base h-12"
            data-testid="button-levels"
          >
            <List className="w-5 h-5 mr-2" />
            Level Select
          </Button>
        </Link>
        <Link href="/how">
          <Button
            size="lg"
            variant="outline"
            className="w-full text-base h-12"
            data-testid="button-how"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            How to Play
          </Button>
        </Link>
        <Link href="/settings">
          <Button
            size="lg"
            variant="ghost"
            className="w-full text-base h-12"
            data-testid="button-settings"
          >
            <SettingsIcon className="w-5 h-5 mr-2" />
            Settings
          </Button>
        </Link>
      </motion.div>

      {completed > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm text-muted-foreground font-serif italic"
        >
          {completed} of {levels.length} chapters complete
        </motion.div>
      )}
    </div>
  );
}
