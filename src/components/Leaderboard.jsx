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

function LeaderboardRow({ user, rank }) {
  return (
    <div className=" responsive-fg flexCol bg-secondary">
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

export function Leaderboard() {
  const query = useQuery({
    queryKey: ["table_data"],
    queryFn: getTableData,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
  const user = useUser();
  const users = query?.data ?? [];
  if (query.isLoading) {
    return <div>Loading...</div>;
  }
  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }
  return (
    <div className="Leaderboard flexCol w-full align-center">
      {users
        .filter((a) => !!a.score || a.id === user?.id)
        .sort((a, b) => b.score - a.score)
        .map((user, index) => (
          <LeaderboardRow key={user.id} user={user} rank={index + 1} />
        ))}
    </div>
  );
}
