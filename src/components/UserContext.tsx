import { UserInfo } from "firebase/auth";
import React from "react";
type User = UserInfo & { getIdToken: () => Promise<string> };
export const UserContext = React.createContext<{
  user: User | null;
  token: string | null;
  isPending?: boolean;
}>({
  user: null,
  token: null,
  isPending: false,
});
