export interface TimetableSlot {
  id: string;
  time: string;
  startTime: string;
  endTime: string;
  subject: string;
  code: string;
  room: string;
  faculty: string;
  type: "Lecture" | "Lab" | "Break" | "Tutorial" | "Self Learning" | "Counseling";
  status: "Completed" | "Current" | "Next" | "Upcoming";
}

export interface SectionDetails {
  section: string;
  room: string;
  classTeacher: string;
  timetableCoordinator: string;
  hodCse: string;
}

export const SECTION_METADATA: SectionDetails = {
  section: "Section-7",
  room: "N-312",
  classTeacher: "Mr. T. Latesh Babu",
  timetableCoordinator: "Mr. Uttej Kumar Nannapaneni (9573793802)",
  hodCse: "Dr. S V Phani Kumar",
};

export const TODAY_TIMETABLE: {
  day: string;
  date: string;
  sourceAgent: string;
  slots: TimetableSlot[];
} = {
  day: "Friday",
  date: "11 September 2026",
  sourceAgent: "Agent 4 (Timetable Engine - Section 7 N-312)",
  slots: [
    {
      id: "F-1",
      time: "09:05 AM – 10:45 AM",
      startTime: "09:05",
      endTime: "10:45",
      subject: "Data Structures Practical [P]",
      code: "DS-25CS201",
      room: "N-312 / DS Lab",
      faculty: "Dr. R. Prathap Kumar (7569888963), Naga Lakshmi, Shaik Thayab, Adil Shai",
      type: "Lab",
      status: "Completed",
    },
    {
      id: "F-2",
      time: "11:00 AM – 11:50 AM",
      startTime: "11:00",
      endTime: "11:50",
      subject: "Self Learning / Advanced Learning",
      code: "SELF-LEARN",
      room: "N-312",
      faculty: "Faculty Mentors",
      type: "Self Learning",
      status: "Completed",
    },
    {
      id: "F-3",
      time: "11:50 AM – 12:30 PM",
      startTime: "11:50",
      endTime: "12:30",
      subject: "Lunch Break",
      code: "BREAK",
      room: "Student Dining / Cafeteria",
      faculty: "-",
      type: "Break",
      status: "Completed",
    },
    {
      id: "F-4",
      time: "12:30 PM – 01:20 PM",
      startTime: "12:30",
      endTime: "13:20",
      subject: "Discrete Mathematical Structures [L]",
      code: "DMS-25MT202",
      room: "N-312",
      faculty: "DR. N. SANTHOSHO",
      type: "Lecture",
      status: "Current",
    },
    {
      id: "F-5",
      time: "01:20 PM – 02:10 PM",
      startTime: "13:20",
      endTime: "14:10",
      subject: "Artificial Intelligence [L]",
      code: "AI-24CS302",
      room: "N-312",
      faculty: "Dr. M. Sunil Babu (8333001991)",
      type: "Lecture",
      status: "Next",
    },
    {
      id: "F-6",
      time: "02:10 PM – 02:20 PM",
      startTime: "14:10",
      endTime: "14:20",
      subject: "Tea Break",
      code: "BREAK",
      room: "Campus Walkway",
      faculty: "-",
      type: "Break",
      status: "Upcoming",
    },
    {
      id: "F-7",
      time: "02:20 PM – 03:10 PM",
      startTime: "14:20",
      endTime: "15:10",
      subject: "Database Management System Tutorial [T]",
      code: "DBMS-25CS203",
      room: "N-312",
      faculty: "Nemalikanti Deena, Mathangi Haveela, Kommuri Ramya",
      type: "Tutorial",
      status: "Upcoming",
    },
  ],
};

