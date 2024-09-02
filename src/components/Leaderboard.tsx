import React from "react";
import useUser from "../hooks/UseProfile";
import "./Leaderboard.css";
import { useUsers } from "../hooks/UseUser";
import { LeaderboardRow } from "./LeaderboardRow";
import { useThisWeek } from "../hooks/UseWeek";
import { useSearchParams } from "react-router-dom";
import { useAllStudyProblems, useProblems } from "../hooks/UseProblem";
import { useQueries } from "@tanstack/react-query";
import { getStats } from "../score/score";

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
  const thisWeek = useThisWeek();
  const allProblemsLength = thisWeek.kattis.length + thisWeek.codeforces.length;
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
  const links = thisWeek.links ?? {};
  const [params] = useSearchParams();
  const leaderboard = params.get("leaderboard") || "all";
  const { data: allProblems } = useProblems();
  const { data: allStudyProblems } = useAllStudyProblems();
  const calculatedUsers = useQueries({
    queries: users.map((user) => ({
      queryKey: [leaderboard, "score", user.id],
      queryFn: async () => {
        return allProblems && allStudyProblems
          ? getStats(user, allProblems, allStudyProblems)
          : null;
      },
      enabled: !!allProblems && !!allStudyProblems,
      staleTime: 1000 * 60 * 5,
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
      {thisWeek.topic && (
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
