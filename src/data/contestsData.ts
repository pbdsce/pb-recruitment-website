export interface Contest {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  registrationOpen: boolean;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  participants: number;
  domain: string;
}

export interface ContestDetail extends Contest {
  fullDescription: string;
  registrationOpenUntil: string;
  problemCount: number;
  registrationStatus: string;
  rules: string[];
  eligibility: string;
}

// Contest list data
export const contestsListData: Contest[] = [
  {
    id: "first-years",
    name: "Point Blank Recruitment Test - 1st Years",
    description:
      "Kick-start your tech journey! This recruitment test is designed for first-year students to showcase their problem-solving abilities and fundamental programming skills.",
    startTime: "2025-11-01 10:00 AM",
    endTime: "2025-11-01 1:00 PM",
    registrationOpen: true,
    duration: "3 hours",
    difficulty: "Easy",
    participants: 412,
    domain: "Point Blank",
  },
  {
    id: "second-third-years",
    name: "Point Blank Recruitment Test - 2nd & 3rd Years",
    description:
      "Challenge yourself with advanced algorithmic problems. This test is for second and third-year students to demonstrate expertise in data structures, algorithms, and competitive programming.",
    startTime: "2025-11-01 10:00 AM",
    endTime: "2025-11-01 1:00 PM",
    registrationOpen: true,
    duration: "3 hours",
    difficulty: "Hard",
    participants: 234,
    domain: "Point Blank",
  },
];

// Contest detail data
export const contestsDetailData: Record<string, ContestDetail> = {
  "first-years": {
    id: "first-years",
    name: "Point Blank Recruitment Test - 1st Years",
    description:
      "Kick-start your tech journey! This recruitment test is designed for first-year students to showcase their problem-solving abilities and fundamental programming skills.",
    fullDescription: `This is the official recruitment contest for Point Blank, designed specifically for first-year students. This contest features carefully crafted problems that test your understanding of fundamental computer science concepts and programming basics.
    Participants will tackle algorithmic problems spanning beginner to intermediate difficulty levels. The contest is a real-time, rated event where your performance directly influences your chances of joining the Point Blank technical team.
    `,
    startTime: "2025-11-01 10:00 AM",
    endTime: "2025-11-01 1:00 PM",
    registrationOpenUntil: "2025-11-01 9:55 AM",
    registrationOpen: true,
    duration: "3 hours",
    difficulty: "Easy",
    participants: 412,
    domain: "Point Blank",
    problemCount: 4,
    registrationStatus: "Open",
    rules: [
      "This is an individual contest. No collaboration is allowed.",
      "You can use any programming language (C++, Python, Java, etc.)",
      "External resources and search engines are not permitted during the contest.",
      "Submissions will be evaluated against test cases.",
      "Plagiarism will result in immediate disqualification.",
      "Only first-year students are eligible to participate.",
    ],
    eligibility:
      "Open to all first-year students. No prior competitive programming experience required!",
  },
  "second-third-years": {
    id: "second-third-years",
    name: "Point Blank Recruitment Test - 2nd & 3rd Years",
    description:
      "Challenge yourself with advanced algorithmic problems. This test is for second and third-year students to demonstrate expertise in data structures, algorithms, and competitive programming.",
    fullDescription: `This is the advanced recruitment contest for Point Blank, designed for second and third-year students who have solid programming foundations. This contest features challenging problems covering advanced topics like dynamic programming, graph algorithms, and complex data structures.
    Participants will tackle algorithmic problems at intermediate to advanced difficulty levels. The contest is a real-time, rated event where your performance directly influences your chances of joining Point Blank's elite competitive programming team.
    `,
    startTime: "2025-11-01 10:00 AM",
    endTime: "2025-11-01 1:00 PM",
    registrationOpenUntil: "2025-11-01 9:55 AM",
    registrationOpen: true,
    duration: "3 hours",
    difficulty: "Hard",
    participants: 234,
    domain: "Point Blank",
    problemCount: 5,
    registrationStatus: "Open",
    rules: [
      "This is an individual contest. No collaboration is allowed.",
      "You can use any programming language (C++, Python, Java, etc.)",
      "External resources and search engines are not permitted during the contest.",
      "Submissions will be evaluated against test cases with time and memory limits.",
      "Plagiarism will result in immediate disqualification.",
      "Only second and third-year students are eligible.",
    ],
    eligibility:
      "Open to all second and third-year students with good programming fundamentals.",
  },
};