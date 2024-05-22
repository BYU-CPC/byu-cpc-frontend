import firebase from "firebase/compat/app";
import useUser from "../hooks/UseUser";

function UserBadge() {
  const user = useUser();

  return (
    <div className="user-badge f1 flexRow justify-right gap-12 px-20">
      <div>
        <a href="/challenge/rules">Rules</a>
      </div>
      {user && (
        <div>
          <a href="/profile">Profile</a>
        </div>
      )}
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
