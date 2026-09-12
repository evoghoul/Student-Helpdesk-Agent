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

  // Navigation
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
  signOut: string;

  // Snapshot & Hero
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

    navHome: "Home",
    navProfile: "My Profile",
    navAttendance: "Attendance",
    navMarks: "Marks",
    navTimetable: "Timetable",
    navExams: "Exams",
    navFees: "Fees",
    navCurriculum: "Curriculum",
    navPolicies: "Policies",
    navCirculars: "Circulars",
    navCalendar: "Calendar",
    navServices: "Services",
    signOut: "Sign Out",

    snapshotTitle: "My Academic Snapshot",
    nextClass: "Next Class",
    nextExam: "Next Exam",
    attendanceWatch: "Attendance Watch",
    totalCredits: "Total Credits",
    viewFullSchedule: "View Full Schedule",
    statAttendedRatio: "Attended Ratio",
    statActiveSubjects: "Active Subjects",
    statCgpa: "Cumulative CGPA",

    timetableTitle: "Class Timetable",
    timetableSubtitle: "Section 7 (Room N-312)",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    currentClass: "Current Class",
    upcomingClass: "Next Class",
    completedClass: "Completed",
    room: "Room",
    faculty: "Faculty",
    coordinator: "Timetable Coordinator",
    classTeacher: "Class Teacher",

    chatTitle: "Student Helpdesk",
    chatSubtitle: "Ask anything about your university experience.",
    chatPlaceholder: "Ask anything about attendance, exams, marks, timetable, fees, or policies...",
    askButton: "Ask",
    modelLow: "Low",
    modelLowDesc: "Fast replies · 3B Model (~3s)",
    modelHigh: "High",
    modelHighDesc: "Accurate & deep · 8B Model (~15s)",
    micListening: "Listening... speak now",
    micStart: "Click to speak with voice",
    coreActive: "Agent 65 Core Active",
    retrievingRecords: "Retrieving authorized records from Institutional agents...",
    quickActionsTitle: "Quick Enquiries",
    contextualActionsTitle: "Contextual Actions",

    quickMyAttendance: "My attendance",
    quickNextExam: "Next exam",
    quickMyMarks: "My marks",
    quickTodayTimetable: "Today's timetable",
    quickFeeStatus: "My fee status",
    quickCurriculum: "My curriculum",
    quickCirculars: "Latest circulars",
    quickPolicies: "University policies",
    quickCalendar: "Academic calendar",
    quickServices: "Student services",

    chipBelow75: "Show subjects below 75% attendance",
    chipUpcomingAssessments: "Show my upcoming assessments",
    chipExplainCurriculum: "Explain my curriculum",
    chipRaiseService: "Raise a service request",
    chipBookMentor: "Book a mentor meeting",
    chipRaiseGrievance: "Raise a grievance",

    openAttendanceDrawer: "Open Attendance Detail Drawer",
    viewExamSchedule: "View Full Examination Schedule",
    viewGradeLedger: "View Grade Ledger",
    downloadHallTicket: "Download Hall Ticket Verification",
    statusHealthy: "Healthy",
    statusAttention: "Attention Required",
    statusResolved: "Resolved",
    statusInProgress: "In Progress",

    needHumanHelp: "Need human help?",
    distressTitle: "We're here to help.",
    distressBody: "Your message suggests you may need additional support. You can connect immediately with a student counselor or support professional.",
    talkToHuman: "Talk to a Human",
    connectSupport: "Connect to Student Support",
    emergencyHelp: "Emergency Help",
};

