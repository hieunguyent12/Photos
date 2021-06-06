import { createContext, useEffect, useState } from "react";

import firebase, { auth } from "./firebase";

const AuthContext = createContext();

const googleProvider = new firebase.auth.GoogleAuthProvider();

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    pending: true,
    isSignedIn: false,
  });

  useEffect(() => {
    const authListener = auth.onAuthStateChanged((user) => {
      setAuthState({ user, pending: false, isSignedIn: Boolean(user) });
    });

    return () => authListener();
  }, []);

  const onSignIn = () => {
    auth.signInWithPopup(googleProvider);
  };

  const onLogout = () => {
    auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ authState, onSignIn, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
