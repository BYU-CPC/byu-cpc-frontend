import React from "react";

//react component that takes in an image component and applies a couple classes to it
export default function FlameIcon({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className=" absolute left-0 right-0 top-0 bottom-0 m-0 w-full h-full translate-x-px translate-y-[-3px]">
      {children}
    </div>
  );
}