const teDict: TranslationDictionary = {
appName: "స్టూడెంట్ హెల్ప్‌డెస్క్",
    badge: "ఏజెంట్ 65",
    heroTitle: "మీ విశ్వవిద్యాలయం, ఒక్క సంభాషణ దూరంలో.",
    heroSubtitle: "మీ హాజరు, పరీక్షలు, టైమ్‌టేబుల్, ఫీజులు మరియు సేవల వివరాలను సురక్షితమైన స్టూడెంట్ హెల్ప్‌డెస్క్ ద్వారా తెలుసుకోండి.",
    onlineStatus: "స్టూడెంట్ హెల్ప్‌డెస్క్ ఆన్‌లైన్",
    secureConnection: "మీ విద్యార్థి ప్రొఫైల్‌కు సురక్షితంగా అనుసంధానించబడింది",
    authenticatedLabel: "ధృవీకరించబడింది",
    viewingRecord: "విద్యార్థి రికార్డును వీక్షిస్తున్నారు",
    rlsBadge: "RLS ధృవీకృతం",
    resetSession: "రీసెట్",
    restoreSession: "పునరుద్ధరించు",
    close: "మూసివేయి",
    searchPlaceholder: "హాజరు, పరీక్షలు, మార్కులు, ఫీజుల గురించి అడగండి...",

    navHome: "హోమ్",
    navProfile: "నా ప్రొఫైల్",
    navAttendance: "హాజరు",
    navMarks: "మార్కులు",
    navTimetable: "టైమ్‌టేబుల్",
    navExams: "పరీక్షలు",
    navFees: "ఫీజులు",
    navCurriculum: "పాఠ్యప్రణాళిక",
    navPolicies: "విధానాలు",
    navCirculars: "సర్క్యులర్లు",
    navCalendar: "క్యాలెండర్",
    navServices: "సేవలు",
    signOut: "లాగ్ అవుట్",

    snapshotTitle: "నా విద్యా సమాచారం",
    nextClass: "తదుపరి తరగతి",
    nextExam: "తదుపరి పరీక్ష",
    attendanceWatch: "హాజరు పరిశీలన",
    totalCredits: "మొత్తం క్రెడిట్లు",
    viewFullSchedule: "పూర్తి షెడ్యూల్ చూడండి",
    statAttendedRatio: "హాజరు నిష్పత్తి",
    statActiveSubjects: "యాక్టివ్ సబ్జెక్టులు",
    statCgpa: "CGPA గ్రేడ్",

    timetableTitle: "తరగతి టైమ్‌టేబుల్",
    timetableSubtitle: "సెక్షన్ 7 (గది N-312)",
    monday: "సోమవారం",
    tuesday: "మంగళవారం",
    wednesday: "బుధవారం",
    thursday: "గురువారం",
    friday: "శుక్రవారం",
    saturday: "శనివారం",
    currentClass: "ప్రస్తుత తరగతి",
    upcomingClass: "తదుపరి తరగతి",
    completedClass: "పూర్తయింది",
    room: "గది",
    faculty: "అధ్యాపకులు",
    coordinator: "టైమ్‌టేబుల్ కోఆర్డినేటర్",
    classTeacher: "క్లాస్ టీచర్",

    chatTitle: "స్టూడెంట్ హెల్ప్‌డెస్క్",
    chatSubtitle: "మీ విశ్వవిద్యాలయ సందేహాలన్నింటినీ ఇక్కడ అడగండి.",
    chatPlaceholder: "హాజరు, పరీక్షలు, మార్కులు, ఫీజులు లేదా విధానాల గురించి ఏదైనా అడగండి...",
    askButton: "అడగండి",
    modelLow: "లో (వేగం)",
    modelLowDesc: "వేగవంతమైన సమాధానాలు · 3B మోడల్ (~3సె)",
    modelHigh: "హై (ఖచ్చితం)",
    modelHighDesc: "లోతైన & ఖచ్చితమైన సమాధానాలు · 8B మోడల్ (~15సె)",
    micListening: "వింటున్నాను... మాట్లాడండి",
    micStart: "వాయిస్‌తో మాట్లాడటానికి క్లిక్ చేయండి",
    coreActive: "ఏజెంట్ 65 యాక్టివ్",
    retrievingRecords: "అధికారిక రికార్డులను సేకరిస్తున్నాము...",
    quickActionsTitle: "త్వరిత ప్రశ్నలు",
    contextualActionsTitle: "సహాయక చర్యలు",

    quickMyAttendance: "నా హాజరు",
    quickNextExam: "తదుపరి పరీక్ష",
    quickMyMarks: "నా మార్కులు",
    quickTodayTimetable: "నేటి టైమ్‌టేబుల్",
    quickFeeStatus: "నా ఫీజు స్థితి",
    quickCurriculum: "నా సిలబస్",
    quickCirculars: "తాజా సర్క్యులర్లు",
    quickPolicies: "యూనివర్సిటీ విధానాలు",
    quickCalendar: "విద్యా క్యాలెండర్",
    quickServices: "విద్యార్థి సేవలు",

    chipBelow75: "75% కన్నా తక్కువ ఉన్న సబ్జెక్టులు చూపించు",
    chipUpcomingAssessments: "రాబోయే పరీక్షలు చూపించు",
    chipExplainCurriculum: "పాఠ్యప్రణాళిక వివరించు",
    chipRaiseService: "సర్వీస్ రిక్వెస్ట్ చేయండి",
    chipBookMentor: "మెంటార్ అపాయింట్‌మెంట్ తీసుకోండి",
    chipRaiseGrievance: "ఫిర్యాదు నమోదు చేయండి",

    openAttendanceDrawer: "పూర్తి హాజరు వివరాలు చూడండి",
    viewExamSchedule: "పూర్తి పరీక్ష షెడ్యూల్ చూడండి",
    viewGradeLedger: "మార్కుల పట్టిక చూడండి",
    downloadHallTicket: "హాల్ టికెట్ ధృవీకరణ పొందండి",
    statusHealthy: "సంతృప్తికరం",
    statusAttention: "శ్రద్ధ అవసరం",
    statusResolved: "పరిష్కరించబడింది",
    statusInProgress: "పురోగతిలో ఉంది",

    needHumanHelp: "వ్యక్తిగత సహాయం కావాలా?",
    distressTitle: "మేము మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాము.",
    distressBody: "మీ సందేశం మానసిక ఒత్తిడిని సూచిస్తోంది. మీరు తక్షణమే మా క్యాంపస్ కౌన్సెలర్‌ను సంప్రదించవచ్చు.",
    talkToHuman: "కౌన్సెలర్‌తో మాట్లాడండి",
    connectSupport: "స్టూడెంట్ సపోర్ట్‌ను సంప్రదించండి",
    emergencyHelp: "అత్యవసర సహాయం",
};

