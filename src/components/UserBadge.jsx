import firebase from "firebase/compat/app";
import useUser from "../hooks/UseProfile";

function UserBadge() {
  const user = useUser();

  return (
    <div className="user-badge f1 flexRow justify-right gap-12 px-20">
      <div>
        <a href="/challenge/rules" className="fg-color">
          Rules
        </a>
      </div>
      {user && (
        <div>
          <a href="/profile" className="fg-color">
            Profile
          </a>
        </div>
      )}
      <div>
        {!user ? (
          <a href="/sign-in" className="fg-color">
            Sign in
          </a>
        ) : (
          <a
            href="/"
            onClick={() => firebase.auth().signOut()}
            className="fg-color"
          >
            Sign out
          </a>
        )}
      </div>
    </div>
  );
}

export default UserBadge;
