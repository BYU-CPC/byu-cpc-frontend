import React from "react";
import UserBadge from "./UserBadge";
import { useSearchParams } from "react-router-dom";
import Countdown from "./Countdown";

const Sidebar = ({ children }: React.PropsWithChildren) => {
  const [params] = useSearchParams();
  const leaderboard = params.get("leaderboard") ?? "all";
  return (
    <div className="flexCol align-center">
      <div className="shadow w-full flexRow space-between  bg-secondary flex-center">
        <div className="f1" />
        <a className="fg-color" href="/challenge">
          <h3 className="f1">
            <span className="hide">BYU CPC</span>{" "}
            <span className="normal">Summer Challenge 2024</span>
          </h3>
        </a>
        <UserBadge />
      </div>
      <Countdown leaderboard={leaderboard} className="w-full space-beneath " />
      {children}
    </div>
  );
};

export { Sidebar };
