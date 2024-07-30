import React from "react";
import useUser from "../hooks/UseProfile";
import "./Leaderboard.css";
import { useUsers } from "../hooks/UseUser";
import { LeaderboardRow } from "./LeaderboardRow";
import { useThisWeek } from "../hooks/UseWeek";

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
  for (const user of users) {
    for (const problem of user.kattis_data) {
      solvedProblems.kattis.set(problem.id, 2);
    }
    for (const problem of user.cf_data.problems) {
      solvedProblems.codeforces.set(problem.id, 2);
    }
  }
  const links = thisWeek.links ?? {};
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
                  <a href={links[key]}>{key}</a>
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
      {users
        .filter((a) => !!a.score || a.id === user?.uid)
        .sort((a, b) => b.score - a.score)
        .map((u, i) => (
          <LeaderboardRow
            key={u.id}
            user={u}
            rank={i + 1}
            isMe={u.id === user?.uid}
          />
        ))}
    </div>
  );
}
