import { useEffect, useState } from "react";
import { ChallengeHeader } from "../components/ChallengeHeader";
import { useUserProfile } from "../hooks/UseUser";
import useUser from "../hooks/UseUser";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { BACKEND_URL } from "../App";
import { useMutation } from "@tanstack/react-query";

async function isKattisUsernameValid(username) {
  if (!username) {
    return true;
  }
  const response = await axios.post(BACKEND_URL + "/kattis/validate", {
    username,
  });
  return response.data.valid;
}

export function Component() {
  const profile = useUserProfile();
  const [savedKattisInput, setSavedKattisInput] = useState(false);
  const user = useUser();
  // make axios request to set kattis username
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (kattis_username) => {
      await axios.post(BACKEND_URL + "/set_kattis_username", {
        id_token: await user.getIdToken(),
        kattis_username: kattisInput,
      });
      setSavedKattisInput(true);
    },
    mutationKey: "set_kattis_username",
  });
  const handleKattisSubmit = (event) => {
    event.preventDefault();
    mutateAsync(kattisInput);
  };
  const [kattisInput, setKattisInput] = useState("");
  useEffect(() => {
    if (profile) {
      setKattisInput(profile.kattis_username);
    }
  }, [profile]);
  const [kattisInputDebounce] = useDebounce(kattisInput, 500);
  const [kattisError, setKattisError] = useState(false);
  useEffect(() => {
    const checkKattis = async () => {
      setKattisError(!(await isKattisUsernameValid(kattisInputDebounce)));
    };
    checkKattis();
  }, [kattisInputDebounce]);
  return (
    <ChallengeHeader>
      {profile ? (
        <div className="responsive-fg flexCol bg-secondary p-10">
          <h3>{profile.display_name}</h3>
          <p className="input-label">Kattis username</p>
          <form onSubmit={handleKattisSubmit}>
            <input
              type="text"
              value={kattisInput}
              onChange={(e) => {
                setKattisInput(e.target.value);
                setSavedKattisInput(false);
              }}
            />
            <button
              type="submit"
              disabled={
                !kattisInput ||
                kattisError ||
                isPending ||
                savedKattisInput ||
                kattisInput === profile.kattis_username
              }
            >
              Save
            </button>
          </form>
          {kattisError && kattisInputDebounce && <p>Invalid Kattis username</p>}
          {isPending && <p>Saving...</p>}
          {!isPending && savedKattisInput && <p>Saved!</p>}
        </div>
      ) : (
        "Loading..."
      )}
    </ChallengeHeader>
  );
}

Component.displayName = "Profile";
