import React, { useEffect } from "react";
import useUser from "../hooks/UseProfile";
import "./Leaderboard.css";
import { useUsers } from "../hooks/UseUser";
import { LeaderboardRow } from "./LeaderboardRow";
import { useProblems } from "../hooks/UseProblem";
import { useQueries } from "@tanstack/react-query";
import { getStats } from "../score/score";
import {
  useCurrentLeaderboard,
  useLeaderboard,
  useLeaderboardIndex,
} from "../hooks/UseLeaderboard";
import Countdown from "./Countdown";

function formatCodeforcesId(input: string) {
  const match = input.match(/^(\d+)(\D.*)$/);
  if (match) {
    return `${match[1]}/${match[2]}`;
  } else {
    return input;
  }
}

export function Leaderboard() {
  const user = useUser();
  const users = useUsers();
  const leaderboard = useCurrentLeaderboard();

  const { data } = useLeaderboard(leaderboard);
  const thisWeek = data?.thisWeek;
  const allStudyProblems = data?.allProblems;
  const allProblemsLength =
    (thisWeek?.kattis?.length ?? 0) + (thisWeek?.codeforces?.length ?? 0);
  const solvedProblems: {
    kattis: Map<string, number>;
    codeforces: Map<string, number>;
  } = {
    kattis: new Map(),
    codeforces: new Map(),
  };
  for (const user of users) {
    for (const problem of Object.keys(user.kattis_submissions ?? {})) {
      solvedProblems.kattis.set(problem, 1);
    }
    for (const problem of Object.keys(user.codeforces_submissions ?? {})) {
      solvedProblems.codeforces.set(problem, 1);
    }
  }
  const links = thisWeek?.links ?? {};
  const { data: allProblems } = useProblems();
  const { data: leaderboardIndex } = useLeaderboardIndex();
  const leaderboardData = leaderboardIndex?.[leaderboard];
  useEffect(() => {
    document.title = leaderboardData?.name ?? "Leaderboard";
  }, [leaderboardData?.name]);

  const calculatedUsers = useQueries({
    queries: users.map((user) => ({
      queryKey: [leaderboard, "score", user.id],
      queryFn: async () => {
        return allProblems && allStudyProblems && leaderboardData
          ? getStats(user, allProblems, allStudyProblems, leaderboardData)
          : undefined;
      },
      enabled: !!allProblems && !!allStudyProblems && !!leaderboardData,
    })),
    combine: (results) => results.map((r) => r.data).filter((a) => !!a),
  });
  for (const user of calculatedUsers) {
    for (const problem of user.solvedDuringContest["kattis"]) {
      solvedProblems.kattis.set(problem, 2);
    }
    for (const problem of user.solvedDuringContest["codeforces"]) {
      solvedProblems.codeforces.set(problem, 2);
    }
  }
  return (
    <div className="gap-6 flex flex-col w-full items-center overflow-y-scroll pt-6 px-6 md:pt-0">
      {thisWeek?.topic && (
        <div className="w-full bg-secondary flex flex-col static md:sticky top-0 z-20">
          <Countdown leaderboard={leaderboard} />
          <h4 className="large text-center">Weekly Topic: {thisWeek?.topic}</h4>
          <div className="items-center flex flex-col">
            <div className="flex-row flex items-center gap-3  mb-3">
              {Object.keys(links)
                .sort()
                .map((key) => (
                  <a key={key} href={links[key]}>
                    {key}
                  </a>
                ))}
            </div>
          </div>
          <div className="flex flex-row gap-2">
            {!!thisWeek?.kattis &&
              thisWeek.kattis.map((problemId: string) => (
                <div
                  className={`center rounded-md truncate shrink-tiny ${
                    solvedProblems.kattis.get(problemId) === 1
                      ? "outline-green"
                      : solvedProblems.kattis.get(problemId) === 2
                      ? "bg-green"
                      : ""
                  }`}
                  style={{ width: `${100 / allProblemsLength}%` }}
                  key={problemId}
                >
                  <a
                    href={`https://open.kattis.com/problems/${problemId}`}
                    className="fg-color underline "
                  >
                    {problemId}
                  </a>
                </div>
              ))}
            {!!thisWeek?.codeforces &&
              thisWeek.codeforces.map((problemId: string) => (
                <div
                  className={`center rounded-md truncate shrink-tiny ${
                    solvedProblems.codeforces.get(problemId) === 1
                      ? "outline-green"
                      : solvedProblems.codeforces.get(problemId) === 2
                      ? "bg-green"
                      : ""
                  }`}
                  style={{ width: `${100 / allProblemsLength}%` }}
                  key={problemId}
                >
                  <a
                    href={`https://codeforces.com/problemset/problem/${formatCodeforcesId(
                      problemId
                    )}`}
                    className="fg-color underline "
                  >
                    {problemId}
                  </a>
                </div>
              ))}
          </div>
        </div>
      )}
      {calculatedUsers
        .filter((a) => !!a.score || a.user.id === user?.uid)
        .sort((a, b) => b.score - a.score)
        .map((u, i) => (
          <LeaderboardRow
            key={u.user.id}
            userStats={u}
            rank={i + 1}
            isMe={u.user?.id === user?.uid}
          />
        ))}
    </div>
  );
}
