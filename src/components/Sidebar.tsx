import React from "react";
import UserBadge from "./UserBadge";
const Sidebar = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start overflow-hidden h-screen w-screen">
      <div className="w-full flex flex-row bg-secondary md:h-full py-8 px-4 md:min-w-44 md:max-w-64 items-start justify-between">
        <a className="fg-color flex flex-col" href="/challenge">
          <span className="">BYU CPC</span>{" "}
          <span className=" font-normal">Summer Challenge 2024</span>
        </a>
        <UserBadge />
      </div>
      <div className="overflow-hidden flex h-screen w-full">{children}</div>
    </div>
  );
};

export { Sidebar };
