import React from "react";
import UserBadge from "./UserBadge";
import LeaderboardSelector from "./LeaderboardSelector";
const Sidebar = ({ children }: React.PropsWithChildren) => {
  const currentUrl = window.location.pathname;
  const isChallenge =
    currentUrl.includes("/challenge") &&
    !currentUrl.includes("/challenge/rules");
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start overflow-hidden h-screen w-screen shadow-md">
      <div className="flex flex-col w-full md:h-full md:min-w-44 md:max-w-64 px-4 py-8 gap-4 bg-secondary">
        <div className="w-full flex flex-row  items-start justify-between">
          <a className="fg-color flex flex-col" href="/challenge">
            <span className="">BYU CPC</span>{" "}
            <span className=" font-normal">Summer Challenge 2024</span>
          </a>
          <UserBadge />
        </div>
        {isChallenge && <LeaderboardSelector />}
      </div>
      <div className="overflow-hidden flex h-screen w-full">{children}</div>
    </div>
  );
};

export { Sidebar };