const hiDict: TranslationDictionary = {
appName: "छात्र हेल्पडेस्क",
    badge: "एजेंट 65",
    heroTitle: "आपका विश्वविद्यालय, बस एक संवाद की दूरी पर।",
    heroSubtitle: "अपनी उपस्थिति, परीक्षा, समय सारिणी, फीस और विश्वविद्यालय सेवाओं की जानकारी एक सुरक्षित छात्र हेल्पडेस्क पर प्राप्त करें।",
    onlineStatus: "छात्र हेल्पडेस्क ऑनलाइन",
    secureConnection: "आपकी छात्र प्रोफ़ाइल से सुरक्षित रूप से जुड़ा हुआ",
    authenticatedLabel: "प्रमाणित",
    viewingRecord: "छात्र रिकॉर्ड देखा जा रहा है",
    rlsBadge: "RLS सत्यापित",
    resetSession: "रीसेट",
    restoreSession: "पुनर्स्थापित करें",
    close: "बंद करें",
    searchPlaceholder: "उपस्थिति, परीक्षा, अंक, फीस आदि के बारे में पूछें...",

    navHome: "होम",
    navProfile: "मेरी प्रोफ़ाइल",
    navAttendance: "उपस्थिति",
    navMarks: "अंक",
    navTimetable: "समय सारिणी",
    navExams: "परीक्षाएं",
    navFees: "शुल्क (फीस)",
    navCurriculum: "पाठ्यक्रम",
    navPolicies: "नियम व नीतियां",
    navCirculars: "परिपत्र (सर्कुलर)",
    navCalendar: "कैलेंडर",
    navServices: "सेवाएं",
    signOut: "लॉग आउट",

    snapshotTitle: "मेरा शैक्षणिक सारांश",
    nextClass: "अगली कक्षा",
    nextExam: "अगली परीक्षा",
    attendanceWatch: "उपस्थिति सतर्कता",
    totalCredits: "कुल क्रेडिट",
    viewFullSchedule: "पूर्ण समय सारिणी देखें",
    statAttendedRatio: "उपस्थिति अनुपात",
    statActiveSubjects: "सक्रिय विषय",
    statCgpa: "कुल CGPA",

    timetableTitle: "कक्षा समय सारिणी",
    timetableSubtitle: "सेक्शन 7 (कमरा N-312)",
    monday: "सोमवार",
    tuesday: "मंगलवार",
    wednesday: "बुधवार",
    thursday: "गुरुवार",
    friday: "शुक्रवार",
    saturday: "शनिवार",
    currentClass: "वर्तमान कक्षा",
    upcomingClass: "अगली कक्षा",
    completedClass: "समाप्त",
    room: "कमरा",
    faculty: "प्राध्यापक (फैकल्टी)",
    coordinator: "समय सारिणी समन्वयक",
    classTeacher: "कक्षा अध्यापक",

    chatTitle: "छात्र हेल्पडेस्क",
    chatSubtitle: "अपने विश्वविद्यालय संबंधी किसी भी विषय पर पूछें।",
    chatPlaceholder: "उपस्थिति, परीक्षा, अंक, समय सारिणी, फीस या नीतियों के बारे में कुछ भी पूछें...",
    askButton: "पूछें",
    modelLow: "लो (तीव्र)",
    modelLowDesc: "तीव्र उत्तर · 3B मॉडल (~3सेकंड)",
    modelHigh: "हाई (सटीक)",
    modelHighDesc: "गहन और सटीक उत्तर · 8B मॉडल (~15सेकंड)",
    micListening: "सुन रहा हूँ... अब बोलिए",
    micStart: "आवाज से बोलने के लिए क्लिक करें",
    coreActive: "एजेंट 65 सक्रिय",
    retrievingRecords: "संस्थागत एजेंटों से अधिकृत रिकॉर्ड प्राप्त किए जा रहे हैं...",
    quickActionsTitle: "त्वरित पूछताछ",
    contextualActionsTitle: "सहायक विकल्प",

    quickMyAttendance: "मेरी उपस्थिति",
    quickNextExam: "अगली परीक्षा",
    quickMyMarks: "मेरे अंक",
    quickTodayTimetable: "आज की समय सारिणी",
    quickFeeStatus: "मेरी फीस स्थिति",
    quickCurriculum: "मेरा पाठ्यक्रम",
    quickCirculars: "नवीनतम परिपत्र",
    quickPolicies: "विश्वविद्यालय नीतियां",
    quickCalendar: "शैक्षणिक कैलेंडर",
    quickServices: "छात्र सेवाएं",

    chipBelow75: "75% से कम उपस्थिति वाले विषय दिखाएं",
    chipUpcomingAssessments: "आगामी मूल्यांकन दिखाएं",
    chipExplainCurriculum: "मेरा पाठ्यक्रम समझाएं",
    chipRaiseService: "सेवा अनुरोध दर्ज करें",
    chipBookMentor: "मेंटर से मिलने का समय लें",
    chipRaiseGrievance: "शिकायत दर्ज करें",

    openAttendanceDrawer: "विस्तृत उपस्थिति विवरण खोलें",
    viewExamSchedule: "पूर्ण परीक्षा समय सारिणी देखें",
    viewGradeLedger: "अंक तालिका देखें",
    downloadHallTicket: "हॉल टिकट सत्यापन डाउनलोड करें",
    statusHealthy: "संतोषजनक",
    statusAttention: "ध्यान देने योग्य",
    statusResolved: "समाधानित",
    statusInProgress: "प्रगति पर",

    needHumanHelp: "मानवीय सहायता चाहिए?",
    distressTitle: "हम आपकी सहायता के लिए उपस्थित हैं।",
    distressBody: "आपके संदेश से प्रतीत होता है कि आपको अतिरिक्त मानसिक या शैक्षणिक समर्थन की आवश्यकता है। आप तुरंत छात्र परामर्शदाता से संपर्क कर सकते हैं।",
    talkToHuman: "परामर्शदाता से बात करें",
    connectSupport: "छात्र सहायता से जुड़ें",
    emergencyHelp: "आपातकालीन सहायता",
};

