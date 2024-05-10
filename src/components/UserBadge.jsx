import React from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

function UserBadge() {
  const user = firebase.auth().currentUser;
  const isSignedIn = !!firebase.auth().currentUser;
  console.log(firebase.auth().currentUser, isSignedIn);

  return (
    <div className="user-badge f1">
      <div className="pr-20">
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
