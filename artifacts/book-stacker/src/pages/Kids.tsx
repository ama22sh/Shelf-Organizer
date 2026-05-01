import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Headphones, Pencil, Coins, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadEconomy } from "@/lib/economy";

export default function Kids() {
  const econ = loadEconomy();
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cheerful blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-pink-300/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-sky-300/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-yellow-300/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto p-5">
        <header className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              data-testid="button-back-kids"
              className="text-amber-900 hover:text-amber-950"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Home
            </Button>
          </Link>
          <div className="flex items-center gap-1 text-amber-700 font-bold">
            <Coins className="w-5 h-5" /> {econ.coins}
          </div>
        </header>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="text-center mb-10"
        >
          <h1 className="font-serif text-5xl sm:text-6xl text-amber-800 drop-shadow-lg tracking-tight">
            Kids Corner
          </h1>
          <p className="font-serif text-5xl sm:text-3xl text-amber-800 drop-shadow-lg tracking-tight">
            Listen to a story or play a word game!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <KidsCard
            to="/kids/listen"
            color="from-pink-400 to-rose-500"
            icon={<Headphones className="w-12 h-12" />}
            title="Listen to a Story"
            subtitle="A friendly voice will read it for you."
            testid="kids-listen"
          />
          <KidsCard
            to="/kids/quiz"
            color="from-emerald-400 to-teal-500"
            icon={<Pencil className="w-12 h-12" />}
            title="Word Game"
            subtitle="Fill in the missing word to win stars."
            testid="kids-quiz"
          />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Stat
            label="Best score"
            value={`${econ.quiz.bestScore} ★`}
            icon={<Star className="w-5 h-5 text-amber-500" />}
          />
          <Stat
            label="Times played"
            value={econ.quiz.timesPlayed.toString()}
            icon={<Pencil className="w-5 h-5 text-emerald-600" />}
          />
        </div>
      </div>
    </div>
  );
}

function KidsCard({
  to,
  color,
  icon,
  title,
  subtitle,
  testid,
}: {
  to: string;
  color: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  testid: string;
}) {
  return (
    <Link href={to}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-gradient-to-br ${color} text-white rounded-3xl p-6 shadow-xl cursor-pointer h-44 flex flex-col justify-between`}
        data-testid={testid}
      >
        <div>{icon}</div>
        <div>
          <div className="text-2xl font-bold leading-tight">{title}</div>
          <div className="text-sm opacity-90">{subtitle}</div>
        </div>
      </motion.div>
    </Link>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-4 flex items-center gap-3 shadow-md">
      {icon}
      <div>
        <div className="text-xs text-amber-700 uppercase tracking-wider">
          {label}
        </div>
        <div className="font-bold text-amber-900 text-lg">{value}</div>
      </div>
    </div>
  );
}
