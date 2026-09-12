"use client";

import React from "react";
import {
  Heart,
  PhoneCall,
  UserCheck,
  ShieldAlert,
  X,
  MessageSquare,
  Sparkles,
  MapPin,
  Clock,
} from "lucide-react";
import { CURRENT_STUDENT } from "@/data/student";
import { useLanguage } from "@/context/LanguageContext";

interface DistressSupportOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectHuman: () => void;
}

export const DistressSupportOverlay: React.FC<DistressSupportOverlayProps> = ({
  isOpen,
  onClose,
  onConnectHuman,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      {/* Calm, supportive card container */}
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-rose-100 text-slate-800 space-y-5">
        {/* Soft supportive header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shadow-xs">
              <Heart className="h-6 w-6 fill-rose-500 text-rose-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">
                  {t.distressSupportTitle}
                </h3>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-800">
                  Agent 66 Priority
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {t.distressSupportSub}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Dismiss overlay"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Supportive message */}
        <div className="rounded-2xl bg-rose-50/70 p-4 border border-rose-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
          <p className="font-semibold text-rose-950">
            Akshat, your message suggests you may be feeling overwhelmed or carrying too much stress right now.
          </p>
          <p className="text-slate-600 text-xs">
            University life can sometimes feel relentless, but you do not have to handle this on your own. Academic deadlines, attendance issues, and exams can be deferred or restructured. Your well-being comes first.
          </p>
        </div>

        {/* Immediate Access Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* 1. 24/7 National/Campus Crisis Line */}
          <div className="rounded-2xl border border-rose-200 bg-white p-4 shadow-2xs space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                <PhoneCall className="h-4 w-4" />
                <span>24/7 Student Wellbeing Hotline</span>
              </div>
              <div className="text-base font-black text-slate-900 mt-1">
                1800-599-0019
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Free, confidential, available 24/7 across all languages.
              </p>
            </div>
            <a
              href="tel:18005990019"
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs"
            >
              <span>{t.callHotline || "Call Hotline Now"}</span>
            </a>
          </div>

          {/* 2. Campus Lead Psychologist */}
          <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-2xs space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                <UserCheck className="h-4 w-4" />
                <span>{t.campusCounselingTeam || "Campus Counseling Team"}</span>
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                Dr. Ananya Roy
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Lead Student Psychologist • Health Block Room 104
              </p>
            </div>
            <button
              onClick={() => {
                onConnectHuman();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
            >
              <span>{t.connectCounselor || "Connect with Counselor"}</span>
            </button>
          </div>
        </div>

        {/* Faculty Mentor Fallback */}
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-slate-800">Assigned Faculty Mentor:</span>{" "}
            <span>{CURRENT_STUDENT.mentor.name} ({CURRENT_STUDENT.mentor.cabin})</span>
          </div>
          <button
            onClick={() => {
              onConnectHuman();
              onClose();
            }}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Notify Mentor
          </button>
        </div>

        {/* Clear Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              onConnectHuman();
              onClose();
            }}
            className="w-full sm:flex-1 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Talk to a Human Support Specialist
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Return to Helpdesk
          </button>
        </div>
      </div>
    </div>
  );
};
