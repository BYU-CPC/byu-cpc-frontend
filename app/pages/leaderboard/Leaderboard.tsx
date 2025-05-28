import React from "react";
import { useParams } from "react-router-dom";
import { Leaderboard } from "../../components/Leaderboard.js";
import { Sidebar } from "../../components/Sidebar.js";
export default function Component() {
  const { leaderboardId } = useParams<{ leaderboardId?: string }>();
  return (
    <Sidebar title="CP Leaderboard" leaderboard={leaderboardId}>
      <Leaderboard leaderboard={leaderboardId ?? ""} />
    </Sidebar>
  );
}
