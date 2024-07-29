import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../App";
import {
  CodeforcesContest,
  CodeforcesProblem,
  KattisProblem,
} from "../types/platform";
export type User = {
  kattis_username: string;
  codeforces_username: string;
  display_name: string;
  id: string;
  kattis_data: KattisProblem[];
  kattis_submissions: { [key: string]: number };
  cf_data: { problems: CodeforcesProblem[]; contests: CodeforcesContest[] };
  codeforces_submissions: { [key: string]: { type: string; time: number } };
  cur_streak: number;
  max_streak: number;
  days: number[];
  exp: { [key: number]: number };
  score: number;
  is_active: boolean;
  level: number;
  next_level: number;
  cur_exp: number;
};

async function getUsers(): Promise<User[]> {
  return (await axios.get(`${BACKEND_URL}/get_table`)).data;
}

export const useUsers = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryFn: getUsers,
    queryKey: ["users"],
  });
  if (query.data) {
    for (const row of query.data) {
      queryClient.setQueryData(["user", row.id], row, {
        updatedAt: Date.now(),
      });
    }
  }
  return query.data ?? [];
};
