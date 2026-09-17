export interface ClubMember {
  id: string;
  name: string;
  role: string;
  details: string;
}

export interface ClubJoiningStep {
  order: number;
  title: string;
  description: string;
}

export interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  themeColor: string;
  members: ClubMember[];
  joiningSteps: ClubJoiningStep[];
}

export const CLUBS_DATA: Club[] = [
  {
    id: "ANC",
    name: "Anti-Ragging Cell (ANC)",
    category: "Statutory",
    description: "The university maintains a strict zero-tolerance policy towards ragging. ANC ensures a safe, welcoming environment for all freshers.",
    themeColor: "rose",
    members: [
      { id: "m1", name: "Prof. Rajiv Sharma", role: "Chief Nodal Officer", details: "Contact for any immediate grievance or ragging reports." },
      { id: "m2", name: "Dr. Smita Rao", role: "Faculty Coordinator", details: "Oversees hostel patrols and anti-ragging squads." }
    ],
    joiningSteps: [] // Statutory, students don't generally "join" this club as members in the traditional sense
  },
  {
    id: "SAC",
    name: "Student Activities Center (SAC)",
    category: "Administrative",
    description: "The core committee governing all student cultural, technical, and sports events across the campus.",
    themeColor: "blue",
    members: [
      { id: "m3", name: "Rahul Verma", role: "Student President", details: "4th Year, CSE. Leads the SAC executive council." },
      { id: "m4", name: "Priya Singh", role: "Cultural Secretary", details: "3rd Year, ECE. Organizes all major university fests." }
    ],
    joiningSteps: [
      { order: 1, title: "Fill the Online Application", description: "Login to the student portal and submit the SAC membership form detailing your past experiences." },
      { order: 2, title: "Portfolio Review", description: "The executive council will review your submission and shortlist candidates based on skill sets." },
      { order: 3, title: "Interview Round", description: "A formal interview with the current SAC committee to gauge your leadership and teamwork skills." },
      { order: 4, title: "Final Induction", description: "Selected candidates are officially inducted during the annual SAC orientation ceremony." }
    ]
  },
  {
    id: "TECH",
    name: "Code & Build Club",
    category: "Technical",
    description: "A community for aspiring software developers, hardware tinkerers, and AI enthusiasts.",
    themeColor: "emerald",
    members: [
      { id: "m5", name: "Amit Patel", role: "Lead Organizer", details: "Full-stack developer and open-source contributor." }
    ],
    joiningSteps: [
      { order: 1, title: "Join the Discord Server", description: "All technical discussions happen on our public Discord server. Link is on the club notice board." },
      { order: 2, title: "Solve the Entry Challenge", description: "Complete a basic algorithmic or web development task to prove your fundamental knowledge." },
      { order: 3, title: "Attend the First Meetup", description: "Come to the lab during our weekly meetup and present your solution to the senior members." }
    ]
  },
  {
    id: "CULT",
    name: "Cultural Society",
    category: "Cultural",
    description: "Promoting arts, dance, music, and dramatics. The heartbeat of university fests.",
    themeColor: "purple",
    members: [
      { id: "m6", name: "Neha Gupta", role: "Dance Troupe Lead", details: "Choreographer and state-level dancer." }
    ],
    joiningSteps: [
      { order: 1, title: "Auditions", description: "Keep an eye out for audition posters. Prepare a 2-minute performance (dance, singing, drama)." },
      { order: 2, title: "Callback Round", description: "Perform alongside current members to see if your style matches the troupe's dynamics." },
      { order: 3, title: "Rehearsal Bootcamp", description: "Attend a 3-day intensive boot camp. Selection is confirmed after successfully completing this camp." }
    ]
  }
];
