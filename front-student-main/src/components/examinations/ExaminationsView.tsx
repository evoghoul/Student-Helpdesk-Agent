"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  CheckCircle2,
} from "lucide-react";
import { EXAMINATIONS_DATA } from "@/data/examinations";
import { useStudent } from "@/context/StudentContext";
import { useLanguage } from "@/context/LanguageContext";

interface ExaminationsViewProps {
  onAskHelpdesk: (query: string) => void;
}

export const ExaminationsView: React.FC<ExaminationsViewProps> = ({ onAskHelpdesk }) => {
  const { studentData } = useStudent();
  const { t, tDynamic } = useLanguage();
  const student = studentData?.profile;

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const nearest = EXAMINATIONS_DATA.exams[0];

  const handleDownloadHallTicket = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{t.examsTitle || "Upcoming Examinations"}</h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
              Agent 30
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.examsSubtitle || "Official Controller of Examinations (CoE) schedule for Semester-I."}
          </p>
        </div>

        {/* Hall Ticket Action */}
        <button
          onClick={handleDownloadHallTicket}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer shrink-0"
        >
          {downloadSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              <span>{t.hallTicketDownloaded || "Hall Ticket Downloaded!"}</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>{t.downloadHallTicket || "Download Digital Hall Ticket"}</span>
            </>
          )}
        </button>
      </div>

      {/* Highlight Card: Nearest Examination */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-blue-200 bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-2xs">
                {t.upcomingAssessment || "NEAREST EXAMINATION"}
              </span>
              <span className="font-mono text-xs font-bold text-blue-700">{nearest.code}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{nearest.subject}</h3>
            <p className="text-xs text-slate-600 font-medium">{tDynamic(nearest.examType)}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 pt-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>{nearest.date}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>{nearest.time}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>{nearest.venue}</span>
              </div>
            </div>
          </div>

          {/* Countdown Block */}
          <div className="flex flex-col items-start md:items-end justify-center rounded-2xl bg-white/95 p-5 border border-blue-100 shadow-sm shrink-0 min-w-[190px]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {t.examCountdown}
            </div>
            <div className="text-3xl font-black text-blue-700 mt-1">7 {t.daysRemaining}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {t.reportingTime}: <strong className="text-slate-700">{nearest.reportingTime}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Full Examination Schedule List */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {t.endSemesterSchedule}
          </h4>
          <span className="text-xs text-slate-500 font-medium">{t.papersScheduled}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {EXAMINATIONS_DATA.exams.map((exam) => (
            <div key={exam.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-500">{exam.code}</span>
                    <h5 className="font-bold text-slate-900 text-sm">{exam.subject}</h5>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {exam.examType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {exam.date} ({exam.time})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-blue-700">
                      <MapPin className="h-3.5 w-3.5 text-blue-500" />
                      {exam.venue}
                    </span>
                    <span>•</span>
                    <span>{exam.seatRange}</span>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end gap-2 shrink-0">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-800 border border-blue-100">
                    {exam.daysRemaining} days left
                  </span>
                  <button
                    onClick={() => onAskHelpdesk(`When is my ${exam.subject} exam?`)}
                    className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Ask Helpdesk
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
