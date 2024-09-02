import React, { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { useUserProfile } from "../hooks/UseProfile";
import useUser from "../hooks/UseProfile";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { BACKEND_URL } from "../hooks/base";

async function isPlatformUsernameValid(username: string, platform: string) {
  if (!username) {
    return true;
  }
  const response = await axios.post(`${BACKEND_URL}/${platform}/validate`, {
    username,
  });
  return response.data.valid;
}

function PlatformUsernameSelector({ platform }: { platform: string }) {
  const profile = useUserProfile();
  const user = useUser();
  const platformDisplay = platform[0].toUpperCase() + platform.slice(1);
  const [savedInput, setSavedInput] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  useEffect(() => {
    if (profile) {
      setUsernameInput(profile[platform + "_username"]);
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
      await axios.post(`${BACKEND_URL}/set_${platform}_username`, {
        id_token: await user?.getIdToken(),
        username: usernameInput,
      });
      setSavedInput(true);
    },
    mutationKey: ["set_kattis_username"],
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
            usernameInput === profile[`${platform}_username`]
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

export function Component() {
  const profile = useUserProfile();
  return (
    <Sidebar>
      {profile ? (
        <div className="responsive-fg flexCol bg-secondary p-10">
          <h3>{profile.display_name}</h3>
          <PlatformUsernameSelector platform="kattis" />
          <PlatformUsernameSelector platform="codeforces" />
        </div>
      ) : (
        "Loading..."
      )}
    </Sidebar>
  );
}

Component.displayName = "Profile";
