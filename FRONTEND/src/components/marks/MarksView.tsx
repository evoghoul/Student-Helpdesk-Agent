"use client";

import React from "react";
import {
  GraduationCap,
  Award,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { MARKS_DATA } from "@/data/marks";
import { CURRENT_STUDENT } from "@/data/student";
import { Badge } from "@/components/ui/badge";
import { useStudent } from "@/context/StudentContext";
import { useLanguage } from "@/context/LanguageContext";

interface MarksViewProps {
  onAskHelpdesk: (query: string) => void;
}

export const MarksView: React.FC<MarksViewProps> = ({ onAskHelpdesk }) => {
  const { studentData } = useStudent();
  const { t, tDynamic } = useLanguage();
  const student = studentData?.profile || CURRENT_STUDENT;

  return (
    <div className="@container space-y-6">
      {/* Header */}
      <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">{t.marksTitle || "Academic Performance & Marks"}</h2>
            <Badge variant="success">Agents 33 & 34</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t.marksSubtitle || "Continuous internal evaluations and cumulative grade points."}
          </p>
        </div>

        {/* GPA Badge */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-white shadow-sm flex items-center gap-3">
            <Award className="h-6 w-6 text-emerald-100" />
            <div>
              <div className="text-[11px] uppercase font-bold tracking-wider text-emerald-100">
                {t.cgpaLabel || "Cumulative CGPA"}
              </div>
              <div className="text-xl font-black">{student.cgpa} / 10.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Assessments Table & Upcoming Evaluations */}
      <div className="grid grid-cols-1 @4xl:grid-cols-12 gap-6">
        {/* Left: Recent Assessments Table (8 Cols) */}
        <div className="@4xl:col-span-8 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-card overflow-hidden shadow-2xs">
            <div className="bg-muted/50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t.marksTitle || "Graded Assessments"} ({t.semesterLabel || "Semester"} {student.semester})
              </h3>
              <span className="text-xs text-muted-foreground font-medium">4 {t.papersScheduled}</span>
            </div>

            <div className="divide-y divide-slate-100">
              {MARKS_DATA.recentAssessments.map((item) => (
                <div key={item.id} className="p-4 hover:bg-muted/50/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                          {item.subjectCode}
                        </span>
                        <span className="font-bold text-foreground text-sm">
                          {item.subjectName}
                        </span>
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                          {item.assessmentType}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Date: {item.date}</p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-base font-extrabold text-foreground">
                          {item.marksObtained}
                        </span>
                        <span className="text-xs text-slate-400">/ {item.maxMarks}</span>
                      </div>
                      <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.2 text-[11px] font-bold text-emerald-800">
                        {item.percentage}% (Grade {item.grade})
                      </span>
                    </div>
                  </div>

                  {/* Feedback Snippet */}
                  <div className="mt-2.5 rounded-lg bg-muted/50 p-2.5 border border-slate-100 text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mt-0.5">
                      Feedback:
                    </span>
                    <p className="italic text-foreground">{item.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Upcoming Assessments Card (4 Cols) */}
        <div className="@4xl:col-span-4 space-y-4">
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>{t.upcomingAssessment}</span>
            </div>

            <div className="space-y-3">
              {MARKS_DATA.upcomingAssessments.map((upcoming, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-indigo-100 bg-card p-3.5 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{upcoming.title}</span>
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {upcoming.date}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">{upcoming.subject}</div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Syllabus: {upcoming.syllabus}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onAskHelpdesk("When is the second formative assessment?")}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
            >
              <span>{t.askButton}: {t.formativeAssessment} 2</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
