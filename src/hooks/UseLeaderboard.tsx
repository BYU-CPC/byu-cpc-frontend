import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "./base";

export type Leaderboard = { start: Date; end: Date };

export type LeaderboardIndex = Record<string, Leaderboard>;
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
