import { Leaderboard } from "../components/Leaderboard";
import UserBadge from "../components/UserBadge";
export function Component() {
  return (
    <div className="flexCol align-center">
      <div className="shadow w-full flexRow space-between space-beneath bg-secondary flex-center m-20">
        <div className="f1" />
        <h2 className="f1">
          <span className="hide">BYU CPC</span>{" "}
          <span className="normal">Summer Challenge 2024</span>
        </h2>
        <UserBadge />
      </div>
      <Leaderboard />
    </div>
  );
}

Component.displayName = "Challenge";
