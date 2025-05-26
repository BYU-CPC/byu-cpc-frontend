import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }

  interface Future {
    unstable_middleware: false
  }
}

type Params = {
  "/": {};
  "/extension": {};
  "/rules": {};
  "/sign-in": {};
  "/profile": {};
  "/leaderboard": {};
  "/leaderboard/edit": {};
  "/leaderboard/:leaderboardId": {
    "leaderboardId": string;
  };
};