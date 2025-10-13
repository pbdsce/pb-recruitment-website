export interface Contest {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  registrationOpen: boolean;
  duration: string;
}

export interface ContestDetail extends Contest {
  fullDescription: string;
  registrationOpenUntil: string;
  registrationStatus: string;
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
  },
];

// Contest detail data
export const contestsDetailData: Record<string, ContestDetail> = {
  "first-years": {
    id: "first-years",
    name: "Point Blank Recruitment Test - 1st Years",
    description:
      "Kick-start your tech journey! This recruitment test is designed for first-year students to showcase their problem-solving abilities and fundamental programming skills.",
    fullDescription: ` •This is the official recruitment contest for Point Blank, designed specifically for first-year students. This contest features carefully crafted problems that test your understanding of fundamental computer science concepts and programming basics.
     •Participants will tackle algorithmic problems spanning beginner to intermediate difficulty levels. The contest is a real-time, rated event where your performance directly influences your chances of joining the Point Blank technical team.
    `,
    startTime: "2025-11-01 10:00 AM",
    endTime: "2025-11-01 1:00 PM",
    registrationOpenUntil: "2025-11-01 9:55 AM",
    registrationOpen: true,
    duration: "3 hours",
    registrationStatus: "Open",

  },
  "second-third-years": {
    id: "second-third-years",
    name: "Point Blank Recruitment Test - 2nd & 3rd Years",
    description:
      "Challenge yourself with advanced algorithmic problems. This test is for second and third-year students to demonstrate expertise in data structures, algorithms, and competitive programming.",
    fullDescription: ` •This is the advanced recruitment contest for Point Blank, designed for second and third-year students who have solid programming foundations. This contest features challenging problems covering advanced topics like dynamic programming, graph algorithms, and complex data structures.
    •Participants will tackle algorithmic problems at intermediate to advanced difficulty levels. The contest is a real-time, rated event where your performance directly influences your chances of joining Point Blank's elite competitive programming team.
    `,
    startTime: "2025-11-01 10:00 AM",
    endTime: "2025-11-01 1:00 PM",
    registrationOpenUntil: "2025-11-01 9:55 AM",
    registrationOpen: true,
    duration: "3 hours",
    registrationStatus: "Open",
  },
};