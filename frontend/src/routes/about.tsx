import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Compass,
  HeartHandshake,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { Reveal } from "../components/reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Brightline Studio" },
      {
        name: "description",
        content: "Meet the small, focused team behind Brightline Studio.",
      },
      { property: "og:title", content: "About — Brightline Studio" },
      {
        property: "og:description",
        content:
          "A product studio built around clarity, craft, and close collaboration.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const values = [
    {
      icon: Compass,
      title: "Clarity first",
      text: "We turn complexity into a shared, practical direction before we build.",
    },
    {
      icon: Lightbulb,
      title: "Useful creativity",
      text: "Good ideas earn their place by making the experience meaningfully better.",
    },
    {
      icon: HeartHandshake,
      title: "True partnership",
      text: "Open communication and honest recommendations are part of the work.",
    },
  ];
  return (
    <div className="about-page">
      <section className="page-intro about-intro">
        <div>
          <span className="eyebrow">
            <Sparkles size={15} /> About the studio
          </span>
          <h1>
            Small team.
            <br />
            Bright outcomes.
          </h1>
        </div>
        <p>
          Brightline Studio designs and builds digital products end to end. We
          pair sharp strategy with thoughtful execution so every decision
          supports the people who will use what we create.
        </p>
      </section>
      <Reveal>
        <section className="statement-band">
          <Target size={30} />
          <p>
            We believe the best digital work feels{" "}
            <strong>obvious in hindsight</strong>—clear, considered, and
            remarkably easy to use.
          </p>
        </section>
      </Reveal>
      <section className="section-block">
        <Reveal>
          <div className="section-heading">
            <span className="eyebrow">Our principles</span>
            <h2>How we approach the work</h2>
          </div>
        </Reveal>
        <div className="feature-grid">
          {values.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 80}>
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
        <section className="process-row">
          <div>
            <span>01</span>
            <strong>Listen</strong>
            <p>Understand the real challenge.</p>
          </div>
          <div>
            <span>02</span>
            <strong>Shape</strong>
            <p>Find the clearest path forward.</p>
          </div>
          <div>
            <span>03</span>
            <strong>Build</strong>
            <p>Craft, test, and refine.</p>
          </div>
          <Link to="/contact" className="button button-primary">
            Start a conversation <ArrowRight size={18} />
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
