import React from "react";
import UserBadge from "./UserBadge";

const ChallengeHeader = ({ children }) => {
  return (
    <div className="flexCol align-center">
      <div className="shadow w-full flexRow space-between space-beneath bg-secondary flex-center">
        <div className="f1" />
        <a className="fg-color" href="/challenge">
          <h3 className="f1">
            <span className="hide">BYU CPC</span>{" "}
            <span className="normal">Summer Challenge 2024</span>
          </h3>
        </a>
        <UserBadge />
      </div>
      {children}
    </div>
  );
};

export { ChallengeHeader };
