import React, { useContext, createContext, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { app } from "../util/firebase";

export type User = FirebaseUser | null;

const initialState = {
  user: undefined,
  loading: true,
};

const AuthContext =
  createContext<{ user: User | undefined; loading: boolean }>(initialState);
const auth = getAuth(app);

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("AUTH STATE CHANGED!");
      console.log(firebaseUser);
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
