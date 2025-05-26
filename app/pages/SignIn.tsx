import React, { FormEvent } from "react";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignIn.css";
import "firebaseui/dist/firebaseui.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { BACKEND_URL } from "../hooks/base";

function LogIn() {
  const navigate = useNavigate();
  const auth = getAuth();
  setPersistence(auth, browserLocalPersistence);
  const logIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/leaderboard");
      })
      .catch((error) => {
        setError(error.message);
      });
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    logIn(email, password);
  };
  return (
    <form className="sign-in-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <div className="input-label">Email</div>
        <input
          className="input-field"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group">
        <div className="input-label">Password</div>
        <input
          className="input-field"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="submit" disabled={!email || !password}>
        Sign In
      </button>
      {error ?? <div className="error">{error}</div>}
    </form>
  );
}
function SignUp() {
  const navigate = useNavigate();
  const signUp = (
    email: string,
    password: string,
    displayName: string,
    kattisUsername: string,
    codeforcesUsername: string
  ) =>
    createUserWithEmailAndPassword(getAuth(), email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await axios.post(`${BACKEND_URL}/create_user`, {
          id_token: await user.getIdToken(),
          display_name: displayName,
          kattis_username: kattisUsername,
          codeforces_username: codeforcesUsername,
        });
        navigate("/leaderboard");
      })
      .catch((error) => {
        setError(error.message);
      });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [kattisUsername, setKattisUsername] = useState("");
  const [codeforcesUsername, setCodeforcesUsername] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    signUp(email, password, displayName, kattisUsername, codeforcesUsername);
  };
  return (
    <form className="sign-in-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <div className="input-label">Email*</div>
        <input
          className="input-field"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group">
        <div className="input-label">Password*</div>
        <input
          className="input-field"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="input-group">
        <div className="input-label">Full Name*</div>
        <input
          className="input-field"
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
      <div className="input-group">
        <div className="input-label">Kattis Username</div>
        <input
          className="input-field"
          id="kattisUsername"
          value={kattisUsername}
          onChange={(e) => setKattisUsername(e.target.value)}
        />
      </div>
      <div className="input-group">
        <div className="input-label">Codeforces Username</div>
        <input
          className="input-field"
          id="codeforcesUsername"
          value={codeforcesUsername}
          onChange={(e) => setCodeforcesUsername(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="submit"
        disabled={!email || !password || !displayName}
      >
        Sign Up
      </button>
      {error ?? <div className="error">{error}</div>}
    </form>
  );
}

export default function Component() {
  const [signIn, setSignIn] = useState(true);
  return (
    <Sidebar title={signIn ? "Log In" : "Sign Up"}>
      <div className="flex-center w-full">
        <div className="flex-col bg-secondary auth ">
          <div className="flex flex-row flex-center gap-9">
            <button
              className={"sign-in " + (signIn ? "selected" : "")}
              onClick={() => setSignIn(true)}
            >
              Log In
            </button>
            <span className="opacity-10">|</span>
            <button
              className={"sign-in " + (!signIn ? "selected" : "")}
              onClick={() => setSignIn(false)}
            >
              Sign Up
            </button>
          </div>
          <div>{signIn ? <LogIn /> : <SignUp />}</div>
        </div>
      </div>
    </Sidebar>
  );
}
