export enum Platform {
  kattis,
  codeforces,
}

export type KattisProblem = {
  id: string;
  timestamp: number;
  difficulty: number;
};

export type CodeforcesProblem = KattisProblem & { type: string };

export type CodeforcesContest = {
  id: string;
  timestamp: number;
};
