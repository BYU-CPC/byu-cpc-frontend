import { useEffect, StrictMode } from "react";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import firebase from "firebase/compat/app";
import { del, get, set } from "idb-keyval";
import { experimental_createPersister } from "@tanstack/react-query-persist-client";
function createIdbStorage() {
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
export const BACKEND_URL = "https://byu-cpc-backend-tqxfeezgfa-uw.a.run.app";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 * 7, // 1 week
      staleTime: 1000 * 60,
      persister: experimental_createPersister({
        buster: "1.0.0",
        storage: createIdbStorage(),
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        serialize: (persistedQuery) => persistedQuery,
        deserialize: (cached) => cached,
      }),
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => {
      return redirect("/challenge");
    },
  },
  {
    path: "/extension",
    loader: () => {
      return redirect("/challenge/extension");
    },
  },
  {
    path: "/challenge/extension",
    lazy: () => import("./pages/Extension"),
  },
  {
    path: "/challenge",
    lazy: () => import("./pages/Challenge"),
  },
  {
    path: "/challenge/rules",
    lazy: () => import("./pages/Rules"),
  },
  {
    path: "/sign-in",
    lazy: () => import("./pages/SignIn"),
  },
  {
    path: "/profile",
    lazy: () => import("./pages/Profile"),
  },
  {
    path: "/hspc",
    loader: () => {
      window.location.replace("/hspc.html");
      return null;
    },
  },
]);

export default function App() {
  useEffect(() => {
    document.title = "BYU CPC Challenge";
  }, []);
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}
