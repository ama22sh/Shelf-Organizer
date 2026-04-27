import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Coins,
  RotateCw,
  Lightbulb,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { quiz } from "@/story/stories";
import type { QuizQuestion } from "@/story/types";
import { audio } from "@/lib/audio";
import { recordQuizResult } from "@/lib/economy";

const ROUND_SIZE = 5;

function pickRound(): QuizQuestion[] {
  const shuffled = [...quiz].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, ROUND_SIZE);
}

export default function KidsQuiz() {
  const [round, setRound] = useState<QuizQuestion[]>(() => pickRound());
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);

  const q = round[idx];
  const options = useMemo(
    () => (q ? [...q.options].sort(() => Math.random() - 0.5) : []),
    [q],
  );

  useEffect(() => {
    if (done) {
      recordQuizResult(score);
    }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === q.answer) {
      audio.correct();
      setScore((s) => s + 1);
      setTimeout(advance, 850);
    } else {
      audio.wrong();
      setShowHint(true);
      setTimeout(advance, 1700);
    }
  };

  const advance = () => {
    setShowHint(false);
    setPicked(null);
    if (idx + 1 >= round.length) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
    }
  };

  const restart = () => {
    setRound(pickRound());
    setIdx(0);
    setScore(0);
    setPicked(null);
    setShowHint(false);
    setDone(false);
  };

  return (
    <div className="min-h-screen relative kids-bg overflow-hidden">
      <div className="absolute -top-24 left-1/3 w-96 h-96 rounded-full bg-emerald-300/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-10 w-96 h-96 rounded-full bg-sky-300/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto p-5">
        <header className="flex items-center justify-between mb-6">
          <Link href="/kids">
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-900 hover:text-amber-950"
              data-testid="button-back-quiz"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
          <div className="flex items-center gap-1 text-amber-900 font-bold">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> {score}
          </div>
        </header>

        {!done && q && (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur rounded-3xl p-6 sm:p-8 shadow-xl"
          >
            <div className="text-center text-sm text-amber-700 mb-2">
              Question {idx + 1} of {round.length}
            </div>
            <h2
              className="text-center text-3xl sm:text-4xl text-amber-900 font-bold leading-snug min-h-[6rem] flex items-center justify-center"
              data-testid="quiz-sentence"
            >
              {renderSentence(q.sentence, picked)}
            </h2>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {options.map((opt) => {
                const correct = picked && opt === q.answer;
                const wrong = picked === opt && opt !== q.answer;
                return (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: picked ? 1 : 1.03 }}
                    whileTap={{ scale: picked ? 1 : 0.97 }}
                    onClick={() => choose(opt)}
                    disabled={!!picked}
                    className={`rounded-2xl text-xl sm:text-2xl font-bold py-5 px-3 shadow-md transition-colors ${
                      correct
                        ? "bg-emerald-500 text-white"
                        : wrong
                        ? "bg-rose-500 text-white"
                        : "bg-amber-50 text-amber-900 hover:bg-amber-100"
                    }`}
                    data-testid={`quiz-option-${opt}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {correct && <CheckCircle2 className="w-5 h-5" />}
                      {wrong && <XCircle className="w-5 h-5" />}
                      {opt}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showHint && q.hint && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 flex items-center justify-center gap-2 text-rose-700 italic"
                >
                  <Lightbulb className="w-4 h-4" /> {q.hint}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {done && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="bg-white/95 rounded-3xl p-8 shadow-xl text-center"
            data-testid="quiz-done"
          >
            <h2 className="text-4xl font-bold text-amber-900 mb-2">
              All done!
            </h2>
            <p className="text-amber-800 mb-5">
              You answered {score} out of {round.length} correctly.
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: round.length }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-9 h-9 ${
                    i < score
                      ? "text-amber-500 fill-amber-500"
                      : "text-amber-200"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 text-amber-700 mb-6">
              <Coins className="w-5 h-5" /> +{score} coins earned
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={restart}
                className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-6"
                data-testid="button-quiz-again"
              >
                <RotateCw className="w-4 h-4 mr-2" /> Play again
              </Button>
              <Link href="/kids">
                <Button
                  variant="outline"
                  className="rounded-full"
                  data-testid="button-quiz-done"
                >
                  Done
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function renderSentence(sentence: string, picked: string | null) {
  const parts = sentence.split("___");
  return (
    <span>
      {parts[0]}
      <span
        className={
          picked
            ? "px-2 mx-1 rounded bg-amber-200 text-amber-900 font-extrabold"
            : "px-3 mx-1 rounded bg-amber-100 border-2 border-dashed border-amber-400 text-amber-300"
        }
      >
        {picked ?? "____"}
      </span>
      {parts[1]}
    </span>
  );
}
