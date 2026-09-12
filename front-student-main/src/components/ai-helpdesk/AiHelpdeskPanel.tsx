"use client";

import React, { useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  ShieldCheck,
  ArrowUpRight,
  RotateCcw,
  Zap,
  Sparkles,
  Mic,
  MicOff,
  PhoneCall,
  HeartHandshake,
  LifeBuoy,
  Phone,
  Stethoscope,
  MapPin,
  CalendarClock,
  Armchair,
  Lightbulb,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import {
  StructuredCardData,
} from "@/lib/ai-engine";
import { CURRENT_STUDENT } from "@/data/student";
import { QuickActionChips } from "@/components/quick-actions/QuickActionChips";
import { Badge } from "@/components/ui/badge";
import { MarkdownText } from "@/components/ui/markdown-text";
import { cn } from "@/lib/utils";
import { useAgentChat } from "@/context/AgentChatContext";
import { useLanguage } from "@/context/LanguageContext";

export interface AiHelpdeskPanelProps {
  onNavigateTab: (tab: string) => void;
  onOpenServiceModal: (category?: string) => void;
  onOpenEscalation: (summary?: string) => void;
  onTriggerDistressSupport: () => void;
  /** Visual variant: 'central' for Home hero, 'side' for contextual panel, 'maximized' for fullscreen modal */
  variant?: "central" | "side" | "maximized";
  /** Renders as a full-height docked panel (backwards compatible prop). */
  fillHeight?: boolean;
  /** Shown as a close button in the header when the panel is a dismissible overlay. */
  onClose?: () => void;
}

export const AiHelpdeskPanel: React.FC<AiHelpdeskPanelProps> = ({
  onNavigateTab,
  onOpenServiceModal,
  onOpenEscalation,
  onTriggerDistressSupport,
  variant,
  fillHeight = false,
  onClose,
}) => {
  const effectiveVariant: "central" | "side" | "maximized" =
    variant || (fillHeight ? "side" : "central");

  const {
    messages,
    inputQuery,
    setInputQuery,
    isTyping,
    isListening,
    setIsMaximized,
    modelMode,
    setModelMode,
    handleSend,
    handleResetChat,
    handleSpeechToggle,
    registerDistressCallback,
  } = useAgentChat();

  const { t: tr, language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    registerDistressCallback(onTriggerDistressSupport);
  }, [onTriggerDistressSupport, registerDistressCallback]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollToBottom();
  }, [messages, isTyping]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  // Shared visual tone tokens per card type
  const cardTone = {
    attendance: {
      border: "border-amber-200",
      bg: "bg-amber-50/50",
      badge: "warning" as const,
      button: "bg-amber-700 hover:bg-amber-800",
      tile: "border-amber-100",
    },
    exam: {
      border: "border-blue-200",
      bg: "bg-blue-50/50",
      badge: "primary" as const,
      button: "bg-blue-600 hover:bg-blue-700",
      tile: "border-blue-100",
    },
    fee: {
      border: "border-amber-200",
      bg: "bg-amber-50/40",
      badge: "warning" as const,
      button: "bg-slate-900 hover:bg-slate-800",
      tile: "border-slate-200",
    },
    curriculum: {
      border: "border-cyan-200",
      bg: "bg-cyan-50/40",
      badge: "info" as const,
      button: "bg-cyan-700 hover:bg-cyan-800",
      tile: "border-cyan-100",
    },
    service: {
      border: "border-indigo-200",
      bg: "bg-indigo-50/50",
      badge: "info" as const,
      button: "bg-indigo-600 hover:bg-indigo-700",
      tile: "border-indigo-100",
    },
  };

  // Render structured interactive card
  const renderStructuredCard = (card: StructuredCardData) => {
    if (card.type === "distress") {
      return (
        <div className="mt-3 rounded-2xl border-2 border-rose-200 bg-rose-50/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-2">
            <HeartHandshake className="h-4 w-4 text-rose-600" />
            <span>{card.badge}</span>
          </div>
          <h4 className="text-sm font-bold text-rose-950">{card.title}</h4>
          <p className="text-xs text-rose-800 mt-1 mb-3">{card.subtitle}</p>
          <div className="rounded-xl bg-white p-3 border border-rose-200 text-xs text-rose-900 space-y-1.5 mb-3 font-medium">
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0 text-rose-600" />
              24/7 Helpline: <strong>1800-599-0019</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <Stethoscope className="h-3.5 w-3.5 shrink-0 text-rose-600" />
              Counselor: <strong>Dr. Ananya Roy (Lead Student Psychologist)</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-600" />
              Location: <strong>Student Wellness Center, Health Block Room 104</strong>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onTriggerDistressSupport}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-colors cursor-pointer"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Connect with Counselor Now</span>
            </button>
            <button
              onClick={() => onOpenEscalation("Student experiencing extreme stress and academic pressure")}
              className="flex items-center gap-1.5 rounded-xl bg-white border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <span>Talk to Human Support</span>
            </button>
          </div>
        </div>
      );
    }

    if (card.type === "attendance") {
      const data = card.data as Record<string, unknown>;
      const t = cardTone.attendance;
      return (
        <div className={cn("mt-3 rounded-2xl border p-4 shadow-xs", t.border, t.bg)}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <Badge variant={t.badge} className="whitespace-normal text-left">{card.badge}</Badge>
              <span className="text-xs font-bold text-slate-800">{card.title}</span>
            </div>
            <span className="text-xs font-bold text-amber-900 shrink-0">{String(data.currentAttendance || "68%")}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2 text-xs">
            <div className={cn("rounded-lg bg-white p-2.5 border", t.tile)}>
              <div className="text-[11px] text-slate-500">Classes Attended</div>
              <div className="font-bold text-slate-800">{String(data.attendedRatio || "34 / 50")}</div>
            </div>
            <div className={cn("rounded-lg bg-white p-2.5 border", t.tile)}>
              <div className="text-[11px] text-slate-500">Target for 70%</div>
              <div className="font-bold text-amber-700">
                {data.consecutiveNeeded70 ? `${String(data.consecutiveNeeded70)} classes consecutive` : "Requirement met"}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-1.5 text-[11px] text-amber-900/90 font-medium mb-3">
            <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
            <p><strong>Actionable Guidance:</strong> Attend the next 4 classes consecutively to reach 70% threshold, assuming no additional absences are incurred.</p>
          </div>

          <button
            onClick={() => onNavigateTab("attendance")}
            className={cn("flex items-center gap-1 rounded-lg text-white px-3 py-1.5 text-xs font-semibold transition-colors shadow-xs cursor-pointer", t.button)}
          >
            <span>{tr.openAttendanceDrawer}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }

    if (card.type === "exam") {
      const data = card.data as Record<string, unknown>;
      const examsList = Array.isArray(data.exams) ? (data.exams as any[]) : [];
      const firstExam = examsList[0] || {};
      const examDate = (data.date && data.date !== "undefined") ? String(data.date) : (firstExam.exam_date || "18 Sep 2026");
      const examTime = (data.time && data.time !== "undefined") ? String(data.time) : (firstExam.time || "10:00 AM");
      const examVenue = (data.venue && data.venue !== "undefined") ? String(data.venue) : (firstExam.venue || "Examination Hall (N-312 / N-Block)");
      const seating = (data.seating && data.seating !== "undefined") ? String(data.seating) : (firstExam.hall_ticket_status || "Hall Ticket Allocated");
      const t = cardTone.exam;
      return (
        <div className={cn("mt-3 rounded-2xl border p-4 shadow-xs", t.border, t.bg)}>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={t.badge} className="whitespace-normal text-left">{card.badge}</Badge>
            <span className="text-xs font-mono font-bold text-blue-700">7 Days Remaining</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">{card.title}</h4>
          <div className={cn("my-2 rounded-xl bg-white p-2.5 border text-xs space-y-1.5 text-slate-700", t.tile)}>
            <div className="flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5 shrink-0 text-blue-600" />
              Date & Time: <strong>{String(examDate)} at {String(examTime)}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600" />
              Examination Venue: <strong>{String(examVenue)}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <Armchair className="h-3.5 w-3.5 shrink-0 text-blue-600" />
              Seating Allocation: <strong>{String(seating)}</strong>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("exams")}
            className={cn("flex items-center gap-1 rounded-lg text-white px-3 py-1.5 text-xs font-semibold transition-colors shadow-xs cursor-pointer", t.button)}
          >
            <span>{tr.viewExamSchedule}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }

    if (card.type === "fee") {
      const data = card.data as Record<string, unknown>;
      const t = cardTone.fee;
      return (
        <div className={cn("mt-3 rounded-2xl border p-4 shadow-xs", t.border, t.bg)}>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
            <Badge variant={t.badge} className="whitespace-normal text-left">{card.badge}</Badge>
            <span className="text-xs font-bold text-amber-900">Due: {String(data.dueDate)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 my-2 text-xs">
            <div className={cn("rounded-lg bg-white p-2.5 border", t.tile)}>
              <div className="text-[11px] text-slate-500">Total Demand</div>
              <div className="font-bold text-slate-800">{String(data.demand)}</div>
            </div>
            <div className={cn("rounded-lg bg-white p-2.5 border", t.tile)}>
              <div className="text-[11px] text-slate-500">Total Settled</div>
              <div className="font-bold text-emerald-600">{String(data.paid)}</div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("fees")}
            className={cn("flex items-center gap-1 rounded-lg text-white px-3 py-1.5 text-xs font-semibold transition-colors shadow-xs cursor-pointer", t.button)}
          >
            <span>View Fee Details & Pay Dues</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }

    if (card.type === "curriculum") {
      const t = cardTone.curriculum;
      return (
        <div className={cn("mt-3 rounded-2xl border p-4 shadow-xs", t.border, t.bg)}>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={t.badge} className="whitespace-normal text-left">{card.badge}</Badge>
            <span className="text-xs font-bold text-cyan-900">Progress: 60%</span>
          </div>
          <p className="text-xs text-slate-700 mb-3 font-medium">
            You have earned <strong>72 of 120 required credits</strong>. Current semester load is 24 credits, leaving 24 credits remaining across Semesters 6, 7 & 8.
          </p>
          <button
            onClick={() => onNavigateTab("curriculum")}
            className={cn("flex items-center gap-1 rounded-lg text-white px-3 py-1.5 text-xs font-semibold transition-colors shadow-xs cursor-pointer", t.button)}
          >
            <span>View Curriculum Pathway</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }

    if (card.type === "service") {
      const t = cardTone.service;
      return (
        <div className={cn("mt-3 rounded-2xl border p-4 shadow-xs", t.border, t.bg)}>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={t.badge} className="whitespace-normal text-left">{card.badge}</Badge>
            <span className="text-xs font-bold text-indigo-950">{card.title}</span>
          </div>
          <p className="text-xs text-indigo-900/90 mb-3">{card.subtitle}</p>
          <button
            onClick={() => onOpenServiceModal()}
            className={cn("flex items-center gap-1 rounded-lg text-white px-3 py-1.5 text-xs font-semibold transition-colors shadow-xs cursor-pointer", t.button)}
          >
            <span>Open Service Request Flow</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }

    return null;
  };

  const isFullHeight = effectiveVariant === "side" || effectiveVariant === "maximized";

  return (
    <div
      className={cn(
        "bg-white transition-all",
        effectiveVariant === "central" &&
          "w-full rounded-3xl border border-slate-200/90 shadow-md shadow-blue-500/5 overflow-hidden flex flex-col",
        effectiveVariant === "side" &&
          "flex h-full flex-col rounded-none border-0 overflow-hidden",
        effectiveVariant === "maximized" &&
          "flex h-full w-full flex-col rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
      )}
    >
      {/* Panel Header */}
      {effectiveVariant === "side" ? (
        /* Side Panel Header: 2 clean rows to prevent any overlap */
        <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white px-3.5 py-3 shrink-0 space-y-2.5">
          {/* Row 1: Bot + Title + Agent 65 | Maximize + Close */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex items-center gap-1.5 truncate">
                <h2 className="text-sm font-bold text-slate-900 truncate">Student Helpdesk</h2>
                <Badge variant="primary" className="text-[10px] px-1.5 py-0 bg-blue-600 text-white shrink-0">
                  Agent 65
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Maximize Button */}
              <button
                onClick={() => setIsMaximized(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                title="Maximize chat to full screen"
                aria-label="Maximize chat"
              >
                <Maximize2 className="h-4 w-4" />
              </button>

              {/* Close Button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                  title="Close chat"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Reset + Need human help? */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
              title="Clear context & reset session"
              aria-label="New conversation / Reset"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{tr.resetSession}</span>
            </button>

            <button
              onClick={() => onOpenEscalation()}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
              title="Connect with Human Student Support"
            >
              <LifeBuoy className="h-3.5 w-3.5 text-indigo-600" />
              <span>{tr.needHumanHelp}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Central & Maximized Header */
        <div
          className={cn(
            "border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white shrink-0",
            effectiveVariant === "central" && "px-4 sm:px-6 py-3 sm:py-3.5",
            effectiveVariant === "maximized" && "px-6 py-4"
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Header Title & Branding */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20",
                  effectiveVariant === "central" ? "h-10 w-10" : "h-10 w-10"
                )}
              >
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    Student Helpdesk
                  </h2>
                  <Badge variant="primary" className="bg-blue-600 text-white font-semibold">
                    Agent 65
                  </Badge>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 border border-blue-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                    {modelMode === "high" ? "Agent 65 Core Active • 8B Accurate" : "Agent 65 Core Active • 3B Fast"}
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    RLS Verified: {CURRENT_STUDENT.id}
                  </span>
                </div>
                {effectiveVariant === "central" && (
                  <p className="text-xs text-slate-500 font-normal mt-0.5 truncate sm:whitespace-normal">
                    Primary conversational access to academic records, attendance, exams, fees & institutional policies.
                  </p>
                )}
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Reset */}
              <button
                onClick={handleResetChat}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
                title="Clear context & start new conversation"
                aria-label="New conversation / Reset"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{tr.resetSession}</span>
              </button>

              {/* Maximize Button (shown on Central) */}
              {effectiveVariant === "central" && (
                <button
                  onClick={() => setIsMaximized(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
                  title="Maximize chat to expanded workspace"
                  aria-label="Maximize chat"
                >
                  <Maximize2 className="h-3.5 w-3.5 text-slate-600" />
                  <span>Maximize</span>
                </button>
              )}

              {/* Restore Button (shown when Maximized) */}
              {effectiveVariant === "maximized" && (
                <button
                  onClick={() => setIsMaximized(false)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
                  title="Restore chat to regular view (Esc)"
                  aria-label="Restore chat"
                >
                  <Minimize2 className="h-3.5 w-3.5 text-slate-600" />
                  <span>{tr.restoreSession}</span>
                </button>
              )}

              {/* Need human help */}
              <button
                onClick={() => onOpenEscalation()}
                className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                title="Connect with Human Student Services"
              >
                <LifeBuoy className="h-3.5 w-3.5 text-indigo-600" />
                <span className="hidden md:inline">{tr.needHumanHelp}</span>
                <span className="md:hidden">Help</span>
              </button>

              {/* Close button for Maximized */}
              {effectiveVariant === "maximized" && (
                <button
                  onClick={() => setIsMaximized(false)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                  title="Close expanded chat (Esc)"
                  aria-label="Close expanded chat"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages Scroll View */}
      <div
        className={cn(
          "overflow-y-auto overscroll-contain space-y-4 bg-slate-50/50",
          effectiveVariant === "central" && "h-[270px] sm:h-[300px] md:h-[320px] p-4 sm:p-5",
          effectiveVariant === "side" && "flex-1 min-h-0 p-4",
          effectiveVariant === "maximized" && "flex-1 min-h-0 p-6"
        )}
      >
        {messages.map((turn, index) => {
          const isUser = turn.role === "user";
          return (
            <div
              key={index}
              className={cn(
                "flex gap-2.5",
                isFullHeight ? "max-w-[92%]" : "max-w-5xl w-full",
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {/* Avatar Icon */}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isUser
                    ? "bg-slate-700 text-white"
                    : "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs"
                }`}
              >
                {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  "min-w-0 rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  isUser
                    ? "bg-blue-600 text-white shadow-xs rounded-tr-sm"
                    : "bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-sm"
                )}
              >
                {/* Assistant Metadata Header */}
                {!isUser && turn.responseMeta && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-slate-100 pb-2 mb-2 text-[11px]">
                    <Badge>{turn.responseMeta.category}</Badge>
                    <span className="flex items-center gap-1 text-blue-600 font-medium truncate">
                      <ShieldCheck className="h-3 w-3 shrink-0" />
                      <span className="truncate">{turn.responseMeta.sourceAgent}</span>
                    </span>
                  </div>
                )}

                {/* Main Message Content */}
                <MarkdownText
                  text={turn.content}
                  className={isUser ? "text-white" : "text-slate-800"}
                />

                {/* Structured Cards (Attendance, Exams, Fees, etc.) */}
                {!isUser && turn.responseMeta?.structuredCard && (
                  renderStructuredCard(turn.responseMeta.structuredCard)
                )}

                {/* Suggested Follow-up chips */}
                {!isUser && turn.responseMeta?.suggestedFollowUps && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Suggested follow-ups:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {turn.responseMeta.suggestedFollowUps.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSend(prompt)}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer text-left"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2 text-xs font-medium text-slate-500">
                  Retrieving authorized record from institutional agents...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className={cn(
          "border-t border-slate-200/80 bg-white shrink-0",
          effectiveVariant === "central" ? "p-3 sm:p-4 space-y-2" : "p-3 space-y-2"
        )}
      >
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          {/* Real Speech Recognition Mic Button */}
          <button
            type="button"
            onClick={handleSpeechToggle}
            className={cn(
              "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all cursor-pointer",
              isListening
                ? "border-rose-500 bg-rose-50 text-rose-600 ring-2 ring-rose-400 ring-offset-1 shadow-sm"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
            title={isListening ? (tr.micListening || "Listening... speak now") : (tr.micStart || "Click to speak")}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? (
              <>
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                </span>
                <MicOff className="h-4 w-4 animate-pulse" />
              </>
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isListening ? (tr.micListening || "Listening... speak now...") : tr.chatPlaceholder}
              className={cn(
                "w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all",
                isListening
                  ? "border-rose-400 bg-rose-50/40 ring-2 ring-rose-100 placeholder:text-rose-600 placeholder:font-medium animate-pulse"
                  : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              )}
            />
          </div>

          {/* Model Selector Toggle (ChatGPT style Low for fast reply, High for accurate reply) */}
          <div
            className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-medium shrink-0 shadow-2xs"
            role="group"
            aria-label="AI Reasoning Model Mode"
          >
            <button
              type="button"
              onClick={() => setModelMode("fast")}
              title={tr.modelLowDesc}
              className={cn(
                "flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer",
                modelMode === "fast"
                  ? "bg-white text-blue-700 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Zap className={cn("h-3.5 w-3.5", modelMode === "fast" ? "text-amber-500 fill-amber-500" : "text-slate-400")} />
              <span className="text-xs">{tr.modelLow}</span>
              <span className="hidden md:inline text-[10px] text-slate-400 font-normal">3B</span>
            </button>
            <button
              type="button"
              onClick={() => setModelMode("high")}
              title={tr.modelHighDesc}
              className={cn(
                "flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer",
                modelMode === "high"
                  ? "bg-white text-purple-700 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Sparkles className={cn("h-3.5 w-3.5", modelMode === "high" ? "text-purple-500 fill-purple-500" : "text-slate-400")} />
              <span className="text-xs">{tr.modelHigh}</span>
              <span className="hidden md:inline text-[10px] text-slate-400 font-normal">8B</span>
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>{tr.askButton}</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Quick Action Chips Bar & Contextual Actions */}
        <QuickActionChips onSelectAction={(query) => handleSend(query)} />
      </div>
    </div>
  );
};
