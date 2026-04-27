import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  Coins,
  Flame,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES, pickDaily, dailyKey, stories } from "@/story/stories";
import type { Story, StoryCategory } from "@/story/types";
import {
  claimDaily,
  loadEconomy,
  unlockStory,
} from "@/lib/economy";
import { CozyRoom } from "@/components/CozyRoom";
import { AmbientDust } from "@/components/AmbientDust";

type Filter = "all" | StoryCategory;

export default function StoryLibrary() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<Filter>("all");
  const [econ, setEcon] = useState(() => loadEconomy());
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? stories
        : stories.filter((s) => s.category === filter),
    [filter],
  );

  const daily = useMemo(() => pickDaily(), []);
  const todayKey = dailyKey();
  const claimedToday = econ.daily.lastClaimed === todayKey;

  const claim = () => {
    const { economy, alreadyClaimed } = claimDaily(todayKey, 5);
    setEcon(economy);
    if (!alreadyClaimed) {
      setToast("+5 coins · daily streak " + economy.daily.streak);
      setTimeout(() => setToast(null), 2200);
    }
  };

  const tryUnlock = (story: Story) => {
    if (story.access === "free") {
      setLocation(`/read/${story.id}`);
      return;
    }
    if (econ.unlocked.includes(story.id)) {
      setLocation(`/read/${story.id}`);
      return;
    }
    const next = unlockStory(story.id, story.cost ?? 0);
    if (!next) {
      setToast(`Need ${story.cost} coins to unlock`);
      setTimeout(() => setToast(null), 2200);
      return;
    }
    setEcon(next);
    setToast(`Unlocked "${story.title}"`);
    setTimeout(() => setToast(null), 1400);
    setTimeout(() => setLocation(`/read/${story.id}`), 700);
  };

  return (
    <div className="min-h-screen relative">
      <CozyRoom />
      <AmbientDust />

      <div className="relative z-10 max-w-5xl mx-auto p-4 sm:p-6">
        <header className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              data-testid="button-back-library"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Home
            </Button>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-amber-400">
              <Coins className="w-4 h-4" /> {econ.coins}
            </div>
            <div className="flex items-center gap-1 text-orange-400">
              <Flame className="w-4 h-4" /> {econ.daily.streak}d
            </div>
          </div>
        </header>

        <div className="text-center mb-6">
          <h1 className="font-serif text-4xl sm:text-5xl text-primary tracking-tight">
            The Library
          </h1>
          <p className="font-serif italic text-muted-foreground mt-1">
            Pick a volume from the shelves.
          </p>
        </div>

        {/* Today's pick */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-lg border-2 border-primary/40 bg-card/80 backdrop-blur p-5 shadow-xl"
          data-testid="card-daily"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 mb-2">
            <Sparkles className="w-4 h-4" />
            Today's pick
          </div>
          {daily.story && (
            <>
              <h2 className="font-serif text-2xl text-primary">
                {daily.story.title}
              </h2>
              <p className="text-muted-foreground italic font-serif text-sm mt-1 mb-3">
                {daily.story.blurb}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => setLocation(`/read/${daily.story!.id}`)}
                  data-testid="button-read-daily"
                >
                  Read now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={claim}
                  disabled={claimedToday}
                  data-testid="button-claim-daily"
                >
                  <Coins className="w-4 h-4 mr-1" />
                  {claimedToday ? "Claimed today" : "+5 daily coins"}
                </Button>
              </div>
            </>
          )}
          {daily.fact && (
            <>
              <h2 className="font-serif text-2xl text-primary">
                {daily.fact.title}
              </h2>
              <p className="font-serif text-sm mt-2 text-foreground/90">
                {daily.fact.body}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={claim}
                  disabled={claimedToday}
                  data-testid="button-claim-daily"
                >
                  <Coins className="w-4 h-4 mr-1" />
                  {claimedToday ? "Claimed today" : "+5 daily coins"}
                </Button>
              </div>
            </>
          )}
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <FilterPill
            label="All"
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {CATEGORIES.map((c) => (
            <FilterPill
              key={c.id}
              label={c.label}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
            />
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, idx) => {
            const unlocked =
              s.access === "free" || econ.unlocked.includes(s.id);
            const read = econ.read.includes(s.id);
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * idx }}
                whileHover={{ y: -3 }}
                onClick={() => tryUnlock(s)}
                className="text-left rounded-lg border border-border bg-card/85 backdrop-blur overflow-hidden hover:border-primary/60 transition-colors"
                data-testid={`story-card-${s.id}`}
              >
                <div
                  className="h-28 relative wood-grain"
                  style={{
                    background: `linear-gradient(135deg, ${s.spine ?? "hsl(28 60% 40%)"}, hsl(20 30% 18%))`,
                  }}
                >
                  <div className="absolute inset-0 book-pattern opacity-25" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                    <div className="font-serif text-white drop-shadow-md text-lg leading-tight pr-2">
                      {s.title}
                    </div>
                    {!unlocked && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/55 text-amber-300 text-xs">
                        <Lock className="w-3 h-3" /> {s.cost}
                      </div>
                    )}
                    {read && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-700/60 text-emerald-100 text-xs">
                        <CheckCircle2 className="w-3 h-3" /> Read
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    {CATEGORIES.find((c) => c.id === s.category)?.label} ·{" "}
                    {s.readTime} min · +{s.reward} coins
                  </div>
                  <p className="font-serif italic text-sm text-foreground/85">
                    {s.blurb}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 px-4 py-2 rounded-md bg-card border border-primary text-sm shadow-xl"
            data-testid="toast"
          >
            {toast}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-sans border transition-colors ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card/60 border-border text-muted-foreground hover:text-foreground"
      }`}
      data-testid={`filter-${label.toLowerCase()}`}
    >
      {label}
    </button>
  );
}
