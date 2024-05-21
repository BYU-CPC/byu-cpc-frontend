import { ChallengeHeader } from "../components/ChallengeHeader";
export function Component() {
  return (
    <ChallengeHeader>
      <div className="responsive-fg bg-secondary m-20">
        <p className="large bold">Contest</p>
        <p>
          The BYU Competitive Programming Challenge is open to anyone who wants
          to join. The contest will run from May 21st to August 12th.
        </p>
        <p className="large bold">Prizes</p>
        <p>
          BYU and Utah high school students are elligible to win prizes based on
          their overall score. Prizes have not yet been decided. For reference,
          the top prize last year was a Nintendo Switch. There will also likely
          be t-shirt prizes for anyone who puts in a decent amount of effort.
        </p>
        <p className="large bold">Scoring</p>
        <p>
          You can earn points in three ways: Solve problems on Kattis, solve
          problems on Codeforces, and participate in Codeforces contests. Note
          that you must solve each problem for the first time during the Summer
          Challenge in order for the problem to count. The scoring for each
          platform is as follows:
        </p>
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
          points. So if a problem has a difficulty of 800, you will earn roughly
          16 points. If a problem has a difficulty of 1600, you will earn
          roughly 64 points.
        </p>
        <p>
          Any problem you solve during a Codeforces contest will be worth double
          its original score. In addition, you will earn 100 points for
          participating in the contest.
        </p>
        <p>
          You can earn a daily bonus of 10 points by solving any problem in a
          day. So, to get a good score, it is recommended to challenge yourself
          by{" "}
          <strong>
            solving hard problems, participating in contests, and solving
            problems as many days as possible.
          </strong>
        </p>
        <p className="large bold">Platforms</p>
        <p>
          Currently, the leaderboard only supports Kattis. To earn points from
          Kattis, you need to <a href="/sign-in">sign in</a> to this website and
          install <a href="/extension.zip">this browser extension.</a> After
          that, you should be ready to start solving problems!
        </p>
        <p>
          We will add support for Codeforces within two weeks of the challenge
          start. When we do, any Codeforces participation will be applied
          retroactively. That means that if you enter a contest on Codeforces
          tomorrow, you will eventually get a bonus of 100 plus the 2&times;
          problem bonus for the problems you solve in contest applied to your
          score.
        </p>
        <p className="large bold">Cheating</p>
        <p>
          This contest is meant as a tool for self-improvement. If you cheat,
          you will be hurting your opportunities to improve as a programmer. We
          recognize that cheating is possible and very tempting. Any form of
          cheating will result in disqualification from the contest. Cheating
          includes the following:
          <ul>
            <li>Submitting code that you did not write</li>
            <li>Submitting code that you do not understand</li>
            <li>Spoofing submissions</li>
            <li>
              Submitting code you had written previously on a separate account
            </li>
            <li>Using LLMs to solve problems for you</li>
          </ul>
          Things that are not cheating include:
          <ul>
            <li>
              Discussing problems with others to understand their solutions
            </li>
            <li>
              Using LLMs as an assistant to get you pointed in the right
              direction
            </li>
            <li>Reading the Codeforces tutorials</li>
            <li>Finding hints online to solve problems</li>
          </ul>
          To help discourage cheating, anyone who wins a prize may be asked to
          demonstrate that they are capable of solving the problems they claim
          to have solved.
        </p>
        <p className="small">
          These rules are subject to change as the contest progresses. If you
          notice any bugs or have any questions or concerns about the rules,
          website, or anything else, please contact Josh Taylor
          (joshbtay@gmail.com)
        </p>
      </div>
    </ChallengeHeader>
  );
}

Component.displayName = "Rules";
