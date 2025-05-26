import React, { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar.js";
import { useUserProfile } from "../../hooks/UseProfile.js";
import useUser from "../../hooks/UseProfile.js";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { BACKEND_URL } from "../../hooks/base.js";
import firebase from "firebase/compat/app";
import { redirect } from "react-router";

export default function Component() {
  const user = firebase.auth().currentUser;
  if (!user) redirect("/sign-in");
  const { data: profile } = useUserProfile();
  return (
    <Sidebar title="My leaderboards">
      {profile ? (
        <div className="flex w-full p-6">
          <div className="flex flex-col gap-4 bg-secondary p-6 w-full">
            <h3 className="mb-4">{profile.display_name}</h3>
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </Sidebar>
  );
}
