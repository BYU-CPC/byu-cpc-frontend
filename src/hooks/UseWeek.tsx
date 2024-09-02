import axios from "axios";
import { BACKEND_URL } from "./base";
import { useQuery } from "@tanstack/react-query";

type Week = {
  codeforces?: string[];
  kattis?: string[];
  topic: string;
  start: string;
  links?: { [key: string]: string };
};

async function getThisWeek(): Promise<Week> {
  return (await axios.get(`${BACKEND_URL}/get_this_week`)).data;
}
export const useThisWeek = () => {
  const weekQuery = useQuery({
    queryKey: ["this_week"],
    queryFn: getThisWeek,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });
  const data = weekQuery.data;
  if (!data) return { codeforces: [], kattis: [], topic: "", start: "" };
  return {
    ...data,
    kattis: data.kattis ?? [],
    codeforces: data.codeforces ?? [],
  };
};
