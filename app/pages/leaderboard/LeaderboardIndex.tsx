import React from "react";
import Countdown from "~/components/Countdown";
import { Sidebar } from "~/components/Sidebar";
import { useLeaderboardIndex } from "~/hooks/UseLeaderboard";
type LeaderboardRow = ReturnType<
  typeof useLeaderboardIndex
>["data"]["combined"][string];

const LeaderboardRow = ({
  leaderboard,
  isStatic,
}: {
  leaderboard: LeaderboardRow;
  isStatic: boolean;
}) => {
  return (
    <div className="flex flex-col w-full bg-secondary p-4 rounded">
      <div className="flex flex-row items-center justify-between">
        <a
          href={`/leaderboard/${leaderboard.id}`}
          className="text-lg font-semibold"
        >
          {leaderboard.name}
        </a>
        {!isStatic && (
          <div className="flex flex-row text-sm gap-2">
            from
            <span>{leaderboard.start.toLocaleString()}</span>
            to
            <span>{leaderboard.finish.toLocaleString()}</span>
          </div>
        )}
      </div>
      {!isStatic && <Countdown leaderboard={leaderboard.id} fontSize="3px" />}
    </div>
  );
};

const LeaderboardIndex = () => {
  const { data, isPending } = useLeaderboardIndex();
  if (isPending) {
    return <div>Loading...</div>;
  }
  return (
    <Sidebar title={"Leaderboards"}>
      <div className="flex flex-col gap-6 w-full p-6">
        {Object.entries(data.combined).map(([key, board]) => {
          return (
            <LeaderboardRow
              key={key}
              leaderboard={board}
              isStatic={Object.keys(data.static).includes(key)}
            />
          );
        })}
      </div>
    </Sidebar>
  );
};

export default LeaderboardIndex;
