import { useState, useEffect, useContext } from "react";
import firebase from "firebase/compat/app";
import { BACKEND_URL } from "./base";
import { onAuthStateChanged, UserInfo } from "firebase/auth";
import "firebase/compat/auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserContext } from "~/components/UserContext";
type User = UserInfo & { getIdToken: () => Promise<string> };
export function useUser() {
  const [user, setUser] = useState<User | null>(firebase.auth().currentUser);
  const [token, setToken] = useState<string | null>(null);

  // reset the token every 5 minutes by setting an interval
  useEffect(() => {
    const interval = setInterval(() => {
      user?.getIdToken().then((newToken) => {
        setToken(newToken);
      });
    }, 1000 * 60 * 5); // 5 minutes

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.auth(), (user) => {
      setUser(user);
      user?.getIdToken().then((token) => {
        setToken(token);
      });
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return { user, token };
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
    enabled: !!user,
  });
}
