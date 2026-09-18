import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Brightline Studio" },
      {
        name: "description",
        content: "Log in or create your Brightline Studio account.",
      },
      { property: "og:title", content: "Log in — Brightline Studio" },
      {
        property: "og:description",
        content: "Access your Brightline Studio workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [registerMode, setRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) navigate({ to: "/", replace: true });
  }, [isAuthenticated, loading, navigate]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (registerMode && password.length < 8)
      return setError("Your password needs at least 8 characters.");
    setSubmitting(true);
    setError("");
    try {
      if (registerMode)
        await register(userId.trim(), password, displayName.trim());
      else await login(userId.trim(), password);
      navigate({ to: "/", replace: true });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "We couldn't complete that request.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-story">
        <span className="eyebrow">
          <Sparkles size={15} /> Brightline workspace
        </span>
        <h1>Good work starts with a clear line forward.</h1>
        <p>
          Sign in to continue shaping thoughtful products with a team that
          values clarity, craft, and momentum.
        </p>
        <div className="auth-proof">
          <span>
            <LockKeyhole size={18} />
          </span>
          <div>
            <strong>Your session stays secure</strong>
            <small>
              We restore access using your saved token and verify it with your
              API.
            </small>
          </div>
        </div>
      </section>
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="mode-switch" role="tablist" aria-label="Account action">
          <button
            type="button"
            role="tab"
            aria-selected={!registerMode}
            className={!registerMode ? "active" : ""}
            onClick={() => {
              setRegisterMode(false);
              setError("");
            }}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={registerMode}
            className={registerMode ? "active" : ""}
            onClick={() => {
              setRegisterMode(true);
              setError("");
            }}
          >
            Create account
          </button>
        </div>
        <div className="auth-heading" key={registerMode ? "register" : "login"}>
          <span className="icon-box">
            <KeyRound size={22} />
          </span>
          <h2 id="auth-title">
            {registerMode ? "Create your account" : "Welcome back"}
          </h2>
          <p>
            {registerMode
              ? "A few details and you’ll be ready to go."
              : "Enter your details to access your workspace."}
          </p>
        </div>
        <form className="form-stack" onSubmit={submit}>
          <label>
            User ID
            <div className="input-wrap">
              <UserRound size={18} />
              <input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                autoComplete="username"
                placeholder="your-user-id"
                required
              />
            </div>
          </label>
          <div
            className={`collapsible-field ${registerMode ? "expanded" : ""}`}
            aria-hidden={!registerMode}
          >
            <label>
              Display name
              <div className="input-wrap">
                <Sparkles size={18} />
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoComplete="name"
                  placeholder="How should we greet you?"
                  required={registerMode}
                  tabIndex={registerMode ? 0 : -1}
                />
              </div>
            </label>
          </div>
          <label>
            Password
            <div className="input-wrap">
              <LockKeyhole size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  registerMode ? "new-password" : "current-password"
                }
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="field-action"
                onClick={() => setShowPassword((show) => !show)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          {registerMode && (
            <div
              className={`strength-hint ${password.length >= 8 ? "valid" : ""}`}
            >
              <span>
                <i className={password.length >= 1 ? "filled" : ""} />
                <i className={password.length >= 4 ? "filled" : ""} />
                <i className={password.length >= 8 ? "filled" : ""} />
              </span>
              {password.length >= 8
                ? "Password length looks good"
                : "Use at least 8 characters"}
            </div>
          )}
          {error && (
            <p className="form-alert error">
              <AlertCircle size={17} />
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={
              submitting ||
              !userId.trim() ||
              !password ||
              (registerMode && (!displayName.trim() || password.length < 8))
            }
          >
            {submitting ? (
              <>
                <LoaderCircle className="spin" size={18} /> Please wait
              </>
            ) : (
              <>
                {registerMode ? "Create account" : "Log in"}
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </form>
      </section>
    </div>
  );
}
