export const platformValues = ["kattis", "codeforces"] as const;
export type Platform = (typeof platformValues)[number];
