import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Crest } from "@/components/crest";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  signIn,
} from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { CENTRE_NAME } from "@/lib/programmes";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPending && user) {
      void navigate({ to: "/admin" });
    }
  }, [isPending, user, navigate]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const { error } = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        if (error) throw new Error(error.message || "Could not create the account.");
      } else {
        const { error } = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (error) throw new Error(error.message || "Sign-in failed.");
      }
      toast.success("Welcome to the registry.");
      await navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-md px-4 py-12">
      <div className="rounded-xl bg-cream p-6 shadow-[var(--shadow-border)] sm:p-8">
        <Crest className="size-12" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-forest">
          Registry staff
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to issue or revoke certificates for {CENTRE_NAME}.
        </p>

        <div className="mt-5 grid grid-cols-2 rounded-md bg-paper p-1 text-sm">
          <button
            type="button"
            className={`h-9 rounded ${mode === "in" ? "bg-cream text-ink shadow-[var(--shadow-border)]" : "text-muted"}`}
            onClick={() => setMode("in")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`h-9 rounded ${mode === "up" ? "bg-cream text-ink shadow-[var(--shadow-border)]" : "text-muted"}`}
            onClick={() => setMode("up")}
          >
            Create account
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          {mode === "up" ? (
            <Field label="Full name" htmlFor="staff-name">
              <Input
                id="staff-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </Field>
          ) : null}
          <Field label="Email" htmlFor="staff-email">
            <Input
              id="staff-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </Field>
          <Field
            label="Password"
            htmlFor="staff-password"
            hint={mode === "up" ? "At least 8 characters." : undefined}
          >
            <Input
              id="staff-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "up" ? "Create staff account" : "Sign in"}
          </Button>
        </form>

        {authEnabled ? (
          <>
            <div className="my-5 flex items-center gap-3 text-xs tracking-wide text-muted uppercase">
              <span className="h-px flex-1 bg-line" />
              or
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="space-y-2">
              {GROK_PROVIDERS.map((provider) => (
                <Button
                  key={provider.providerId}
                  type="button"
                  variant="cream"
                  className="w-full"
                  onClick={() =>
                    void signIn(provider.providerId, { callbackURL: "/admin" }).catch(
                      (err: unknown) =>
                        toast.error(
                          err instanceof Error ? err.message : "Sign-in failed.",
                        ),
                    )
                  }
                >
                  Continue with {provider.label}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-muted">Sign-in is disabled.</p>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          Public verification does not need an account.{" "}
          <Link to="/" className="text-forest underline-offset-4 hover:underline">
            Verify a certificate
          </Link>
        </p>
      </div>
    </main>
  );
}
