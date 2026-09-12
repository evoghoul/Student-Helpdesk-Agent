"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  CreditCard,
  Calendar,
  BookOpen,
  LifeBuoy,
  MessageSquareText,
  Zap,
  Lock,
  HeartHandshake,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LandingPageProps {
  onGetStarted: () => void;
}

function useTypewriter(text: string, speed = 32, startDelay = 400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

const NAV_LINKS = ["Features", "How it works", "Trust & Security", "FAQ"];

const FEATURE_CARDS = [
  {
    icon: MessageSquareText,
    tone: "primary" as const,
    title: "One AI agent, every answer",
    description:
      "Ask about attendance, exams, fees, or policies in plain language. Agent 65 pulls the real record and answers instantly — no forms, no tickets, no waiting on email.",
  },
  {
    icon: UserCheck,
    tone: "warning" as const,
    title: "Attendance that warns you early",
    description:
      "See per-subject attendance against the 70% rule, with a consecutive-classes calculator that tells you exactly what it takes to stay clear.",
  },
  {
    icon: GraduationCap,
    tone: "success" as const,
    title: "Marks, CGPA & degree progress",
    description:
      "Continuous assessment scores, semester CGPA, and a live credit-completion tracker against your full degree requirement — always in view.",
  },
  {
    icon: CreditCard,
    tone: "info" as const,
    title: "Fees, receipts & due dates",
    description:
      "A single ledger for tuition, hostel and exam fees, with downloadable receipts and clear reminders before anything falls due.",
  },
  {
    icon: Calendar,
    tone: "primary" as const,
    title: "Timetable & exam schedule",
    description:
      "Today's classes, room numbers, and faculty at a glance, plus hall tickets and seating details for every upcoming examination.",
  },
  {
    icon: LifeBuoy,
    tone: "info" as const,
    title: "Services, without the paperwork",
    description:
      "Request certificates, book a mentor meeting, or raise a grievance conversationally — every request becomes a tracked ticket automatically.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Sign in with your roll number",
    description: "Single sign-on authenticates you against the university's own student records — no separate account to create.",
  },
  {
    step: "02",
    title: "Ask Agent 65 anything",
    description: "Type a question the way you'd ask a senior — the assistant classifies it, checks your access, and answers from the real data.",
  },
  {
    step: "03",
    title: "Act on what it finds",
    description: "Jump straight into the relevant screen, download a hall ticket, pay a fee, or escalate to a human — all from the same place.",
  },
];

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: "Row-Level Security",
    description: "Every query is scoped to your own student ID before it ever reaches a data source — cross-student access is rejected at the guardrail, not the UI.",
  },
  {
    icon: Lock,
    title: "Federated, not siloed",
    description: "12 specialized institutional agents (attendance, exams, fees, and more) sit behind Agent 65, each authorized independently.",
  },
  {
    icon: HeartHandshake,
    title: "Distress-aware by design",
    description: "Conversations are monitored for signs of serious stress, with an immediate handoff to campus counseling — never left to a chatbot alone.",
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { displayed, done } = useTypewriter(
    "Ask about your attendance, exams, fees, or policies — get a real answer from your real record.",
    28,
    600
  );

  const [pillsVisible, setPillsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Subtle mouse-driven parallax on the hero background blobs.
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const el = heroRef.current;
      if (!el) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.setProperty("--parallax-x", `${x * 14}px`);
      el.style.setProperty("--parallax-y", `${y * 14}px`);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/vignan-logo.png"
              alt="Vignan's University"
              className="h-10 sm:h-11 w-auto object-contain"
            />
            <div className="h-7 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden sm:block text-left">
              <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 leading-tight block">
                Student Helpdesk <span className="text-blue-600">65</span>
              </span>
              <p className="text-[11px] text-slate-500 leading-none">Autonomous University System</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <button
              onClick={onGetStarted}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <span>Sign in</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            <span
              className={`h-[2px] w-6 bg-slate-900 transition-all duration-300 ${
                isMobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[2px] w-6 bg-slate-900 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-[2px] w-6 bg-slate-900 transition-all duration-300 ${
                isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile overlay menu — kept outside <header> because its
          backdrop-blur creates a new containing block for fixed
          children, which would clip this to the header's own height. */}
      <div
        className={`fixed inset-0 z-20 flex flex-col gap-6 bg-white px-8 pt-24 pb-10 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-semibold text-slate-900"
          >
            {link}
          </a>
        ))}
        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            onGetStarted();
          }}
          className="mt-2 flex w-fit items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-base font-semibold text-white cursor-pointer"
        >
          Sign in
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center overflow-hidden px-5 pt-28 pb-16 sm:px-8 md:pt-24"
        style={{
          ["--parallax-x" as string]: "0px",
          ["--parallax-y" as string]: "0px",
        }}
      >
        {/* Background: animated gradient blobs + dot grid */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div
          className="absolute inset-0 -z-10 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(#c7d2fe 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute -top-32 left-1/4 -z-10 h-[32rem] w-[32rem] rounded-full bg-blue-300/25 blur-3xl transition-transform duration-300 ease-out"
          style={{ transform: "translate(var(--parallax-x), var(--parallax-y))" }}
        />
        <div
          className="absolute top-1/3 right-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-indigo-300/25 blur-3xl transition-transform duration-300 ease-out"
          style={{ transform: "translate(calc(var(--parallax-x) * -1), calc(var(--parallax-y) * -1))" }}
        />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left: copy */}
          <div className="max-w-2xl">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <Badge variant="primary">
                <Sparkles className="h-3 w-3" />
                Agent 65 Core
              </Badge>
              <Badge variant="success">
                <ShieldCheck className="h-3 w-3" />
                Row-Level Security
              </Badge>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              The AI helpdesk that actually knows{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                your record
              </span>
              .
            </h1>

            <p
              className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl"
              style={{ minHeight: "3.5rem" }}
            >
              {displayed}
              {!done && (
                <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-0.5 animate-[blink_1s_step-end_infinite] bg-blue-600 align-middle" />
              )}
            </p>

            <div
              className={`mt-8 flex flex-wrap items-center gap-3 transition-all duration-500 ${
                pillsVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              <button
                onClick={onGetStarted}
                className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <span>Sign in to your dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#features"
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>See what it can do</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-blue-500" />
                12 federated agents
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Verified per-student access
              </span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="h-4 w-4 text-rose-500" />
                Distress-aware support
              </span>
            </div>
          </div>

          {/* Right: floating preview card */}
          <div className="relative hidden lg:block">
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-2xl shadow-blue-900/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Student Helpdesk</div>
                  <div className="text-xs text-slate-500">Agent 65 &middot; live preview</div>
                </div>
              </div>
              <div className="space-y-3 py-4 text-sm">
                <div className="ml-auto w-fit rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2.5 text-white">
                  What&apos;s my attendance in Digital Electronics?
                </div>
                <div className="w-fit rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-700">
                  You&apos;re at <strong>68%</strong>, below the 70% threshold. Attend the next{" "}
                  <strong>4 classes consecutively</strong> to clear it.
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
                <div className="rounded-xl bg-amber-50 p-2.5">
                  <div className="text-lg font-black text-amber-900">68%</div>
                  <div className="text-[10px] font-medium text-amber-700">Attendance</div>
                </div>
                <div className="rounded-xl bg-emerald-50 p-2.5">
                  <div className="text-lg font-black text-emerald-800">8.42</div>
                  <div className="text-[10px] font-medium text-emerald-700">CGPA</div>
                </div>
                <div className="rounded-xl bg-indigo-50 p-2.5">
                  <div className="text-lg font-black text-indigo-900">7d</div>
                  <div className="text-[10px] font-medium text-indigo-700">Next exam</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-8 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-900">RLS guardrail verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-slate-100 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="primary">Everything in one place</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              One assistant, your whole academic life
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              No more chasing five different portals. Agent 65 connects to every record that
              matters and answers from the source of truth.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_CARDS.map((f) => {
              const Icon = f.icon;
              const toneClasses: Record<string, string> = {
                primary: "bg-blue-50 text-blue-600",
                warning: "bg-amber-50 text-amber-600",
                success: "bg-emerald-50 text-emerald-600",
                info: "bg-indigo-50 text-indigo-600",
              };
              return (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses[f.tone]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="info">How it works</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From sign-in to answer in seconds
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white">
                    {s.step}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent md:block" />
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section id="trust-&-security" className="border-t border-slate-100 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="success">Trust &amp; security</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Built on the same guardrails a bank would use
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                Agent 65 never touches another student&apos;s data, even by accident. Every
                request is authenticated, scoped, and logged before it reaches an institutional
                agent.
              </p>
              <button
                onClick={onGetStarted}
                className="mt-8 flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span>Try it with your own login</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {TRUST_POINTS.map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.title}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{t.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {t.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your record is already connected. Go ask it something.
          </h2>
          <p className="mt-4 text-base text-blue-100 sm:text-lg">
            Sign in with your university roll number to talk to Agent 65.
          </p>
          <button
            onClick={onGetStarted}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-blue-700 shadow-lg hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <span>Sign in to Student Helpdesk</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Bot className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-800">
              Student Helpdesk &middot; Agent 65
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Autonomous Student Support Layer &middot; Group 13
          </p>
        </div>
      </footer>
    </div>
  );
};
