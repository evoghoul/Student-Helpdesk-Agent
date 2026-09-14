export interface SecurityLogItem {
  id: string;
  time: string;
  event: string;
  agent: string;
  status: "SUCCESS" | "FORWARDED" | "BLOCKED" | "VERIFIED";
  scope: string;
  details: string;
}

export const INITIAL_SECURITY_LOGS: SecurityLogItem[] = [
  {
    id: "SEC-LOG-01",
    time: "10:24 AM",
    event: "Student identity authenticated",
    agent: "Agent 44 (Profile)",
    status: "SUCCESS",
    scope: "UID: 251FA04E13",
    details: "Biometric SSO token validated. Row-Level Security policy enforced.",
  },
  {
    id: "SEC-LOG-02",
    time: "10:22 AM",
    event: "Attendance records queried",
    agent: "Agent 11 (Attendance)",
    status: "SUCCESS",
    scope: "UID: 251FA04E13 (Own Record Only)",
    details: "Queried 4 subjects. Authorization check passed. Cross-tenant reads rejected.",
  },
  {
    id: "SEC-LOG-03",
    time: "10:20 AM",
    event: "Examination schedule retrieved",
    agent: "Agent 30 (Exams)",
    status: "SUCCESS",
    scope: "UID: 251FA04E13",
    details: "Seating roll #42 in Hall A2 retrieved securely.",
  },
  {
    id: "SEC-LOG-04",
    time: "10:18 AM",
    event: "Student fee ledger retrieved",
    agent: "Agent 40 (Fee Status)",
    status: "SUCCESS",
    scope: "UID: 251FA04E13",
    details: "Outstanding balance ₹28,000 fetched over encrypted mTLS channel.",
  },
  {
    id: "SEC-LOG-05",
    time: "10:15 AM",
    event: "Service request routed",
    agent: "Agent 46 (Services)",
    status: "FORWARDED",
    scope: "UID: 251FA04E13",
    details: "Ticket #SR-8921 generated and enqueued with priority Medium.",
  },
  {
    id: "SEC-LOG-06",
    time: "10:02 AM",
    event: "Cross-student access attempt test",
    agent: "Agent 65 (Guardrail)",
    status: "BLOCKED",
    scope: "Foreign UID query attempt",
    details: "Row-Level Security rule dropped unauthorized foreign parameter. Only 251FA04E13 permissible.",
  },
];
