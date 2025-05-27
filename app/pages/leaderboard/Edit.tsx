import React, { useEffect } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";
import { Sidebar } from "../../components/Sidebar.js";
import { useUserProfile } from "../../hooks/UseProfile.js";
import firebase from "firebase/compat/app";
import { redirect } from "react-router";
import {
  useLeaderboardIndex,
  useLeaderboardUpsert,
  useMyLeaderboards,
} from "~/hooks/UseLeaderboard.js";

import { Input, Checkbox, NumberInput } from "../../components/Input";
const Separator = () => {
  return <div className="w-full h-px bg-gray-300 my-4" />;
};

type LeaderboardFormFields = {
  name: string;
  start: number | null;
  finish: number | null;
  publicView: boolean;
  publicJoin: boolean;
};

const fields = ["name", "start", "finish", "publicView", "publicJoin"] as const;
const types = {
  name: "string",
  start: "number",
  finish: "number",
  publicView: "boolean",
  publicJoin: "boolean",
};

const labels = {
  name: "Leaderboard name",
  start: "Start date (UTC seconds)",
  finish: "Finish date (UTC seconds)",
  publicView: "Public view",
  publicJoin: "Public join",
};

const explanations = {
  name: () => "",
  start: (start: number | null) =>
    start === null ? "" : new Date(start * 1000).toLocaleString(),
  finish: (finish: number | null) =>
    finish === null ? "" : new Date(finish * 1000).toLocaleString(),
  publicView: (set: boolean) =>
    set
      ? "Anyone will be able to view this leaderboard."
      : "Only those with the invite link can view this leaderboard.",
  publicJoin: (set: boolean) =>
    set
      ? "Anyone will be able to join this leaderboard."
      : "Only those with the invite link can join this leaderboard.",
} as const;
const EditBody = ({
  close,
  id,
  initialState,
  otherLeaderboardNames,
}: {
  close: () => void;
  initialState?: LeaderboardFormFields;
  id?: string;
  otherLeaderboardNames: string[];
}) => {
  const { mutateAsync, isPending } = useLeaderboardUpsert();
  const getInitialState = () => {
    if (initialState) return initialState;
    return {
      name: "",
      start: null,
      finish: null,
      publicView: false,
      publicJoin: false,
    };
  };
  const [state, setState] = useState<LeaderboardFormFields>(getInitialState());
  const [errors, setErrors] = useState<
    Partial<Record<keyof LeaderboardFormFields, string>>
  >({});

  useEffect(() => {
    if (state.publicJoin && !state.publicView) {
      setState((prev) => ({
        ...prev,
        publicView: true,
      }));
    }
    if (state.publicView && !state.publicJoin) {
      setState((prev) => ({
        ...prev,
        publicView: false,
      }));
    }
  }, [state.publicJoin]);
  const hasDiff = (() => {
    if (!initialState) return true;
    return Object.keys(state).some(
      (key) =>
        state[key as keyof LeaderboardFormFields] !==
        initialState[key as keyof LeaderboardFormFields]
    );
  })();

  return (
    <Collapsible.Content className="CollapsibleContent p-4 bg-secondary rounded w-full flex flex-col gap-6 border border-gray-300">
      {fields.map((field) => {
        const type = types[field];
        const value = state[field];
        const error = errors[field];
        const label = labels[field];
        // @ts-ignore
        const explanation = explanations[field](value);

        return (
          <div key={field} className="flex flex-col">
            <div className="flex flex-row items-center justify-between">
              {label}
              {type === "string" ? (
                <Input
                  value={value as string}
                  setValue={(val) =>
                    setState((prev) => ({
                      ...prev,
                      [field]: val,
                    }))
                  }
                />
              ) : type === "number" ? (
                <NumberInput
                  value={value as number | null}
                  setValue={(val) =>
                    setState((prev) => ({
                      ...prev,
                      [field]: val,
                    }))
                  }
                />
              ) : type === "boolean" ? (
                <Checkbox
                  value={value as boolean}
                  disabled={field === "publicView" && state.publicJoin}
                  setValue={(val) =>
                    setState((prev) => ({
                      ...prev,
                      [field]: val,
                    }))
                  }
                />
              ) : null}
            </div>
            <span className="text-gray-500 text-sm">{explanation}</span>
            <span className="text-red-500 text-sm">{error}</span>
          </div>
        );
      })}
      <button
        disabled={isPending || !hasDiff}
        onClick={async () => {
          let anyErrors = false;
          const setError = (
            field: keyof LeaderboardFormFields,
            message: string
          ) => {
            anyErrors = true;
            setErrors((prev) => ({
              ...prev,
              [field]: message,
            }));
          };
          setErrors({});
          if (!state.name) {
            setError("name", "Leaderboard name is required.");
          }
          if (state.name.length < 3) {
            setError("name", "Leaderboard name must be at least 3 characters.");
          }
          if (
            otherLeaderboardNames.includes(state.name) &&
            state.name !== initialState?.name
          ) {
            setError("name", "Leaderboard name must be unique.");
          }
          if (state.start !== null && state.finish !== null) {
            if (state.start >= state.finish) {
              setError("start", "Start date must be before finish date.");
            }
          }
          if (!anyErrors) {
            //submit
            await mutateAsync({
              ...state,
              start: state.start ? new Date(state.start * 1000) : undefined,
              finish: state.finish ? new Date(state.finish * 1000) : undefined,
              id,
            });

            setState(getInitialState());
            close();
          }
        }}
        className="mt-4"
      >
        Submit
      </button>
    </Collapsible.Content>
  );
};