function createLangDict(overrides: Partial<TranslationDictionary>): TranslationDictionary {
  return { ...enDict, ...overrides };
}

// -------------------------------------------------------------
// Official Scheduled Languages Dictionaries
// -------------------------------------------------------------
const taDict = createLangDict({
  appName: "மாணவர் உதவி மையம்",
  badge: "ஏஜென்ட் 65",
  heroTitle: "உங்கள் பல்கலைக்கழகம், ஒரே உரையாடலில்.",
  heroSubtitle: "உங்கள் வருகைப்பதிவு, தேர்வுகள், மதிப்பெண்கள் மற்றும் கொள்கைகள் பற்றி நேரடியாக கேளுங்கள்.",
  onlineStatus: "மாணவர் உதவி மையம் இயங்குகிறது",
  searchPlaceholder: "வருகைப்பதிவு, தேர்வுகள், கட்டணம் பற்றி கேளுங்கள்...",
  navHome: "முகப்பு",
  navAttendance: "வருகைப்பதிவு",
  navMarks: "மதிப்பெண்கள்",
  navTimetable: "நேர அட்டவணை",
  navExams: "தேர்வுகள்",
  navFees: "கட்டணம்",
  navCurriculum: "பாடத்திட்டம்",
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
  needHumanHelp: "உதவி தேவையா?",
});

