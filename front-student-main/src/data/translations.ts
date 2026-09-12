export type Language =
  | "en"
  | "hi"
  | "te"
  | "ta"
  | "kn"
  | "ml"
  | "mr"
  | "bn"
  | "gu"
  | "pa"
  | "or"
  | "as"
  | "ur"
  | "sa"
  | "ne"
  | "kok"
  | "ks"
  | "sd"
  | "doi"
  | "mai"
  | "mni"
  | "sat"
  | "brx";

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  script: string;
  region: string;
}

export const OFFICIAL_LANGUAGES_OF_INDIA: LanguageMeta[] = [
  { code: "en", name: "English", nativeName: "English", script: "Latin", region: "All-India / Higher Education" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", script: "Telugu", region: "Andhra Pradesh & Telangana" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", script: "Devanagari", region: "Official Language of the Union" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", script: "Tamil", region: "Tamil Nadu & Puducherry" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", script: "Kannada", region: "Karnataka" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", script: "Malayalam", region: "Kerala & Lakshadweep" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", script: "Devanagari", region: "Maharashtra & Goa" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", script: "Bengali", region: "West Bengal & Tripura" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", script: "Gujarati", region: "Gujarat & Daman/Diu" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", script: "Gurmukhi", region: "Punjab & Chandigarh" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", script: "Odia", region: "Odisha" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", script: "Bengali-Assamese", region: "Assam" },
  { code: "ur", name: "Urdu", nativeName: "اردو", script: "Perso-Arabic", region: "National / Jammu & Kashmir" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", script: "Devanagari", region: "Classical / Pan-India" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", script: "Devanagari", region: "Sikkim & West Bengal" },
  { code: "kok", name: "Konkani", nativeName: "कोंकणी", script: "Devanagari", region: "Goa & coastal Maharashtra" },
  { code: "ks", name: "Kashmiri", nativeName: "کٲشُر", script: "Perso-Arabic", region: "Jammu & Kashmir" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", script: "Perso-Arabic", region: "Pan-India" },
  { code: "doi", name: "Dogri", nativeName: "डोगरी", script: "Devanagari", region: "Jammu & Kashmir" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली", script: "Devanagari", region: "Bihar & Jharkhand" },
  { code: "mni", name: "Manipuri", nativeName: "মৈতৈলোন্", script: "Meitei", region: "Manipur" },
  { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ", script: "Ol Chiki", region: "Jharkhand, Odisha & WB" },
  { code: "brx", name: "Bodo", nativeName: "बड़ो", script: "Devanagari", region: "Assam (Bodoland)" },
];

export interface TranslationDictionary {
  // Brand & General
  appName: string;
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  onlineStatus: string;
  secureConnection: string;
  authenticatedLabel: string;
  viewingRecord: string;
  rlsBadge: string;
  resetSession: string;
  restoreSession: string;
  close: string;
  searchPlaceholder: string;
  connectedBadge: string;
  commandBarTip: string;
  signIn: string;
  signOut: string;
  welcomeBack: string;
  daysRemaining: string;

  // Sidebar Sections & Items
  sectionOverview: string;
  sectionAcademics: string;
  sectionSupport: string;
  sectionSystem: string;
  collapseSidebar: string;
  expandSidebar: string;
  navHome: string;
  navProfile: string;
  navAttendance: string;
  navMarks: string;
  navTimetable: string;
  navExams: string;
  navFees: string;
  navCurriculum: string;
  navPolicies: string;
  navCirculars: string;
  navCalendar: string;
  navServices: string;

  // Snapshot
  snapshotTitle: string;
  nextClass: string;
  nextExam: string;
  attendanceWatch: string;
  totalCredits: string;
  viewFullSchedule: string;
  statAttendedRatio: string;
  statActiveSubjects: string;
  statCgpa: string;

  // Timetable
  timetableTitle: string;
  timetableSubtitle: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  currentClass: string;
  upcomingClass: string;
  completedClass: string;
  room: string;
  faculty: string;
  coordinator: string;
  classTeacher: string;

  // AI Chat & Panel
  chatTitle: string;
  chatSubtitle: string;
  chatPlaceholder: string;
  askButton: string;
  modelLow: string;
  modelLowDesc: string;
  modelHigh: string;
  modelHighDesc: string;
  micListening: string;
  micStart: string;
  coreActive: string;
  retrievingRecords: string;
  quickActionsTitle: string;
  contextualActionsTitle: string;

  // Quick Chips
  quickMyAttendance: string;
  quickNextExam: string;
  quickMyMarks: string;
  quickTodayTimetable: string;
  quickFeeStatus: string;
  quickCurriculum: string;
  quickCirculars: string;
  quickPolicies: string;
  quickCalendar: string;
  quickServices: string;

  // Contextual Chips
  chipBelow75: string;
  chipUpcomingAssessments: string;
  chipExplainCurriculum: string;
  chipRaiseService: string;
  chipBookMentor: string;
  chipRaiseGrievance: string;

  // Cards & Actions
  openAttendanceDrawer: string;
  viewExamSchedule: string;
  viewGradeLedger: string;
  downloadHallTicket: string;
  hallTicketDownloaded: string;
  statusHealthy: string;
  statusAttention: string;
  statusResolved: string;
  statusInProgress: string;

  // Wellbeing & Crisis
  needHumanHelp: string;
  distressTitle: string;
  distressBody: string;
  talkToHuman: string;
  connectSupport: string;
  emergencyHelp: string;

  // Attendance View
  attendanceTitle: string;
  attendanceSubtitle: string;
  overallAttendance: string;
  statutoryThreshold: string;
  classesHeld: string;
  classesAttended: string;
  attendanceSafe: string;
  attendanceWarning: string;
  attendanceCritical: string;
  subjectWiseAttendance: string;
  simulateAttendance: string;
  applyLeave: string;
  askAttendanceHelp: string;

  // Examinations View
  examsTitle: string;
  examsSubtitle: string;
  upcomingAssessment: string;
  formativeAssessment: string;
  practicalAssessment: string;
  summativeEndSem: string;
  tableDate: string;
  tableCourse: string;
  tableSession: string;
  tableRoom: string;
  tableStatus: string;

  // Marks View
  marksTitle: string;
  marksSubtitle: string;
  cgpaLabel: string;
  sgpaLabel: string;
  creditsEarned: string;
  activeCourses: string;
  internalMarks: string;
  midTermMarks: string;
  gradeLedger: string;

  // Calendar View
  calendarTitle: string;
  calendarSubtitle: string;
  allEvents: string;
  calendarExams: string;
  calendarHolidays: string;
  calendarMilestones: string;
  upcomingMilestone: string;

  // Fees View
  feesTitle: string;
  feesSubtitle: string;
  totalFees: string;
  amountPaid: string;
  pendingDue: string;
  payOnline: string;
  downloadReceipt: string;
  transactionHistory: string;

  // Curriculum View
  curriculumTitle: string;
  curriculumSubtitle: string;
  courseCode: string;
  courseTitle: string;
  courseCredits: string;
  courseType: string;
  syllabus: string;

  // Services View
  servicesTitle: string;
  servicesSubtitle: string;
  newServiceRequest: string;
  bonafideCert: string;
  busPassApp: string;
  hostelLeave: string;
  grievanceRedressal: string;
  requestStatus: string;

  // Circulars View
  circularsTitle: string;
  circularsSubtitle: string;
  searchCirculars: string;
  downloadNotice: string;
  publishedDate: string;

  // Policies View
  policiesTitle: string;
  policiesSubtitle: string;
  academicRegulations: string;
  attendanceRegulations: string;
  examCodeOfConduct: string;

  // Profile Drawer
  profileTitle: string;
  rollNoLabel: string;
  programLabel: string;
  semesterLabel: string;
  contactInfo: string;
  mentorLabel: string;

  // Notifications Drawer
  notificationsTitle: string;
  markAllRead: string;
  noNotifications: string;

  // Security Drawer
  securityTitle: string;
  rlsActiveLabel: string;
  activeSession: string;

  // Auth / Login
  loginTitle: string;
  loginSubtitle: string;
  rollNumberPlaceholder: string;
  passwordPlaceholder: string;
  signInButton: string;
  demoAccounts: string;
}

const enDict: TranslationDictionary = {
  appName: "Student Helpdesk",
  badge: "AGENT 65",
  heroTitle: "Your university, one conversation away.",
  heroSubtitle: "Ask questions about your academics, schedule, fees, policies and university services — through one secure student helpdesk.",
  onlineStatus: "Student Helpdesk Online",
  secureConnection: "Securely connected to your student profile",
  authenticatedLabel: "Authenticated",
  viewingRecord: "Viewing student record",
  rlsBadge: "RLS Verified",
  resetSession: "Reset",
  restoreSession: "Restore",
  close: "Close",
  searchPlaceholder: "Ask Helpdesk anything (attendance, exams, fees)...",
  connectedBadge: "Connected · VFSTR",
  commandBarTip: "Press ⌘K or Ctrl+K to open Command Bar",
  signIn: "Sign In",
  signOut: "Sign Out",
  welcomeBack: "Welcome back",
  daysRemaining: "days remaining",

  sectionOverview: "Overview",
  sectionAcademics: "Academics",
  sectionSupport: "Institution & Support",
  sectionSystem: "System",
  collapseSidebar: "Collapse sidebar",
  expandSidebar: "Expand sidebar",

  navHome: "Home",
  navProfile: "My Profile",
  navAttendance: "Attendance",
  navMarks: "Marks & CGPA",
  navTimetable: "Timetable",
  navExams: "Examinations",
  navFees: "Fees & Finance",
  navCurriculum: "Curriculum",
  navPolicies: "Policies",
  navCirculars: "Circulars",
  navCalendar: "Calendar",
  navServices: "Services",

  snapshotTitle: "Student Academic Snapshot",
  nextClass: "Next Class",
  nextExam: "Upcoming Exam",
  attendanceWatch: "Attendance Watch",
  totalCredits: "Total Credits",
  viewFullSchedule: "View Full Schedule",
  statAttendedRatio: "Lecture Attendance",
  statActiveSubjects: "Active Subjects",
  statCgpa: "Cumulative GPA",

  timetableTitle: "Academic Timetable",
  timetableSubtitle: "Official section routine for Semester-I",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  currentClass: "Current Session",
  upcomingClass: "Next Session",
  completedClass: "Completed",
  room: "Room",
  faculty: "Faculty",
  coordinator: "Coordinator",
  classTeacher: "Class Teacher",

  chatTitle: "AI Helpdesk Workspace",
  chatSubtitle: "Grounded in official VFSTR database records",
  chatPlaceholder: "Ask about attendance, exam schedule, marks, fees, timetable...",
  askButton: "Ask Agent",
  modelLow: "Fast (3B)",
  modelLowDesc: "Rapid response model",
  modelHigh: "Deep (8B)",
  modelHighDesc: "High accuracy cognitive agent",
  micListening: "Listening... speak now",
  micStart: "Click to speak",
  coreActive: "Cognitive AI Online",
  retrievingRecords: "Fetching verified records...",
  quickActionsTitle: "Quick Help Desk Inquiries",
  contextualActionsTitle: "Personalized Alerts & Recommendations",

  quickMyAttendance: "What is my current attendance?",
  quickNextExam: "When is my next examination?",
  quickMyMarks: "Show my internal marks & CGPA",
  quickTodayTimetable: "What is my timetable today?",
  quickFeeStatus: "Check my tuition fee balance",
  quickCurriculum: "What are my subjects this semester?",
  quickCirculars: "Are there any recent circulars?",
  quickPolicies: "Explain the 75% attendance policy",
  quickCalendar: "Show upcoming academic holidays",
  quickServices: "How do I apply for a bonafide certificate?",

  chipBelow75: "Attendance below 75% — how to recover?",
  chipUpcomingAssessments: "List all upcoming exams & dates",
  chipExplainCurriculum: "Give course syllabus breakdown",
  chipRaiseService: "Submit a new student service request",
  chipBookMentor: "Contact my faculty counselor",
  chipRaiseGrievance: "File an official student grievance",

  openAttendanceDrawer: "View Attendance Breakdown",
  viewExamSchedule: "View Full Exam Schedule",
  viewGradeLedger: "Inspect Grade Ledger",
  downloadHallTicket: "Download Digital Hall Ticket",
  hallTicketDownloaded: "Hall Ticket Downloaded!",
  statusHealthy: "Healthy",
  statusAttention: "Requires Attention",
  statusResolved: "Resolved",
  statusInProgress: "In Progress",

  needHumanHelp: "Need Human Escalation?",
  distressTitle: "Student Wellbeing & Emergency Support",
  distressBody: "24/7 confidential counseling, anti-ragging helpline, and student mentor assistance.",
  talkToHuman: "Connect with Human Officer",
  connectSupport: "Emergency Helpline",
  emergencyHelp: "Crisis Support",

  attendanceTitle: "Attendance Telemetry",
  attendanceSubtitle: "Biometric and lecture-by-lecture records. Statutory minimum threshold: 75%.",
  overallAttendance: "Overall Attendance",
  statutoryThreshold: "Statutory Minimum: 75%",
  classesHeld: "Classes Held",
  classesAttended: "Classes Attended",
  attendanceSafe: "Safe Zone (≥75%)",
  attendanceWarning: "Warning Zone (65–75%)",
  attendanceCritical: "Critical Shortage (<65%)",
  subjectWiseAttendance: "Subject-wise Biometric Breakdown",
  simulateAttendance: "Attendance Recovery Simulator",
  applyLeave: "Apply for Medical/On-Duty Leave",
  askAttendanceHelp: "Ask Helpdesk about Attendance",

  examsTitle: "Upcoming Examinations",
  examsSubtitle: "Official Controller of Examinations (CoE) schedule for Semester-I.",
  upcomingAssessment: "Nearest Assessment",
  formativeAssessment: "Formative Assessment",
  practicalAssessment: "Practical Assessment",
  summativeEndSem: "Summative End-Semester Exam",
  tableDate: "Date",
  tableCourse: "Course & Subject",
  tableSession: "Session",
  tableRoom: "Exam Hall",
  tableStatus: "Status",

  marksTitle: "Academic Performance & Marks",
  marksSubtitle: "Continuous internal evaluations and cumulative grade points.",
  cgpaLabel: "Cumulative GPA (CGPA)",
  sgpaLabel: "Semester GPA (SGPA)",
  creditsEarned: "Credits Earned",
  activeCourses: "Enrolled Courses",
  internalMarks: "Internal Assessment",
  midTermMarks: "Mid-Term Marks",
  gradeLedger: "Academic Grade Ledger",

  calendarTitle: "Academic Calendar 2026-27 (Semester-I)",
  calendarSubtitle: "Official notification issued by Dean - Academics, VFSTR.",
  allEvents: "All Events",
  calendarExams: "Examinations",
  calendarHolidays: "Holidays",
  calendarMilestones: "Milestones",
  upcomingMilestone: "Upcoming Milestone",

  feesTitle: "Fees & Financial Ledger",
  feesSubtitle: "Verified student accounts records and payment transactions.",
  totalFees: "Total Annual Fees",
  amountPaid: "Amount Paid",
  pendingDue: "Outstanding Dues",
  payOnline: "Pay Online Now",
  downloadReceipt: "Download Fee Receipt",
  transactionHistory: "Payment Transaction History",

  curriculumTitle: "Course Curriculum & Syllabus",
  curriculumSubtitle: "R22 Academic Regulations — Department of Computer Science & Engineering",
  courseCode: "Course Code",
  courseTitle: "Course Title",
  courseCredits: "Credits",
  courseType: "Type",
  syllabus: "Detailed Syllabus",

  servicesTitle: "Student Services & Applications",
  servicesSubtitle: "Track certificate issuance, hostel leaves, transport passes, and grievances.",
  newServiceRequest: "Create New Request",
  bonafideCert: "Bonafide Certificate",
  busPassApp: "University Bus Pass",
  hostelLeave: "Hostel Outing / Leave",
  grievanceRedressal: "Student Grievance",
  requestStatus: "Application Status",

  circularsTitle: "Official University Circulars",
  circularsSubtitle: "Regulatory circulars, academic notices, and university orders.",
  searchCirculars: "Search circulars by title or number...",
  downloadNotice: "Download Circular",
  publishedDate: "Published Date",

  policiesTitle: "University Policies & Guidelines",
  policiesSubtitle: "Statutory academic regulations, attendance criteria, and conduct rules.",
  academicRegulations: "Academic Regulations",
  attendanceRegulations: "Attendance & Condonation Rules",
  examCodeOfConduct: "Examination Code of Conduct",

  profileTitle: "Student Profile",
  rollNoLabel: "Registration Number",
  programLabel: "Degree & Branch",
  semesterLabel: "Academic Semester",
  contactInfo: "Student Contact",
  mentorLabel: "Faculty Counselor / Mentor",

  notificationsTitle: "Notifications & Alerts",
  markAllRead: "Mark all as read",
  noNotifications: "No new notifications",

  securityTitle: "Security & Access Audit",
  rlsActiveLabel: "Row-Level Security (RLS) Active",
  activeSession: "Authenticated Session",

  loginTitle: "Sign in to Student Portal",
  loginSubtitle: "VFSTR Student Helpdesk & Academic Information System",
  rollNumberPlaceholder: "Registration Number (e.g., 251FA04E03)",
  passwordPlaceholder: "Password",
  signInButton: "Sign In Securely",
  demoAccounts: "Demo Accounts Available",
};

function createLangDict(overrides: Partial<TranslationDictionary>): TranslationDictionary {
  return { ...enDict, ...overrides };
}

// -------------------------------------------------------------
// Official Scheduled Languages Dictionaries
// -------------------------------------------------------------
const teDict: TranslationDictionary = createLangDict({
  appName: "విద్యార్థి సహాయ కేంద్రం",
  badge: "ఏజెంట్ 65",
  heroTitle: "మీ విశ్వవిద్యాలయం, ఒక్క సంభాషణతో చేరువగా.",
  heroSubtitle: "హాజరు, పరీక్షలు, మార్కులు, ఫీజులు, విద్యా క్యాలెండర్ మరియు సేవల వివరాలను తక్షణమే తెలుసుకోండి.",
  onlineStatus: "సహాయ కేంద్రం సిద్ధంగా ఉంది",
  secureConnection: "మీ విద్యార్థి ప్రొఫైల్‌కు సురక్షితంగా అనుసంధానించబడింది",
  authenticatedLabel: "ధృవీకరించబడింది",
  viewingRecord: "విద్యార్థి రికార్డును వీక్షిస్తున్నారు",
  rlsBadge: "RLS రక్షితం",
  resetSession: "రీసెట్",
  restoreSession: "పునరుద్ధరించు",
  close: "మూసివేయి",
  searchPlaceholder: "హాజరు, పరీక్షలు, ఫీజుల గురించి అడగండి...",
  connectedBadge: "అనుసంధానమైంది · VFSTR",
  commandBarTip: "కమాండ్ బార్ తెరవడానికి Ctrl+K నొక్కండి",
  signIn: "లాగిన్ అవ్వండి",
  signOut: "లాగ్ అవుట్",
  welcomeBack: "స్వాగతం",
  daysRemaining: "రోజులు మిగిలి ఉన్నాయి",

  sectionOverview: "స్థూలదృష్టి",
  sectionAcademics: "విద్యా విషయాలు",
  sectionSupport: "సంస్థ మరియు సహాయం",
  sectionSystem: "వ్యవస్థ",
  collapseSidebar: "సైడ్‌బార్ కుదించు",
  expandSidebar: "సైడ్‌బార్ విస్తరించు",

  navHome: "హోమ్",
  navProfile: "నా ప్రొఫైల్",
  navAttendance: "హాజరు",
  navMarks: "మార్కులు & CGPA",
  navTimetable: "టైమ్‌టేబుల్",
  navExams: "పరీక్షలు",
  navFees: "ఫీజులు",
  navCurriculum: "సిలబస్",
  navPolicies: "నిబంధనలు",
  navCirculars: "సర్క్యులర్లు",
  navCalendar: "విద్యా క్యాలెండర్",
  navServices: "సేవలు",

  snapshotTitle: "విద్యార్థి విద్యా ప్రొఫైల్",
  nextClass: "తదుపరి తరగతి",
  nextExam: "రాబోయే పరీక్ష",
  attendanceWatch: "హాజరు పర్యవేక్షణ",
  totalCredits: "మొత్తం క్రెడిట్లు",
  viewFullSchedule: "పూర్తి షెడ్యూల్ చూడండి",
  statAttendedRatio: "హాజరైన తరగతులు",
  statActiveSubjects: "ప్రస్తుత సబ్జెక్టులు",
  statCgpa: "సంచిత GPA (CGPA)",

  timetableTitle: "విద్యా కాలపట్టిక (టైమ్‌టేబుల్)",
  timetableSubtitle: "సెమిస్టర్-1 అధికారిక తరగతుల విభాగ దినచర్య",
  monday: "సోమవారం",
  tuesday: "మంగళవారం",
  wednesday: "బుధవారం",
  thursday: "గురువారం",
  friday: "శుక్రవారం",
  saturday: "శనివారం",
  currentClass: "ప్రస్తుత తరగతి",
  upcomingClass: "తదుపరి తరగతి",
  completedClass: "పూర్తయింది",
  room: "గది నం.",
  faculty: "అధ్యాపకులు",
  coordinator: "కోఆర్డినేటర్",
  classTeacher: "క్లాస్ టీచర్",

  chatTitle: "AI సహాయ కేంద్రం",
  chatSubtitle: "అధికారిక VFSTR డేటా ఆధారంగా సమాధానాలు",
  chatPlaceholder: "హాజరు, పరీక్షలు, మార్కులు, ఫీజులు, సిలబస్ గురించి అడగండి...",
  askButton: "అడగండి",
  modelLow: "వేగవంతమైనది (3B)",
  modelLowDesc: "త్వరిత సమాధానాలు",
  modelHigh: "ఖచ్చితమైనది (8B)",
  modelHighDesc: "లోతైన జ్ఞాన విశ్లేషణ",
  micListening: "వింటున్నాను... మాట్లాడండి",
  micStart: "మాట్లాడటానికి క్లిక్ చేయండి",
  coreActive: "AI కోర్ ఆన్‌లైన్",
  retrievingRecords: "రికార్డులను సేకరిస్తోంది...",
  quickActionsTitle: "త్వరిత ప్రశ్నలు",
  contextualActionsTitle: "వ్యక్తిగత సూచనలు",

  quickMyAttendance: "నా ప్రస్తుత హాజరు ఎంత?",
  quickNextExam: "నా తదుపరి పరీక్ష ఎప్పుడు?",
  quickMyMarks: "నా ఇంటర్నల్ మార్కులు & CGPA చూపించు",
  quickTodayTimetable: "ఈ రోజు నా టైమ్‌టేబుల్ ఏమిటి?",
  quickFeeStatus: "నా ఫీజు బకాయి వివరాలు చూపించు",
  quickCurriculum: "ఈ సెమిస్టర్ సబ్జెక్టులు ఏమిటి?",
  quickCirculars: "ఇటీవలి సర్క్యులర్లు ఏమైనా ఉన్నాయా?",
  quickPolicies: "75% హాజరు నిబంధనను వివరించండి",
  quickCalendar: "రాబోయే విద్యా సెలవుల వివరాలు చూపించు",
  quickServices: "బోనాఫైడ్ సర్టిఫికెట్ కోసం ఎలా దరఖాస్తు చేయాలి?",

  openAttendanceDrawer: "హాజరు పూర్తి వివరాలు",
  viewExamSchedule: "పరీక్షల టైమ్‌టేబుల్ చూడండి",
  viewGradeLedger: "మార్కుల వివరాలు చూడండి",
  downloadHallTicket: "హాల్ టికెట్ డౌన్‌లోడ్ చేసుకోండి",
  hallTicketDownloaded: "హాల్ టికెట్ డౌన్‌లోడ్ చేయబడింది!",
  statusHealthy: "సంతృప్తికరం",
  statusAttention: "శ్రద్ధ వహించండి",
  statusResolved: "పరిష్కరించబడింది",
  statusInProgress: "పురోగతిలో ఉంది",

  needHumanHelp: "సహాయం కావాలా?",
  distressTitle: "విద్యార్థి సంక్షేమం & అత్యవసర సహాయం",
  distressBody: "24/7 గోప్యమైన కౌన్సెలింగ్, ర్యాగింగ్ నిరోధక హెల్ప్‌లైన్ మరియు మెంటార్ మద్దతు.",
  talkToHuman: "అధికారితో మాట్లాడండి",
  connectSupport: "అత్యవసర హెల్ప్‌లైన్",
  emergencyHelp: "సంక్షోభ సహాయం",

  attendanceTitle: "హాజరు వివరాలు (టెలిమెట్రీ)",
  attendanceSubtitle: "బయోమెట్రిక్ మరియు లెక్చర్ల వారీగా రికార్డులు. కనీస పరిమితి: 75%.",
  overallAttendance: "మొత్తం హాజరు శాతం",
  statutoryThreshold: "కనీస నిబంధన: 75%",
  classesHeld: "జరిగిన తరగతులు",
  classesAttended: "హాజరైన తరగతులు",
  attendanceSafe: "సురక్షిత జోన్ (≥75%)",
  attendanceWarning: "హెచ్చరిక జోన్ (65–75%)",
  attendanceCritical: "తీవ్ర కొరత (<65%)",
  subjectWiseAttendance: "సబ్జెక్టుల వారీగా బయోమెట్రిక్ హాజరు",
  simulateAttendance: "హాజరు సిమ్యులేటర్",
  applyLeave: "సెలవు కోసం దరఖాస్తు చేయండి",
  askAttendanceHelp: "హాజరు గురించి అడగండి",

  examsTitle: "రాబోయే పరీక్షలు",
  examsSubtitle: "పరీక్షల నియంత్రణ విభాగం (CoE) అధికారిక షెడ్యూల్.",
  upcomingAssessment: "సమీప పరీక్ష",
  formativeAssessment: "ఫార్మేటివ్ అసెస్‌మెంట్ (FA)",
  practicalAssessment: "ప్రాక్టికల్ పరీక్షలు",
  summativeEndSem: "సెమిస్టర్ ముగింపు పరీక్షలు (సమ్మేటివ్)",
  tableDate: "తేదీ",
  tableCourse: "సబ్జెక్టు & కోడ్",
  tableSession: "సమయం / సెషన్",
  tableRoom: "పరీక్ష హాలు",
  tableStatus: "స్థితి",

  marksTitle: "మార్కులు మరియు విద్యా ఫలితాలు",
  marksSubtitle: "ఇంటర్నల్ అసెస్‌మెంట్ మరియు గ్రేడ్ పాయింట్ల వివరాలు.",
  cgpaLabel: "సంచిత గ్రేడ్ పాయింట్ (CGPA)",
  sgpaLabel: "సెమిస్టర్ గ్రేడ్ పాయింట్ (SGPA)",
  creditsEarned: "పొందిన క్రెడిట్లు",
  activeCourses: "నమోదైన సబ్జెక్టులు",
  internalMarks: "ఇంటర్నల్ మార్కులు",
  midTermMarks: "మిడ్ పరీక్షల మార్కులు",
  gradeLedger: "గ్రేడ్ లెడ్జర్",

  calendarTitle: "అకడమిక్ క్యాలెండర్ 2026-27 (సెమిస్టర్-I)",
  calendarSubtitle: "డీన్ - అకడమిక్స్, VFSTR జారీ చేసిన అధికారిక నోటిఫికేషన్.",
  allEvents: "అన్ని ఈవెంట్లు",
  calendarExams: "పరీక్షలు",
  calendarHolidays: "సెలవులు",
  calendarMilestones: "ముఖ్య తేదీలు",
  upcomingMilestone: "రాబోయే మైలురాయి",

  feesTitle: "ఫీజులు & చెల్లింపుల వివరాలు",
  feesSubtitle: "ధృవీకరించబడిన విద్యార్థి ఫీజు ఖాతా మరియు లావాదేవీల రికార్డు.",
  totalFees: "మొత్తం ట్యూషన్ ఫీజు",
  amountPaid: "చెల్లించిన మొత్తం",
  pendingDue: "బకాయి ఉన్న మొత్తం",
  payOnline: "ఆన్‌లైన్‌లో చెల్లించండి",
  downloadReceipt: "రసీదు డౌన్‌లోడ్ చేసుకోండి",
  transactionHistory: "చెల్లింపు లావాదేవీల చరిత్ర",

  curriculumTitle: "సిలబస్ మరియు కోర్సు పాఠ్యప్రణాళిక",
  curriculumSubtitle: "R22 విద్యా నిబంధనలు — కంప్యూటర్ సైన్స్ & ఇంజనీరింగ్",
  courseCode: "కోర్సు కోడ్",
  courseTitle: "కోర్సు పేరు",
  courseCredits: "క్రెడిట్లు",
  courseType: "రకం",
  syllabus: "వివరణాత్మక సిలబస్",

  servicesTitle: "విద్యార్థి సేవలు మరియు దరఖాస్తులు",
  servicesSubtitle: "బోనాఫైడ్, బస్సు పాస్, హాస్టల్ సెలవు మరియు ఫిర్యాదుల స్థితి.",
  newServiceRequest: "కొత్త దరఖాస్తు సృష్టించండి",
  bonafideCert: "బోనాఫైడ్ సర్టిఫికెట్",
  busPassApp: "బస్సు పాస్ దరఖాస్తు",
  hostelLeave: "హాస్టల్ సెలవు అనుమతి",
  grievanceRedressal: "విద్యార్థి ఫిర్యాదు పరిష్కారం",
  requestStatus: "దరఖాస్తు స్థితి",

  circularsTitle: "అధికారిక విశ్వవిద్యాలయ సర్క్యులర్లు",
  circularsSubtitle: "రిజిస్ట్రార్ మరియు డీన్ కార్యాలయాల నుంచి అధికారిక నోటీసులు.",
  searchCirculars: "సర్క్యులర్లను శోధించండి...",
  downloadNotice: "నోటీసు డౌన్‌లోడ్ చేయండి",
  publishedDate: "ప్రచురించిన తేదీ",

  policiesTitle: "విశ్వవిద్యాలయ నిబంధనలు మరియు మార్గదర్శకాలు",
  policiesSubtitle: "విద్యా నిబంధనలు, హాజరు ప్రమాణాలు మరియు క్రమశిక్షణ నియమావళి.",
  academicRegulations: "విద్యా నిబంధనలు (అకడమిక్)",
  attendanceRegulations: "హాజరు మరియు కండోనేషన్ నియమాలు",
  examCodeOfConduct: "పరీక్షల ప్రవర్తనా నియమావళి",

  profileTitle: "విద్యార్థి ప్రొఫైల్",
  rollNoLabel: "రిజిస్ట్రేషన్ నంబర్",
  programLabel: "డిగ్రీ & విభాగం",
  semesterLabel: "సెమిస్టర్",
  contactInfo: "సంప్రదింపు వివరాలు",
  mentorLabel: "ఫ్యాకల్టీ కౌన్సిలర్ / మెంటార్",

  notificationsTitle: "నోటిఫికేషన్లు & హెచ్చరికలు",
  markAllRead: "అన్నీ చదివినట్లు గుర్తించు",
  noNotifications: "కొత్త నోటిఫికేషన్లు లేవు",

  securityTitle: "భద్రత & సెషన్ లాగ్",
  rlsActiveLabel: "రో-లెవల్ సెక్యూరిటీ (RLS) సక్రియం",
  activeSession: "ధృవీకరించబడిన సెషన్",

  loginTitle: "విద్యార్థి పోర్టల్‌లోకి ప్రవేశించండి",
  loginSubtitle: "VFSTR విద్యార్థి సహాయ కేంద్రం మరియు సమాచార వ్యవస్థ",
  rollNumberPlaceholder: "రిజిస్ట్రేషన్ నంబర్ (ఉదా. 251FA04E03)",
  passwordPlaceholder: "పాస్‌వర్డ్",
  signInButton: "సురక్షితంగా లాగిన్ అవ్వండి",
  demoAccounts: "డెమో ఖాతాలు అందుబాటులో ఉన్నాయి",
});

const hiDict: TranslationDictionary = createLangDict({
  appName: "छात्र सहायता केंद्र",
  badge: "एजेंट 65",
  heroTitle: "आपका विश्वविद्यालय, बस एक बातचीत की दूरी पर।",
  heroSubtitle: "अपनी उपस्थिति, परीक्षा, अंक, शुल्क और नीतियों के बारे में सीधे अपने सुरक्षित सहायता केंद्र से पूछें।",
  onlineStatus: "सहायता केंद्र सक्रिय है",
  secureConnection: "आपकी छात्र प्रोफ़ाइल से सुरक्षित रूप से जुड़ा हुआ",
  authenticatedLabel: "प्रमाणित",
  viewingRecord: "छात्र रिकॉर्ड देखा जा रहा है",
  rlsBadge: "RLS सुरक्षित",
  resetSession: "रीसेट",
  restoreSession: "पुनर्स्थापित करें",
  close: "बंद करें",
  searchPlaceholder: "उपस्थिति, परीक्षा, शुल्क के बारे में कुछ भी पूछें...",
  connectedBadge: "कनेक्टेड · VFSTR",
  commandBarTip: "कमांड बार खोलने के लिए Ctrl+K दबाएं",
  signIn: "लॉग इन करें",
  signOut: "लॉग आउट",
  welcomeBack: "वापसी पर स्वागत है",
  daysRemaining: "दिन शेष",

  sectionOverview: "सिंहावलोकन",
  sectionAcademics: "शैक्षणिक",
  sectionSupport: "संस्थान और सहायता",
  sectionSystem: "सिस्टम",
  collapseSidebar: "साइडबार संक्षिप्त करें",
  expandSidebar: "साइडबार विस्तृत करें",

  navHome: "मुख्य पृष्ठ",
  navProfile: "मेरी प्रोफ़ाइल",
  navAttendance: "उपस्थिति",
  navMarks: "अंक एवं सीजीपीए",
  navTimetable: "समय सारणी",
  navExams: "परीक्षाएं",
  navFees: "शुल्क एवं वित्त",
  navCurriculum: "पाठ्यक्रम",
  navPolicies: "नीतियां",
  navCirculars: "परिपत्र",
  navCalendar: "अकादमिक कैलेंडर",
  navServices: "छात्र सेवाएं",

  snapshotTitle: "छात्र अकादमिक स्नैपशॉट",
  nextClass: "अगली कक्षा",
  nextExam: "आगामी परीक्षा",
  attendanceWatch: "उपस्थिति निगरानी",
  totalCredits: "कुल क्रेडिट",
  viewFullSchedule: "पूर्ण समय सारणी देखें",
  statAttendedRatio: "व्याख्यान उपस्थिति",
  statActiveSubjects: "सक्रिय विषय",
  statCgpa: "संचयी जीपीए (CGPA)",

  timetableTitle: "अकादमिक समय सारणी (टाइमटेबल)",
  timetableSubtitle: "सेमेस्टर-1 के लिए आधिकारिक कक्षा दिनचर्या",
  monday: "सोमवार",
  tuesday: "मंगलवार",
  wednesday: "बुधवार",
  thursday: "गुरुवार",
  friday: "शुक्रवार",
  saturday: "शनिवार",
  currentClass: "वर्तमान सत्र",
  upcomingClass: "अगला सत्र",
  completedClass: "पूर्ण",
  room: "कमरा सं.",
  faculty: "संकाय सदस्य",
  coordinator: "समन्वयक",
  classTeacher: "कक्षा अध्यापक",

  chatTitle: "एआई सहायता कार्यक्षेत्र",
  chatSubtitle: "आधिकारिक VFSTR डेटाबेस पर आधारित उत्तर",
  chatPlaceholder: "उपस्थिति, परीक्षा समय सारणी, अंक, शुल्क के बारे में पूछें...",
  askButton: "पूछें",
  modelLow: "तेज़ (3B)",
  modelLowDesc: "त्वरित उत्तर मॉडल",
  modelHigh: "सटीक (8B)",
  modelHighDesc: "गहन संज्ञानात्मक एजेंट",
  micListening: "सुन रहा हूँ... बोलिए",
  micStart: "बोलने के लिए क्लिक करें",
  coreActive: "संज्ञानात्मक एआई ऑनलाइन",
  retrievingRecords: "सत्यापित रिकॉर्ड खोजे जा रहे हैं...",
  quickActionsTitle: "त्वरित प्रश्न",
  contextualActionsTitle: "व्यक्तिगत सुझाव",

  quickMyAttendance: "मेरी वर्तमान उपस्थिति क्या है?",
  quickNextExam: "मेरी अगली परीक्षा कब है?",
  quickMyMarks: "मेरे आंतरिक अंक और सीजीपीए दिखाएं",
  quickTodayTimetable: "आज मेरी समय सारणी क्या है?",
  quickFeeStatus: "मेरी बकाया शुल्क स्थिति जांचें",
  quickCurriculum: "इस सेमेस्टर मेरे विषय क्या हैं?",
  quickCirculars: "क्या कोई हालिया परिपत्र है?",
  quickPolicies: "75% उपस्थिति नियम समझाइए",
  quickCalendar: "आगामी शैक्षणिक छुट्टियां दिखाएं",
  quickServices: "बोनाफाइड प्रमाणपत्र के लिए आवेदन कैसे करें?",

  openAttendanceDrawer: "उपस्थिति विवरण देखें",
  viewExamSchedule: "परीक्षा समय सारणी देखें",
  viewGradeLedger: "अंक बही देखें",
  downloadHallTicket: "डिजिटल हॉल टिकट डाउनलोड करें",
  hallTicketDownloaded: "हॉल टिकट डाउनलोड हो गया!",
  statusHealthy: "संतोषजनक",
  statusAttention: "ध्यान दें",
  statusResolved: "हल किया गया",
  statusInProgress: "प्रगति पर है",

  needHumanHelp: "मानवीय सहायता चाहिए?",
  distressTitle: "छात्र कल्याण एवं आपातकालीन सहायता",
  distressBody: "24/7 गोपनीय परामर्श, एंटी-रैगिंग हेल्पलाइन और संकाय मेंटर सहायता।",
  talkToHuman: "अधिकारी से बात करें",
  connectSupport: "आपातकालीन हेल्पलाइन",
  emergencyHelp: "संकट सहायता",

  attendanceTitle: "उपस्थिति टेलीमेट्री",
  attendanceSubtitle: "बायोमेट्रिक और व्याख्यान-वार रिकॉर्ड। न्यूनतम सीमा: 75%।",
  overallAttendance: "कुल उपस्थिति प्रतिशत",
  statutoryThreshold: "वैधानिक न्यूनतम: 75%",
  classesHeld: "कुल कक्षाएं",
  classesAttended: "उपस्थित कक्षाएं",
  attendanceSafe: "सुरक्षित क्षेत्र (≥75%)",
  attendanceWarning: "चेतावनी क्षेत्र (65–75%)",
  attendanceCritical: "गंभीर कमी (<65%)",
  subjectWiseAttendance: "विषय-वार बायोमेट्रिक विवरण",
  simulateAttendance: "उपस्थिति रिकवरी सिम्युलेटर",
  applyLeave: "अवकाश हेतु आवेदन करें",
  askAttendanceHelp: "उपस्थिति के बारे में पूछें",

  examsTitle: "आगामी परीक्षाएं",
  examsSubtitle: "परीक्षा नियंत्रक (CoE) द्वारा जारी आधिकारिक परीक्षा कार्यक्रम।",
  upcomingAssessment: "निकटतम परीक्षा",
  formativeAssessment: "फॉर्मेटिव असेसमेंट (FA)",
  practicalAssessment: "प्रायोगिक परीक्षा",
  summativeEndSem: "सेमेस्टर अंत परीक्षा (समेटिव)",
  tableDate: "तारीख",
  tableCourse: "विषय और कोड",
  tableSession: "सत्र / समय",
  tableRoom: "परीक्षा कक्ष",
  tableStatus: "स्थिति",

  marksTitle: "अकादमिक प्रदर्शन एवं अंक",
  marksSubtitle: "सतत आंतरिक मूल्यांकन और संचयी ग्रेड बिंदु।",
  cgpaLabel: "संचयी जीपीए (CGPA)",
  sgpaLabel: "सेमेस्टर जीपीए (SGPA)",
  creditsEarned: "अर्जित क्रेडिट",
  activeCourses: "पंजीकृत पाठ्यक्रम",
  internalMarks: "आंतरिक मूल्यांकन अंक",
  midTermMarks: "मिड-टर्म अंक",
  gradeLedger: "ग्रेड लेज़र",

  calendarTitle: "अकादमिक कैलेंडर 2026-27 (सेमेस्टर-I)",
  calendarSubtitle: "डीन - अकादमिक, VFSTR द्वारा जारी आधिकारिक अधिसूचना।",
  allEvents: "सभी कार्यक्रम",
  calendarExams: "परीक्षाएं",
  calendarHolidays: "अवकाश",
  calendarMilestones: "महत्वपूर्ण तिथियां",
  upcomingMilestone: "आगामी मील का पत्थर",

  feesTitle: "शुल्क एवं वित्तीय विवरण",
  feesSubtitle: "सत्यापित छात्र खाता एवं भुगतान विवरण।",
  totalFees: "कुल शिक्षण शुल्क",
  amountPaid: "भुगतान की गई राशि",
  pendingDue: "बकाया राशि",
  payOnline: "ऑनलाइन भुगतान करें",
  downloadReceipt: "रसीद डाउनलोड करें",
  transactionHistory: "भुगतान लेनदेन इतिहास",

  curriculumTitle: "पाठ्यक्रम एवं विषय रूपरेखा",
  curriculumSubtitle: "R22 अकादमिक विनियम — कंप्यूटर साइंस एंड इंजीनियरिंग",
  courseCode: "पाठ्यक्रम कोड",
  courseTitle: "विषय का नाम",
  courseCredits: "क्रेडिट",
  courseType: "प्रकार",
  syllabus: "विस्तृत पाठ्यक्रम",

  servicesTitle: "छात्र सेवाएं एवं आवेदन",
  servicesSubtitle: "बोनाफाइड, बस पास, छात्रावास अवकाश और शिकायत निवारण।",
  newServiceRequest: "नया आवेदन बनाएं",
  bonafideCert: "बोनाफाइड प्रमाणपत्र",
  busPassApp: "विश्वविद्यालय बस पास",
  hostelLeave: "छात्रावास अवकाश अनुमति",
  grievanceRedressal: "छात्र शिकायत निवारण",
  requestStatus: "आवेदन स्थिति",

  circularsTitle: "आधिकारिक विश्वविद्यालय परिपत्र",
  circularsSubtitle: "रजिस्ट्रार एवं डीन कार्यालय द्वारा जारी आधिकारिक सूचनाएं।",
  searchCirculars: "परिपत्र खोजें...",
  downloadNotice: "परिपत्र डाउनलोड करें",
  publishedDate: "प्रकाशन तिथि",

  policiesTitle: "विश्वविद्यालय नीतियां एवं दिशानिर्देश",
  policiesSubtitle: "अकादमिक नियम, उपस्थिति मापदंड एवं अनुशासन संहिता।",
  academicRegulations: "अकादमिक नियम",
  attendanceRegulations: "उपस्थिति एवं छूट नियम",
  examCodeOfConduct: "परीक्षा आचार संहिता",

  profileTitle: "छात्र प्रोफ़ाइल",
  rollNoLabel: "पंजीकरण संख्या",
  programLabel: "डिग्री एवं शाखा",
  semesterLabel: "सेमेस्टर",
  contactInfo: "संपर्क जानकारी",
  mentorLabel: "संकाय परामर्शदाता / मेंटर",

  notificationsTitle: "सूचनाएं एवं अलर्ट",
  markAllRead: "सभी को पढ़ा हुआ चिह्नित करें",
  noNotifications: "कोई नई सूचना नहीं है",

  securityTitle: "सुरक्षा एवं एक्सेस ऑडिट",
  rlsActiveLabel: "रो-लेवल सुरक्षा (RLS) सक्रिय",
  activeSession: "प्रमाणित सत्र",

  loginTitle: "छात्र पोर्टल में प्रवेश करें",
  loginSubtitle: "VFSTR छात्र सहायता केंद्र एवं अकादमिक प्रणाली",
  rollNumberPlaceholder: "पंजीकरण संख्या (उदा. 251FA04E03)",
  passwordPlaceholder: "पासवर्ड",
  signInButton: "सुरक्षित रूप से लॉग इन करें",
  demoAccounts: "डेमो खाते उपलब्ध हैं",
});

const taDict = createLangDict({
  appName: "மாணவர் உதவி மையம்",
  badge: "ஏஜென்ட் 65",
  heroTitle: "உங்கள் பல்கலைக்கழகம், ஒரே உரையாடலில்.",
  heroSubtitle: "உங்கள் வருகைப்பதிவு, தேர்வுகள், மதிப்பெண்கள் மற்றும் கொள்கைகள் பற்றி நேரடியாக கேளுங்கள்.",
  onlineStatus: "மாணவர் உதவி மையம் இயங்குகிறது",
  searchPlaceholder: "வருகைப்பதிவு, தேர்வுகள், கட்டணம் பற்றி கேளுங்கள்...",
  connectedBadge: "இணைக்கப்பட்டது · VFSTR",
  signIn: "உள்நுழைய",
  signOut: "வெளியேறு",
  welcomeBack: "மீண்டும் வருக",
  sectionOverview: "மேலோட்டம்",
  sectionAcademics: "கல்வி",
  sectionSupport: "ஆதரவு",
  sectionSystem: "அமைப்பு",
  navHome: "முகப்பு",
  navAttendance: "வருகைப்பதிவு",
  navMarks: "மதிப்பெண்கள்",
  navTimetable: "நேர அட்டவணை",
  navExams: "தேர்வுகள்",
  navFees: "கட்டணம்",
  navCurriculum: "பாடத்திட்டம்",
  navPolicies: "கொள்கைகள்",
  navCirculars: "சுற்றறிக்கைகள்",
  navCalendar: "நாள்காட்டி",
  navServices: "சேவைகள்",
  chatPlaceholder: "வருகைப்பதிவு, தேர்வு, மதிப்பெண், கட்டணம் குறித்து கேளுங்கள்...",
  askButton: "கேளுங்கள்",
  modelLow: "வேகம் (3B)",
  modelHigh: "துல்லியம் (8B)",
  micListening: "கேட்கிறேன்... பேசுங்கள்",
  micStart: "பேச கிளிக் செய்யவும்",
  monday: "திங்கள்",
  tuesday: "செவ்வாய்",
  wednesday: "புதன்",
  thursday: "வியாழன்",
  friday: "வெள்ளி",
  saturday: "சனி",
  attendanceTitle: "வருகைப்பதிவு கண்காணிப்பு",
  examsTitle: "வரவிருக்கும் தேர்வுகள்",
  marksTitle: "மதிப்பெண்கள் & முடிவுகள்",
  calendarTitle: "கல்வி நாள்காட்டி 2026-27",
  feesTitle: "கட்டணம் மற்றும் நிதியியல்",
  curriculumTitle: "பாடத்திட்டம்",
  servicesTitle: "மாணவர் சேவைகள்",
  circularsTitle: "அதிகாரப்பூர்வ சுற்றறிக்கைகள்",
  policiesTitle: "பல்கலைக்கழக விதிமுறைகள்",
  profileTitle: "மாணவர் சுயவிவரம்",
  downloadHallTicket: "ஹால் டிக்கெட் பதிவிறக்குக",
});

const knDict = createLangDict({
  appName: "ವಿದ್ಯಾರ್ಥಿ ಸಹಾಯವಾಣಿ",
  badge: "ಏಜೆಂಟ್ 65",
  heroTitle: "ನಿಮ್ಮ ವಿಶ್ವವಿದ್ಯಾಲಯ, ಒಂದೇ ಸಂಭಾಷಣೆಯಲ್ಲಿ.",
  heroSubtitle: "ನಿಮ್ಮ ಹಾಜರಾತಿ, ಪರೀಕ್ಷೆಗಳು, ಅಂಕಗಳು ಮತ್ತು ಶುಲ್ಕಗಳ ಬಗ್ಗೆ ನೇರವಾಗಿ ಕೇಳಿ.",
  onlineStatus: "ಸಹಾಯವಾಣಿ ಸಕ್ರಿಯವಾಗಿದೆ",
  searchPlaceholder: "ಹಾಜರಾತಿ, ಪರೀಕ್ಷೆಗಳು, ಶುಲ್ಕಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
  connectedBadge: "ಸಂಪರ್ಕಗೊಂಡಿದೆ · VFSTR",
  signIn: "ಲಾಗಿನ್",
  signOut: "ಲಾಗ್ ಔಟ್",
  welcomeBack: "ಸ್ವಾಗತ",
  sectionOverview: "ಅವಲೋಕನ",
  sectionAcademics: "ಶೈಕ್ಷಣಿಕ",
  sectionSupport: "ಬೆಂಬಲ",
  sectionSystem: "ವ್ಯವಸ್ಥೆ",
  navHome: "ಮುಖಪುಟ",
  navAttendance: "ಹಾಜರಾತಿ",
  navMarks: "ಅಂಕಗಳು",
  navTimetable: "ವೇಳಾಪಟ್ಟಿ",
  navExams: "ಪರೀಕ್ಷೆಗಳು",
  navFees: "ಶುಲ್ಕ",
  navCurriculum: "ಪಠ್ಯಕ್ರಮ",
  navPolicies: "ನಿಯಮಗಳು",
  navCirculars: "ಸುತ್ತೋಲೆಗಳು",
  navCalendar: "ಕ್ಯಾಲೆಂಡರ್",
  navServices: "ಸೇವೆಗಳು",
  chatPlaceholder: "ಹಾಜರಾತಿ, ಪರೀಕ್ಷೆ, ಅಂಕ, ಶುಲ್ಕದ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ...",
  askButton: "ಕೇಳಿ",
  modelLow: "ವೇಗ (3B)",
  modelHigh: "ನಿಖರ (8B)",
  micListening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡಿ",
  micStart: "ಮಾತನಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
  attendanceTitle: "ಹಾಜರಾತಿ ವಿವರಗಳು",
  examsTitle: "ಮುಂಬರುವ ಪರೀಕ್ಷೆಗಳು",
  marksTitle: "ಅಂಕಗಳು ಮತ್ತು ಫಲಿತಾಂಶ",
  calendarTitle: "ಶೈಕ್ಷಣಿಕ ಕ್ಯಾಲೆಂಡರ್ 2026-27",
  feesTitle: "ಶುಲ್ಕ ಮತ್ತು ಲೆಕ್ಕಪತ್ರ",
  downloadHallTicket: "ಹಾಲ್ ಟಿಕೆಟ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
});

const mlDict = createLangDict({
  appName: "വിദ്യാർത്ഥി സഹായ കേന്ദ്രം",
  badge: "ഏജന്റ് 65",
  heroTitle: "നിങ്ങളുടെ സർവ്വകലാശാല, ഒറ്റ സംഭാഷണത്തിൽ.",
  heroSubtitle: "ഹാജർനില, പരീക്ഷകൾ, മാർക്കുകൾ, ഫീസ് എന്നിവയെക്കുറിച്ച് ചോദിക്കുക.",
  onlineStatus: "സഹായ കേന്ദ്രം സജീവമാണ്",
  searchPlaceholder: "ഹാജർ, പരീക്ഷ, ഫീസ് വിവരങ്ങൾ ചോദിക്കുക...",
  connectedBadge: "കണക്റ്റുചെയ്‌തു · VFSTR",
  signIn: "പ്രവേശിക്കുക",
  signOut: "പുറത്തുകടക്കുക",
  welcomeBack: "സ്വാഗതം",
  sectionOverview: "അവലോകനം",
  sectionAcademics: "അക്കാദമിക്",
  navHome: "ഹോം",
  navAttendance: "ഹാജർ",
  navMarks: "മാർക്കുകൾ",
  navTimetable: "ടൈംടേബിൾ",
  navExams: "പരീക്ഷകൾ",
  navFees: "ഫീസ്",
  navCurriculum: "സിലബസ്",
  navPolicies: "നയങ്ങൾ",
  navCirculars: "സർക്കുലറുകൾ",
  navCalendar: "കലണ്ടർ",
  navServices: "സേവനങ്ങൾ",
  askButton: "ചോദിക്കൂ",
  downloadHallTicket: "ഹാൾ ടിക്കറ്റ് ഡൗൺലോഡ് ചെയ്യുക",
});

const mrDict = createLangDict({
  appName: "विद्यार्थी मदत केंद्र",
  badge: "एजंट 65",
  heroTitle: "तुमचे विद्यापीठ, एका संवादात.",
  heroSubtitle: "तुमची उपस्थिती, परीक्षा, गुण, शुल्क आणि नियमांबद्दल त्वरित विचारा.",
  onlineStatus: "मदत केंद्र सक्रिय आहे",
  searchPlaceholder: "उपस्थिती, परीक्षा, शुल्काबद्दल विचारा...",
  connectedBadge: "कनेक्ट केले · VFSTR",
  signIn: "लॉग इन करा",
  signOut: "लॉग आउट",
  welcomeBack: "पुन्हा स्वागत आहे",
  sectionOverview: "आढावा",
  sectionAcademics: "शैक्षणिक",
  navHome: "मुख्यपृष्ठ",
  navAttendance: "हजेरी",
  navMarks: "गुण आणि सीजीपीए",
  navTimetable: "वेळापत्रक",
  navExams: "परीक्षा",
  navFees: "शुल्क",
  navCurriculum: "अभ्यासक्रम",
  navPolicies: "नियम",
  navCirculars: "परिपत्रके",
  navCalendar: "कॅलेंडर",
  navServices: "सेवा",
  askButton: "विचारा",
  downloadHallTicket: "हॉल तिकीट डाउनलोड करा",
});

const bnDict = createLangDict({
  appName: "শিক্ষার্থী সহায়তা কেন্দ্র",
  badge: "এজেন্ট 65",
  heroTitle: "আপনার বিশ্ববিদ্যালয়, এক কথোপকথনে।",
  heroSubtitle: "উপস্থিতি, পরীক্ষা, নম্বর, ফি এবং নীতি সম্পর্কে সরাসরি জিজ্ঞাসা করুন।",
  onlineStatus: "সহায়তা কেন্দ্র অনলাইন",
  searchPlaceholder: "উপস্থিতি, পরীক্ষা, ফি সম্পর্কে অনুসন্ধান করুন...",
  connectedBadge: "সংযুক্ত · VFSTR",
  signIn: "সাইন ইন",
  signOut: "সাইন আউট",
  welcomeBack: "স্বাগতম",
  sectionOverview: "ওভারভিউ",
  sectionAcademics: "একাডেমিক",
  navHome: "হোম",
  navAttendance: "উপস্থিতি",
  navMarks: "নম্বর",
  navTimetable: "সময়সূচী",
  navExams: "পরীক্ষা",
  navFees: "ফি",
  navCurriculum: "পাঠ্যক্রম",
  navPolicies: "নীতিমালা",
  navCirculars: "বিজ্ঞপ্তি",
  navCalendar: "ক্যালেন্ডার",
  navServices: "সেবা",
  askButton: "জিজ্ঞাসা করুন",
  downloadHallTicket: "হল টিকিট ডাউনলোড করুন",
});

const guDict = createLangDict({
  appName: "વિદ્યાર્થી સહાય કેન્દ્ર",
  badge: "એજન્ટ 65",
  heroTitle: "તમારી યુનિવર્સિટી, માત્ર એક વાતચીતમાં.",
  heroSubtitle: "હાજરી, પરીક્ષાઓ, ગુણ અને ફી વિશે તાત્કાલિક માહિતી મેળવો.",
  onlineStatus: "સહાય કેન્દ્ર ઓનલાઇન",
  searchPlaceholder: "હાજરી, પરીક્ષા, ફી વિશે પૂછો...",
  connectedBadge: "કનેક્ટેડ · VFSTR",
  signIn: "સાઇન ઇન",
  signOut: "સાઇન આઉટ",
  welcomeBack: "સ્વાગત છે",
  sectionOverview: "ઝાંખી",
  sectionAcademics: "શૈક્ષણિક",
  navHome: "મુખ્ય પૃષ્ઠ",
  navAttendance: "હાજરી",
  navMarks: "ગુણ",
  navTimetable: "સમયપત્રક",
  navExams: "પરીક્ષાઓ",
  navFees: "ફી",
  navCurriculum: "અભ્યાસક્રમ",
  navPolicies: "નિયમો",
  navCirculars: "પરિપત્રો",
  navCalendar: "કેલેન્ડર",
  navServices: "સેવાઓ",
  askButton: "પૂછો",
  downloadHallTicket: "હોલ ટિકિટ ડાઉનલોડ કરો",
});

const paDict = createLangDict({
  appName: "ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਕੇਂਦਰ",
  badge: "ਏਜੰਟ 65",
  heroTitle: "ਤੁਹਾਡੀ ਯੂਨੀਵਰਸਿਟੀ, ਇਕੋ ਗੱਲਬਾਤ ਵਿੱਚ।",
  heroSubtitle: "ਹਾਜ਼ਰੀ, ਪ੍ਰੀਖਿਆਵਾਂ, ਅੰਕਾਂ ਅਤੇ ਫੀਸਾਂ ਬਾਰੇ ਪੁੱਛੋ।",
  onlineStatus: "ਸਹਾਇਤਾ ਕੇਂਦਰ ਆਨਲਾਈਨ",
  searchPlaceholder: "ਹਾਜ਼ਰੀ, ਪ੍ਰੀਖਿਆ, ਫੀਸ ਬਾਰੇ ਪੁੱਛੋ...",
  connectedBadge: "ਕਨੈਕਟਡ · VFSTR",
  signIn: "ਸਾਈਨ ਇਨ",
  signOut: "ਸਾਈਨ ਆਊਟ",
  welcomeBack: "ਜੀ ਆਇਆਂ ਨੂੰ",
  sectionOverview: "ਸੰਖੇਪ",
  sectionAcademics: "ਅਕਾਦਮਿਕ",
  navHome: "ਮੁੱਖ ਪੰਨਾ",
  navAttendance: "ਹਾਜ਼ਰੀ",
  navMarks: "ਅੰਕ",
  navTimetable: "ਸਮਾਂ ਸਾਰਣੀ",
  navExams: "ਪ੍ਰੀਖਿਆਵਾਂ",
  navFees: "ਫੀਸ",
  navCurriculum: "ਪਾਠਕ੍ਰਮ",
  navPolicies: "ਨੀਤੀਆਂ",
  navCirculars: "ਸਰਕੂਲਰ",
  navCalendar: "ਕੈਲੰਡਰ",
  navServices: "ਸੇਵਾਵਾਂ",
  askButton: "ਪੁੱਛੋ",
  downloadHallTicket: "ਹਾਲ ਟਿਕਟ ਡਾਊਨਲੋਡ ਕਰੋ",
});

const orDict = createLangDict({
  appName: "ଛାତ୍ର ସହାୟତା କେନ୍ଦ୍ର",
  badge: "ଏଜେଣ୍ଟ 65",
  heroTitle: "ଆପଣଙ୍କ ବିଶ୍ୱବିଦ୍ୟାଳୟ, ଗୋଟିଏ ବାର୍ତ୍ତାଳାପରେ।",
  heroSubtitle: "ଉପସ୍ଥିତି, ପରୀକ୍ଷା, ମାର୍କ ଏବଂ ଫି ବିଷୟରେ ପଚାରନ୍ତୁ।",
  onlineStatus: "ସହାୟତା କେନ୍ଦ୍ର ସକ୍ରିୟ",
  searchPlaceholder: "ଉପସ୍ଥିତି, ପରୀକ୍ଷା, ଫି ବିଷୟରେ ପଚାରନ୍ତୁ...",
  connectedBadge: "ସଂଯୁକ୍ତ · VFSTR",
  signIn: "ଲଗ୍ ଇନ୍",
  signOut: "ଲଗ୍ ଆଉଟ୍",
  welcomeBack: "ସ୍ୱାଗତ",
  navHome: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
  navAttendance: "ଉପସ୍ଥିତି",
  navMarks: "ମାର୍କ",
  navTimetable: "ସମୟ ସାରଣୀ",
  navExams: "ପରୀକ୍ଷା",
  navFees: "ଫିସ୍",
  navCurriculum: "ପାଠ୍ୟକ୍ରମ",
  navPolicies: "ନିୟମାବଳୀ",
  navCirculars: "ସର୍କୁଲାର",
  navCalendar: "କ୍ୟାଲେଣ୍ଡର",
  navServices: "ସେବା",
  askButton: "ପଚାରନ୍ତୁ",
  downloadHallTicket: "ହଲ୍ ଟିକେଟ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ",
});

const asDict = createLangDict({
  appName: "ছাত্ৰ সহায়তা কেন্দ্ৰ",
  badge: "এজেণ্ট 65",
  heroTitle: "আপোনাৰ বিশ্ববিদ্যালয়, এটা বাৰ্তালাপতে।",
  heroSubtitle: "উপস্থিতি, পৰীক্ষা, নম্বৰ আৰু মাচুল সম্পৰ্কে জানক।",
  onlineStatus: "সহায়তা কেন্দ্ৰ সক্ৰিয়",
  searchPlaceholder: "উপস্থিতি, পৰীক্ষা, মাচুল সম্পৰ্কে সোধক...",
  connectedBadge: "সংযুক্ত · VFSTR",
  signIn: "ছাইন ইন",
  signOut: "ছাইন আউট",
  welcomeBack: "স্বাগতম",
  navHome: "মূল পৃষ্ঠা",
  navAttendance: "উপস্থিতি",
  navMarks: "নম্বৰ",
  navTimetable: "সময়সূচী",
  navExams: "পৰীক্ষা",
  navFees: "মাচুল",
  navCurriculum: "পাঠ্যক্ৰম",
  navPolicies: "নীতিসমূহ",
  navCirculars: "জাননী",
  navCalendar: "কেলেণ্ডাৰ",
  navServices: "সেৱাসমূহ",
  askButton: "সোধক",
  downloadHallTicket: "হল টিকেট ডাউনলোড কৰক",
});

const urDict = createLangDict({
  appName: "طلباء ہیلپ ڈیسک",
  badge: "ایجنٹ 65",
  heroTitle: "آپ کی یونیورسٹی، ایک گفتگو کے فاصلے پر۔",
  heroSubtitle: "اپنی حاضری، امتحانات، نمبرات اور فیس کے بارے میں دریافت کریں۔",
  onlineStatus: "طلباء ہیلپ ڈیسک آن لائن",
  searchPlaceholder: "حاضری، امتحانات، فیس کے متعلق پوچھیں...",
  connectedBadge: "منسلک · VFSTR",
  signIn: "سائن ان",
  signOut: "سائن آؤٹ",
  welcomeBack: "خوش آمدید",
  sectionOverview: "جائزہ",
  sectionAcademics: "تعلیمی",
  navHome: "ہوم",
  navAttendance: "حاضری",
  navMarks: "نمبرات",
  navTimetable: "ٹائم ٹیبل",
  navExams: "امتحانات",
  navFees: "فیس",
  navCurriculum: "نصاب",
  navPolicies: "پالیسیاں",
  navCirculars: "سرکلرز",
  navCalendar: "کیلنڈر",
  navServices: "خدمات",
  askButton: "پوچھیں",
  downloadHallTicket: "ہال ٹکٹ ڈاؤن لوڈ کریں",
});

const saDict = createLangDict({
  appName: "छात्र साहाय्य केन्द्रम्",
  badge: "अभिकर्ता 65",
  heroTitle: "भवतः विश्वविद्यालयः, एकस्मिन् संवादे।",
  heroSubtitle: "उपस्थितिम्, परीक्षाः, अङ्कान्, शुल्कं च पृच्छतु।",
  onlineStatus: "साहाय्य केन्द्रं सक्रियम्",
  searchPlaceholder: "उपस्थितिम्, परीक्षाः, शुल्कं च पृच्छतु...",
  connectedBadge: "संबद्धम् · VFSTR",
  signIn: "प्रवेशः",
  signOut: "निर्गमनम्",
  welcomeBack: "स्वागतम्",
  navHome: "मुखपृष्ठम्",
  navAttendance: "उपस्थितिः",
  navMarks: "अङ्काः",
  navTimetable: "समयसारिणी",
  navExams: "परीक्षाः",
  navFees: "शुल्कम्",
  navCurriculum: "पाठ्यक्रमः",
  navPolicies: "नियमाः",
  navCirculars: "परिपत्राणि",
  navCalendar: "दिनदर्शिका",
  navServices: "सेवाः",
  askButton: "पृच्छतु",
  downloadHallTicket: "प्रवेशपत्रं डाउनलोड् कुर्वन्तु",
});

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: enDict,
  te: teDict,
  hi: hiDict,
  ta: taDict,
  kn: knDict,
  ml: mlDict,
  mr: mrDict,
  bn: bnDict,
  gu: guDict,
  pa: paDict,
  or: orDict,
  as: asDict,
  ur: urDict,
  sa: saDict,
  ne: createLangDict({ navHome: "गृहपृष्ठ", navAttendance: "उपस्थिति", navMarks: "अङ्क", navExams: "परीक्षा", navFees: "शुल्क", askButton: "सोध्नुहोस्", downloadHallTicket: "प्रवेशपत्र डाउनलोड गर्नुहोस्" }),
  kok: createLangDict({ navHome: "मुखपृष्ठ", navAttendance: "हाजरी", navMarks: "गुण", navExams: "परीक्षा", navFees: "शुल्क", askButton: "विचारात", downloadHallTicket: "हॉल तिकीट डाउनलोड करा" }),
  ks: createLangDict({ navHome: "ہوم", navAttendance: "حاضری", navMarks: "نمبر", navExams: "امتحان", askButton: "پریچھِو", downloadHallTicket: "ہال ٹکٹ ڈاؤن لوڈ کٔرِو" }),
  sd: createLangDict({ navHome: "مکيه صفحو", navAttendance: "حاضري", navMarks: "مارڪون", navExams: "امتحان", askButton: "پڇو", downloadHallTicket: "هال ٽڪيٽ ڊائون لوڊ ڪريو" }),
  doi: createLangDict({ navHome: "मुक्ख पन्ना", navAttendance: "हाजरी", navMarks: "नंबर", navExams: "परीक्षा", askButton: "पुच्छो", downloadHallTicket: "हाल टिकट डाउनलोड करो" }),
  mai: createLangDict({ navHome: "मुख्य पृष्ठ", navAttendance: "उपस्थिति", navMarks: "अंक", navExams: "परीक्षा", askButton: "पूछू", downloadHallTicket: "हॉल टिकट डाउनलोड करू" }),
  mni: createLangDict({ navHome: "য়ূম", navAttendance: "উপস্থিতি", navMarks: "মার্ক", navExams: "পরীক্ষা", askButton: "হংবীয়ু", downloadHallTicket: "হোল টিকেট ডাউনলোড তৌবীয়ু" }),
  sat: createLangDict({ navHome: "ᱚᱲᱟᱜ", navAttendance: "ᱦᱟᱡᱤᱨ", navMarks: "ᱱᱚᱢᱵᱚᱨ", navExams: "ᱵᱤᱱᱤᱰ", askButton: "ᱠᱩᱞᱤ", downloadHallTicket: "ᱦᱚᱞ ᱴᱤᱠᱮᱴ ᱰᱟᱣᱩᱱᱞᱳᱰ" }),
  brx: createLangDict({ navHome: "न'खर", navAttendance: "हाजिरा", navMarks: "नम्बर", navExams: "आनजाद", askButton: "सों", downloadHallTicket: "हल टिकिट डाउनलोड खालाम" }),
};
