import { UserInfo } from "firebase/auth";
import React from "react";
type User = UserInfo & { getIdToken: () => Promise<string> };
export const UserContext = React.createContext<{
  user: User | null;
  token: string | null;
}>({
  user: null,
  token: null,
});