const AddLeaderboard = ({
  otherLeaderboardNames,
}: {
  otherLeaderboardNames: string[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center mt-4">
      <Collapsible.Root
        open={open}
        onOpenChange={setOpen}
        className="w-[80%] flex flex-col items-center justify-center gap-4"
      >
        <Collapsible.Trigger className="rounded">
          {open ? "- Cancel" : "+ Create leaderboard"}
        </Collapsible.Trigger>
        <EditBody
          close={() => setOpen(false)}
          otherLeaderboardNames={otherLeaderboardNames}
        />
      </Collapsible.Root>
    </div>
  );
};

type LeaderboardInfo = ReturnType<
  typeof useLeaderboardIndex
>["data"]["dynamic"][string];

const LeaderboardRow = ({
  otherLeaderboardNames,
  info,
}: {
  info: LeaderboardInfo;
  otherLeaderboardNames: string[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={(o) => setOpen(o)}>
      <div className="flex flex-col w-full gap-6">
        <div className="flex flex-row items-center gap-16">
          <a href={`/leaderboard/${info.id}`} key={info.id}>
            <h2 className="text-lg font-bold">{info.name}</h2>
          </a>
          <Collapsible.Trigger className="rounded text-xs">
            Edit
          </Collapsible.Trigger>
          <button className="rounded text-xs">Copy invitation url</button>
        </div>
        <EditBody
          close={() => setOpen(false)}
          otherLeaderboardNames={otherLeaderboardNames}
          initialState={{
            ...info,
            start: info.start?.getTime() / 1000,
            finish: info.finish?.getTime() / 1000,
          }}
          id={info.id}
        />
        <Separator />
      </div>
    </Collapsible.Root>
  );
};

export default function Component() {
  const { data: leaderboards = [] } = useMyLeaderboards();
  const user = firebase.auth().currentUser;
  if (!user) redirect("/sign-in");
  const { data: profile, isLoading, isError } = useUserProfile();
  if (isLoading || !profile) return <div>Loading...</div>;
  if (isError) return <div>Error loading profile</div>;
  const otherLeaderboardNames = leaderboards.map((board) => board.name);
  return (
    <Sidebar title="My leaderboards">
      <div className="flex w-full p-6">
        <div className="bg-secondary rounded p-6 flex w-full flex-col">
          My leaderboards
          <Separator />
          {!leaderboards.length && (
            <>
              <div className="text-gray-500 flex items-center justify-center">
                You have not created any leaderboards yet.
              </div>
              <Separator />
            </>
          )}
          {leaderboards.map((board) => (
            <LeaderboardRow
              key={board.id}
              info={board}
              otherLeaderboardNames={otherLeaderboardNames.filter(
                (name) => name !== board.name
              )}
            />
          ))}
          <AddLeaderboard otherLeaderboardNames={otherLeaderboardNames} />
        </div>
      </div>
    </Sidebar>
  );
}
