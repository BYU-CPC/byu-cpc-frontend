import { set } from "idb-keyval";
import { type QueryClient } from "@tanstack/react-query";
export const BACKEND_URL = "http://localhost:5000";
//  "https://byu-cpc-backend-433866642768.us-west1.run.app";
export const BUSTER = "1.0.3";

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
