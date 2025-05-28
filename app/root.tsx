import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Route } from "./+types/root";
import React, { StrictMode } from "react";
export const BUSTER = "1.0.3";
import { del, get, set } from "idb-keyval";
import firebase from "firebase/compat/app";
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
export const environment = import.meta.env.DEV ? "development" : "production";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const Wrapped = () => {
  const { user, token, isPending } = useUser();
  if (isPending)
    return <div className="pt-16 p-4 container mx-auto">Loading...</div>;
  return (
    <UserContext.Provider value={{ user, token, isPending }}>
      <Outlet />
    </UserContext.Provider>
  );
};

export default function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Wrapped />
      </QueryClientProvider>
    </StrictMode>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (environment === "development" && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
