import React, { createContext, useContext } from 'react';

// ─── Create the context ───────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider wraps the whole app in App.js ───────────────────
export function AuthProvider({ setUser, children }) {
  return (
    <AuthContext.Provider value={{ setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook — use this in ANY screen to get setUser ─────────────
// Usage:  const { setUser } = useAuth();
export default function useAuth() {
  return useContext(AuthContext);
}