const knDict = createLangDict({
  appName: "ವಿದ್ಯಾರ್ಥಿ ಸಹಾಯವಾಣಿ",
  badge: "ಏಜೆಂಟ್ 65",
  heroTitle: "ನಿಮ್ಮ ವಿಶ್ವವಿದ್ಯಾಲಯ, ಒಂದೇ ಸಂಭಾಷಣೆಯಲ್ಲಿ.",
  heroSubtitle: "ನಿಮ್ಮ ಹಾಜರಾತಿ, ಪರೀಕ್ಷೆಗಳು, ಅಂಕಗಳು ಮತ್ತು ಶುಲ್ಕಗಳ ಬಗ್ಗೆ ನೇರವಾಗಿ ಕೇಳಿ.",
  onlineStatus: "ಸಹಾಯವಾಣಿ ಸಕ್ರಿಯವಾಗಿದೆ",
  searchPlaceholder: "ಹಾಜರಾತಿ, ಪರೀಕ್ಷೆಗಳು, ಶುಲ್ಕಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
  navHome: "ಮುಖಪುಟ",
  navAttendance: "ಹಾಜರಾತಿ",
  navMarks: "ಅಂಕಗಳು",
  navTimetable: "ವೇಳಾಪಟ್ಟಿ",
  navExams: "ಪರೀಕ್ಷೆಗಳು",
  navFees: "ಶುಲ್ಕ",
  navCurriculum: "ಪಠ್ಯಕ್ರಮ",
  chatPlaceholder: "ಹಾಜರಾತಿ, ಪರೀಕ್ಷೆ, ಅಂಕ, ಶುಲ್ಕದ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ...",
  askButton: "ಕೇಳಿ",
  modelLow: "ವೇಗ (3B)",
  modelHigh: "ನಿಖರ (8B)",
  micListening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡಿ",
  micStart: "ಧ್ವನಿಯಲ್ಲಿ ಮಾತನಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
  monday: "ಸೋಮವಾರ",
  tuesday: "ಮಂಗಳವಾರ",
  wednesday: "ಬುಧವಾರ",
  thursday: "ಗುರುವಾರ",
  friday: "ಶುಕ್ರವಾರ",
  saturday: "ಶನಿವಾರ",
  needHumanHelp: "ಮಾನವ ನೆರವು ಬೇಕೇ?",
});

const mlDict = createLangDict({
  appName: "വിദ്യാർത്ഥി ഹെൽപ്പ് ഡെസ്ക്",
  badge: "ഏജന്റ് 65",
  heroTitle: "നിങ്ങളുടെ സർവകലാശാല, ഒരു സംഭാഷണത്തിൽ.",
  heroSubtitle: "നിങ്ങളുടെ ഹാജർ, പരീക്ഷകൾ, മാർക്കുകൾ, ഫീസ് എന്നിവയെക്കുറിച്ച് ചോദിക്കുക.",
  onlineStatus: "ഹെൽപ്പ് ഡെസ്ക് സജീവം",
  searchPlaceholder: "ഹാജർ, പരീക്ഷകൾ, ഫീസ് എന്നിവ ചോദിക്കുക...",
  navHome: "ഹോം",
  navAttendance: "ഹാജർ",
  navMarks: "മാർക്കുകൾ",
  navTimetable: "ടൈംടേബിൾ",
  navExams: "പരീക്ഷകൾ",
  navFees: "ഫീസ്",
  navCurriculum: "പാഠ്യപദ്ധതി",
  chatPlaceholder: "ഹാജർ, പരീക്ഷ, മാർക്കുകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...",
  askButton: "ചോദിക്കൂ",
  modelLow: "വേഗത (3B)",
  modelHigh: "കൃത്യത (8B)",
  micListening: "കേൾക്കുന്നു... സംസാരിക്കൂ",
  micStart: "സംസാരിക്കാൻ ക്ലിക്ക് ചെയ്യുക",
  monday: "തിങ്കൾ",
  tuesday: "ചൊവ്വ",
  wednesday: "ബുധൻ",
  thursday: "വ്യാഴം",
  friday: "വെള്ളി",
  saturday: "ശനി",
  needHumanHelp: "സഹായം ആവശ്യമുണ്ടോ?",
});

const mrDict = createLangDict({
  appName: "विद्यार्थी हेल्पडेस्क",
  badge: "एजंट 65",
  heroTitle: "आपले विद्यापीठ, एका संवादात.",
  heroSubtitle: "आपली उपस्थिती, परीक्षा, गुण आणि शुल्काबद्दल थेट विचारा.",
  onlineStatus: "हेल्पडेस्क सक्रिय",
  searchPlaceholder: "उपस्थिती, परीक्षा, शुल्क विचारा...",
  navHome: "मुख्यपृष्ठ",
  navAttendance: "हजेरी",
  navMarks: "गुण",
  navTimetable: "वेळापत्रक",
  navExams: "परीक्षा",
  navFees: "शुल्क",
  navCurriculum: "अभ्यासक्रम",
  chatPlaceholder: "उपस्थिती, परीक्षा, गुण किंवा शुल्काबद्दल विचारा...",
  askButton: "विचारा",
  modelLow: "जलद (3B)",
  modelHigh: "अचूक (8B)",
  micListening: "ऐकत आहे... बोला",
  micStart: "बोलण्यासाठी क्लिक करा",
  monday: "सोमवार",
  tuesday: "मंगळवार",
  wednesday: "बुधवार",
  thursday: "गुरुवार",
  friday: "शुक्रवार",
  saturday: "शनिवार",
  needHumanHelp: "मानवी मदत हवी आहे?",
});

