import React from "react";
import { Sidebar } from "../components/Sidebar";
export function Component() {
  return (
    <Sidebar>
      <div className="responsive-fg bg-secondary p-2">
        <p className="large bold">Chrome</p>
        <p>
          Install the extension for Chrome{" "}
          <a
            href="https://chromewebstore.google.com/detail/kattis-tracker/ggcmlekiemlkdojgohedanfnjpdokloa"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
        </p>
        <p className="large bold">Firefox</p>
        <p>
          Install the add-on for Firefox{" "}
          <a
            href="https://addons.mozilla.org/en-US/firefox/addon/kattis-tracker1/"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          , then make sure to enable the permissions for the add-on to work:
        </p>
        <div>
          <img
            src="/firefox-permissions.png"
            width="75%"
            alt="enable firefox kattis permission"
          />
        </div>
        <p className="large bold">From source</p>
        <p>
          Source can be found{" "}
          <a
            href="https://github.com/joshbtay/kattis-extension"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          . You can download the compiled extension{" "}
          <a href="/extension.zip">here</a>.
        </p>
      </div>
    </Sidebar>
  );
}

Component.displayName = "Extension";
