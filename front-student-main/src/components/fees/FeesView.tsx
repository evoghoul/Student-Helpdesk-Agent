"use client";

import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Download,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Clock,
} from "lucide-react";
import { FEES_DATA } from "@/data/fees";
import { CURRENT_STUDENT } from "@/data/student";
import { formatCurrency } from "@/lib/utils";
import { useStudent } from "@/context/StudentContext";
import { useLanguage } from "@/context/LanguageContext";

interface FeesViewProps {
  onAskHelpdesk: (query: string) => void;
}

export const FeesView: React.FC<FeesViewProps> = ({ onAskHelpdesk }) => {
  const { studentData } = useStudent();
  const { t } = useLanguage();
  const student = studentData?.profile || CURRENT_STUDENT;
  const feesData = studentData?.fees || FEES_DATA;

  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSimulatePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 4000);
  };

  const outstandingAmt = feesData.outstandingBalance ?? FEES_DATA.outstanding;

  return (
    <div className="@container space-y-6">
      {/* Header */}
      <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{t.feesTitle || "Fees & Financial Ledger"}</h2>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
              Agent 40
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.feesSubtitle || "Personal academic accounts and payment records."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulatePayment}
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition-colors cursor-pointer"
          >
            <CreditCard className="h-4 w-4" />
            <span>{t.payOnline || "Pay Online"} ({formatCurrency(outstandingAmt)})</span>
          </button>
        </div>
      </div>

      {paymentSuccess && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>Simulated Payment Verified! Transaction token logged with Agent 40.</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700">Ref: TXN-2026-9921</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 @lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {t.totalFees || "Total Demand"}
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(FEES_DATA.totalDemand)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Academic Year 2026–27</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            {t.amountPaid || "Paid to Date"}
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {formatCurrency(FEES_DATA.totalPaid)}
          </div>
          <p className="text-[11px] text-emerald-800 mt-0.5">Verified & Cleared</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            {t.pendingDue || "Outstanding Balance"}
          </div>
          <div className="text-2xl font-black text-amber-900 mt-1">
            {formatCurrency(outstandingAmt)}
          </div>
          <p className="flex items-center gap-1 text-[11px] text-amber-800 mt-0.5">
            <Clock className="h-3 w-3 shrink-0" />
            Clearance Due Date: <strong>{feesData.dueDate || FEES_DATA.dueDate}</strong>
          </p>
        </div>
      </div>

      {/* Fee Breakdown Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Institutional Fee Head Breakdown
          </h3>
          <span className="text-xs text-slate-500 font-medium">Bursar Ledger {student.id}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {FEES_DATA.breakdown.map((item, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.head}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span>Demand: <strong>{formatCurrency(item.demand)}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-700">Paid: <strong>{formatCurrency(item.paid)}</strong></span>
                    <span>•</span>
                    <span>Due: {item.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center @lg:flex-col @lg:items-end gap-2">
                  <span className="text-sm font-extrabold text-slate-900">
                    {item.outstanding > 0 ? (
                      <span className="text-amber-800">{formatCurrency(item.outstanding)} Due</span>
                    ) : (
                      <span className="text-emerald-700 font-bold">Settled (₹0)</span>
                    )}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      item.status === "Paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Payment Receipts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-slate-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Payment Receipts & Tax Invoices
            </h4>
          </div>
          <span className="text-xs text-slate-500">2 Verified Transactions</span>
        </div>

        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-3">
          {FEES_DATA.recentReceipts.map((rec) => (
            <div
              key={rec.receiptNo}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 flex items-center justify-between"
            >
              <div>
                <div className="font-mono text-xs font-bold text-slate-900">{rec.receiptNo}</div>
                <div className="text-xs text-slate-500">{rec.date} • {rec.mode}</div>
                <div className="text-xs font-extrabold text-emerald-700 mt-1">
                  {formatCurrency(rec.amount)}
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(rec.receiptNo)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="h-3 w-3" />
                <span>PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
