import {
  useJoinedLeaderboards,
  useLeaderboardIndex,
} from "../hooks/UseLeaderboard";
import React, { useEffect } from "react";
import Countdown from "./Countdown";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useIsMobile } from "../hooks/UseIsMobile";
import DownArrow from "../icons/DownArrow";

export default function LeaderboardSelector({
  leaderboard,
}: {
  leaderboard?: string;
}) {
  const { data } = useLeaderboardIndex();
  const { data: joined } = useJoinedLeaderboards();
  const { isMobile } = useIsMobile();
  const [open, setOpen] = React.useState(!isMobile);
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);
  const leaderboardItems = Object.entries(data.combined)
    .filter(
      ([key]) => joined?.includes(key) || Object.keys(data.static).includes(key)
    )
    .map(([key, board]) => (
      <LeaderboardSelectorItem
        id={key}
        key={key}
        isSelected={key === leaderboard}
        isDynamic={!!data.dynamic?.hasOwnProperty(key)}
        name={board.name ?? key}
      />
    ));
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="w-full">
      <Collapsible.Trigger className="w-full mb-2 rounded">
        <div className="w-full flex flex-row items-center gap-2">
          {leaderboard && (
            <LeaderboardSelectorItem
              id={leaderboard}
              isSelected={false}
              isDynamic={false}
              name={data.combined[leaderboard]?.name}
            />
          )}
          <div
            className={"transition-all "}
            style={{
              transform: open ? "scaleY(-1)" : "scaleY(1)",
            }}
          >
            <DownArrow height="16" width="16" fill="var(--fg-color)" />
          </div>
        </div>
      </Collapsible.Trigger>
      <div className="flex flex-col w-full gap-2">
        {leaderboardItems.map((item) => (
          <Collapsible.Content
            key={item.key}
            className="CollapsibleContent w-full"
          >
            {item}
          </Collapsible.Content>
        ))}
      </div>
    </Collapsible.Root>
  );
}

const LeaderboardSelectorItem = ({
  id,
  isSelected,
  isDynamic,
  name,
}: {
  id: string;
  isSelected: boolean;
  isDynamic: boolean;
  name: string;
}) => {
  return (
    <a
      style={{
        background: isSelected
          ? `linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color-two) 100%)`
          : undefined,
        color: isSelected ? "var(--bg-color)" : "var(--fg-color)",
      }}
      className="flex flex-col border-none gap-1 py-[1px] rounded-md bg-[var(--bg-tertiary)] hover:bg-[var(--accent-half-opacity)] transition-all w-full items-center"
      href={`/leaderboard/${id}`}
    >
      <span className={" text-nowrap"}>{name}</span>
      {isDynamic && (
        <Countdown
          className={"w-full " + (isSelected ? "opacity-0" : "")}
          fontSize="7px"
          leaderboard={id}
          hideDisplay={true}
        />
      )}
    </a>
  );
};
