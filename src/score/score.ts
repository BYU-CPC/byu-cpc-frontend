import type { Leaderboard } from "../hooks/UseLeaderboard";
import { AllProblems, StudyProblems } from "../hooks/UseProblem";
import { User } from "../hooks/UseUser";
import { Platform, platformValues } from "../types/platform";

const DIFFICULTY_EXPO = 1.2;
const CONTEST_BONUS = 100;
const DAILY_BONUS = 10;
const getDayFromDate = (date: Date, start: Date) => {
  return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

const kattisDifficultyToExp = (difficulty: number) => {
  return Math.pow(difficulty, DIFFICULTY_EXPO) * 10;
};

const codeforcesDifficultyToExp = (difficulty: number) => {
  return kattisDifficultyToExp(((1 / 25) * difficulty - 17) / 10);
};

const expMap: Record<Platform, (difficulty: number) => number> = {
  codeforces: codeforcesDifficultyToExp,
  kattis: kattisDifficultyToExp,
};
const fallbackDifficulty = {
  kattis: 1.1,
  codeforces: 800,
} as const satisfies Record<Platform, number>;

const get_weekday_from_day = (day: number, start: Date) => {
  return new Date(start.getTime() + day * 1000 * 60 * 60 * 24).getDay();
};

const skippable = (day: number, start: Date) => {
  return get_weekday_from_day(day, start) === 0;
};

const getCurrentStreak = (days: Set<number>, start: Date) => {
  let today = getDayFromDate(new Date(), start);
  let count = days.has(today) ? 1 : 0;
  today--;
  while (days.has(today) || skippable(today, start)) {
    if (days.has(today)) count++;
    today--;
  }
  return count;
};

const getMaximumStreak = (days: number[], start: Date) => {
  const daysSet = new Set(days);
  days.sort((a, b) => a - b);
  let best = 0;
  let cur = 0;
  for (const i of days) {
    if (daysSet.has(i - 1) || (daysSet.has(i - 2) && skippable(i - 1, start))) {
      cur++;
    } else {
      cur = 1;
    }
    best = Math.max(best, cur);
  }
  return best;
};

const getStreaks = (days: number[], start: Date) => {
  return {
    currentStreak: getCurrentStreak(new Set(days), start),
    maximumStreak: getMaximumStreak(days, start),
    isActive: days.includes(getDayFromDate(new Date(), start)),
  };
};

const getExpFromLevel = (level: number) => {
  return level * 100 + (((level - 1) * level) / 2) * 5;
};

const getLevel = (score: number) => {
  const level = Math.floor((-195 + Math.sqrt(38025 + 40 * score)) / 10);
  const nextLevel = Math.round(getExpFromLevel(level + 1) - score);
  const currentExp = Math.round(score - getExpFromLevel(level));
  return { level, nextLevel, currentExp };
};

export function getStats(
  user: User,
  allProblems: AllProblems,
  studyProblems: StudyProblems,
  leaderboard: Leaderboard
) {
  const kattisSubmissions: Record<string, { type: "practice"; time: number }> =
    Object.keys(user.kattis_submissions).reduce(
      (acc, key) => ({
        ...acc,
        [key]: { type: "practice", time: user.kattis_submissions[key] },
      }),
      {}
    );
  const all_submissions = {
    codeforces: user.codeforces_submissions,
    kattis: kattisSubmissions,
  };
  let problemCount = 0;
  const exp = new Map<number, number>();
  const contests = new Set<number>();
  const difficultyTotal = { kattis: 0, codeforces: 0 };
  const difficultyCount = { kattis: 0, codeforces: 0 };
  const maxDifficulty = { kattis: 0, codeforces: 0 };
  const avgDifficulty = { kattis: 0, codeforces: 0 };
  const solvedDuringContest = {
    kattis: new Set<string>(),
    codeforces: new Set<string>(),
  };
  for (const platform of platformValues) {
    for (const [problemId, submission] of Object.entries(
      all_submissions[platform]
    )) {
      if (
        problemId === "contests" ||
        submission.time < leaderboard.start.getTime() / 1000 ||
        submission.time > leaderboard.end.getTime() / 1000
      ) {
        continue;
      }
      solvedDuringContest[platform].add(problemId);
      problemCount += 1;
      const difficulty =
        allProblems[platform][problemId]?.rating ??
        fallbackDifficulty[platform];
      difficultyTotal[platform] += difficulty;
      difficultyCount[platform] += 1;
      maxDifficulty[platform] = Math.max(maxDifficulty[platform], difficulty);
      const day = getDayFromDate(
        new Date(submission.time * 1000),
        leaderboard.start
      );
      const current_exp = exp.get(day) ?? DAILY_BONUS;
      const multiplier =
        submission.type === "contestant" ||
        studyProblems[platform].includes(problemId)
          ? 2
          : 1;
      if (submission.type === "contestant") {
        contests.add(day);
      }
      exp.set(day, current_exp + expMap[platform](difficulty) * multiplier);
    }
    avgDifficulty[platform] =
      Math.round((difficultyTotal[platform] / difficultyCount[platform]) * 10) /
      10;
  }
  const score = Math.round(
    Array.from(exp.values()).reduce((acc, val) => acc + val, 0) +
      contests.size * CONTEST_BONUS
  );
  const level = getLevel(score);
  const streak = getStreaks([...exp.keys()], leaderboard.start);

  return {
    exp,
    contests,
    avgDifficulty,
    maxDifficulty,
    score,
    user,
    problemCount,
    solvedDuringContest,
    level,
    streak,
  };
}

export type UserStats = ReturnType<typeof getStats>;
