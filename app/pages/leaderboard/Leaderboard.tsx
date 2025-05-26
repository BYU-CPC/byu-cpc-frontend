import React from "react";
import { Leaderboard } from "../../components/Leaderboard.js";
import { Sidebar } from "../../components/Sidebar.js";
export function Component() {
  return (
    <Sidebar title="CP Leaderboard">
      <Leaderboard />
    </Sidebar>
  );
}

Component.displayName = "Challenge";
