import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
export const BUSTER = "1.0.3";
import { del, get, set } from "idb-keyval";
import firebase from "firebase/compat/app";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";
import {
  experimental_createQueryPersister,
  type AsyncStorage,
  type PersistedQuery,
} from "@tanstack/react-query-persist-client";
import "./index.css";
import { useUser } from "./hooks/UseProfile";
import { UserContext } from "./components/UserContext";
function createIdbStorage(): AsyncStorage<PersistedQuery> {
  return {
    getItem: async (key) => await get(key),
    setItem: async (key, value) => await set(key, value),
    removeItem: async (key) => await del(key),
  };
}
const config = {
  apiKey: "AIzaSyAIGt00sW24vecwBlgXJNyVKFje3ma9HqM",
  authDomain: "byu-cpc.firebaseapp.com",
};
firebase.initializeApp(config);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 * 7, // 1 week
      staleTime: 1000,
      persister: experimental_createQueryPersister({
        buster: BUSTER,
        storage: createIdbStorage(),
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        serialize: (persistedQuery) => persistedQuery,
        deserialize: (cached) => cached,
      }).persisterFn,
    },
  },
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const Wrapped = () => {
  const { user, token, isPending } = useUser();
  return (
    <UserContext.Provider value={{ user, token, isPending }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
};
const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Wrapped />
      </QueryClientProvider>
    </StrictMode>
  );
}
