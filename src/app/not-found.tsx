import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container" style={{ padding: "120px 0" }}>
      <p className="mono" style={{ color: "var(--muted)" }}>404</p>
      <h1 style={{ fontSize: "clamp(40px,6vw,88px)", letterSpacing: "-0.05em", lineHeight: 0.95, marginTop: 16 }}>
        Page not found.
      </h1>
      <p style={{ marginTop: 24 }}>
        <Link href="/projects">← Back to projects</Link>
      </p>
    </section>
  );
}