const bnDict = createLangDict({
  appName: "স্টুডেন্ট হেল্পডেস্ক",
  badge: "এজেন্ট ৬৫",
  heroTitle: "আপনার বিশ্ববিদ্যালয়, এক কথোপকথনে।",
  heroSubtitle: "আপনার উপস্থিতি, পরীক্ষা, নম্বর এবং ফি সংক্রান্ত যেকোনো প্রশ্ন করুন।",
  onlineStatus: "হেল্পডেস্ক সক্রিয়",
  searchPlaceholder: "উপস্থিতি, পরীক্ষা, ফি সম্পর্কে জিজ্ঞাসা করুন...",
  navHome: "হোম",
  navAttendance: "উপস্থিতি",
  navMarks: "নম্বর",
  navTimetable: "রুটিন",
  navExams: "পরীক্ষা",
  navFees: "ফি",
  navCurriculum: "পাঠ্যক্রম",
  chatPlaceholder: "উপস্থিতি, পরীক্ষা, নম্বর বা ফি সম্পর্কে জিজ্ঞাসা করুন...",
  askButton: "জিজ্ঞাসা করুন",
  modelLow: "দ্রুত (3B)",
  modelHigh: "নির্ভুল (8B)",
  micListening: "শুনছি... বলুন",
  micStart: "বলতে ক্লিক করুন",
  monday: "সোমবার",
  tuesday: "মঙ্গলবার",
  wednesday: "বুধবার",
  thursday: "বৃহস্পতিবার",
  friday: "শুক্রবার",
  saturday: "শনিবার",
  needHumanHelp: "মানুষের সাহায্য চান?",
});

const guDict = createLangDict({
  appName: "વિદ્યાર્થી હેલ્પડેસ્ક",
  badge: "એજન્ટ 65",
  heroTitle: "તમારી યુનિવર્સિટી, એક જ વાતચીતમાં.",
  heroSubtitle: "તમારી હાજરી, પરીક્ષાઓ, ગુણ અને ફી વિશે સીધા પૂછો.",
  onlineStatus: "હેલ્પડેસ્ક સક્રિય",
  searchPlaceholder: "હાજરી, પરીક્ષાઓ, ફી વિશે પૂછો...",
  navHome: "મુખ્ય પૃષ્ઠ",
  navAttendance: "હાજરી",
  navMarks: "ગુણ",
  navTimetable: "સમયપત્રક",
  navExams: "પરીક્ષાઓ",
  navFees: "ફી",
  navCurriculum: "અભ્યાસક્રમ",
  chatPlaceholder: "હાજરી, પરીક્ષા, ગુણ કે ફી વિશે પૂછો...",
  askButton: "પૂછો",
  modelLow: "ઝડપી (3B)",
  modelHigh: "સચોટ (8B)",
  micListening: "સાંભળી રહ્યો છું... બોલો",
  micStart: "બોલવા માટે ક્લિક કરો",
  monday: "સોમવાર",
  tuesday: "મંગળવાર",
  wednesday: "બુધવાર",
  thursday: "ગુરુવાર",
  friday: "શુક્રવાર",
  saturday: "શનિવાર",
  needHumanHelp: "માનવીય મદદ જોઈએ છે?",
});

const paDict = createLangDict({
  appName: "ਵਿਦਿਆਰਥੀ ਹੈਲਪਡੈਸਕ",
  badge: "ਏਜੰਟ 65",
  heroTitle: "ਤੁਹਾਡੀ ਯੂਨੀਵਰਸਿਟੀ, ਇੱਕ ਗੱਲਬਾਤ ਵਿੱਚ।",
  heroSubtitle: "ਆਪਣੀ ਹਾਜ਼ਰੀ, ਪ੍ਰੀਖਿਆਵਾਂ, ਅੰਕ ਅਤੇ ਫੀਸਾਂ ਬਾਰੇ ਪੁੱਛੋ।",
  onlineStatus: "ਹੈਲਪਡੈਸਕ ਸਰਗਰਮ",
  searchPlaceholder: "ਹਾਜ਼ਰੀ, ਪ੍ਰੀਖਿਆਵਾਂ, ਫੀਸ ਬਾਰੇ ਪੁੱਛੋ...",
  navHome: "ਮੁੱਖ ਪੰਨਾ",
  navAttendance: "ਹਾਜ਼ਰੀ",
  navMarks: "ਅੰਕ",
  navTimetable: "ਸਮਾਂ ਸਾਰਣੀ",
  navExams: "ਪ੍ਰੀਖਿਆਵਾਂ",
  navFees: "ਫੀਸ",
  navCurriculum: "ਪਾਠਕ੍ਰਮ",
  chatPlaceholder: "ਹਾਜ਼ਰੀ, ਪ੍ਰੀਖਿਆ ਜਾਂ ਫੀਸ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ...",
  askButton: "ਪੁੱਛੋ",
  modelLow: "ਤੇਜ਼ (3B)",
  modelHigh: "ਸਹੀ (8B)",
  micListening: "ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ",
  micStart: "ਬੋਲਣ ਲਈ ਕਲਿੱਕ ਕਰੋ",
  monday: "ਸੋਮਵਾਰ",
  tuesday: "ਮੰਗਲਵਾਰ",
  wednesday: "ਬੁੱਧਵਾਰ",
  thursday: "ਵੀਰਵਾਰ",
  friday: "ਸ਼ੁੱਕਰਵਾਰ",
  saturday: "ਸ਼ਨੀਵਾਰ",
  needHumanHelp: "ਮਨੁੱਖੀ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
});

