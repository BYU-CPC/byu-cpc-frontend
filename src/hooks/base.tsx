import { set } from "idb-keyval";
import { type QueryClient } from "@tanstack/react-query";
import { BUSTER } from "../main";
// @ts-ignore
const environment = import.meta.env.DEV ? "development" : "production";
export const BACKEND_URL =
  environment === "development"
    ? "http://localhost:5000"
    : "https://api.cpleaderboard.com";
export const FRONTEND_URL =
  environment === "development"
    ? "http://localhost:5173"
    : "https://cpleaderboard.com";

export function setQueryDataPersist<T>(
  key: string[],
  data: T,
  client: QueryClient
) {
  client.setQueryData(key, data, { updatedAt: Date.now() });
  const queryKey = `tanstack-query-${JSON.stringify(key)}`;
  const queryState = client.getQueryData(key);
  set(queryKey, {
    state: queryState,
    queryKey,
    queryHash: JSON.stringify(key),
    buster: BUSTER,
  });
}
