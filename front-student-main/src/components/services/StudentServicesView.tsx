"use client";

import React from "react";
import {
  LifeBuoy,
  FileCheck2,
  AlertTriangle,
  Users,
  GraduationCap,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { ServiceRequest } from "@/data/services";
import { CURRENT_STUDENT } from "@/data/student";
import { useStudent } from "@/context/StudentContext";
import { useLanguage } from "@/context/LanguageContext";

interface StudentServicesViewProps {
  services: ServiceRequest[];
  onOpenNewServiceModal: (category?: string) => void;
  onAskHelpdesk: (query: string) => void;
}

export const StudentServicesView: React.FC<StudentServicesViewProps> = ({
  services,
  onOpenNewServiceModal,
  onAskHelpdesk,
}) => {
  const { studentData } = useStudent();
  const { t } = useLanguage();
  const student = studentData?.profile || CURRENT_STUDENT;
  const serviceCards = [
    {
      category: "Certificate",
      title: t.bonafideCert || "Apply for a Certificate",
      desc: "Instant verification for Bonafide, Custodian, Medium of Instruction, or Course Completion statement.",
      icon: FileCheck2,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      category: "Mentor Meeting",
      title: t.chipBookMentor || "Book Mentor Meeting",
      desc: "Schedule a one-on-one advisory session with Dr. Radhika Sharma (Cabin C-402).",
      icon: Users,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      category: "Grievance",
      title: t.grievanceRedressal || "Raise an Academic Grievance",
      desc: "Submit formal appeals on internal marks evaluations, attendance condonation, or hostel amenities.",
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      category: "Academic Support",
      title: "Request Academic Support",
      desc: "Enroll in peer tutoring cohorts, remedial programming clinics, or library study groups.",
      icon: GraduationCap,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <div className="@container space-y-6">
      {/* Header */}
      <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{t.servicesTitle || "Student Services & Applications"}</h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
              Agent 46
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.servicesSubtitle || "Convert conversational requests into verified institutional tickets."}
          </p>
        </div>

        <button
          onClick={() => onOpenNewServiceModal("Certificate")}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t.newServiceRequest || "New Service Request"}</span>
        </button>
      </div>

      {/* 4 Action Cards */}
      <div className="grid grid-cols-1 @xl:grid-cols-2 @5xl:grid-cols-4 gap-4">
        {serviceCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.category}
              onClick={() => onOpenNewServiceModal(card.category)}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color} mb-3`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{card.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-800">
                <span>Launch Workflow</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Service Requests List */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Active Requests & Tickets for {student.id}
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {services.length} Submitted Tickets
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {services.map((req) => (
            <div key={req.id} className="p-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">{req.id}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                      {req.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{req.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{req.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                    <span>Submitted: {req.submittedAt}</span>
                    <span>•</span>
                    <span>Department: <strong>{req.assignedDept}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-blue-700">{req.trackingToken}</span>
                  </div>
                </div>

                <div className="flex items-center @lg:flex-col @lg:items-end gap-2 shrink-0">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>{req.status}</span>
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    Priority: {req.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
