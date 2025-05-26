import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("pages/Home.tsx"),
  route("extension", "pages/Extension.tsx"),
  route("rules", "pages/Rules.tsx"),
  route("sign-in", "pages/SignIn.tsx"),
  route("profile", "pages/Profile.tsx"),
  ...prefix("leaderboard", [
    index("pages/leaderboard/LeaderboardIndex.tsx"),
    route("edit", "pages/leaderboard/Edit.tsx"),
    route(":leaderboardId", "pages/leaderboard/Leaderboard.tsx"),
  ]),
] satisfies RouteConfig;
