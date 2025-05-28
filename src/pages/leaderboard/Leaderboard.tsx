import React from "react";
import { Leaderboard } from "../../components/Leaderboard.js";
import { Sidebar } from "../../components/Sidebar.js";
import { leaderboardPage } from "~/routes/index.js";
export default function LeaderboardPage() {
  const { leaderboardId } = leaderboardPage.useParams();
  return (
    <Sidebar title="CP Leaderboard" leaderboard={leaderboardId}>
      <Leaderboard leaderboard={leaderboardId} />
    </Sidebar>
  );
}
