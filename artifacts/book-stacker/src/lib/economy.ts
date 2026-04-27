/**
 * Coins, daily streaks, story progress, and Kids Mode quiz progress.
 * All persisted to localStorage under a single namespaced key so it
 * survives reloads and migrations gracefully.
 */
const KEY = "book-stacker-economy-v1";

export type Economy = {
  coins: number;
  unlocked: string[]; // story ids
  read: string[]; // story ids the player has finished
  storyPage: Record<string, number>; // last opened page index
  daily: {
    lastClaimed: string | null; // dailyKey()
    streak: number;
    longestStreak: number;
  };
  quiz: {
    bestScore: number;
    timesPlayed: number;
  };
};

const DEFAULT: Economy = {
  coins: 0,
  unlocked: [],
  read: [],
  storyPage: {},
  daily: { lastClaimed: null, streak: 0, longestStreak: 0 },
  quiz: { bestScore: 0, timesPlayed: 0 },
};

export function loadEconomy(): Economy {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT,
      ...parsed,
      daily: { ...DEFAULT.daily, ...(parsed.daily ?? {}) },
      quiz: { ...DEFAULT.quiz, ...(parsed.quiz ?? {}) },
      storyPage: { ...(parsed.storyPage ?? {}) },
      unlocked: Array.isArray(parsed.unlocked) ? parsed.unlocked : [],
      read: Array.isArray(parsed.read) ? parsed.read : [],
    };
  } catch {
    return DEFAULT;
  }
}

export function saveEconomy(e: Economy) {
  try {
    localStorage.setItem(KEY, JSON.stringify(e));
  } catch {
    /* ignore */
  }
}

export function addCoins(amount: number): Economy {
  const e = loadEconomy();
  e.coins = Math.max(0, e.coins + amount);
  saveEconomy(e);
  return e;
}

export function spendCoins(amount: number): Economy | null {
  const e = loadEconomy();
  if (e.coins < amount) return null;
  e.coins -= amount;
  saveEconomy(e);
  return e;
}

export function unlockStory(storyId: string, cost: number): Economy | null {
  const e = loadEconomy();
  if (e.unlocked.includes(storyId)) return e;
  if (e.coins < cost) return null;
  e.coins -= cost;
  e.unlocked.push(storyId);
  saveEconomy(e);
  return e;
}

export function isUnlocked(storyId: string, access: "free" | "premium"): boolean {
  if (access === "free") return true;
  const e = loadEconomy();
  return e.unlocked.includes(storyId);
}

export function setStoryPage(storyId: string, page: number) {
  const e = loadEconomy();
  e.storyPage[storyId] = page;
  saveEconomy(e);
}

export function markRead(storyId: string, reward: number): Economy {
  const e = loadEconomy();
  let updated = false;
  if (!e.read.includes(storyId)) {
    e.read.push(storyId);
    e.coins += reward;
    updated = true;
  }
  if (updated) saveEconomy(e);
  return e;
}

/**
 * Claim today's daily reward. Returns the new economy and whether it was
 * already claimed today (in which case no coins are awarded).
 */
export function claimDaily(
  todayKey: string,
  reward = 5,
): { economy: Economy; alreadyClaimed: boolean } {
  const e = loadEconomy();
  if (e.daily.lastClaimed === todayKey) {
    return { economy: e, alreadyClaimed: true };
  }
  // streak: continued if the previous claim was yesterday by string compare
  // (we just check that it is exactly 1 day before today).
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  })();
  if (e.daily.lastClaimed === yesterday) {
    e.daily.streak += 1;
  } else {
    e.daily.streak = 1;
  }
  e.daily.longestStreak = Math.max(e.daily.longestStreak, e.daily.streak);
  e.daily.lastClaimed = todayKey;
  e.coins += reward;
  saveEconomy(e);
  return { economy: e, alreadyClaimed: false };
}

export function recordQuizResult(score: number): Economy {
  const e = loadEconomy();
  e.quiz.bestScore = Math.max(e.quiz.bestScore, score);
  e.quiz.timesPlayed += 1;
  // 1 coin per correct answer
  e.coins += score;
  saveEconomy(e);
  return e;
}
