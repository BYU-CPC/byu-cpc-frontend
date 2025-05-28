import React, { useContext } from "react";
import firebase from "firebase/compat/app";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Gear from "../icons/Gear";
import { UserContext } from "./UserContext";

function UserBadge() {
  const { user } = useContext(UserContext);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="border-none ">
        <div className="w-6 h-6 ">
          <Gear className=" fill-[var(--fg-color)]" />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className=" bg-[var(--bg-tertiary)] z-30 shadow-lg rounded-md overflow-hidden">
          <div className="flex flex-col gap-2 ">
            <DropdownMenu.Item
              className=" hover:bg-[#fff3] flex border-none"
              asChild
            >
              <a href="/rules" className="fg-color w-full">
                <div className="p-2">Rules</div>
              </a>
            </DropdownMenu.Item>
            {user && (
              <DropdownMenu.Item
                className=" hover:bg-[#fff3] flex border-none"
                asChild
              >
                <a href="/profile" className="fg-color w-full">
                  <div className="p-2">Profile</div>
                </a>
              </DropdownMenu.Item>
            )}
            {user && (
              <DropdownMenu.Item
                className=" hover:bg-[#fff3] flex border-none"
                asChild
              >
                <a href="/leaderboard/edit" className="fg-color w-full">
                  <div className="p-2">My leaderboards</div>
                </a>
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item
              className=" hover:bg-[#fff3] flex  border-none"
              asChild
            >
              {!user ? (
                <a href="/sign-in" className="fg-color w-full">
                  <div className="p-2">Sign in</div>
                </a>
              ) : (
                <a
                  href="/"
                  onClick={() => firebase.auth().signOut()}
                  className="fg-color w-full"
                >
                  <div className="p-2">Sign out</div>
                </a>
              )}
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default UserBadge;
