import { useEffect, StrictMode } from "react";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import firebase from "firebase/compat/app";
const config = {
  apiKey: "AIzaSyAIGt00sW24vecwBlgXJNyVKFje3ma9HqM",
  authDomain: "byu-cpc.firebaseapp.com",
};
firebase.initializeApp(config);
export const BACKEND_URL = "https://byu-cpc-backend-tqxfeezgfa-uw.a.run.app";
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => {
      return redirect("/challenge");
    },
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
