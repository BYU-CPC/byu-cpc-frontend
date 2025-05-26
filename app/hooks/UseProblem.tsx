import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "./base";
import { Platform } from "../types/platform";
type Problem = { [key: string]: { rating?: number; name?: string } };
export type AllProblems = Record<Platform, Problem>;

async function getAllProblems(): Promise<AllProblems> {
  return (await axios.get(`${BACKEND_URL}/get_all_problems`)).data;
}

export const useProblems = () => {
  return useQuery({
    queryFn: getAllProblems,
    queryKey: ["allProblems"],
    staleTime: 1000 * 60 * 60 * 24,
  });
};
