import React from "react";
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
    <div className="Leaderboard flexCol w-full align-center">
      {thisWeek?.topic && (
        <div className="responsive-fg bg-secondary flexCol">
          <div className="align-center">
            <h4 className="large text-green-400">
              Weekly Topic: {thisWeek?.topic}
            </h4>
          </div>
          <div className="align-center flexCol">
            <div className="flexRow align-center gap-12 mb-12">
              {Object.keys(links)
                .sort()
                .map((key) => (
                  <a key={key} href={links[key]}>
                    {key}
                  </a>
                ))}
            </div>
          </div>
          <div className="flexRow gap-8">
            {!!thisWeek?.kattis &&
              thisWeek.kattis.map((problemId: string) => (
                <div
                  className={`center rounded py-4 ellipsis shrink-tiny ${
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
                  className={`center rounded py-10 ellipsis shrink-tiny ${
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
