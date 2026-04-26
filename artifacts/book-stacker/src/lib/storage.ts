const KEY = "book-stacker-progress-v1";

export type LevelResult = {
  stars: number;
  bestMoves: number;
  bestTime: number;
  completed: boolean;
};

export type ProgressState = {
  levels: Record<number, LevelResult>;
  highestUnlocked: number;
  settings: {
    theme: "dark" | "light";
    sound: boolean;
  };
};

const DEFAULT: ProgressState = {
  levels: {},
  highestUnlocked: 1,
  settings: { theme: "dark", sound: true },
};

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT,
      ...parsed,
      settings: { ...DEFAULT.settings, ...(parsed.settings || {}) },
      levels: { ...(parsed.levels || {}) },
    };
  } catch {
    return DEFAULT;
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function recordLevelResult(
  levelId: number,
  result: LevelResult,
  totalLevels: number,
): ProgressState {
  const state = loadProgress();
  const prev = state.levels[levelId];
  const merged: LevelResult = prev
    ? {
        stars: Math.max(prev.stars, result.stars),
        bestMoves: Math.min(prev.bestMoves, result.bestMoves),
        bestTime: Math.min(prev.bestTime, result.bestTime),
        completed: true,
      }
    : result;
  state.levels[levelId] = merged;
  state.highestUnlocked = Math.max(
    state.highestUnlocked,
    Math.min(levelId + 1, totalLevels),
  );
  saveProgress(state);
  return state;
}

export function updateSettings(
  settings: Partial<ProgressState["settings"]>,
): ProgressState {
  const state = loadProgress();
  state.settings = { ...state.settings, ...settings };
  saveProgress(state);
  return state;
}

export function resetProgress(): ProgressState {
  const state = loadProgress();
  const reset: ProgressState = {
    ...DEFAULT,
    settings: state.settings,
  };
  saveProgress(reset);
  return reset;
}
