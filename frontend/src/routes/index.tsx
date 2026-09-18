import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Gauge,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import { Reveal } from "../components/reveal";
import { useAuth } from "../context/auth-context";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — Brightline Studio" },
      {
        name: "description",
        content:
          "Your Brightline Studio home for thoughtful, reliable digital product services.",
      },
      { property: "og:title", content: "Home — Brightline Studio" },
      {
        property: "og:description",
        content:
          "Thoughtful digital products designed and built to move your business forward.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate({ to: "/login", replace: true });
  }, [isAuthenticated, loading, navigate]);

  if (loading || !isAuthenticated) return <PageLoading />;

  const features = [
    {
      icon: ShieldCheck,
      title: "Built with confidence",
      text: "Reliable foundations, sensible security, and maintainable systems from day one.",
    },
    {
      icon: Gauge,
      title: "Fast by design",
      text: "Focused experiences that feel immediate and perform beautifully on every screen.",
    },
    {
      icon: Layers3,
      title: "End-to-end thinking",
      text: "Strategy, interface, and engineering working together as one clear process.",
    },
  ];

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} /> Welcome back,{" "}
            {user?.displayName || user?.userId}
          </span>
          <h1>Bring your next digital product into focus.</h1>
          <p>
            Brightline Studio turns ambitious ideas into clear, fast,
            human-centered experiences your customers will enjoy using.
          </p>
          <div className="hero-actions">
            <Link to="/service" className="button button-primary">
              View services <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="button button-secondary">
              Contact us
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="signal-grid">
            <div className="signal-card signal-primary">
              <span>Momentum</span>
              <strong>+34%</strong>
              <div className="mini-chart">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="signal-card signal-float">
              <span>Projects shipped</span>
              <strong>120+</strong>
            </div>
            <div className="signal-orbit">
              <span>
                <Sparkles size={22} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <Reveal>
          <div className="section-heading">
            <span className="eyebrow">Why Brightline</span>
            <h2>Clear thinking. Beautiful execution.</h2>
            <p>
              Every engagement is shaped around real outcomes, not unnecessary
              complexity.
            </p>
          </div>
        </Reveal>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 80}>
              <article className="feature-card">
                <span className="icon-box">
                  <Icon size={23} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="stats-band">
          <div>
            <strong>120+</strong>
            <span>Products delivered</span>
          </div>
          <div>
            <strong>98%</strong>
            <span>Client satisfaction</span>
          </div>
          <div>
            <strong>4.9</strong>
            <span>Average partnership rating</span>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

function PageLoading() {
  return (
    <div className="full-state">
      <span className="loader-ring" />
      <h1>Restoring your workspace</h1>
      <p>One quick moment while we securely load your session.</p>
    </div>
  );
}
