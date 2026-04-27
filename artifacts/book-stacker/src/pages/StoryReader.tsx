import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stories } from "@/story/stories";
import {
  isUnlocked,
  loadEconomy,
  markRead,
  setStoryPage,
} from "@/lib/economy";
import { audio } from "@/lib/audio";
import { CozyRoom } from "@/components/CozyRoom";

export default function StoryReader({ id }: { id: string }) {
  const [, setLocation] = useLocation();
  const story = useMemo(() => stories.find((s) => s.id === id), [id]);
  const [opened, setOpened] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [reward, setReward] = useState<number | null>(null);

  // Pair pages into spreads of 2 for the book layout
  const spreads = useMemo(() => {
    if (!story) return [];
    const out: { left: string; right: string | null; index: number }[] = [];
    for (let i = 0; i < story.pages.length; i += 2) {
      out.push({
        left: story.pages[i],
        right: story.pages[i + 1] ?? null,
        index: i,
      });
    }
    return out;
  }, [story]);

  // Open animation + sound
  useEffect(() => {
    if (!story) return;
    if (!isUnlocked(story.id, story.access)) {
      setLocation("/library");
      return;
    }
    const t = setTimeout(() => {
      audio.bookOpen();
      setOpened(true);
    }, 200);
    return () => clearTimeout(t);
  }, [story, setLocation]);

  // Resume from saved page
  useEffect(() => {
    if (!story) return;
    const e = loadEconomy();
    const saved = e.storyPage[story.id] ?? 0;
    setPageIdx(Math.min(Math.floor(saved / 2), spreads.length - 1));
  }, [story, spreads.length]);

  // Persist page + reward on last spread
  useEffect(() => {
    if (!story) return;
    setStoryPage(story.id, pageIdx * 2);
    if (pageIdx === spreads.length - 1 && spreads.length > 0) {
      const e = markRead(story.id, story.reward);
      // Show reward toast only once per session per story
      if (e.read.includes(story.id) && reward === null) {
        setReward(story.reward);
        setTimeout(() => setReward(null), 2400);
      }
    }
  }, [story, pageIdx, spreads.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setLocation("/library");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pageIdx, spreads.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => {
    if (pageIdx >= spreads.length - 1) return;
    setDirection(1);
    audio.pageFlip();
    setPageIdx((p) => p + 1);
  };
  const prev = () => {
    if (pageIdx <= 0) return;
    setDirection(-1);
    audio.pageFlip();
    setPageIdx((p) => p - 1);
  };

  if (!story) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="font-serif text-xl mb-4">Story not found.</p>
        <Link href="/library">
          <Button>Back to library</Button>
        </Link>
      </div>
    );
  }

  const spread = spreads[pageIdx];
  const isLast = pageIdx === spreads.length - 1;

  return (
    <div className="min-h-screen relative flex flex-col">
      <CozyRoom />

      <header className="relative z-20 flex items-center justify-between p-4">
        <Link href="/library">
          <Button variant="ghost" size="sm" data-testid="button-back-reader">
            <ArrowLeft className="w-4 h-4 mr-1" /> Library
          </Button>
        </Link>
        <div className="text-center">
          <div className="font-serif text-lg text-primary leading-tight">
            {story.title}
          </div>
          <div className="text-xs text-muted-foreground italic">
            by {story.author}
          </div>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {pageIdx + 1} / {spreads.length}
        </div>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-8">
        {/* Book */}
        <motion.div
          initial={{ rotateX: -25, scale: 0.85, opacity: 0 }}
          animate={{
            rotateX: opened ? 0 : -25,
            scale: opened ? 1 : 0.85,
            opacity: opened ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 110, damping: 18 }}
          style={{ perspective: 1600, transformStyle: "preserve-3d" }}
          className="w-full max-w-4xl aspect-[7/4] relative"
          data-testid="book-spread"
        >
          {/* Outer book / leather */}
          <div
            className="absolute inset-0 rounded-lg shadow-2xl wood-grain"
            style={{
              background: `linear-gradient(140deg, ${story.spine ?? "hsl(28 60% 40%)"}, hsl(15 35% 14%))`,
              padding: 14,
            }}
          >
            <div
              className="absolute inset-0 rounded-lg book-pattern"
              style={{ opacity: 0.12 }}
            />
            {/* Pages */}
            <div
              className="relative h-full rounded shadow-inner overflow-hidden"
              style={{
                background:
                  "linear-gradient(180deg, hsl(40 35% 88%) 0%, hsl(38 30% 80%) 100%)",
              }}
            >
              {/* Center binding */}
              <div
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,.35), rgba(0,0,0,0) 70%)",
                  pointerEvents: "none",
                  zIndex: 5,
                }}
              />
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={pageIdx}
                  custom={direction}
                  initial={{
                    rotateY: direction === 1 ? 80 : -80,
                    opacity: 0.2,
                  }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{
                    rotateY: direction === 1 ? -80 : 80,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  style={{ transformStyle: "preserve-3d", transformOrigin: "center" }}
                  className="absolute inset-0 grid grid-cols-2"
                >
                  <Page
                    text={spread.left}
                    pageNumber={spread.index + 1}
                    side="left"
                  />
                  {spread.right ? (
                    <Page
                      text={spread.right}
                      pageNumber={spread.index + 2}
                      side="right"
                    />
                  ) : (
                    <div className="relative bg-transparent flex items-center justify-center text-muted-foreground/60 italic font-serif text-sm select-none">
                      <div className="text-center px-6">
                        <div className="text-3xl mb-2 text-foreground/60">·</div>
                        End of the story.
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Tap zones for paging on mobile */}
              <button
                onClick={prev}
                disabled={pageIdx === 0}
                aria-label="Previous page"
                className="absolute left-0 top-0 bottom-0 w-1/4 z-10 disabled:cursor-not-allowed"
                data-testid="tap-prev"
              />
              <button
                onClick={next}
                disabled={isLast}
                aria-label="Next page"
                className="absolute right-0 top-0 bottom-0 w-1/4 z-10 disabled:cursor-not-allowed"
                data-testid="tap-next"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer controls */}
      <div className="relative z-20 flex items-center justify-center gap-3 pb-6">
        <Button
          variant="outline"
          onClick={prev}
          disabled={pageIdx === 0}
          data-testid="button-prev-page"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="text-xs text-muted-foreground font-mono w-20 text-center">
          page {pageIdx + 1}/{spreads.length}
        </div>
        <Button
          onClick={next}
          disabled={isLast}
          data-testid="button-next-page"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <AnimatePresence>
        {reward !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-md bg-card border border-amber-400 text-sm shadow-xl flex items-center gap-2"
            data-testid="toast-reward"
          >
            <Coins className="w-4 h-4 text-amber-400" />
            +{reward} coins · story complete
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Page({
  text,
  pageNumber,
  side,
}: {
  text: string;
  pageNumber: number;
  side: "left" | "right";
}) {
  return (
    <div
      className="relative h-full p-6 sm:p-10 overflow-hidden"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent 0px, transparent 27px, hsl(35 25% 70% / 0.18) 28px)",
      }}
    >
      <div
        className="font-serif text-base sm:text-lg leading-relaxed first-letter:text-3xl first-letter:font-bold first-letter:mr-1"
        style={{ color: "hsl(25 40% 18%)" }}
      >
        <span style={{ color: "hsl(28 70% 35%)", fontWeight: 700 }}>
          {text.charAt(0)}
        </span>
        {text.slice(1)}
      </div>
      <div
        className={`absolute bottom-3 ${side === "left" ? "left-4" : "right-4"} text-xs italic font-serif`}
        style={{ color: "hsl(25 30% 35% / 0.7)" }}
      >
        — {pageNumber} —
      </div>
    </div>
  );
}