const orDict = createLangDict({
  appName: "ଛାତ୍ର ହେଲ୍ପଡେସ୍କ",
  badge: "ଏଜେଣ୍ଟ 65",
  heroTitle: "ଆପଣଙ୍କ ବିଶ୍ୱବିଦ୍ୟାଳୟ, ଗୋଟିଏ ବାର୍ତ୍ତାଳାପରେ।",
  heroSubtitle: "ଆପଣଙ୍କ ଉପସ୍ଥିତି, ପରୀକ୍ଷା, ମାର୍କ ଏବଂ ଫି ବିଷୟରେ ପଚାରନ୍ତୁ।",
  onlineStatus: "ହେଲ୍ପଡେସ୍କ ସକ୍ରିୟ",
  searchPlaceholder: "ଉପସ୍ଥିତି, ପରୀକ୍ଷା, ଫି ବିଷୟରେ ପଚାରନ୍ତୁ...",
  navHome: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
  navAttendance: "ଉପସ୍ଥିତି",
  navMarks: "ମାର୍କ",
  navTimetable: "ସମୟ ସାରଣୀ",
  navExams: "ପରୀକ୍ଷା",
  navFees: "ଫି",
  navCurriculum: "ପାଠ୍ୟକ୍ରମ",
  chatPlaceholder: "ଉପସ୍ଥିତି, ପରୀକ୍ଷା ବା ଫି ସମ୍ପର୍କରେ ପଚାରନ୍ତୁ...",
  askButton: "ପଚାରନ୍ତୁ",
  modelLow: "ଦ୍ରୁତ (3B)",
  modelHigh: "ସଠିକ (8B)",
  micListening: "ଶୁଣୁଛି... କୁହନ୍ତୁ",
  micStart: "କୁହିବା ପାଇଁ କ୍ଲିକ୍ କରନ୍ତୁ",
  monday: "ସୋମବାର",
  tuesday: "ମଙ୍ଗଳବାର",
  wednesday: "ବୁଧବାର",
  thursday: "ଗୁରୁବାର",
  friday: "ଶୁକ୍ରବାର",
  saturday: "ଶନିବାର",
  needHumanHelp: "ସାହାଯ୍ୟ ଦରକାର କି?",
});

const asDict = createLangDict({
  appName: "ছাত্ৰ হেল্পডেস্ক",
  badge: "এজেণ্ট ৬৫",
  heroTitle: "আপোনাৰ বিশ্ববিদ্যালয়, এটা বাৰ্তালাপত।",
  heroSubtitle: "আপোনাৰ উপস্থিতি, পৰীক্ষা, নম্বৰ আৰু মাচুল সম্পৰ্কে সোধক।",
  onlineStatus: "হেল্পডেস্ক সক্ৰিয়",
  searchPlaceholder: "উপস্থিতি, পৰীক্ষা, মাচুল সোধক...",
  navHome: "মূল পৃষ্ঠা",
  navAttendance: "উপস্থিতি",
  navMarks: "নম্বৰ",
  navTimetable: "সময়সূচী",
  navExams: "পৰীক্ষা",
  navFees: "মাচুল",
  navCurriculum: "পাঠ্যক্ৰম",
  chatPlaceholder: "উপস্থিতি, পৰীক্ষা বা মাচুল বিষয়ে সোধক...",
  askButton: "সোধক",
  modelLow: "দ্ৰুত (3B)",
  modelHigh: "সঠিক (8B)",
  micListening: "শুনি আছোঁ... কওক",
  micStart: "ক'বলৈ ক্লিক কৰক",
  monday: "সোমবাৰ",
  tuesday: "মঙ্গলবাৰ",
  wednesday: "বুধবাৰ",
  thursday: "বৃহস্পতিবাৰ",
  friday: "শুক্ৰবাৰ",
  saturday: "শনিবাৰ",
  needHumanHelp: "সহায় লাগে নেকি?",
});

