import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Blocks,
  Cloud,
  Code2,
  Database,
  Palette,
  RefreshCw,
  ServerCog,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { api, type Service } from "../lib/api";

export const Route = createFileRoute("/service")({
  head: () => ({
    meta: [
      { title: "Services — Brightline Studio" },
      {
        name: "description",
        content:
          "Explore Brightline Studio design, development, integration, and deployment services.",
      },
      { property: "og:title", content: "Services — Brightline Studio" },
      {
        property: "og:description",
        content:
          "Focused digital product services from strategy through launch.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

const fallback: Service[] = [
  {
    id: "web",
    title: "Web Development",
    description:
      "Responsive websites and web apps engineered for speed and longevity.",
    icon: "code",
  },
  {
    id: "product",
    title: "Product Design",
    description:
      "Clear flows and polished interfaces rooted in real user needs.",
    icon: "palette",
  },
  {
    id: "api",
    title: "API Integration",
    description:
      "Dependable connections between the tools and services your business relies on.",
    icon: "blocks",
  },
  {
    id: "data",
    title: "Database Design",
    description:
      "Thoughtful data structures, optimization, and safe migrations.",
    icon: "database",
  },
  {
    id: "cloud",
    title: "Cloud Deployment",
    description: "Reliable releases, environments, and delivery workflows.",
    icon: "cloud",
  },
  {
    id: "systems",
    title: "Technical Strategy",
    description:
      "Practical architecture decisions that support where you are going.",
    icon: "server",
  },
];
const icons = {
  code: Code2,
  palette: Palette,
  blocks: Blocks,
  database: Database,
  cloud: Cloud,
  server: ServerCog,
};

function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const load = useCallback(() => {
    setLoading(true);
    setFailed(false);
    api
      .services()
      .then((data) =>
        setServices(data.services?.length ? data.services : fallback),
      )
      .catch(() => {
        setServices(fallback);
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  return (
    <div className="services-page">
      <section className="page-intro">
        <div>
          <span className="eyebrow">
            <Sparkles size={15} /> What we do
          </span>
          <h1>Expertise that moves your product forward.</h1>
        </div>
        <p>
          From first direction to launch and beyond, we bring the right blend of
          strategy, design, and engineering.
        </p>
      </section>
      {failed && (
        <div className="inline-state">
          <AlertTriangle size={21} />
          <div>
            <strong>Live services are unavailable</strong>
            <p>We’re showing our standard capabilities in the meantime.</p>
          </div>
          <Button variant="ghost" size="compact" onClick={load}>
            <RefreshCw size={16} /> Retry
          </Button>
        </div>
      )}
      <div className="service-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div className="service-card skeleton-card" key={i}>
                <span />
                <i />
                <i />
                <i />
              </div>
            ))
          : services.map((service, i) => {
              const Icon =
                icons[
                  (service.icon || "code").toLowerCase() as keyof typeof icons
                ] || Sparkles;
              return (
                <article
                  className="service-card"
                  key={service.id}
                  style={
                    { "--card-delay": `${i * 55}ms` } as React.CSSProperties
                  }
                >
                  <span className="icon-box">
                    <Icon size={24} />
                  </span>
                  <span className="service-number">0{i + 1}</span>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  <Link to="/contact">
                    Discuss this service <ArrowRight size={16} />
                  </Link>
                </article>
              );
            })}
      </div>
      <section className="service-cta">
        <div>
          <span className="eyebrow">Have something specific in mind?</span>
          <h2>Let’s shape the right approach together.</h2>
        </div>
        <Link to="/contact" className="button button-primary">
          Start a conversation <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
