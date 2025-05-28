import { createRootRoute, createRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import React from "react";
import { Router } from "@tanstack/react-router";
import { z } from "zod";
import LeaderboardIndex from "../pages/leaderboard/LeaderboardIndex";
import Extension from "../pages/Extension";
import Rules from "../pages/Rules";
import SignIn from "../pages/SignIn";
import Profile from "../pages/Profile";
import Edit from "../pages/leaderboard/Edit";
import LeaderboardPage from "../pages/leaderboard/Leaderboard";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});
export const rootPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <LeaderboardIndex />,
});
export const extensionPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/extension",
  component: () => <Extension />,
});
export const rulesPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rules",
  component: () => <Rules />,
});
export const signInPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: () => <SignIn />,
});
export const profilePage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => <Profile />,
});
export const leaderboardIndexPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: () => <LeaderboardIndex />,
});

export const leaderboardEditPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard/edit",
  component: () => <Edit />,
});

export const leaderboardPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard/$leaderboardId",
  component: () => <LeaderboardPage />,
  validateSearch: z.object({
    invitationId: z.string().optional(),
  }),
});

const routeTree = rootRoute.addChildren([
  rootPage,
  extensionPage,
  rulesPage,
  signInPage,
  profilePage,
  leaderboardIndexPage,
  leaderboardEditPage,
  leaderboardPage,
]);

export const router = new Router({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});