export const WEEKLY_TIMETABLE: Record<string, TimetableSlot[]> = {
  Monday: [
    { id: "M-1", time: "09:05 AM – 10:45 AM", startTime: "09:05", endTime: "10:45", subject: "Object Oriented Programming Through Java [P]", code: "OOPS-25CS204", room: "N-312 / Java Lab", faculty: "Mr. T. Latesh Babu, Manikanta Reddy, Vamsi Krishna, Shaik Shamsheer Bhash", type: "Lab", status: "Upcoming" },
    { id: "M-2", time: "11:00 AM – 11:50 AM", startTime: "11:00", endTime: "11:50", subject: "Self Learning / Advanced Learning", code: "SELF-LEARN", room: "N-312", faculty: "Faculty Mentors", type: "Self Learning", status: "Upcoming" },
    { id: "M-3", time: "11:50 AM – 12:30 PM", startTime: "11:50", endTime: "12:30", subject: "Lunch Break", code: "BREAK", room: "Cafeteria", faculty: "-", type: "Break", status: "Upcoming" },
    { id: "M-4", time: "12:30 PM – 01:20 PM", startTime: "12:30", endTime: "13:20", subject: "Digital Logic design [L]", code: "DLD-25CS205", room: "N-312", faculty: "Mrs Archana (8985716984)", type: "Lecture", status: "Upcoming" },
    { id: "M-5", time: "01:20 PM – 02:10 PM", startTime: "13:20", endTime: "14:10", subject: "Counseling & Student Mentorship", code: "COUN", room: "N-312", faculty: "Mr. T. Latesh Babu (Class Teacher)", type: "Counseling", status: "Upcoming" },
    { id: "M-6", time: "02:10 PM – 02:20 PM", startTime: "14:10", endTime: "14:20", subject: "Break", code: "BREAK", room: "-", faculty: "-", type: "Break", status: "Upcoming" },
    { id: "M-7", time: "02:20 PM – 03:10 PM", startTime: "14:20", endTime: "15:10", subject: "Data Structures [L]", code: "DS-25CS201", room: "N-312", faculty: "Dr. R. Prathap Kumar (7569888963)", type: "Lecture", status: "Upcoming" },
    { id: "M-8", time: "03:10 PM – 04:00 PM", startTime: "15:10", endTime: "16:00", subject: "Database Management System [L]", code: "DBMS-25CS203", room: "N-312", faculty: "Ms. Y. Sai Eswari (8074131669)", type: "Lecture", status: "Upcoming" },
  ],
  Tuesday: [
    { id: "T-1", time: "08:15 AM – 09:05 AM", startTime: "08:15", endTime: "09:05", subject: "Discrete Mathematical Structures [L]", code: "DMS-25MT202", room: "N-314", faculty: "DR. N. SANTHOSHO", type: "Lecture", status: "Upcoming" },
    { id: "T-2", time: "09:05 AM – 10:45 AM", startTime: "09:05", endTime: "10:45", subject: "Data Wrangling and Visualization [T]", code: "DW-25CS202", room: "N-314", faculty: "Dr. M. Raja Rao (8979803148), Bhavvanjali, Pallaprolu Kavya Sri", type: "Tutorial", status: "Upcoming" },
    { id: "T-3", time: "11:00 AM – 11:50 AM", startTime: "11:00", endTime: "11:50", subject: "Self Learning / Advanced Learning", code: "SELF-LEARN", room: "N-312", faculty: "Faculty Mentors", type: "Self Learning", status: "Upcoming" },
    { id: "T-4", time: "11:50 AM – 12:30 PM", startTime: "11:50", endTime: "12:30", subject: "Lunch Break", code: "BREAK", room: "Cafeteria", faculty: "-", type: "Break", status: "Upcoming" },
    { id: "T-5", time: "12:30 PM – 01:20 PM", startTime: "12:30", endTime: "13:20", subject: "Data Structures [L]", code: "DS-25CS201", room: "N-312", faculty: "Dr. R. Prathap Kumar (7569888963)", type: "Lecture", status: "Upcoming" },
    { id: "T-6", time: "01:20 PM – 02:10 PM", startTime: "13:20", endTime: "14:10", subject: "Database Management System [L]", code: "DBMS-25CS203", room: "N-312", faculty: "Ms. Y. Sai Eswari (8074131669)", type: "Lecture", status: "Upcoming" },
    { id: "T-7", time: "02:10 PM – 02:20 PM", startTime: "14:10", endTime: "14:20", subject: "Break", code: "BREAK", room: "-", faculty: "-", type: "Break", status: "Upcoming" },
    { id: "T-8", time: "02:20 PM – 03:10 PM", startTime: "14:20", endTime: "15:10", subject: "Digital Logic design [L]", code: "DLD-25CS205", room: "N-312", faculty: "Mrs Archana (8985716984)", type: "Lecture", status: "Upcoming" },
    { id: "T-9", time: "03:10 PM – 04:00 PM", startTime: "15:10", endTime: "16:00", subject: "Object Oriented Programming Through Java [L]", code: "OOPS-25CS204", room: "N-312", faculty: "Mr. T. Latesh Babu", type: "Lecture", status: "Upcoming" },
  ],
  Wednesday: [
    { id: "W-1", time: "08:15 AM – 09:05 AM", startTime: "08:15", endTime: "09:05", subject: "Digital Logic design [L]", code: "DLD-25CS205", room: "N-312", faculty: "Mrs Archana (8985716984)", type: "Lecture", status: "Upcoming" },
    { id: "W-2", time: "09:05 AM – 10:45 AM", startTime: "09:05", endTime: "10:45", subject: "Discrete Mathematical Structures [T]", code: "DMS-25MT202", room: "N-312", faculty: "DR. N. SANTHOSHO", type: "Tutorial", status: "Upcoming" },
    { id: "W-3", time: "11:00 AM – 11:50 AM", startTime: "11:00", endTime: "11:50", subject: "Self Learning / Advanced Learning", code: "SELF-LEARN", room: "N-312", faculty: "Faculty Mentors", type: "Self Learning", status: "Upcoming" },
    { id: "W-4", time: "11:50 AM – 12:30 PM", startTime: "11:50", endTime: "12:30", subject: "Lunch Break", code: "BREAK", room: "Cafeteria", faculty: "-", type: "Break", status: "Upcoming" },
    { id: "W-5", time: "12:30 PM – 01:20 PM", startTime: "12:30", endTime: "13:20", subject: "Artificial Intelligence [L]", code: "AI-24CS302", room: "N-312", faculty: "Dr. M. Sunil Babu (8333001991)", type: "Lecture", status: "Upcoming" },
    { id: "W-6", time: "01:20 PM – 02:10 PM", startTime: "13:20", endTime: "14:10", subject: "Database Management System [L]", code: "DBMS-25CS203", room: "N-312", faculty: "Ms. Y. Sai Eswari (8074131669)", type: "Lecture", status: "Upcoming" },
    { id: "W-7", time: "02:10 PM – 02:20 PM", startTime: "14:10", endTime: "14:20", subject: "Break", code: "BREAK", room: "-", faculty: "-", type: "Break", status: "Upcoming" },
    { id: "W-8", time: "02:20 PM – 03:10 PM", startTime: "14:20", endTime: "15:10", subject: "Data Structures Tutorial [T]", code: "DS-25CS201", room: "N-312", faculty: "Naga Lakshmi, Shaik Thayab [9908378028]", type: "Tutorial", status: "Upcoming" },
  ],
  Thursday: [
    { id: "TH-1", time: "09:05 AM – 10:45 AM", startTime: "09:05", endTime: "10:45", subject: "Database Management System Practical [P]", code: "DBMS-25CS203", room: "N-312 / DBMS Lab", faculty: "Ms. Y. Sai Eswari, Nemalikanti Deena, Mathangi Haveela, Kommuri Ramya", type: "Lab", status: "Upcoming" },
    { id: "TH-2", time: "11:00 AM – 11:50 AM", startTime: "11:00", endTime: "11:50", subject: "Self Learning / Advanced Learning", code: "SELF-LEARN", room: "N-312", faculty: "Faculty Mentors", type: "Self Learning", status: "Upcoming" },
    { id: "TH-3", time: "11:50 AM – 12:30 PM", startTime: "11:50", endTime: "12:30", subject: "Lunch Break", code: "BREAK", room: "Cafeteria", faculty: "-", type: "Break", status: "Upcoming" },
    { id: "TH-4", time: "12:30 PM – 02:10 PM", startTime: "12:30", endTime: "14:10", subject: "Artificial Intelligence Tutorial [T]", code: "AI-24CS302", room: "N-312", faculty: "Dr. M. Sunil Babu (8333001991), Palagani Pavani, Mulpuri Koti surya sama prabh", type: "Tutorial", status: "Upcoming" },
    { id: "TH-5", time: "02:10 PM – 02:20 PM", startTime: "14:10", endTime: "14:20", subject: "Break", code: "BREAK", room: "-", faculty: "-", type: "Break", status: "Upcoming" },
    { id: "TH-6", time: "02:20 PM – 03:10 PM", startTime: "14:20", endTime: "15:10", subject: "Discrete Mathematical Structures [L]", code: "DMS-25MT202", room: "N-312", faculty: "DR. N. SANTHOSHO", type: "Lecture", status: "Upcoming" },
    { id: "TH-7", time: "03:10 PM – 04:00 PM", startTime: "15:10", endTime: "16:00", subject: "Object Oriented Programming Through Java [L]", code: "OOPS-25CS204", room: "N-312", faculty: "Mr. T. Latesh Babu", type: "Lecture", status: "Upcoming" },
  ],
  Friday: TODAY_TIMETABLE.slots,
  Saturday: [
    { id: "S-1", time: "08:15 AM – 09:05 AM", startTime: "08:15", endTime: "09:05", subject: "Artificial Intelligence [L]", code: "AI-24CS302", room: "N-314A", faculty: "Dr. M. Sunil Babu (8333001991)", type: "Lecture", status: "Upcoming" },
    { id: "S-2", time: "09:05 AM – 10:45 AM", startTime: "09:05", endTime: "10:45", subject: "Data Wrangling and Visualization [P]", code: "DW-25CS202", room: "N-314A", faculty: "Dr. M. Raja Rao (8979803148), Bhavvanjali, Pallaprolu Kavya Sri [7989443565]", type: "Lab", status: "Upcoming" },
    { id: "S-3", time: "11:00 AM – 11:50 AM", startTime: "11:00", endTime: "11:50", subject: "Self Learning / Advanced Learning", code: "SELF-LEARN", room: "N-312", faculty: "Faculty Mentors", type: "Self Learning", status: "Upcoming" },
    { id: "S-4", time: "11:50 AM – 12:30 PM", startTime: "11:50", endTime: "12:30", subject: "Lunch Break", code: "BREAK", room: "Cafeteria", faculty: "-", type: "Break", status: "Upcoming" },
    { id: "S-5", time: "12:30 PM – 01:20 PM", startTime: "12:30", endTime: "13:20", subject: "Object Oriented Programming Through Java [L]", code: "OOPS-25CS204", room: "N-312", faculty: "Mr. T. Latesh Babu", type: "Lecture", status: "Upcoming" },
    { id: "S-6", time: "01:20 PM – 02:10 PM", startTime: "13:20", endTime: "14:10", subject: "Data Structures [L]", code: "DS-25CS201", room: "N-312", faculty: "Dr. R. Prathap Kumar (7569888963)", type: "Lecture", status: "Upcoming" },
    { id: "S-7", time: "02:10 PM – 02:20 PM", startTime: "14:10", endTime: "14:20", subject: "Break", code: "BREAK", room: "-", faculty: "-", type: "Break", status: "Upcoming" },
    { id: "S-8", time: "02:20 PM – 03:10 PM", startTime: "14:20", endTime: "15:10", subject: "Digital Logic design Tutorial [T]", code: "DLD-25CS205", room: "N-312", faculty: "Mrs Archana (8985716984), Mr K. Raj Kiran", type: "Tutorial", status: "Upcoming" },
  ],
};
