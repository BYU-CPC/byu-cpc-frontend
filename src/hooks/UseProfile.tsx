import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { BACKEND_URL } from "./base";
import { onAuthStateChanged, UserInfo } from "firebase/auth";
import "firebase/compat/auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
type User = UserInfo & { getIdToken: () => Promise<string> };
export default function useUser() {
  const [user, setUser] = useState<User | null>(firebase.auth().currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.auth(), (user) => {
      setUser(user);
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return user;
}

export function useUserProfile() {
  const user = useUser();
  const getProfile = async () => {
    return (
      await axios
        .post(`${BACKEND_URL}/get_profile`, {
          id_token: await user?.getIdToken(),
        })
        .catch((e) => ({ data: null }))
    ).data;
  };
  const query = useQuery({
    queryKey: ["profile", user?.uid],
    queryFn: getProfile,
    refetchOnWindowFocus: true,
    enabled: !!user,
  });
  return query?.data;
}
