import axios from "axios";
import { BACKEND_URL } from "./base";
import { useQuery } from "@tanstack/react-query";

type Week = {
  codeforces: string[];
  kattis: string[];
  topic: string;
  start: string;
};

async function getThisWeek(): Promise<Week> {
  return (await axios.get(`${BACKEND_URL}/get_this_week`)).data;
}
export const useThisWeek = () => {
  const weekQuery = useQuery({
    queryKey: ["this_week"],
    queryFn: getThisWeek,
    refetchOnWindowFocus: true,
  });
  const data = weekQuery.data;
  if (!data) return { codeforces: [], kattis: [], topic: "", start: "" };
  return weekQuery.data;
};
