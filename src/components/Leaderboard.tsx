import React, { useContext, useEffect } from "react";
import "./Leaderboard.css";
import { useUsers } from "../hooks/UseUser";
import { LeaderboardRow } from "./LeaderboardRow";
import { useProblems } from "../hooks/UseProblem";
import { useQueries } from "@tanstack/react-query";
import { getStats } from "../score/score";
import {
  staticLeaderboardDisplayNames,
  useLeaderboard,
  useLeaderboardIndex,
  useLeaderboardJoin,
} from "../hooks/UseLeaderboard";
import Countdown from "./Countdown";
import { UserContext } from "./UserContext";
import { Link, useSearch } from "@tanstack/react-router";
import { leaderboardPage } from "~/routes";

function formatCodeforcesId(input: string) {
  const match = input.match(/^(\d+)(\D.*)$/);
  if (match) {
    return `${match[1]}/${match[2]}`;
  } else {
    return input;
  }
}

export function Leaderboard({ leaderboard }: { leaderboard: string }) {
  const { user } = useContext(UserContext);
  const users = useUsers();
  const { invitationId } = useSearch({
    from: leaderboardPage.fullPath,
  });
  const { mutateAsync, isPending } = useLeaderboardJoin(
    leaderboard,
    invitationId
  );

  const { data } = useLeaderboard(leaderboard, invitationId);
  const thisWeek = data && "thisWeek" in data ? data.thisWeek : undefined;
  const allStudyProblems =
    data && "allProblems" in data ? data.allProblems : undefined;
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
  const leaderboardData = leaderboardIndex?.combined?.[leaderboard];
  useEffect(() => {
    document.title = leaderboardData?.name ?? "Leaderboard";
  }, [leaderboardData?.name]);

  const isStatic = Object.keys(staticLeaderboardDisplayNames).includes(
    leaderboard
  );

  const calculatedUsers = useQueries({
    queries: users
      .filter((u) => isStatic || data?.members?.includes(u.id))
      .map((user) => ({
        queryKey: [leaderboard, "score", user.id],
        queryFn: async () => {
          return allProblems && leaderboardData
            ? getStats(user, allProblems, leaderboardData, allStudyProblems)
            : undefined;
        },
        enabled: !!allProblems && !!leaderboardData,
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
    <div className="gap-6 flex flex-col w-full items-center overflow-y-scroll p-6">
      {!isStatic &&
        !data?.has_joined &&
        data?.can_join &&
        !data.members?.includes(user?.uid ?? "") && (
          <button disabled={isPending} onClick={() => mutateAsync()}>
            Join
          </button>
        )}
      {!isStatic && (
        <Countdown
          className="w-full  bg-secondary z-[-1] rounded-lg"
          leaderboard={leaderboard}
        />
      )}
      {thisWeek?.topic && (
        <div className="w-full bg-secondary flex flex-col static z-20 mb-[-1.5rem] rounded-t-md">
          <h4 className="large text-center">Weekly Topic: {thisWeek?.topic}</h4>
          <div className="items-center flex flex-col">
            <div className="flex-row flex items-center gap-3  mb-3">
              {Object.keys(links)
                .sort()
                .map((key) => (
                  <Link key={key} to={links[key]}>
                    {key}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
      {thisWeek && (
        <div className="flex flex-row gap-2 md:sticky top-0 w-full z-20 bg-secondary rounded-b-md">
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
      )}
      {calculatedUsers
        .filter((a) => !!a.score || a.user.id === user?.uid)
        .sort((a, b) => b.score - a.score)
        .map((u, i) => (
          <LeaderboardRow
            leaderboard={data}
            key={u.user.id}
            userStats={u}
            rank={i + 1}
            isMe={u.user?.id === user?.uid}
          />
        ))}
    </div>
  );
}
