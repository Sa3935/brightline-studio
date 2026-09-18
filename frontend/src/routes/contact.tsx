import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  AtSign,
  CheckCircle2,
  LoaderCircle,
  Mail,
  MessageSquareText,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Toast } from "../components/toast";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Brightline Studio" },
      {
        name: "description",
        content:
          "Tell Brightline Studio about your next digital product or project.",
      },
      { property: "og:title", content: "Contact — Brightline Studio" },
      {
        property: "og:description",
        content:
          "Start a clear, practical conversation about your next project.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const empty = { name: "", email: "", subject: "", message: "" };
function ContactPage() {
  const [form, setForm] = useState(empty);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const valid =
    form.name.trim().length >= 2 &&
    emailValid &&
    form.message.trim().length >= 10;
  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const timer = window.setTimeout(() => setStatus("idle"), 5000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!valid) return;
    setStatus("submitting");
    setFeedback("");
    try {
      const result = await api.contact(form);
      setFeedback(result.message || "Thanks — your message is on its way.");
      setStatus("success");
      setForm(empty);
      setTouched({});
    } catch (cause) {
      setFeedback(
        cause instanceof Error
          ? cause.message
          : "We couldn't send your message.",
      );
      setStatus("error");
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-aside">
        <span className="eyebrow">
          <Sparkles size={15} /> Let’s work together
        </span>
        <h1>Tell us what you’re building.</h1>
        <p>
          Share a little about the challenge, the opportunity, or the idea.
          We’ll respond with a clear next step.
        </p>
        <div className="contact-detail">
          <span className="icon-box">
            <Mail size={21} />
          </span>
          <div>
            <small>Email us</small>
            <strong>hello@brightline.studio</strong>
          </div>
        </div>
        <div className="response-note">
          <CheckCircle2 size={19} />
          <span>
            <strong>Thoughtful replies, not sales scripts.</strong>
            <small>We typically respond within two business days.</small>
          </span>
        </div>
      </section>
      <section className="contact-form-panel">
        <form onSubmit={submit} noValidate>
          <div className="form-row">
            <Field
              label="Name"
              error={
                touched["name"] && form.name.trim().length < 2
                  ? "Please enter your name."
                  : ""
              }
            >
              <UserRound size={18} />
              <input
                value={form.name}
                onBlur={() => setTouched((v) => ({ ...v, name: true }))}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
            </Field>
            <Field
              label="Email"
              error={
                touched["email"] && !emailValid
                  ? "Enter a valid email address."
                  : ""
              }
            >
              <AtSign size={18} />
              <input
                type="email"
                value={form.email}
                onBlur={() => setTouched((v) => ({ ...v, email: true }))}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
              />
            </Field>
          </div>
          <Field label="Subject" optional>
            <MessageSquareText size={18} />
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="What can we help with?"
            />
          </Field>
          <Field
            label="Message"
            error={
              touched["message"] && form.message.trim().length < 10
                ? "Please share at least 10 characters."
                : ""
            }
          >
            <MessageSquareText size={18} />
            <textarea
              rows={6}
              value={form.message}
              onBlur={() => setTouched((v) => ({ ...v, message: true }))}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="A little context goes a long way…"
            />
          </Field>
          {feedback && (
            <p
              className={`form-alert ${status === "error" ? "error" : "success"}`}
            >
              {status === "error" ? (
                <AlertCircle size={17} />
              ) : (
                <CheckCircle2 size={17} />
              )}{" "}
              {feedback}
            </p>
          )}
          <Button type="submit" disabled={status === "submitting" || !valid}>
            {status === "submitting" ? (
              <>
                <LoaderCircle className="spin" size={18} /> Sending
              </>
            ) : (
              <>
                Send message <Send size={18} />
              </>
            )}
          </Button>
        </form>
      </section>
      {(status === "success" || status === "error") && (
        <Toast
          message={feedback}
          tone={status}
          onClose={() => setStatus("idle")}
        />
      )}
    </div>
  );
}

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string | false;
  children: React.ReactNode;
}) {
  return (
    <label className={error ? "field-invalid" : ""}>
      <span className="label-row">
        <span>{label}</span>
        {optional && <small>Optional</small>}
      </span>
      <div className="input-wrap">{children}</div>
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
