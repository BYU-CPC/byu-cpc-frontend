import React, { useContext } from "react";
import firebase from "firebase/compat/app";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Gear from "../icons/Gear";
import { UserContext } from "./UserContext";
import { Link } from "@tanstack/react-router";

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
        <DropdownMenu.Content className=" bg-[var(--bg-tertiary)] z-30 shadow-lg rounded-md overflow-hidden min-w-56">
          <div className="flex flex-col gap-2 ">
            <DropdownMenu.Item
              className=" hover:bg-[#fff3] flex border-none"
              asChild
            >
              <Link to="/rules" className="fg-color w-full">
                <div className="p-2">Rules</div>
              </Link>
            </DropdownMenu.Item>
            {user && (
              <DropdownMenu.Item
                className=" hover:bg-[#fff3] flex border-none"
                asChild
              >
                <Link to="/profile" className="fg-color w-full">
                  <div className="p-2">Profile</div>
                </Link>
              </DropdownMenu.Item>
            )}
            {user && (
              <DropdownMenu.Item
                className=" hover:bg-[#fff3] flex border-none"
                asChild
              >
                <Link to="/leaderboard/edit" className="fg-color w-full">
                  <div className="p-2">My leaderboards</div>
                </Link>
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item
              className=" hover:bg-[#fff3] flex border-none"
              asChild
            >
              <Link to="/extension" className="fg-color w-full">
                <div className="p-2">Extension</div>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className=" hover:bg-[#fff3] flex  border-none"
              asChild
            >
              {!user ? (
                <Link to="/sign-in" className="fg-color w-full">
                  <div className="p-2">Sign in</div>
                </Link>
              ) : (
                <Link
                  to="/"
                  onClick={() => firebase.auth().signOut()}
                  className="fg-color w-full"
                >
                  <div className="p-2">Sign out</div>
                </Link>
              )}
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default UserBadge;
