const API_URL = import.meta.env["VITE_API_URL"] || "http://localhost:5000";

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  token?: string | null;
};

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const init: RequestInit = {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
  };
  if (options.body !== undefined) init.body = JSON.stringify(options.body);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch {
    const insecure =
      typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      API_URL.startsWith("http://");
    const error = new Error(
      insecure
        ? `Can't reach the API at ${API_URL}. This page is served over HTTPS, so the browser blocks insecure requests. Use an HTTPS API address (set VITE_API_URL) or run the app locally.`
        : `Can't reach the API at ${API_URL}. Make sure it's running and allows requests from ${typeof window !== "undefined" ? window.location.origin : "this site"} (CORS).`,
    ) as Error & { status?: number };
    error.status = 0;
    throw error;
  }

  let data: { error?: string } | T | null = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data && data.error
        ? data.error
        : `Request failed (${response.status})`;
    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return data as T;
}

export type User = { userId: string; displayName?: string };
export type Service = {
  id: string | number;
  title: string;
  description: string;
  icon?: string;
};

export const api = {
  login: (userId: string, password: string) =>
    request<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: { userId, password },
    }),
  register: (userId: string, password: string, displayName: string) =>
    request<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: { userId, password, displayName },
    }),
  me: (token: string) => request<{ user: User }>("/api/auth/me", { token }),
  services: () => request<{ services: Service[] }>("/api/services"),
  contact: (body: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) =>
    request<{ success?: boolean; message?: string }>("/api/contact", {
      method: "POST",
      body,
    }),
};
