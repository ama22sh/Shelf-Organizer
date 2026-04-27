import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, SkipBack, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stories } from "@/story/stories";
import { audio } from "@/lib/audio";

const KID_FRIENDLY_IDS = [
  "moonbirds",
  "lantern-keeper",
  "missing-bookmark",
  "small-stones",
];

type Word = { text: string; start: number; end: number };

export default function KidsListen() {
  const [, setLocation] = useLocation();
  const kidStories = useMemo(
    () => stories.filter((s) => KID_FRIENDLY_IDS.includes(s.id)),
    [],
  );
  const [storyId, setStoryId] = useState<string | null>(null);
  const story = kidStories.find((s) => s.id === storyId) ?? null;

  const [playing, setPlaying] = useState(false);
  const [activeWord, setActiveWord] = useState<number>(-1);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordsRef = useRef<Word[]>([]);

  // Build a flat list of words from all pages with offsets
  const fullText = useMemo(
    () => (story ? story.pages.join("\n\n") : ""),
    [story],
  );
  const words = useMemo<Word[]>(() => {
    if (!fullText) return [];
    const out: Word[] = [];
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(fullText)) !== null) {
      out.push({
        text: m[0],
        start: m.index,
        end: m.index + m[0].length,
      });
    }
    wordsRef.current = out;
    return out;
  }, [fullText]);

  const speechAvailable =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const stop = () => {
    if (!speechAvailable) return;
    window.speechSynthesis.cancel();
    setPlaying(false);
    setActiveWord(-1);
  };

  const play = () => {
    if (!speechAvailable || !story) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(fullText);
    u.rate = 0.95;
    u.pitch = 1.05;
    u.volume = 1;
    // Try to pick a nicer voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /female|samantha|karen|moira|tessa/i.test(v.name)) ??
      voices.find((v) => v.lang.startsWith("en"));
    if (preferred) u.voice = preferred;

    u.onboundary = (ev) => {
      if (ev.name !== "word") return;
      const idx = wordsRef.current.findIndex(
        (w) => ev.charIndex >= w.start && ev.charIndex < w.end,
      );
      if (idx !== -1) setActiveWord(idx);
    };
    u.onend = () => {
      setPlaying(false);
      setActiveWord(-1);
    };
    u.onerror = () => {
      setPlaying(false);
      setActiveWord(-1);
    };
    utterRef.current = u;
    setPlaying(true);
    window.speechSynthesis.speak(u);
  };

  // Cleanup on unmount or story change
  useEffect(() => {
    return () => {
      if (speechAvailable) window.speechSynthesis.cancel();
    };
  }, [speechAvailable]);
  useEffect(() => {
    stop();
  }, [storyId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen relative kids-bg overflow-hidden">
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-rose-300/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-20 w-96 h-96 rounded-full bg-amber-300/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto p-5">
        <header className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/kids")}
            className="text-amber-900 hover:text-amber-950"
            data-testid="button-back-listen"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="font-bold text-amber-900">Story Time</div>
          <div className="w-10" />
        </header>

        {!story && (
          <div>
            <h1 className="font-serif text-3xl text-amber-900 mb-4 text-center">
              Pick a story
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kidStories.map((s) => (
                <motion.button
                  key={s.id}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStoryId(s.id)}
                  className="bg-white/85 rounded-2xl p-5 text-left shadow-md hover:shadow-xl transition-shadow"
                  data-testid={`kid-story-${s.id}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-7 h-7 text-rose-500" />
                    <div className="text-amber-900 font-bold text-lg">
                      {s.title}
                    </div>
                  </div>
                  <div className="text-sm text-amber-800 italic">
                    {s.blurb}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {story && (
          <div className="bg-white/90 backdrop-blur rounded-3xl p-5 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-2xl text-amber-900">
                  {story.title}
                </div>
                <div className="text-sm italic text-amber-700">
                  by {story.author}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setStoryId(null)}
                data-testid="button-change-story"
              >
                Change
              </Button>
            </div>

            <div
              className="font-serif text-lg leading-relaxed text-amber-950 max-h-[55vh] overflow-y-auto pr-2"
              data-testid="listen-text"
            >
              {words.map((w, i) => (
                <span
                  key={i}
                  className={
                    i === activeWord
                      ? "bg-amber-300/80 rounded px-0.5 transition-colors"
                      : "transition-colors"
                  }
                >
                  {w.text + " "}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <Button
                onClick={() => {
                  stop();
                  play();
                }}
                size="lg"
                variant="outline"
                className="rounded-full"
                data-testid="button-restart-listen"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              {!playing ? (
                <Button
                  onClick={play}
                  size="lg"
                  className="rounded-full bg-rose-500 hover:bg-rose-600 text-white px-8"
                  data-testid="button-play-listen"
                >
                  <Play className="w-5 h-5 mr-2" /> Play
                </Button>
              ) : (
                <Button
                  onClick={stop}
                  size="lg"
                  className="rounded-full bg-rose-500 hover:bg-rose-600 text-white px-8"
                  data-testid="button-pause-listen"
                >
                  <Pause className="w-5 h-5 mr-2" /> Stop
                </Button>
              )}
            </div>

            {!speechAvailable && (
              <p className="text-center text-sm text-rose-700 mt-3">
                Your browser does not support voice narration.
              </p>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/library">
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-900"
              onClick={() => audio.bookOpen()}
              data-testid="button-go-library-from-listen"
            >
              Want to read instead? Visit the library
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
