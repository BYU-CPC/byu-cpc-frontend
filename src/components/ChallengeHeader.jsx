import React from "react";
import UserBadge from "./UserBadge";

const ChallengeHeader = ({ children }) => {
  return (
    <div className="flexCol align-center">
      <div className="shadow w-full flexRow space-between space-beneath bg-secondary flex-center m-20">
        <div className="f1" />
        <a href="/challenge">
          <h2 className="f1">
            <span className="hide">BYU CPC</span>{" "}
            <span className="normal">Summer Challenge 2024</span>
          </h2>
        </a>
        <UserBadge />
      </div>
      {children}
    </div>
  );
};

export { ChallengeHeader };
