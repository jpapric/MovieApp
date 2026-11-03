import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Movies } from "../movies/api/getMovies";
import type { Series } from "../series/api/getSeries";

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
  favoriteItems: Favorite[];
  toggleFavorite: (favorite: Favorite) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

type Favorite =
  | { type: "movie"; item: Movies }
  | { type: "series"; item: Series };

function isMovie(value: unknown): value is Movies {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "title" in value &&
    typeof value.title === "string"
  );
}

function isSeries(value: unknown): value is Series {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "name" in value &&
    typeof value.name === "string"
  );
}

function isFavorite(value: unknown): value is Favorite {
  if (typeof value !== "object" || value === null || !("type" in value)) {
    return false;
  }

  if (!("item" in value)) {
    return false;
  }

  if (value.type === "movie") return isMovie(value.item);
  if (value.type === "series") return isSeries(value.item);

  return false;
}

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

function readFavorites(): Favorite[] {
  try {
    const saved = localStorage.getItem("favorites");
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      throw new Error("Saved favorites are not an array.");
    }

    return parsed.flatMap((entry): Favorite[] => {
      if (isFavorite(entry)) return [entry];

      if (isMovie(entry)) {
        return [{ type: "movie", item: entry }];
      }

      return [];
    });
  } catch (error) {
    console.error("Could not read saved favorites.", error);
    return [];
  }
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

  const [favoriteItems, setFavoriteItems] = useState<Favorite[]>(() =>
    user ? readFavorites() : [],
  );

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
    setFavoriteItems(readFavorites());
    setUser(mockUser);
    return { success: true };
  };

  const logout = () => {
    removeStoredUser();
    setUser(null);
    setFavoriteItems([]);
  };

  const toggleFavorite = (favorite: Favorite) => {
    if (!user) return;

    const alreadyFavorite = favoriteItems.some(
      (saved) =>
        saved.type === favorite.type && saved.item.id === favorite.item.id,
    );

    const nextFavorites = alreadyFavorite
      ? favoriteItems.filter(
          (saved) =>
            saved.type !== favorite.type || saved.item.id !== favorite.item.id,
        )
      : [favorite, ...favoriteItems];

    try {
      localStorage.setItem("favorites", JSON.stringify(nextFavorites));
    } catch (error) {
      console.error("Could not save favorites.", error);
      return;
    }

    setFavoriteItems(nextFavorites);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        favoriteItems,
        toggleFavorite,
      }}
    >
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
