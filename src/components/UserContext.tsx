import { User } from "firebase/auth";
import React from "react";

export const UserContext = React.createContext<{
  user: User | null;
  token: string | null;
  isPending: boolean;
}>({
  user: null,
  token: null,
  isPending: true,
});
