"use client";

import React from "react";
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Bot,
  Zap,
} from "lucide-react";
import { CURRENT_STUDENT } from "@/data/student";
import { Language, TRANSLATIONS } from "@/data/translations";
import { useLanguage } from "@/context/LanguageContext";

interface HeroSectionProps {
  currentLang: Language;
  onFocusChat: () => void;
  onOpenSecurityDrawer: () => void;
  onOpenProfile: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onFocusChat,
  onOpenSecurityDrawer,
  onOpenProfile,
}) => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-b from-blue-50/50 via-indigo-50/30 to-white pt-8 pb-10">
      {/* Background Futuristic Subtle Grid & Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(#3b82f6 0.75px, transparent 0.75px)`,
            backgroundSize: "24px 24px",
          }}
        />
        {/* Soft violet & blue radiant orbs */}
        <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute top-10 right-1/4 h-72 w-72 rounded-full bg-violet-400/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Subtitle, Badges, Direct Actions */}
          <div className="lg:col-span-7 space-y-4">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t.onlineStatus}</span>
              </div>

              <button
                onClick={onOpenSecurityDrawer}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-50/90 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200/80 hover:bg-blue-100/80 transition-colors shadow-2xs cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>{t.secureConnection}</span>
              </button>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {t.heroTitle}
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
              {t.heroSubtitle}
            </p>

            {/* Student Personalization Callout */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-700">
              <div
                onClick={onOpenProfile}
                className="flex items-center gap-2 rounded-xl bg-white/90 border border-slate-200/80 px-3 py-2 shadow-xs hover:border-blue-300 transition-all cursor-pointer"
              >
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                <span className="font-semibold text-slate-800">{CURRENT_STUDENT.name}</span>
                <span className="text-slate-400">â€¢</span>
                <span className="font-mono text-slate-600">{CURRENT_STUDENT.id}</span>
                <span className="text-slate-400">â€¢</span>
                <span className="text-slate-600">{CURRENT_STUDENT.programme}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Cpu className="h-3.5 w-3.5 text-violet-600" />
                <span>12 Federated Institutional Agents</span>
              </div>
            </div>

            {/* Primary Hero CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onFocusChat}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer group"
              >
                <Sparkles className="h-4 w-4" />
                <span>{t.askButton || "Ask Student Helpdesk"}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenSecurityDrawer}
                className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>{t.howSecurityWorks || "How Security & RLS Works"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Futuristic AI Visual (Light Theme, Neural Lattice, Clean Institutional) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Soft animated ambient ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-blue-400/20 via-violet-400/20 to-indigo-400/20 blur-xl opacity-80 animate-pulse-subtle" />

              {/* Main Card Container */}
              <div className="relative rounded-2xl border border-blue-200/80 bg-white/95 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-md">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-xs">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">AGENT 65 CORE</h4>
                      <p className="text-[10px] text-slate-500">{t.autonomousContextEngine || "Autonomous Context Engine"}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                    <Zap className="h-2.5 w-2.5 text-blue-600" />
                    ACTIVE
                  </span>
                </div>

                {/* Simulated Neural Flow */}
                <div className="my-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50/80 p-2.5 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                        1
                      </span>
                      <span className="font-medium text-slate-700">{t.verifyIdentity || "Verify Identity"}</span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-600 font-semibold">251FA04E03 âœ“</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-50/80 p-2.5 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
                        2
                      </span>
                      <span className="font-medium text-slate-700">{t.footerRls}</span>
                    </div>
                    <span className="font-mono text-[11px] text-violet-600 font-semibold">{t.passIsolation || "Pass Isolation"}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-50/80 p-2.5 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                        3
                      </span>
                      <span className="font-medium text-slate-700">{t.realTimeWellbeing || "Real-time Well-being"}</span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-600 font-semibold">{t.agent66Monitored || "Agent 66 Monitored"}</span>
                  </div>
                </div>

                {/* Floating Metric Callout */}
                <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/80 p-3 border border-blue-100 text-slate-800">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-blue-900">{t.currentExamProximity || "Current Exam Proximity"}</span>
                    <span className="font-bold text-blue-700">7 {t.daysRemaining}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">
                    Digital Logic design (DLD-25CS205) â€¢ 18 Sep, 10:00 AM in Hall A2
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
