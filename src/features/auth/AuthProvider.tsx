import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AuthUser = {
  username: string;
  role: "user";
  token: string;
};

type LoginResult = { success: true } | { success: false; message: string };

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

function removeStoredUser() {
  try {
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Could not remove stored auth user.", error);
  }
}

function readStoredUser(): AuthUser | null {
  let savedUser: string | null;

  try {
    savedUser = localStorage.getItem("user");
  } catch (error) {
    console.error("Could not access stored auth user.", error);
    return null;
  }

  if (savedUser === null) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(savedUser);
  } catch (error) {
    console.error("Could not parse stored auth user.", error);
    removeStoredUser();
    return null;
  }

  if (!isAuthUser(parsed)) {
    console.error("Stored auth user has an invalid format.");
    removeStoredUser();
    return null;
  }

  return parsed;
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

    try {
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Could not save auth user.", error);
      return {
        success: false,
        message: "Could not save login. Try again.",
      };
    }

    setUser(mockUser);
    return { success: true };
  };

  const logout = () => {
    removeStoredUser();
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