const urDict = createLangDict({
  appName: "اسٹوڈنٹ ہیلپ ڈیسک",
  badge: "ایجنٹ 65",
  heroTitle: "آپ کی یونیورسٹی، ایک ہی گفتگو میں۔",
  heroSubtitle: "اپنی حاضری، امتحانات، نمبرات اور فیس کے متعلق سوالات پوچھیں۔",
  onlineStatus: "ہیلپ ڈیسک آن لائن",
  searchPlaceholder: "حاضری، امتحانات، فیس کے بارے میں پوچھیں...",
  navHome: "ہوم",
  navAttendance: "حاضری",
  navMarks: "نمبرات",
  navTimetable: "ٹائم ٹیبل",
  navExams: "امتحانات",
  navFees: "فیس",
  navCurriculum: "نصاب",
  chatPlaceholder: "حاضری، امتحانات یا فیس کے متعلق پوچھیں...",
  askButton: "پوچھیں",
  modelLow: "تیز (3B)",
  modelHigh: "درست (8B)",
  micListening: "سن رہا ہوں... بولیں",
  micStart: "بولنے کے لیے کلک کریں",
  monday: "پیر",
  tuesday: "منگل",
  wednesday: "بدھ",
  thursday: "جمعرات",
  friday: "جمعہ",
  saturday: "ہفتہ",
  needHumanHelp: "انسانی مدد درکار ہے؟",
});

const saDict = createLangDict({
  appName: "छात्रसहायताकेन्द्रम्",
  badge: "प्रतिनिधिः ६५",
  heroTitle: "भवतः विश्वविद्यालयः, एकेन सम्भाषणेन।",
  heroSubtitle: "भवतः उपस्थितिं, परीक्षाः, अङ्कान्, शुल्कं च पृच्छतु।",
  onlineStatus: "सहायताकेन्द्रं सक्रियम्",
  searchPlaceholder: "उपस्थितिं, परीक्षाः, शुल्कं च पृच्छतु...",
  navHome: "गृहम्",
  navAttendance: "उपस्थितिः",
  navMarks: "अङ्काः",
  navTimetable: "समयसारिणी",
  navExams: "परीक्षाः",
  navFees: "शुल्कम्",
  navCurriculum: "पाठ्यक्रमः",
  chatPlaceholder: "उपस्थितिं, परीक्षां, शुल्कं वा पृच्छतु...",
  askButton: "पृच्छतु",
  modelLow: "तीव्रम् (3B)",
  modelHigh: "शुद्धम् (8B)",
  micListening: "शृणोमि... वदतु",
  micStart: "वक्तुं नुदतु",
  monday: "सोमवासरः",
  tuesday: "मङ्गलवासरः",
  wednesday: "बुधवासरः",
  thursday: "गुरुवासरः",
  friday: "शुक्रवासरः",
  saturday: "शनिवासरः",
  needHumanHelp: "मानवीयसाहाय्यम् आवश्यकम्?",
});

// Export comprehensive multilingual map
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
  ne: createLangDict({ navHome: "गृहपृष्ठ", navAttendance: "उपस्थिति", navMarks: "अंक", navExams: "परीक्षा", navFees: "शुल्क", askButton: "सोध्नुहोस्" }),
  kok: createLangDict({ navHome: "मुखपृष्ठ", navAttendance: "हाजरी", navMarks: "गुण", navExams: "परीक्षा", navFees: "शुल्क", askButton: "विचार" }),
  ks: createLangDict({ navHome: "ہوم", navAttendance: "حاضری", navMarks: "نمبر", navExams: "امتحان", askButton: "پریچھِو" }),
  sd: createLangDict({ navHome: "مکيه صفحو", navAttendance: "حاضري", navMarks: "مارڪون", navExams: "امتحان", askButton: "پڇو" }),
  doi: createLangDict({ navHome: "मुक्ख पन्ना", navAttendance: "हाजरी", navMarks: "नंबर", navExams: "परीक्षा", askButton: "पुच्छो" }),
  mai: createLangDict({ navHome: "मुख्य पृष्ठ", navAttendance: "उपस्थिति", navMarks: "अंक", navExams: "परीक्षा", askButton: "पूछू" }),
  mni: createLangDict({ navHome: "য়ুম", navAttendance: "উপস্থিতি", navMarks: "মার্ক", navExams: "পরীক্ষা", askButton: "হংবীয়ু" }),
  sat: createLangDict({ navHome: "ᱚᱲᱟᱜ", navAttendance: "ᱥᱮᱴᱮᱨ", navMarks: "ᱱᱚᱢᱵᱚᱨ", navExams: "ᱵᱤᱱᱤᱰ", askButton: "ᱠᱩᱞᱤ" }),
  brx: createLangDict({ navHome: "न'खर", navAttendance: "हाजिरा", navMarks: "नम्बर", navExams: "आनजाद", askButton: "सों" }),
};
