import { Link } from "wouter";
import { useEffect, useState } from "react";
import { ArrowLeft, Sun, Moon, Volume2, VolumeX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { loadProgress, resetProgress, updateSettings } from "@/lib/storage";
import { audio } from "@/lib/audio";

export default function Settings() {
  const [state, setState] = useState(() => loadProgress());

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      state.settings.theme === "dark",
    );
  }, [state.settings.theme]);

  const setTheme = (theme: "dark" | "light") => {
    setState(updateSettings({ theme }));
  };

  const toggleSound = () => {
    const next = !state.settings.sound;
    setState(updateSettings({ sound: next }));
    audio.setEnabled(next);
    if (next) audio.perfect();
  };

  const reset = () => {
    if (
      confirm(
        "Reset all progress? This will clear stars and unlocked levels.",
      )
    ) {
      setState(resetProgress());
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" data-testid="button-home">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Home
          </Button>
        </Link>
        <h1 className="font-serif text-3xl text-primary">Settings</h1>
      </div>

      <div className="space-y-6">
        <section className="bg-card border border-border rounded-md p-5">
          <h2 className="font-serif text-lg mb-4 text-primary">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {state.settings.theme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              <span className="font-serif">Theme</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={state.settings.theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                data-testid="button-theme-light"
              >
                <Sun className="w-4 h-4 mr-1" />
                Light
              </Button>
              <Button
                variant={state.settings.theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                data-testid="button-theme-dark"
              >
                <Moon className="w-4 h-4 mr-1" />
                Dark
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-md p-5">
          <h2 className="font-serif text-lg mb-4 text-primary">Audio</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {state.settings.sound ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
              <span className="font-serif">Sound effects</span>
            </div>
            <Switch
              checked={state.settings.sound}
              onCheckedChange={toggleSound}
              data-testid="switch-sound"
            />
          </div>
        </section>

        <section className="bg-card border border-border rounded-md p-5">
          <h2 className="font-serif text-lg mb-4 text-primary">Progress</h2>
          <Button
            variant="destructive"
            onClick={reset}
            className="w-full"
            data-testid="button-reset"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Reset all progress
          </Button>
        </section>
      </div>
    </div>
  );
}
