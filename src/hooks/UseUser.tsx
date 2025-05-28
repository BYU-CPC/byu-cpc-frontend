import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL, setQueryDataPersist } from "./base";
export type User = {
  kattis_username: string;
  codeforces_username: string;
  display_name: string;
  id: string;
  kattis_submissions: Record<string, number>;
  affiliation?: string;
  codeforces_submissions:
    | (Record<
        string,
        { type: "practice" | "contestant" | "virtual"; time: number }
      > & { contests: Record<string, number> })
    | null;
};

async function getUsers(): Promise<User[]> {
  return (await axios.get(`${BACKEND_URL}/get_users`)).data;
}

export const useUsers = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryFn: getUsers,
    queryKey: ["users"],
    staleTime: 1000 * 60 * 5,
  });
  if (query.data) {
    for (const row of query.data) {
      setQueryDataPersist(["user", row.id], row, queryClient);
    }
  }
  return query.data ?? [];
};
