"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
  Phone,
  CheckCircle2,
  PlayCircle,
  CircleDashed,
} from "lucide-react";
import {
  WEEKLY_TIMETABLE,
  SECTION_METADATA,
} from "@/data/timetable";
import { Badge } from "@/components/ui/badge";
import { useStudent } from "@/context/StudentContext";
import { useLanguage } from "@/context/LanguageContext";

interface TimetableViewProps {
  onAskHelpdesk: (query: string) => void;
}

export const TimetableView: React.FC<TimetableViewProps> = ({ onAskHelpdesk }) => {
  const { studentData } = useStudent();
  const { t, tDynamic } = useLanguage();
  const student = studentData?.profile;

  // Selected Day State (Defaults to Friday)
  const [selectedDay, setSelectedDay] = useState<string>("Friday");

  const currentSlots = WEEKLY_TIMETABLE[selectedDay] || [];

  return (
    <div className="space-y-5">
      {/* Header with Day Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{t.timetableTitle}</h2>
            <Badge variant="info">Section-7 (N-312)</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official department routine for student {student?.id || "251FA04E03"} • {t.classTeacher}: {SECTION_METADATA.classTeacher}
          </p>
        </div>

        {/* Day Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1">
          {[
            { key: "Monday", label: t.monday },
            { key: "Tuesday", label: t.tuesday },
            { key: "Wednesday", label: t.wednesday },
            { key: "Thursday", label: t.thursday },
            { key: "Friday", label: t.friday },
            { key: "Saturday", label: t.saturday },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedDay(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedDay === key
                  ? "bg-white text-blue-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {label}
              {key === "Friday" && <span className="ml-1 text-[10px] text-blue-600 font-bold">• Today</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Section 7 Institutional Info Banner - Uniform Height & Clean Alignment */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 flex items-center gap-3 min-h-[74px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-2xs">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">{t.tableRoom}</span>
            <p className="text-xs font-bold text-slate-900 truncate">{SECTION_METADATA.section} ({SECTION_METADATA.room})</p>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 flex items-center gap-3 min-h-[74px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-2xs">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">{t.classTeacher}</span>
            <p className="text-xs font-bold text-slate-900 truncate">{SECTION_METADATA.classTeacher}</p>
          </div>
        </div>

        <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3.5 flex items-center gap-3 min-h-[74px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-xs shadow-2xs">
            <Phone className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">{t.coordinator}</span>
            <p className="text-xs font-bold text-slate-900 truncate" title={SECTION_METADATA.timetableCoordinator}>
              {SECTION_METADATA.timetableCoordinator}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 flex items-center gap-3 min-h-[74px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-2xs">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">HOD, CSE</span>
            <p className="text-xs font-bold text-slate-900 truncate">{SECTION_METADATA.hodCse}</p>
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {selectedDay} Instructional Schedule ({SECTION_METADATA.section})
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {currentSlots.length} Scheduled Sessions
          </span>
        </div>

        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {currentSlots.map((slot) => {
            const isCompleted = slot.status === "Completed";
            const isCurrent = slot.status === "Current";
            const isNext = slot.status === "Next";

            return (
              <div key={slot.id} className="relative group">
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-6 top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white transition-transform group-hover:scale-110 ${
                    isCompleted
                      ? "border-emerald-500 text-emerald-600"
                      : isCurrent
                      ? "border-blue-600 bg-blue-600 text-white animate-pulse"
                      : isNext
                      ? "border-amber-500 text-amber-600"
                      : "border-slate-300 text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : isCurrent ? (
                    <PlayCircle className="h-3 w-3 text-white" />
                  ) : (
                    <CircleDashed className="h-3 w-3" />
                  )}
                </div>

                {/* Slot Card */}
                <div
                  className={`rounded-xl border p-4 transition-all ${
                    isCurrent
                      ? "border-blue-400 bg-blue-50/50 shadow-xs ring-1 ring-blue-200"
                      : isNext
                      ? "border-amber-300 bg-amber-50/30"
                      : "border-slate-200/80 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{slot.subject}</span>
                        {slot.code && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600 font-semibold">
                            {slot.code}
                          </span>
                        )}
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {slot.type}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <div className="flex items-center gap-1 font-semibold text-blue-800">
                          <MapPin className="h-3.5 w-3.5 text-blue-600" />
                          <span>{slot.room}</span>
                        </div>
                        {slot.faculty !== "-" && (
                          <div className="flex items-center gap-1 text-slate-600">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span>{slot.faculty}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end gap-2">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{slot.time}</span>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          isCurrent
                            ? "bg-blue-600 text-white animate-pulse"
                            : isNext
                            ? "bg-amber-100 text-amber-800"
                            : isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
