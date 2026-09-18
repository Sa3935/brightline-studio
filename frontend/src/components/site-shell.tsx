import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  House,
  Info,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../context/auth-context";
import { Button } from "./ui/button";

const links = [
  { to: "/" as const, label: "Home", icon: House },
  { to: "/about" as const, label: "About", icon: Info },
  { to: "/service" as const, label: "Services", icon: BriefcaseBusiness },
  { to: "/contact" as const, label: "Contact", icon: Mail },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  useEffect(() => {
    const saved = window.localStorage.getItem("brightline_theme");
    const nextDark = saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("brightline_theme", next ? "dark" : "light");
  };

  return (
    <div className="app-shell">
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav-wrap">
          <Link
            to="/"
            className="brand"
            onClick={() => setMenuOpen(false)}
            aria-label="Brightline Studio home"
          >
            <span className="brand-mark" aria-hidden="true">
              <span />
            </span>
            <span>
              Brightline<span className="brand-muted"> Studio</span>
            </span>
          </Link>

          <nav
            className={`main-nav ${menuOpen ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="nav-link"
                activeProps={{ className: "nav-link is-active" }}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            ))}
            <div className="nav-divider" />
            {isAuthenticated ? (
              <div className="user-area">
                <span className="user-chip">
                  <span className="user-avatar">
                    {(user?.displayName || user?.userId || "U")
                      .slice(0, 1)
                      .toUpperCase()}
                  </span>
                  {user?.displayName || user?.userId}
                </span>
                <Button
                  variant="ghost"
                  size="compact"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate({ to: "/login" });
                  }}
                >
                  <LogOut size={16} /> Log out
                </Button>
              </div>
            ) : (
              <Link
                to="/login"
                className="button button-primary button-compact"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn size={16} /> Log in
              </Link>
            )}
          </nav>

          <div className="nav-actions">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={dark ? "Use light mode" : "Use dark mode"}
              title={dark ? "Use light mode" : "Use dark mode"}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="menu-button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </header>

      <main className="site-main">
        <div key={pathname} className="page-enter">
          {children}
        </div>
      </main>
      <footer className="site-footer">
        <div className="footer-wrap">
          <div>
            <Link to="/" className="footer-brand">
              Brightline Studio
            </Link>
            <p>
              Thoughtful digital products, built to move businesses forward.
            </p>
          </div>
          <div className="footer-links">
            {links.slice(1).map(({ to, label }) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} Brightline Studio
          </p>
        </div>
      </footer>
    </div>
  );
}
