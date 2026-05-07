import React, { FormEvent, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import axios from "axios";
import "./SignIn.css";
import "firebaseui/dist/firebaseui.css";
import { FirebaseError } from "firebase/app";
import {
  AuthCredential,
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  linkWithCredential,
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

type ProviderName = "google" | "github";

type PendingAccountLink = {
  email: string;
  credential: AuthCredential;
  providerName: ProviderName;
  signInMethods: string[];
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

function getProviderLabel(providerName: ProviderName) {
  return providerName === "google" ? "Google" : "GitHub";
}

function ProviderIcon({ providerName }: { providerName: ProviderName }) {
  if (providerName === "google") {
    return (
      <svg className="sso-icon" viewBox="0 0 18 18" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.25h2.91c1.7-1.57 2.69-3.88 2.69-6.6z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.25c-.8.54-1.84.86-3.05.86-2.35 0-4.34-1.59-5.05-3.72H.94v2.33A9 9 0 0 0 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.95 10.69A5.41 5.41 0 0 1 3.67 9c0-.59.1-1.16.28-1.69V4.98H.94A9 9 0 0 0 0 9c0 1.45.35 2.82.94 4.02l3.01-2.33z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .94 4.98l3.01 2.33C4.66 5.17 6.65 3.58 9 3.58z"
        />
      </svg>
    );
  }

  return (
    <svg className="sso-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.45 11.45 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5z"
      />
    </svg>
  );
}

function ProviderButton({
  providerName,
  children,
  className = "",
  ...buttonProps
}: {
  providerName: ProviderName;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...buttonProps}
      className={`sso-button sso-button-${providerName} ${className}`.trim()}
    >
      <ProviderIcon providerName={providerName} />
      <span>{children}</span>
    </button>
  );
}

function getCredentialFromProviderError(
  error: unknown,
  providerName: ProviderName
) {
  if (!(error instanceof FirebaseError)) return null;
  return providerName === "google"
    ? GoogleAuthProvider.credentialFromError(error)
    : GithubAuthProvider.credentialFromError(error);
}

function getExistingProviderName(method: string): ProviderName | null {
  if (method === GoogleAuthProvider.PROVIDER_ID) return "google";
  if (method === GithubAuthProvider.PROVIDER_ID) return "github";
  return null;
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/account-exists-with-different-credential":
        return "This email is already registered. Sign in with the existing method below and we'll link the new sign-in option.";
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
  const [ssoLoading, setSsoLoading] = useState<ProviderName | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingLink, setPendingLink] = useState<PendingAccountLink | null>(null);

  const completeSignIn = async (user: User) => {
    const profile = await getAppProfile(user);
    if (profile) {
      await navigate({ to: leaderboardIndexPage.to });
    } else {
      onNeedsProfile(user);
    }
  };

  const linkPendingCredential = async (user: User) => {
    if (!pendingLink) return;
    if (user.email && user.email !== pendingLink.email) {
      throw new Error(
        `Please sign in as ${pendingLink.email} before linking ${getProviderLabel(
          pendingLink.providerName
        )}.`
      );
    }
    await linkWithCredential(user, pendingLink.credential);
    setPendingLink(null);
    await completeSignIn(user);
  };

  const logIn = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      if (pendingLink) {
        await linkPendingCredential(credential.user);
      } else {
        await completeSignIn(credential.user);
      }
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const signInAndMaybeLinkWithProvider = async (
    providerName: ProviderName,
    provider: AuthProvider
  ) => {
    setSsoLoading(providerName);
    setError("");
    try {
      const credential = await signInWithPopup(auth, provider);
      if (pendingLink) {
        await linkPendingCredential(credential.user);
      } else {
        await completeSignIn(credential.user);
      }
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setSsoLoading(null);
    }
  };

  const logInWithProvider = async (
    providerName: ProviderName,
    provider: AuthProvider
  ) => {
    setSsoLoading(providerName);
    setError("");
    try {
      const credential = await signInWithPopup(auth, provider);
      await completeSignIn(credential.user);
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === "auth/account-exists-with-different-credential" &&
        error.customData?.email
      ) {
        const pendingCredential = getCredentialFromProviderError(error, providerName);
        if (pendingCredential) {
          const existingMethods = await fetchSignInMethodsForEmail(
            auth,
            String(error.customData.email)
          );
          setPendingLink({
            email: String(error.customData.email),
            credential: pendingCredential,
            providerName,
            signInMethods: existingMethods,
          });
          setEmail(String(error.customData.email));
          setPassword("");
          setError("");
          return;
        }
      }
      setError(getAuthErrorMessage(error));
    } finally {
      setSsoLoading(null);
    }
  };

  const existingProviderName = pendingLink?.signInMethods
    .map(getExistingProviderName)
    .find((method): method is ProviderName => !!method);
  const fallbackProviders = [
    { name: "google" as const, provider: googleProvider },
    { name: "github" as const, provider: githubProvider },
  ].filter(({ name }) => name !== pendingLink?.providerName);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    logIn(email, password);
  };

  return (
    <>
      {pendingLink ? (
        <div className="linking-notice">
          <p>
            An account already exists for <strong>{pendingLink.email}</strong>.
            Sign in with your existing method below and we'll link {" "}
            {getProviderLabel(pendingLink.providerName)} to that account.
            {existingProviderName
              ? ` Firebase says this account uses ${getProviderLabel(
                  existingProviderName
                )}.`
              : " If you are not sure which method you used before, try email/password or another provider."}
          </p>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setPendingLink(null);
              setPassword("");
              setError("");
            }}
          >
            Cancel linking
          </button>
        </div>
      ) : (
        <div className="sso-buttons">
          <ProviderButton
            type="button"
            providerName="google"
            disabled={loading || !!ssoLoading}
            onClick={() => logInWithProvider("google", googleProvider)}
          >
            {ssoLoading === "google" ? "Signing in..." : "Continue with Google"}
          </ProviderButton>
          <ProviderButton
            type="button"
            providerName="github"
            disabled={loading || !!ssoLoading}
            onClick={() => logInWithProvider("github", githubProvider)}
          >
            {ssoLoading === "github" ? "Signing in..." : "Continue with GitHub"}
          </ProviderButton>
        </div>
      )}

      {pendingLink && (
        <div className="sso-buttons">
          {fallbackProviders.map(({ name, provider }) => (
            <ProviderButton
              key={name}
              type="button"
              providerName={name}
              disabled={loading || !!ssoLoading}
              onClick={() => signInAndMaybeLinkWithProvider(name, provider)}
            >
              {ssoLoading === name
                ? "Signing in..."
                : `Sign in with ${getProviderLabel(name)} to link`}
            </ProviderButton>
          ))}
        </div>
      )}

      <div className="auth-divider">or</div>
      <form className="sign-in-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="input-label">Email</div>
          <input
            className="input-field"
            id="email"
            value={email}
            disabled={!!pendingLink}
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
          {loading
            ? "Signing in..."
            : pendingLink
              ? `Sign in and link ${getProviderLabel(pendingLink.providerName)}`
              : "Sign In"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
    </>
  );
}

