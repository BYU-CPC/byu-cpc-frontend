import React, { useEffect } from "react";
import UserBadge from "./UserBadge";
import LeaderboardSelector from "./LeaderboardSelector";
import { useLocation } from "react-router";
import { useIsMobile } from "~/hooks/UseIsMobile";
const Sidebar = ({
  children,
  leaderboard,
  title,
}: React.PropsWithChildren & { title: string; leaderboard?: string }) => {
  const location = useLocation();
  const isChallenge = location.pathname.includes("/leaderboard");
  const { setWidth } = useIsMobile();
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start overflow-hidden h-screen w-screen shadow-md">
      <div className="flex flex-col w-full md:h-full md:min-w-52 md:max-w-80 px-4 py-8 gap-4 bg-secondary">
        <div className="w-full flex flex-row  items-center justify-between">
          <a className="fg-color flex flex-col" href="/leaderboard">
            <span className="">CPLeaderboard</span>{" "}
          </a>
          <UserBadge />
        </div>
        {isChallenge && <LeaderboardSelector leaderboard={leaderboard} />}
      </div>
      <div className="overflow-hidden flex h-screen w-full">{children}</div>
    </div>
  );
};

export { Sidebar };
