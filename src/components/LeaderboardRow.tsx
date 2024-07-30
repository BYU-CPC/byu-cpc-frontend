import { Tooltip } from "react-tooltip";
import Flame from "../icons/Flame";
import FlameBorder from "../icons/FlameBorder";
import DeadFlame from "../icons/DeadFlame";
import React from "react";
import { User } from "../hooks/UseUser";
import { useThisWeek } from "../hooks/UseWeek";
function WeeklyProblemBox({
  solved,
  allProblemsLength,
}: {
  solved: number;
  allProblemsLength: number;
}) {
  return (
    <div
      className={`center rounded tiny transparent ${
        solved === 2 ? "bg-green" : solved === 1 ? "outline-green" : ""
      }`}
      style={{ width: `${100 / allProblemsLength}%` }}
    >
      ✓
    </div>
  );
}

type LeaderboardRowProps = {
  user: User;
  rank: number;
  isMe: boolean;
};

export function LeaderboardRow({ user, rank, isMe }: LeaderboardRowProps) {
  const thisWeek = useThisWeek();
  const allProblemsLength = thisWeek.kattis.length + thisWeek.codeforces.length;
  const solvedKattis = new Set(Object.keys(user.kattis_submissions));
  const solvedCodeforces = new Set(Object.keys(user.codeforces_submissions));
  const validSolvedKattis = new Set(
    user.kattis_data.map((problem) => problem.id)
  );
  const validSolvedCodeforces = new Set(
    user.cf_data.problems.map((problem) => problem.id)
  );
  return (
    <div className="bg-secondary responsive-fg">
      <div className={"flexCol  rounded " + (isMe ? "highlight" : "")}>
        <div className="flexRow gap-8">
          {!!thisWeek?.kattis &&
            thisWeek.kattis.map((problemId: string) => (
              <WeeklyProblemBox
                key={problemId}
                solved={
                  validSolvedKattis.has(problemId)
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
                  validSolvedCodeforces.has(problemId)
                    ? 2
                    : solvedCodeforces.has(problemId)
                    ? 1
                    : 0
                }
                allProblemsLength={allProblemsLength}
              />
            ))}
        </div>
        <div className="flexVar w-full wrap">
          <div className="section flexCol">
            <div className="flexRow">
              <div className={isMe ? "highlight-text" : ""}>
                {rank}. <span className="bold">{user.display_name} </span>
              </div>
              <div
                className="streak relative flex-center "
                data-tooltip-id={user.id + "-streak"}
              >
                {user.cur_streak > 0 && (
                  <div
                    className={
                      "z1 relative streakText bold pop-shadow " +
                      (user.is_active ? "fg-white" : "")
                    }
                  >
                    {user.cur_streak}
                  </div>
                )}
                {user.is_active ? (
                  <Flame className="bgImage full flame" />
                ) : user.cur_streak ? (
                  <FlameBorder className="bgImage full flame" />
                ) : (
                  <DeadFlame className="bgImage full flame" />
                )}
              </div>
            </div>
            <div className="flexRow gap-12">
              <div>
                <span className="small">Lv.</span>{" "}
                <span className="bold">{user.level}</span>
              </div>
              <div>
                <span className="small">Score:</span>{" "}
                <span className="">{user.score}</span>
              </div>
            </div>
          </div>
          <div className="flexRow gap-12 wrap section">
            <div>{user.days.length} days</div>
            <div>{user.cf_data.contests.length} contests</div>
            <div>
              {user.cf_data.problems.length + user.kattis_data.length} problems
            </div>
          </div>
          <div className="flexRow  gap-12 section">
            <div>Avg. Diff.</div>
            {!!user.kattis_data.length && (
              <div
                className="flexRow   gap-12"
                data-tooltip-id={user.id + "-kattis"}
              >
                <div>Kattis</div>
                <div className="bold">
                  {Math.round(
                    (user.kattis_data.reduce((a, b) => a + b.difficulty, 0) /
                      user.kattis_data.length) *
                      10
                  ) / 10}
                </div>
              </div>
            )}
            {!!user.cf_data.problems.length && (
              <div
                className="flexRow  gap-12"
                data-tooltip-id={user.id + "-codeforces"}
              >
                <div>Codeforces</div>
                <div className="bold">
                  {Math.round(
                    user.cf_data.problems.reduce(
                      (a, b) => a + b.difficulty,
                      0
                    ) / user.cf_data.problems.length
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="expBar w-full" data-tooltip-id={user.id + "-exp"}>
          <div
            className="expBarFill h-full"
            style={{
              width: `${
                (user.cur_exp / (user.cur_exp + user.next_level)) * 100
              }%`,
            }}
          />
        </div>
        <Tooltip id={user.id + "-streak"}>
          <div>
            <div>Current Streak: {user.cur_streak}</div>
            <div>Best Streak: {user.max_streak}</div>
          </div>
        </Tooltip>
        <Tooltip id={user.id + "-exp"}>
          {user.cur_exp} / {user.cur_exp + user.next_level} XP
        </Tooltip>
        <Tooltip id={user.id + "-kattis"}>
          <div>
            <div>
              <div>
                Avg difficulty:{" "}
                {Math.round(
                  (user.kattis_data.reduce((a, b) => a + b.difficulty, 0) /
                    user.kattis_data.length) *
                    10
                ) / 10}
              </div>
              <div>
                Max difficulty:{" "}
                {Math.max(
                  ...user.kattis_data.map((problem) => problem.difficulty)
                )}
              </div>
            </div>
          </div>
        </Tooltip>
        <Tooltip id={user.id + "-codeforces"}>
          <div>
            <div>
              <div>
                Avg difficulty:{" "}
                {Math.round(
                  user.cf_data.problems.reduce((a, b) => a + b.difficulty, 0) /
                    user.cf_data.problems.length
                )}
              </div>
              <div>
                Max difficulty:{" "}
                {Math.max(
                  ...user.cf_data.problems.map((problem) => problem.difficulty)
                )}
              </div>
            </div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
