import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import useUser from "../hooks/UseUser";
import "./Leaderboard.css";
import { Tooltip } from "react-tooltip";
import Flame from "../icons/Flame";
import FlameBorder from "../icons/FlameBorder";
import DeadFlame from "../icons/DeadFlame";
import { BACKEND_URL } from "../App";

async function getTableData() {
  return (await axios.get(`${BACKEND_URL}/get_table`)).data;
}
async function getThisWeek() {
  return (await axios.get(`${BACKEND_URL}/get_this_week`)).data;
}

function WeeklyProblemBox({ solved, allProblemsLength, problemId }) {
  return (
    <div
      className={`center rounded small ${
        solved === 2 ? "bg-green" : solved === 1 ? "outline-green" : ""
      }`}
      style={{ width: `${100 / allProblemsLength}%` }}
      data-tooltip-id={
        "" + solved === 2 ? "solved" : solved === 1 ? "previously-solved" : ""
      }
    >
      {solved === 2 ? "✓" : solved === 1 ? "✓" : ""}
      <Tooltip id="solved">
        {problemId} was solved during the Summer Challenge
      </Tooltip>
      <Tooltip id="previously-solved">
        {problemId} was solved before the Summer Challenge
      </Tooltip>
    </div>
  );
}

function LeaderboardRow({ user, rank, thisWeek, allProblemsLength }) {
  const solvedKattis = new Set(Object.keys(user.kattis_submissions));
  const solvedCodeforces = new Set(Object.keys(user.codeforces_submissions));
  const validSolvedKattis = new Set(
    user.kattis_data.map((problem) => problem.id)
  );
  const validSolvedCodeforces = new Set(
    user.cf_data.problems.map((problem) => problem.id)
  );
  return (
    <div className=" responsive-fg flexCol bg-secondary">
      <div>
        <div className="flexRow">
          {!!thisWeek?.kattis &&
            thisWeek.kattis.map((problemId) => (
              <WeeklyProblemBox
                key="problemId"
                problemId={problemId}
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
        </div>
        <div className="flexRow">
          {!!thisWeek?.codeforces &&
            thisWeek.codeforces.map((problemId) => (
              <WeeklyProblemBox
                key="problemId"
                problemId={problemId}
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
      </div>
      <div className="flexVar w-full wrap">
        <div className="section flexCol">
          <div className="flexRow">
            <div>
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
                  user.cf_data.problems.reduce((a, b) => a + b.difficulty, 0) /
                    user.cf_data.problems.length
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="expBar w-full">
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
  );
}
function formatCodeforcesId(input) {
  const match = input.match(/^(\d+)(\D.*)$/);
  if (match) {
    return `${match[1]}/${match[2]}`;
  } else {
    return input;
  }
}

export function Leaderboard() {
  const query = useQuery({
    queryKey: ["table_data"],
    queryFn: getTableData,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
  const weekQuery = useQuery({
    queryKey: ["this_week"],
    queryFn: getThisWeek,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
  const user = useUser();
  const users = query?.data ?? [];
  const thisWeek = weekQuery?.data;
  if (query.isLoading) {
    return <div>Loading...</div>;
  }
  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }
  const allProblemsLength =
    thisWeek?.kattis?.length ?? 0 + thisWeek?.codeforces?.length ?? 0;
  const solvedProblems = { kattis: {}, codeforces: {} };
  for (const user of users) {
    for (const problem of Object.keys(user.kattis_submissions ?? {})) {
      solvedProblems.kattis[problem] = 1;
    }
    for (const problem of Object.keys(user.codeforces_submissions ?? {})) {
      solvedProblems.codeforces[problem] = 1;
    }
  }
  for (const user of users) {
    for (const problem of user.kattis_data) {
      solvedProblems.kattis[problem.id] = 2;
    }
    for (const problem of user.cf_data.problems) {
      solvedProblems.codeforces[problem.id] = 2;
    }
  }

  return (
    <div className="Leaderboard flexCol w-full align-center">
      {!!thisWeek?.topic && (
        <div className="responsive-fg bg-secondary flexCol">
          <div className="align-center">
            <h4 className="large">Weekly Topic: {thisWeek?.topic}</h4>
          </div>
          <div className="flexRow">
            {!!thisWeek?.kattis &&
              thisWeek.kattis.map((problemId) => (
                <div
                  className={`center rounded py-10 ellipsis ${
                    solvedProblems.kattis[problemId] === 1
                      ? "outline-green"
                      : solvedProblems.kattis[problemId] === 2
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
              thisWeek.codeforces.map((problemId) => (
                <div
                  className={`center rounded py-10 ellipsis ${
                    solvedProblems.codeforces[problemId] === 1
                      ? "outline-green"
                      : solvedProblems.codeforces[problemId] === 2
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
        .filter((a) => !!a.score || a.id === user?.id)
        .sort((a, b) => b.score - a.score)
        .map((user, index) => (
          <LeaderboardRow
            key={user.id}
            user={user}
            rank={index + 1}
            thisWeek={thisWeek}
            allProblemsLength={allProblemsLength}
          />
        ))}
    </div>
  );
}
