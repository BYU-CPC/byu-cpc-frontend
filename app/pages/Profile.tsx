import React, { FormEvent, useContext } from "react";
import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { useUserProfile } from "../hooks/UseProfile";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { BACKEND_URL } from "../hooks/base";
import { UserContext } from "~/components/UserContext";

async function isPlatformUsernameValid(username: string, platform: string) {
  if (!username) {
    return true;
  }
  const response = await axios.post(`${BACKEND_URL}/validate_username`, {
    username,
    platform,
  });
  return response.data.valid;
}

function PlatformUsernameSelector({ platform }: { platform: string }) {
  const { data: profile } = useUserProfile();
  const { token } = useContext(UserContext);
  const platformDisplay = platform[0].toUpperCase() + platform.slice(1);
  const [savedInput, setSavedInput] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  useEffect(() => {
    if (profile) {
      setUsernameInput(profile.usernames[platform] ?? "");
    }
  }, [profile, platform]);
  const [usernameInputDebounce] = useDebounce(usernameInput, 2000);
  const [usernameError, setUsernameError] = useState(false);
  useEffect(() => {
    const validateUsername = async () => {
      setUsernameError(
        !(await isPlatformUsernameValid(usernameInputDebounce, platform))
      );
    };
    validateUsername();
  }, [usernameInputDebounce, platform]);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      await axios.post(
        `${BACKEND_URL}/set_username`,
        {
          username: usernameInput,
          platform,
        },
        {
          headers: { Authorization: token },
        }
      );
      setSavedInput(true);
    },
    mutationKey: ["set_username"],
  });
  const handleKattisSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutateAsync();
  };
  return (
    <>
      <p className="inputLabel">{platformDisplay} username</p>
      <form onSubmit={handleKattisSubmit}>
        <input
          type="text"
          value={usernameInput}
          onChange={(e) => {
            setUsernameInput(e.target.value);
            setSavedInput(false);
          }}
        />
        <button
          type="submit"
          disabled={
            !usernameInput ||
            usernameError ||
            isPending ||
            savedInput ||
            usernameInput === profile?.usernames[platform]
          }
        >
          Save
        </button>
      </form>
      {usernameError && usernameInputDebounce && (
        <p>Invalid {platformDisplay} username</p>
      )}
      {isPending && <p>Saving...</p>}
      {!isPending && savedInput && <p>Saved!</p>}
    </>
  );
}

export default function Component() {
  const { data: profile } = useUserProfile();
  return (
    <Sidebar title="Profile settings">
      {profile ? (
        <div className="flex w-full p-6">
          <div className="flex flex-col gap-4 bg-secondary p-6 w-full">
            <h3 className="mb-4">{profile.display_name}</h3>
            <PlatformUsernameSelector platform="kattis" />
            <PlatformUsernameSelector platform="codeforces" />
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </Sidebar>
  );
}
