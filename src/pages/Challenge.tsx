import React from "react";
import { Leaderboard } from "../components/Leaderboard";
import { Sidebar } from "../components/Sidebar";
export function Component() {
  return (
    <Sidebar>
      <Leaderboard />
    </Sidebar>
  );
}

Component.displayName = "Challenge";
