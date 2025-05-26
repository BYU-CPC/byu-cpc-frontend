import React from "react";
import { useLeaderboardIndex } from "../hooks/UseLeaderboard";
import { useDebounce } from "use-debounce";
import ProgressBar from "./ProgressBar";

const formatTime = (time: number) => {
  if (time < 0) {
    return "Ended";
  }
  const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, "0");
  const minutes = String(Math.floor((time / (1000 * 60)) % 60)).padStart(
    2,
    "0"
  );
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  if (days) return `${days} days, ${hours}:${minutes}:${seconds}`;
  return `${hours}:${minutes}:${seconds}`;
};

//Take in react props like classname
function Countdown({
  leaderboard,
  className,
  fontSize,
}: {
  leaderboard: string;
  className?: string;
  fontSize?: string;
}) {
  const { data } = useLeaderboardIndex();
  const board = data.combined?.[leaderboard];
  const currentTime = useDebounce(new Date(), 500)[0];
  if (!board) return null;
  const timeDisplay = formatTime(board.end.getTime() - currentTime.getTime());
  const progress =
    (currentTime.getTime() - (board.start.getTime() ?? 0)) /
    ((board.end.getTime() ?? 1) - (board.start.getTime() ?? 0));
  return (
    <ProgressBar
      progress={progress}
      display={timeDisplay}
      className={className}
      fontSize={fontSize}
    />
  );
}

export default Countdown;
