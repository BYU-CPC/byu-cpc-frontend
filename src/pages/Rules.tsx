import React from "react";
import { Sidebar } from "../components/Sidebar";
import { Link } from "@tanstack/react-router";
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
          <p className="large bold">Cheating</p>
          <p>
            This contest is meant as a tool for self-improvement. If you cheat,
            you will be hurting your opportunities to improve as a programmer.
            We recognize that cheating is possible and very tempting. Any form
            of cheating will result in disqualification from the contest.
            Cheating includes the following:
          </p>
          <ul className="list-disc pl-6">
            <li>Submitting entire solutions that you did not write</li>
            <li>
              Submitting entire solutions that you do not mostly understand
              &mdash; Using another person's implementation of a general
              algorithm that you use to help solve a problem is okay
            </li>
            <li>Spoofing submissions</li>
            <li>
              Submitting code you had written previously on a separate account
            </li>
            <li>Using LLMs to solve problems for you</li>
          </ul>
          <p>Things that are not cheating include:</p>
          <ul className="list-disc pl-6">
            <li>
              Using other peoples' implementations for general algorithms/data
              structure &mdash; Using book code without completely understanding
              it is okay
            </li>
            <li>
              Discussing problems with others to understand their solutions
            </li>
            <li>
              Using LLMs as an assistant to get you pointed in the right
              direction
            </li>
            <li>Reading Codeforces tutorials</li>
            <li>Finding hints online to solve problems</li>
          </ul>
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
