import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AuthUser = {
  username: string;
  role: "user";
  token: string;
};

type LoginResult =
  | { success: true }
  | { success: false; message: "Username or password invalid" };

type AuthContextValue = {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

function isAuthUser(value: unknown): value is AuthUser {
  return (
    typeof value === "object" &&
    value !== null &&
    "username" in value &&
    typeof value.username === "string" &&
    "role" in value &&
    value.role === "user" &&
    "token" in value &&
    typeof value.token === "string"
  );
}

function readStoredUser(): AuthUser | null {
  const savedUser = localStorage.getItem("user");
  if (savedUser === null) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(savedUser);
    if (isAuthUser(parsed)) {
      return parsed;
    }
    console.error("Stored auth user has an invalid format.");
    return null;
  } catch (error) {
    console.error("Could not parse stored auth user.", error);
    return null;
  }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  const login: AuthContextValue["login"] = async (username, password) => {
    if (username !== "user" || password !== "password") {
      return { success: false, message: "Username or password invalid" };
    }

    const mockUser: AuthUser = {
      username,
      role: "user",
      token: "mock-jwt-token-1234",
    };

    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return context;
}
