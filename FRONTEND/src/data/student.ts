export interface StudentProfile {
  id: string;
  name: string;
  programme: string;
  department: string;
  academicYear: string;
  semester: number;
  admissionYear: number;
  email: string;
  phone: string;
  cgpa: number;
  mentor: {
    name: string;
    email: string;
    cabin: string;
    phone: string;
  };
  authStatus: "Authenticated";
  securityLabel: string;
  securityToken: string;
  sourceAgent: string;
}

export const CURRENT_STUDENT: StudentProfile = {
  id: "251FA04E03",
  name: "Akshat Raj",
  programme: "B.Tech CSE (Section 7, Room N-312)",
  department: "Computer Science & Engineering",
  academicYear: "2025–26",
  semester: 3,
  admissionYear: 2024,
  email: "251fa04e03@vignan.ac.in",
  phone: "+91 98765 43210",
  cgpa: 8.79,
  mentor: {
    name: "Mr. T. Latesh Babu",
    email: "latesh.babu@vignan.ac.in",
    cabin: "N-312 Faculty Staff Room / CSE Department, VFSTR",
    phone: "+91 94901 23456",
  },
  authStatus: "Authenticated",
  securityLabel: "Viewing your verified Section-7 student record",
  securityToken: "RLS-VFSTR-251FA04E03-VERIFIED",
  sourceAgent: "Agent 44 (Student Profile - Section 7)",
};
