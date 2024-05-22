import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { onAuthStateChanged } from "firebase/auth";

function UserBadge() {
  const [user, setUser] = useState(firebase.auth().currentUser);
  onAuthStateChanged(firebase.auth(), (user) => {
    setUser(user);
  });

  const isSignedIn = !!firebase.auth().currentUser;
  console.log(firebase.auth().currentUser, isSignedIn);

  return (
    <div className="user-badge f1 flexRow justify-right gap-12 pr-20">
      <div>
        <a href="/challenge/rules">Rules</a>
      </div>
      <div>
        {!user ? (
          <a href="/sign-in">Sign in</a>
        ) : (
          <a href="/" onClick={() => firebase.auth().signOut()}>
            Sign out
          </a>
        )}
      </div>
    </div>
  );
}

export default UserBadge;
