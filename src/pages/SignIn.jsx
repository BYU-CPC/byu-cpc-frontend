import { useState } from "react";
import { ChallengeHeader } from "../components/ChallengeHeader";
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
import { BACKEND_URL } from "../App";

function LogIn() {
  const navigate = useNavigate();
  const auth = getAuth();
  setPersistence(auth, browserLocalPersistence);
  const logIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/challenge");
      })
      .catch((error) => {
        setError(error.message);
      });
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (event) => {
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
    email,
    password,
    displayName,
    kattisUsername,
    codeforcesUsername
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
        navigate("/challenge");
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
  const handleSubmit = (event) => {
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

export function Component() {
  const [signIn, setSignIn] = useState(true);
  return (
    <ChallengeHeader>
      <div className="flex-center vfull">
        <div className="flex-col bg-secondary auth shadow">
          <div className="flexRow flex-center">
            <button
              className={"sign-in " + (signIn ? "selected" : "")}
              onClick={() => setSignIn(true)}
            >
              Log In
            </button>
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
    </ChallengeHeader>
  );
}

Component.displayName = "SignIn";
