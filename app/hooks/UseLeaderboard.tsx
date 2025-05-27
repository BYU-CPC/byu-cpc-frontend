import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "./base";
import { Platform, platformValues } from "../types/platform";
import { useContext, useEffect } from "react";
import { UserContext } from "~/components/UserContext";
const staticLeaderboardValues = ["week", "all"] as const;

type StaticLearderboard = (typeof staticLeaderboardValues)[number];

export const staticLeaderboardDisplayNames: Record<StaticLearderboard, string> =
  {
    week: "This week",
    all: "All time",
  };
const durations: Record<StaticLearderboard, number> = {
  week: 1000 * 60 * 60 * 24 * 7,
  all: 1000 * 60 * 60 * 24 * 365 * 100,
};

export type LeaderboardEntry = { start: Date; finish: Date };

type LeaderboardResponse = {
  id: string;
  start: number;
  name: string;
  finish: number;
  public_view: boolean;
  public_join: boolean;
};

const getLeaderboardIndex = async (
  userToken?: string
): Promise<LeaderboardResponse[]> => {
  const response = await axios.get(
    `${BACKEND_URL}/leaderboard/all_accessible`,
    { headers: { Authorization: userToken } }
  );
  return response.data;
};

const transformLeaderboardResponse = (response: LeaderboardResponse[]) =>
  response.map((value) => ({
    ...value,
    start: new Date(value.start * 1000),
    finish: new Date(value.finish * 1000),
    publicView: value.public_view,
    publicJoin: value.public_join,
  }));
export const useLeaderboardIndex = () => {
  const { token } = useContext(UserContext);
  const query = useQuery({
    queryKey: ["leaderboardIndex"],
    queryFn: async () =>
      transformLeaderboardResponse(
        await getLeaderboardIndex(token ?? undefined)
      ),
  });
  const staticLeaderboard = Object.fromEntries(
    staticLeaderboardValues.map((key) => [
      key,
      {
        //subtract the milliseconds from today's time since midnight
        id: key,
        publicView: true,
        publicJoin: false,
        start: new Date(Date.now() - durations[key] - (Date.now() % 86400000)),
        finish: new Date(),
        name: staticLeaderboardDisplayNames[key],
      },
    ])
  );
  const transformedData = query.data
    ? Object.fromEntries(query.data.map((value) => [value.id, value]))
    : {};
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

const getJoinedLeaderboards = async (userToken?: string): Promise<string[]> => {
  return (
    await axios.get(`${BACKEND_URL}/leaderboard/joined`, {
      headers: { Authorization: userToken },
    })
  ).data;
};

export const useJoinedLeaderboards = () => {
  const { token } = useContext(UserContext);
  return useQuery({
    queryKey: ["joinedLeaderboards"],
    queryFn: () => getJoinedLeaderboards(token ?? undefined),
    staleTime: 1000,
  });
};

const getMyLeaderboards = async (
  userToken?: string
): Promise<LeaderboardResponse[]> => {
  return (
    await axios.get(`${BACKEND_URL}/leaderboard/created`, {
      headers: { Authorization: userToken },
    })
  ).data;
};

export const useMyLeaderboards = () => {
  const { token } = useContext(UserContext);
  return useQuery({
    queryKey: ["myLeaderboards"],
    queryFn: async () =>
      transformLeaderboardResponse(await getMyLeaderboards(token ?? undefined)),
    staleTime: 1000,
  });
};

type PracticeWeek = string;

type LeaderboardTime = { start: Date; finish: Date } | { period: number };

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
    data: { allProblems, practiceSets, thisWeek, members: query.data.members },
  };
};

type CreateLeaderboardResponse = { id: string };

type UpsertLeaderboardData = {
  id?: string;
  name: string;
  start?: Date;
  finish?: Date;
  publicView: boolean;
  publicJoin: boolean;
};

export const useLeaderboardUpsert = () => {
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  return useMutation({
    mutationKey: ["upsert_leaderboard"],
    mutationFn: async (data: UpsertLeaderboardData) => {
      const { id, name, start, finish, publicView, publicJoin } = data;
      const response = await axios.post(
        `${BACKEND_URL}/leaderboard/upsert`,
        {
          id,
          name,
          start: start ?? null,
          finish: finish ?? null,
          public_view: publicView,
          public_join: publicJoin,
        },
        { headers: { Authorization: token } }
      );
      return response.data as CreateLeaderboardResponse;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myLeaderboards"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboardIndex"] });
    },
  });
};
