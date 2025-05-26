import { Tooltip } from "react-tooltip";
import Flame from "../icons/Flame";
import FlameBorder from "../icons/FlameBorder";
import DeadFlame from "../icons/DeadFlame";
import React from "react";
import { UserStats } from "../score/score";
import ProgressBar from "./ProgressBar";
import { useCurrentLeaderboard, useLeaderboard } from "../hooks/UseLeaderboard";
import FlameIcon from "./FlameIcon";
function WeeklyProblemBox({
  solved,
  allProblemsLength,
}: {
  solved: number;
  allProblemsLength: number;
}) {
  return (
    <div
      className={`center rounded-md tiny transparent ${
        solved === 2 ? "bg-green" : solved === 1 ? "outline-green" : ""
      }`}
      style={{ width: `${100 / allProblemsLength}%`, userSelect: "none" }}
    >
      ✓
    </div>
  );
}
function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

type LeaderboardRowProps = {
  userStats: UserStats;
  rank: number;
  isMe: boolean;
};

export function LeaderboardRow({ userStats, rank, isMe }: LeaderboardRowProps) {
  const userId = userStats.user.id;
  const [leaderboard] = useCurrentLeaderboard();
  const { data } = useLeaderboard(leaderboard);
  const thisWeek = data && "thisWeek" in data ? data.thisWeek : undefined;
  const allProblemsLength =
    (thisWeek?.kattis?.length ?? 0) + (thisWeek?.codeforces?.length ?? 0);
  const solvedKattis = new Set(Object.keys(userStats.user.kattis_submissions));
  const solvedCodeforces = new Set(
    Object.keys(userStats.user.codeforces_submissions ?? {})
  );

  return (
    <div className="bg-secondary w-full rounded-md overflow-hidden flex-none  ">
      <div className={"flex flex-col " + (isMe ? "highlight" : "")}>
        <div className="flex flex-row gap-2">
          {!!thisWeek?.kattis &&
            thisWeek.kattis.map((problemId: string) => (
              <WeeklyProblemBox
                key={problemId}
                solved={
                  userStats.solvedDuringContest["kattis"].has(problemId)
                    ? 2
                    : solvedKattis.has(problemId)
                    ? 1
                    : 0
                }
                allProblemsLength={allProblemsLength}
              />
            ))}
          {!!thisWeek?.codeforces &&
            thisWeek.codeforces.map((problemId: string) => (
              <WeeklyProblemBox
                key={problemId}
                solved={
                  userStats.solvedDuringContest["codeforces"].has(problemId)
                    ? 2
                    : solvedCodeforces.has(problemId)
                    ? 1
                    : 0
                }
                allProblemsLength={allProblemsLength}
              />
            ))}
        </div>
        <div className="flex flex-col md:flex-row items-center w-full  flex-wrap">
          <div className="section flex flex-col">
            <div className="flex flex-row items-center">
              <div className={isMe ? " text-" : ""}>
                {rank}.{" "}
                <span className="bold">{userStats.user.display_name} </span>
              </div>
              <div
                className=" w-9 h-9 flex relative flex-center "
                data-tooltip-id={userId + "-streak"}
              >
                {userStats.streak.currentStreak > 0 && (
                  <div
                    className={
                      "z-10 relative text-xs font-black " +
                      (userStats.streak.isActive ? "fg-white" : "")
                    }
                  >
                    {userStats.streak.currentStreak}
                  </div>
                )}
                {userStats.streak.isActive ? (
                  <FlameIcon>
                    <Flame />
                  </FlameIcon>
                ) : userStats.streak.currentStreak ? (
                  <FlameIcon>
                    <FlameBorder />
                  </FlameIcon>
                ) : (
                  <FlameIcon>
                    <DeadFlame />
                  </FlameIcon>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-3">
              <div data-tooltip-id={userId + "-exp"}>
                <span className="small">Lv.</span>{" "}
                <span className="bold">{userStats.level.level}</span>
              </div>
              <div>
                <span className="small">Score:</span>{" "}
                <span className="">{numberWithCommas(userStats.score)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-3 flex-wrap section">
            <div>{userStats.exp.size} days</div>
            <div>{userStats.contests.size} contests</div>
            <div>{userStats.problemCount} problems</div>
          </div>
          <div className="flex flex-row  gap-3 section">
            <div>Avg. Diff.</div>
            {!!userStats.avgDifficulty["kattis"] && (
              <div
                className="flex flex-row gap-3"
                data-tooltip-id={userId + "-kattis"}
              >
                <div>Kattis</div>
                <div className="bold">{userStats.avgDifficulty["kattis"]}</div>
              </div>
            )}
            {!!userStats.avgDifficulty["codeforces"] && (
              <div
                className="flex flex-row gap-3"
                data-tooltip-id={userId + "-codeforces"}
              >
                <div>Codeforces</div>
                <div className="bold">
                  {userStats.avgDifficulty["codeforces"]}
                </div>
              </div>
            )}
          </div>
        </div>
        <ProgressBar
          className="translate-y-[-1px]"
          progress={
            userStats.level.currentExp /
            (userStats.level.currentExp + userStats.level.nextLevel)
          }
        />
        <div className="expBar w-full">
          <div
            className="expBarFill h-full"
            style={{
              width: `${
                (userStats.level.currentExp /
                  (userStats.level.currentExp + userStats.level.nextLevel)) *
                100
              }%`,
            }}
          />
        </div>
        <Tooltip id={userId + "-streak"}>
          <div>
            <div>Current Streak: {userStats.streak.currentStreak}</div>
            <div>Best Streak: {userStats.streak.maximumStreak}</div>
          </div>
        </Tooltip>
        <Tooltip id={userId + "-exp"}>
          {userStats.level.currentExp} /{" "}
          {userStats.level.currentExp + userStats.level.nextLevel} XP
        </Tooltip>
        <Tooltip id={userId + "-kattis"}>
          <div>
            <div>
              <div>Avg difficulty: {userStats.avgDifficulty["kattis"]}</div>
              <div>Max difficulty: {userStats.maxDifficulty["kattis"]}</div>
            </div>
          </div>
        </Tooltip>
        <Tooltip id={userId + "-codeforces"}>
          <div>
            <div>
              <div>Avg difficulty: {userStats.avgDifficulty["codeforces"]}</div>
              <div>Max difficulty: {userStats.maxDifficulty["codeforces"]}</div>
            </div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
