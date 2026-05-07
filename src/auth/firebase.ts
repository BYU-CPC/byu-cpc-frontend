import { initializeApp } from "firebase/app";
import {
  Auth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  initializeAuth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAIGt00sW24vecwBlgXJNyVKFje3ma9HqM",
  authDomain: "byu-cpc.firebaseapp.com",
};

export const firebaseApp = initializeApp(firebaseConfig);

const initializeFirebaseAuth = (): Auth => {
  try {
    return initializeAuth(firebaseApp, {
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    // Auth may already be initialized during development hot reloads.
    return getAuth(firebaseApp);
  }
};

export const auth = initializeFirebaseAuth();
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });
githubProvider.addScope("user:email");
