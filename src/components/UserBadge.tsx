import React from "react";
import firebase from "firebase/compat/app";
import useUser from "../hooks/UseProfile";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Gear from "../icons/Gear";

function UserBadge() {
  const user = useUser();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="border-none ">
        <div className="w-6 h-6 ">
          <Gear className=" fill-[var(--fg-color)]" />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className=" bg-[var(--bg-tertiary)] z-30 shadow-lg rounded-md overflow-hidden">
          <div className="flex flex-col w-28 gap-2 ">
            <DropdownMenu.Item
              className=" hover:bg-[#fff3] flex border-none"
              asChild
            >
              <a href="/challenge/rules" className="fg-color w-full">
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
