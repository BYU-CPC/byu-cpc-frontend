import { useState, useEffect, useContext } from "react";
import { BACKEND_URL } from "./base";
import { onIdTokenChanged, User } from "firebase/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UserContext } from "src/components/UserContext";
import { auth } from "src/auth/firebase";

export function useUser() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [token, setToken] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let active = true;
    const readyPromise = auth.authStateReady?.() ?? Promise.resolve();

    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      const nextToken = firebaseUser ? await firebaseUser.getIdToken() : null;
      await readyPromise;
      if (!active) return;

      setUser(firebaseUser);
      setToken(nextToken);
      setIsPending(false);

      if (!firebaseUser) {
        queryClient.removeQueries({ queryKey: ["profile"] });
        queryClient.removeQueries({ queryKey: ["joinedLeaderboards"] });
        queryClient.removeQueries({ queryKey: ["myLeaderboards"] });
      }
    });

    readyPromise.finally(() => {
      if (active) {
        setIsPending(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [queryClient]);

  return { user, token, isPending };
}

type Profile = {
  usernames: {
    [key: string]: string;
  };
  display_name: string;
};

export function useUserProfile() {
  const { user, token } = useContext(UserContext);
  const getProfile = async () => {
    return (
      await axios
        .post<Profile>(`${BACKEND_URL}/get_profile`, undefined, {
          headers: { Authorization: token },
        })
        .catch(() => ({ data: null }))
    ).data;
  };

  return useQuery({
    queryKey: ["profile", user?.uid],
    queryFn: getProfile,
    refetchOnWindowFocus: true,
    enabled: !!user && !!token,
  });
}
