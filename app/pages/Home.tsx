import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to CPLeaderboard</h1>
      <p className="text-lg mb-8">
        Your hub for competitive programming leaderboards.
      </p>
      <a
        href="/leaderboard"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go to Leaderboard
      </a>
      <a
        href="/sign-in"
        className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Sign In
      </a>
    </div>
  );
}