function SignUp({
  onNeedsProfile,
}: {
  onNeedsProfile: (user: User) => void;
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<ProviderName | null>(null);
  const [error, setError] = useState("");

  const completeProviderSignUp = async (user: User) => {
    const profile = await getAppProfile(user);
    if (profile) {
      await navigate({ to: leaderboardIndexPage.to });
    } else {
      onNeedsProfile(user);
    }
  };

  const signUpWithProvider = async (
    providerName: ProviderName,
    provider: AuthProvider
  ) => {
    setSsoLoading(providerName);
    setError("");
    try {
      const credential = await signInWithPopup(auth, provider);
      await completeProviderSignUp(credential.user);
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setSsoLoading(null);
    }
  };

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
      <div className="sso-buttons">
        <ProviderButton
          type="button"
          providerName="google"
          disabled={loading || !!ssoLoading}
          onClick={() => signUpWithProvider("google", googleProvider)}
        >
          {ssoLoading === "google" ? "Signing up..." : "Sign up with Google"}
        </ProviderButton>
        <ProviderButton
          type="button"
          providerName="github"
          disabled={loading || !!ssoLoading}
          onClick={() => signUpWithProvider("github", githubProvider)}
        >
          {ssoLoading === "github" ? "Signing up..." : "Sign up with GitHub"}
        </ProviderButton>
      </div>
      <div className="auth-divider">or</div>
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
                  <SignUp onNeedsProfile={setProfileUser} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
