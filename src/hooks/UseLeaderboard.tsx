import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "./base";
import { Platform, platformValues } from "../types/platform";
import { useSearchParams } from "react-router-dom";

export type LeaderboardEntry = { start: Date; end: Date };

export type LeaderboardIndex = Record<string, LeaderboardEntry>;
type LeaderboardResponse = Record<
  string,
  {
    start: number;
    end: number;
  }
>;

const getLeaderboardIndex = async (): Promise<LeaderboardResponse> => {
  const response = await axios.get(`${BACKEND_URL}/leaderboard`);
  return response.data;
};

export const useLeaderboardIndex = () => {
  const query = useQuery({
    queryKey: ["leaderboardIndex"],
    queryFn: () => getLeaderboardIndex(),
    staleTime: 1000 * 60 * 60,
  });
  const transformedData = query.data
    ? Object.fromEntries(
        Object.entries(query.data).map(([key, value]) => [
          key,
          {
            start: new Date(value.start * 1000),
            end: new Date(value.end * 1000),
          },
        ])
      )
    : undefined;
  return { ...query, data: transformedData };
};

type PracticeWeek = string;

export type Leaderboard = {
  practice_set?: Record<
    PracticeWeek,
    { topic: string; links: Record<string, string> } & Partial<
      Record<Platform, string[]>
    >
  >;
  school?: string;
};

export type StudyProblems = Record<Platform, Set<string>>;

const getLeaderboard = async (id: string): Promise<Leaderboard> => {
  return (await axios.get(`${BACKEND_URL}/leaderboard/${id}`)).data;
};

export const useLeaderboard = (id: string) => {
  const query = useQuery({
    queryKey: ["leaderboard", id],
    queryFn: () => getLeaderboard(id),
    staleTime: 1000 * 60 * 5,
  });
  if (!query.data) return query;
  const practiceSets = Object.entries(query.data.practice_set ?? {})
    .map(([key, value]) => ({ ...value, start: key }))
    .sort((a, b) => a.start.localeCompare(b.start));
  const allProblems = practiceSets.reduce((acc, week) => {
    platformValues.forEach((platform) => {
      const problems = week[platform];
      problems?.forEach((problem) => {
        acc[platform].add(problem);
      });
    });
    return acc;
  }, platformValues.reduce((x, platform) => ({ ...x, [platform]: new Set<string>() }), {}) as StudyProblems);
  const thisWeek = practiceSets.at(practiceSets.length - 1);
  return {
    ...query,
    data: { allProblems, practiceSets, thisWeek },
  };
};

export const useCurrentLeaderboard = () => {
  const [params] = useSearchParams();
  return params.get("leaderboard") ?? "byu_summer_24";
};
