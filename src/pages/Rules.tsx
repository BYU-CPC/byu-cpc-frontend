import React from "react";
import { Sidebar } from "../components/Sidebar";
export default function Rules() {
  return (
    <Sidebar title="Rules">
      <div className="overflow-y-auto p-6">
        <div className="responsive-fg bg-secondary p-6 flex flex-col gap-4 rounded">
          <p className="bold">Kattis</p>
          <p>
            Solving a problem with difficulty <em>d</em> will earn you{" "}
            <em>
              d<sup>1.2</sup> &times; 10
            </em>{" "}
            points. So if a problem has a difficulty of 1.0, you will earn 10
            points, and if a problem has a difficulty of 2.0, you will earn
            roughly 23 points. Note that Kattis difficulties are updated every
            day, so your score may change slightly over time.
          </p>
          <p className="bold">Codeforces</p>
          <p>
            Solving a problem with difficulty <em>d</em> will earn you{" "}
            <em>
              ((d &divide; 25 - 17) &divide; 10)<sup>1.2</sup> &times; 10
            </em>{" "}
            points. So if a problem has a difficulty of 800, you will earn
            roughly 16 points. If a problem has a difficulty of 1600, you will
            earn roughly 64 points.
          </p>
          <p>
            Any problem you solve during a Codeforces contest will be worth
            double its original score. In addition, you will earn 100 points for
            participating in the contest.
          </p>
          <p>
            You can earn a daily bonus of 10 points by solving any problem in a
            day. So, to get a good score, it is recommended to challenge
            yourself by{" "}
            <strong>
              solving hard problems, participating in contests, and solving
              problems as many days as possible.
            </strong>
          </p>
          <p className="small">
            If you notice any bugs or have any questions or concerns about the
            rules, website, or anything else, please contact Josh Taylor
            (joshbtay@gmail.com)
          </p>
        </div>
      </div>
    </Sidebar>
  );
}
