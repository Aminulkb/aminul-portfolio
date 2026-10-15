"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { serviceTypeOptions } from "@/content/site";

type FormState = {
  name: string;
  email: string;
  organization: string;
  serviceType: string;
  message: string;
  consent: boolean;
};

const initialState: FormState = {
  name: "",
  email: "",
  organization: "",
  serviceType: "",
  message: "",
  consent: false,
};

export function ContactForm() {
  const searchParams = useSearchParams();
  // Preselect the service type from a "?service=" link (Pricing/Services CTAs), computed once on
  // first render rather than synced via an effect — see https://react.dev/learn/you-might-not-need-an-effect.
  const [form, setForm] = useState<FormState>(() => {
    const preselect = searchParams.get("service");
    const serviceType = preselect && serviceTypeOptions.some((o) => o.value === preselect) ? preselect : "";
    return { ...initialState, serviceType };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  // Captured on mount (not during render) so the server can sanity-check submission speed as a bot guard.
  const renderedAtRef = useRef<number>(0);

  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Please enter a valid email address.";
    if (!form.serviceType) next.serviceType = "Please select a service type.";
    if (form.message.trim().length < 20) next.message = "Please provide a few more details (at least 20 characters).";
    if (!form.consent) next.consent = "Please agree to the privacy policy to continue.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const clientErrors = validate();
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setStatus("submitting");
    setStatusMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          companyWebsite: "",
          renderedAt: renderedAtRef.current,
        }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        setStatus("error");
        setStatusMessage(result.error || "Something went wrong. Please try again.");
        if (result.fieldErrors) setErrors(result.fieldErrors);
        return;
      }

      setStatus("success");
      setStatusMessage("Thank you — your inquiry has been sent. I'll get back to you within 2 business days.");
      setForm(initialState);
      setErrors({});
    } catch {
      setStatus("error");
      setStatusMessage("Network error. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-background p-10 text-center"
      >
        <CheckCircle2 className="text-primary" size={40} />
        <p className="text-lg font-semibold text-text">Message Sent</p>
        <p className="max-w-md text-sm text-text-secondary">{statusMessage}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-semibold text-primary hover:text-secondary"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot field — hidden from real visitors via CSS, bots that auto-fill every field trip it. */}
      <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="companyWebsite">Website</label>
        <input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            className={inputClass(!!errors.name)}
          />
        </Field>

        <Field label="Email Address" htmlFor="email" error={errors.email}>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            className={inputClass(!!errors.email)}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Organization (optional)" htmlFor="organization">
          <input
            id="organization"
            type="text"
            value={form.organization}
            onChange={(e) => update("organization", e.target.value)}
            className={inputClass(false)}
          />
        </Field>

        <Field label="Service Type" htmlFor="serviceType" error={errors.serviceType}>
          <select
            id="serviceType"
            value={form.serviceType}
            onChange={(e) => update("serviceType", e.target.value)}
            required
            className={inputClass(!!errors.serviceType)}
          >
            <option value="" disabled>
              Select a service
            </option>
            {serviceTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Message" htmlFor="message" error={errors.message}>
        <textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          required
          minLength={20}
          maxLength={2000}
          className={inputClass(!!errors.message)}
        />
      </Field>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update("consent", e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-secondary"
        />
        <label htmlFor="consent" className="text-sm text-text-secondary">
          I agree to the{" "}
          <a href="/privacy" className="font-medium text-primary underline hover:text-secondary">
            Privacy Policy
          </a>{" "}
          and consent to being contacted about this inquiry.
        </label>
      </div>
      {errors.consent && <p className="text-sm text-red-600">{errors.consent}</p>}

      {status === "error" && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{statusMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" && <Loader2 size={18} className="animate-spin" />}
        {status === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
    hasError ? "border-red-400" : "border-border"
  }`;
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-text">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
