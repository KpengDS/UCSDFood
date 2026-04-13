import { createContext, useContext } from "react";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: false,
});

export function AuthProvider({ children }) {
  // No external auth — always unauthenticated for now
  const auth = { user: null, isAuthenticated: false, loading: false };

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
