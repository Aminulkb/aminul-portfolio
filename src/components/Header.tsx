"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-4 border-gold bg-gradient-to-r from-primary via-primary to-secondary/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Link
          href="/"
          className="font-serif text-xl font-semibold text-gold-soft transition-colors hover:text-gold"
          onClick={() => setOpen(false)}
        >
          Aminul Islam
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-gold/15 hover:text-gold-soft"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-ember hover:text-white md:inline-flex"
        >
          Book a Consultation
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex items-center justify-center rounded-md p-2 text-white md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="border-t-2 border-gold bg-primary px-6 py-4 md:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-4">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block text-base font-medium text-white/85 transition-colors hover:text-gold-soft"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-md bg-gold px-5 py-2.5 text-center text-sm font-semibold text-ink transition-colors duration-300 hover:bg-ember hover:text-white"
              >
                Book a Consultation
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
