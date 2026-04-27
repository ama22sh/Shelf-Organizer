import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Play,
  List,
  BookOpen,
  Settings as SettingsIcon,
  Library,
  Smile,
  Coins,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadProgress } from "@/lib/storage";
import { levels } from "@/game/levels";
import { loadEconomy } from "@/lib/economy";
import { pickDaily } from "@/story/stories";
import { CozyRoom } from "@/components/CozyRoom";
import { AmbientDust } from "@/components/AmbientDust";

export default function Title() {
  const progress = loadProgress();
  const econ = loadEconomy();
  const continueLevel = Math.min(progress.highestUnlocked, levels.length);
  const completed = Object.values(progress.levels).filter((l) => l.completed).length;
  const daily = pickDaily();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      <CozyRoom />
      <AmbientDust />
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur border border-border text-amber-400 text-sm">
        <Coins className="w-4 h-4" />
        <span data-testid="title-coins">{econ.coins}</span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 relative z-10"
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

      {/* Today's pick card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 mb-6 w-full max-w-md rounded-lg border border-primary/40 bg-card/80 backdrop-blur p-4 shadow-xl"
        data-testid="today-card"
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 mb-1">
          <Sparkles className="w-4 h-4" /> Today's pick
        </div>
        <div className="font-serif text-lg text-primary leading-tight">
          {daily.story?.title ?? daily.fact?.title}
        </div>
        <div className="text-xs italic text-muted-foreground mt-1 line-clamp-2">
          {daily.story?.blurb ?? daily.fact?.body}
        </div>
        <div className="mt-2">
          <Link href="/library">
            <Button size="sm" variant="outline" data-testid="button-today">
              Open the library
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col gap-3 w-full max-w-xs relative z-10"
      >
        <Link href={`/play/${continueLevel}`}>
          <Button
            size="lg"
            className="w-full text-base h-12"
            data-testid="button-play"
          >
            <Play className="w-5 h-5 mr-2" />
            {completed > 0 ? "Continue Puzzles" : "Play Puzzles"}
          </Button>
        </Link>
        <Link href="/library">
          <Button
            size="lg"
            variant="secondary"
            className="w-full text-base h-12"
            data-testid="button-library"
          >
            <Library className="w-5 h-5 mr-2" />
            Story Library
          </Button>
        </Link>
        <Link href="/kids">
          <Button
            size="lg"
            variant="secondary"
            className="w-full text-base h-12 bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white border-none"
            data-testid="button-kids"
          >
            <Smile className="w-5 h-5 mr-2" />
            Kids Corner
          </Button>
        </Link>
        <Link href="/levels">
          <Button
            size="lg"
            variant="outline"
            className="w-full text-base h-12"
            data-testid="button-levels"
          >
            <List className="w-5 h-5 mr-2" />
            Level Select
          </Button>
        </Link>
        <div className="flex gap-3">
          <Link href="/how" className="flex-1">
            <Button
              variant="ghost"
              className="w-full"
              data-testid="button-how"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              How to play
            </Button>
          </Link>
          <Link href="/settings" className="flex-1">
            <Button
              variant="ghost"
              className="w-full"
              data-testid="button-settings"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </motion.div>

      {completed > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-sm text-muted-foreground font-serif italic relative z-10"
        >
          {completed} of {levels.length} chapters complete
        </motion.div>
      )}
    </div>
  );
}
