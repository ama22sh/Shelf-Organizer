import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Play,
  List,
  Settings as SettingsIcon,
  Library,
  Smile,
  Coins,
  Sparkles,
  BookOpen,
  Heart,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadProgress } from "@/lib/storage";
import { levels } from "@/game/levels";
import { loadEconomy } from "@/lib/economy";
import { pickDaily } from "@/story/stories";
import { AmbientDust } from "@/components/AmbientDust";
import { AnimatedBook } from "@/components/AnimatedBook";

export default function Title() {
  const [showDaily, setShowDaily] = useState(false);
  const progress = loadProgress();
  const econ = loadEconomy();
  const continueLevel = Math.min(progress.highestUnlocked, levels.length);
  const completed = Object.values(progress.levels).filter((l) => l.completed).length;
  const daily = pickDaily();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
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
          <motion.button
            onClick={() => setShowDaily(true)}
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative text-primary cursor-pointer bg-transparent border-none p-0 hover:opacity-80 transition-opacity"
          >
            <AnimatedBook />
          </motion.button>
        </div>
        <h1 className="font-serif text-6xl sm:text-7xl text-primary mb-2 tracking-tight">
          Cozy Corner
        </h1>
        <p className="font-serif italic text-muted-foreground text-lg">
          A cozy puzzle of shelves and stories.
        </p>
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
            {completed > 0 ? "Continue where you left" : "Play Puzzles"}
          </Button>
        </Link>

        <Link href="/levels">
          <Button
            size="lg"
            className="w-full text-base h-12"
            data-testid="button-find-items">
            <Heart className="w-5 h-5 mr-2 text-black-500" />
            Shelves Mode
          </Button>
        </Link>

        <Link href="/find-items-levels">
          <Button  size="lg"
            className="w-full text-base h-12"
            data-testid="button-find-items">
            <Heart className="w-5 h-5 mr-2 text-black-500" />
            Discovery Mode
          </Button>
         </Link>

         <Link href="/Puzzles">
          <Button  size="lg"
            className="w-full text-base h-12"
            data-testid="button-find-items">
            <Heart className="w-5 h-5 mr-2 text-black-500" />
            Puzzles Mode
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

      {/* Today's Pick Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showDaily ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setShowDaily(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur z-40 ${
          showDaily ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{
          opacity: showDaily ? 1 : 0,
          scale: showDaily ? 1 : 0.9,
          y: showDaily ? 0 : 20,
        }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${
          showDaily ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="w-screen sm:w-96 mx-4 rounded-lg border border-primary/40 bg-card/95 backdrop-blur p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm uppercase tracking-wider text-amber-400 font-semibold">
                Today's pick
              </h2>
            </div>
            <button
              onClick={() => setShowDaily(false)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="font-serif text-2xl text-primary leading-tight mb-3">
            {daily.story?.title ?? daily.fact?.title}
          </div>
          
          <div className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {daily.story?.blurb ?? daily.fact?.body}
          </div>

          <div className="flex gap-2">
            <Link href="/library" className="flex-1">
              <Button
                size="sm"
                className="w-full"
                onClick={() => setShowDaily(false)}
              >
                Open the library
              </Button>
            </Link>
            <button
              onClick={() => setShowDaily(false)}
              className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
