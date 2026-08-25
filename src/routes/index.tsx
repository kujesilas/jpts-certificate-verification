import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  FileSearch,
  LockKeyhole,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Crest } from "@/components/crest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prepareRegistry } from "@/lib/cert-api";
import { CENTRE_NAME, CENTRE_STATE, INSTITUTION_NAME } from "@/lib/programmes";

export const Route = createFileRoute("/")({
  loader: () => prepareRegistry(),
  component: Home,
});

const SAMPLES = [
  { number: "JPTS-AKW-2026-0001", name: "Amina Bello" },
  { number: "JPTS-AKW-2026-0002", name: "Chinedu Okafor" },
  { number: "JPTS-AKW-2025-0148", name: "Fatima Abdullahi" },
  { number: "JPTS-AKW-2024-0091", name: "Musa Suleiman" },
];

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    void navigate({
      to: "/c/$number",
      params: { number: value.replace(/\s+/g, "") },
    });
  }

  return (
    <main>
      <section className="hero-panel text-forest-fg">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div className="stagger-in">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs tracking-[0.18em] text-gold-soft uppercase">
              <ShieldCheck className="size-3.5" />
              Official register · {CENTRE_STATE}
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-6xl">
              Confirm a JPTS certificate in seconds.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-forest-fg/80 sm:text-lg">
              Employers, institutions and graduates can check that a certificate
              issued by {INSTITUTION_NAME}, {CENTRE_NAME}, is authentic, current
              and has not been revoked.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-xl bg-cream p-5 text-ink shadow-[var(--shadow-border)] sm:p-7"
          >
            <div className="flex items-center gap-3">
              <Crest className="size-10" />
              <div>
                <p className="font-display text-xl font-semibold text-forest">
                  Verify a certificate
                </p>
                <p className="text-sm text-muted">
                  Enter the certificate number or 8-character code
                </p>
              </div>
            </div>
            <label className="mt-5 block text-sm font-medium" htmlFor="cert-query">
              Certificate number
            </label>
            <Input
              id="cert-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="JPTS-AKW-2026-0001"
              autoComplete="off"
              className="mt-1.5"
            />
            <Button type="submit" className="mt-4 w-full" size="lg">
              <FileSearch className="size-4" />
              Verify now
            </Button>
            <p className="mt-4 text-xs font-medium tracking-wide text-muted uppercase">
              Try a sample record
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SAMPLES.map((sample) => (
                <button
                  key={sample.number}
                  type="button"
                  onClick={() =>
                    void navigate({
                      to: "/c/$number",
                      params: { number: sample.number },
                    })
                  }
                  className="rounded-full bg-paper px-3 py-1.5 text-left text-xs text-ink shadow-[var(--shadow-border)] transition-shadow hover:shadow-[var(--shadow-border-hover)]"
                >
                  <span className="block font-medium">{sample.name}</span>
                  <span className="tabular-nums text-muted">{sample.number}</span>
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <p className="text-xs tracking-[0.2em] text-gold uppercase">How it works</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-forest sm:text-4xl">
          Three steps from paper to proof
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: ScanLine,
              title: "Enter the number",
              body: "Type the certificate number printed on the document, or the short verification code next to the QR mark.",
            },
            {
              icon: BadgeCheck,
              title: "Match the register",
              body: "The portal looks up the live Akwanga Centre register and returns the holder, programme, date and status.",
            },
            {
              icon: LockKeyhole,
              title: "Trust the status",
              body: "Valid means the award is current. Revoked means the Centre has withdrawn the record after review.",
            },
          ].map((step) => (
            <article
              key={step.title}
              className="rounded-xl bg-cream p-5 shadow-[var(--shadow-border)]"
            >
              <step.icon className="size-6 text-gold" />
              <h3 className="mt-4 font-display text-xl font-semibold text-forest">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-cream/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs tracking-[0.2em] text-gold uppercase">The Centre</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-forest sm:text-4xl">
              {INSTITUTION_NAME}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              JPTS is a professional training organisation offering certificated
              programmes in management, health and safety, oil and gas, ICT and
              related fields. This portal is the official verification register
              of the {CENTRE_NAME} in {CENTRE_STATE}. Staff of the registry issue
              and, where necessary, revoke awards. The public may inspect any
              record without signing in.
            </p>
          </div>
          <div className="rounded-xl bg-forest p-6 text-forest-fg">
            <Building2 className="size-7 text-gold-soft" />
            <p className="mt-4 font-display text-2xl font-semibold">
              Akwanga Centre
            </p>
            <p className="mt-1 text-sm text-forest-fg/75">Nasarawa State, Nigeria</p>
            <ul className="mt-5 space-y-2 text-sm text-forest-fg/85">
              <li>Professional certificates and international diplomas</li>
              <li>Live status: valid or revoked</li>
              <li>QR-backed public inspection</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
