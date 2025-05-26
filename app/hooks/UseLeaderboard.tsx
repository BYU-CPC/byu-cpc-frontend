import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "./base";
import { Platform, platformValues } from "../types/platform";
import { useSearchParams } from "react-router-dom";
const staticLeaderboardValues = [
  "week",
  "three_months",
  "six_months",
  "year",
  "all",
] as const;

type StaticLearderboard = (typeof staticLeaderboardValues)[number];

export const staticLeaderboardDisplayNames: Record<StaticLearderboard, string> =
  {
    week: "This week",
    three_months: "3 months",
    six_months: "6 months",
    year: "This year",
    all: "All time",
  };
const durations: Record<StaticLearderboard, number> = {
  week: 1000 * 60 * 60 * 24 * 7,
  three_months: 1000 * 60 * 60 * 24 * 30 * 3,
  six_months: 1000 * 60 * 60 * 24 * 30 * 6,
  year: 1000 * 60 * 60 * 24 * 365,
  all: 1000 * 60 * 60 * 24 * 365 * 100,
};

export type LeaderboardEntry = { start: Date; end: Date };

export type LeaderboardIndex = Record<string, LeaderboardEntry>;
type LeaderboardResponse = Record<
  string,
  {
    start: number;
    name?: string;
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
  const staticLeaderboard = Object.fromEntries(
    staticLeaderboardValues.map((key) => [
      key,
      {
        //subtract the milliseconds from today's time since midnight
        start: new Date(Date.now() - durations[key] - (Date.now() % 86400000)),
        end: new Date(),
        name: staticLeaderboardDisplayNames[key],
      },
    ])
  );
  const transformedData = query.data
    ? Object.fromEntries(
        Object.entries(query.data).map(([key, value]) => [
          key,
          {
            ...value,
            start: new Date(value.start * 1000),
            end: new Date(value.end * 1000),
          },
        ])
      )
    : undefined;
  const data = {
    combined: { ...(transformedData ?? {}), ...staticLeaderboard },
    dynamic: transformedData,
    static: staticLeaderboard,
  };
  return {
    ...query,
    data,
  };
};

type PracticeWeek = string;

type LeaderboardTime = { start: Date; end: Date } | { period: number };

export type Leaderboard = {
  practice_set?: Record<
    PracticeWeek,
    { topic: string; links: Record<string, string> } & Partial<
      Record<Platform, string[]>
    >
  >;
  name: string;
  rules?: string;
  scoring?: unknown;
  created_by_id?: string;
  members: string[];
  can_join: boolean;
  has_joined: boolean;
} & LeaderboardTime;

export type StudyProblems = Record<Platform, Set<string>>;

const getLeaderboard = async (
  id: string,
  invitationId?: string
): Promise<Leaderboard | null> => {
  if (staticLeaderboardValues.includes(id as StaticLearderboard)) return null;
  return (
    await axios.get(`${BACKEND_URL}/leaderboard/${id}`, {
      params: { invitation_id: invitationId },
    })
  ).data;
};

export const useLeaderboard = (id: string, invitationId?: string) => {
  const query = useQuery({
    queryKey: ["leaderboard", id, invitationId],
    queryFn: () => getLeaderboard(id, invitationId),
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
  const [params, setParams] = useSearchParams();
  return [params.get("leaderboard") ?? "week", setParams] as const;
};

type CreateLeaderboardResponse = { id: string };

export const useCreateLeaderboard = async () => {
  return useMutation({
    mutationFn: async ({
      name,
      rules,
      publicView,
      publicJoin,
      scoring,
    }: {
      name: string;
      rules?: string;
      scoring?: string;
      publicView: boolean;
      publicJoin: boolean;
    } & LeaderboardTime) => {
      const response = await axios.post(`${BACKEND_URL}/create_leaderboard`, {
        name,
        rules,
        public_view: publicView,
        public_join: publicJoin,
        scoring,
      });
      return response.data as CreateLeaderboardResponse;
    },
  });
};
