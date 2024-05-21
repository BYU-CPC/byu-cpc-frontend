import { Leaderboard } from "../components/Leaderboard";
import { ChallengeHeader } from "../components/ChallengeHeader";
export function Component() {
  return (
    <ChallengeHeader>
      <Leaderboard />
    </ChallengeHeader>
  );
}

Component.displayName = "Challenge";
