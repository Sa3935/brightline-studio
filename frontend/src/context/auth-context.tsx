import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, type User } from "../lib/api";

const STORAGE_KEY = "brightline_auth_token";

type AuthValue = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userId: string, password: string) => Promise<void>;
  register: (
    userId: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(STORAGE_KEY);
    if (!storedToken) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setToken(storedToken);
    api
      .me(storedToken)
      .then(({ user: restoredUser }) => {
        if (!cancelled) setUser(restoredUser);
      })
      .catch((error: Error & { status?: number }) => {
        if (!cancelled) {
          if (error.status === 401) window.localStorage.removeItem(STORAGE_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const persistSession = (nextToken: string, nextUser: User) => {
    window.localStorage.setItem(STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login: async (userId, password) => {
        const result = await api.login(userId, password);
        persistSession(result.token, result.user);
      },
      register: async (userId, password, displayName) => {
        const result = await api.register(userId, password, displayName);
        persistSession(result.token, result.user);
      },
      logout: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setUser(null);
      },
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
