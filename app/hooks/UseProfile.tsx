import { useState, useEffect, useContext } from "react";
import firebase from "firebase/compat/app";
import { BACKEND_URL } from "./base";
import { onAuthStateChanged, UserInfo } from "firebase/auth";
import "firebase/compat/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UserContext } from "~/components/UserContext";
type User = UserInfo & { getIdToken: () => Promise<string> };

const useUserToken = () => {
  return useQuery({
    queryKey: ["userToken"],
    queryFn: async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const token = user.getIdToken();
        if (token) {
          return token;
        }
        throw new Error("User token not available");
      }
      throw new Error("User not authenticated");
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    gcTime: 1000 * 60 * 30, // Garbage collect after 1 hour
  });
};

export function useUser() {
  const [user, setUser] = useState<User | null>(firebase.auth().currentUser);
  const { data: token, isPending } = useUserToken();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (user && !token) {
      queryClient.invalidateQueries({ queryKey: ["userToken"] });
    }
  }, [user, token, queryClient]);

  // reset the token every 5 minutes by setting an interval
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.auth(), (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["userToken"] });
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return { user, token: token ?? null, isPending };
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
