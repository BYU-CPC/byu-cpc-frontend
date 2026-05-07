import React, { FormEvent, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import axios from "axios";
import "./SignIn.css";
import "firebaseui/dist/firebaseui.css";
import { FirebaseError } from "firebase/app";
import {
  AuthProvider,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  auth,
  githubProvider,
  googleProvider,
} from "src/auth/firebase";
import { BACKEND_URL } from "../hooks/base";
import { useNavigate } from "@tanstack/react-router";
import { leaderboardIndexPage } from "~/routes";

type AppProfile = {
  usernames: Record<string, string>;
  display_name: string;
};

type ProfileFormData = {
  displayName: string;
  kattisUsername: string;
  codeforcesUsername: string;
};

const getAuthHeaders = async (user: User) => ({
  Authorization: await user.getIdToken(),
});

async function getAppProfile(user: User): Promise<AppProfile | null> {
  return (
    await axios
      .post<AppProfile>(`${BACKEND_URL}/get_profile`, undefined, {
        headers: await getAuthHeaders(user),
      })
      .catch(() => ({ data: null }))
  ).data;
}

async function createAppProfile(user: User, data: ProfileFormData) {
  await axios.post(
    `${BACKEND_URL}/create_user`,
    {
      display_name: data.displayName,
      kattis_username: data.kattisUsername,
      codeforces_username: data.codeforcesUsername,
    },
    { headers: await getAuthHeaders(user) }
  );
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/account-exists-with-different-credential":
        return "An account already exists with this email using a different sign-in method. Try signing in with your original method first.";
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled before it completed.";
      case "auth/popup-blocked":
        return "The sign-in popup was blocked by your browser. Allow popups for this site and try again.";
      case "auth/cancelled-popup-request":
        return "Another sign-in popup is already open. Complete or close it before trying again.";
      default:
        return error.message;
    }
  }

  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

function ProfileForm({
  initialDisplayName = "",
  submitLabel,
  loading = false,
  onSubmit,
}: {
  initialDisplayName?: string;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (data: ProfileFormData) => Promise<void> | void;
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [kattisUsername, setKattisUsername] = useState("");
  const [codeforcesUsername, setCodeforcesUsername] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ displayName, kattisUsername, codeforcesUsername });
  };

  return (
    <form className="sign-in-form" onSubmit={handleSubmit}>
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
        disabled={!displayName || loading}
      >
        {submitLabel}
      </button>
    </form>
  );
}

function LogIn({
  onNeedsProfile,
}: {
  onNeedsProfile: (user: User) => void;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const completeSignIn = async (user: User) => {
    const profile = await getAppProfile(user);
    if (profile) {
      await navigate({ to: leaderboardIndexPage.to });
    } else {
      onNeedsProfile(user);
    }
  };

  const logIn = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await completeSignIn(credential.user);
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const logInWithProvider = async (
    providerName: "google" | "github",
    provider: AuthProvider
  ) => {
    setSsoLoading(providerName);
    setError("");
    try {
      const credential = await signInWithPopup(auth, provider);
      await completeSignIn(credential.user);
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setSsoLoading(null);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    logIn(email, password);
  };

  return (
    <>
      <div className="sso-buttons">
        <button
          type="button"
          className="sso-button"
          disabled={loading || !!ssoLoading}
          onClick={() => logInWithProvider("google", googleProvider)}
        >
          {ssoLoading === "google" ? "Signing in..." : "Continue with Google"}
        </button>
        <button
          type="button"
          className="sso-button"
          disabled={loading || !!ssoLoading}
          onClick={() => logInWithProvider("github", githubProvider)}
        >
          {ssoLoading === "github" ? "Signing in..." : "Continue with GitHub"}
        </button>
      </div>
      <div className="auth-divider">or</div>
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
        <button
          type="submit"
          className="submit"
          disabled={!email || !password || loading || !!ssoLoading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </>
  );
}

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signUp = async (data: ProfileFormData) => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await createAppProfile(userCredential.user, data);
      await navigate({ to: leaderboardIndexPage.to });
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="sign-in-form sign-up-account-form">
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
      </form>
      <ProfileForm
        submitLabel={loading ? "Signing up..." : "Sign Up"}
        loading={!email || !password || loading}
        onSubmit={signUp}
      />
      {error && <div className="error">{error}</div>}
    </>
  );
}

function CompleteProfile({
  user,
  onCancel,
}: {
  user: User;
  onCancel: () => void;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setError("");
    try {
      await createAppProfile(user, data);
      await navigate({ to: leaderboardIndexPage.to });
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    await signOut(auth);
    onCancel();
  };

  return (
    <div className="sign-in-form">
      <p className="onboarding-copy">
        Finish creating your profile to continue.
      </p>
      <ProfileForm
        initialDisplayName={user.displayName ?? ""}
        submitLabel={loading ? "Creating profile..." : "Create profile"}
        loading={loading}
        onSubmit={handleSubmit}
      />
      <button type="button" className="secondary-button" onClick={handleCancel}>
        Cancel
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default function SignIn() {
  const [signIn, setSignIn] = useState(true);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  return (
    <Sidebar title={profileUser ? "Complete Profile" : signIn ? "Log In" : "Sign Up"}>
      <div className="flex-center w-full">
        <div className="flex-col bg-secondary auth ">
          {profileUser ? (
            <CompleteProfile
              user={profileUser}
              onCancel={() => setProfileUser(null)}
            />
          ) : (
            <>
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
              <div>
                {signIn ? (
                  <LogIn onNeedsProfile={setProfileUser} />
                ) : (
                  <SignUp />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
