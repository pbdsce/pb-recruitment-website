export const BRANCHES = [
  "Artificial Intelligence and Machine Learning",
  "Aeronautical Engineering",
  "Automobile Engineering",
  "Biotechnology",
  "Computer Science and Engineering",
  "Computer Science and Business Systems",
  "Computer Science & Engineering (Cyber Security)",
  "Computer Science & Engineering (Data Science)",
  "Computer Science & Engineering (IoT and Cyber Security Including Blockchain)",
  "Computer Science and Design",
  "Chemical Engineering",
  "Civil Engineering",
  "Electrical & Electronics Engineering",
  "Electronics & Communication Engineering",
  "Electronics and Instrumentation Engineering",
  "Electronics and Telecommunication Engineering",
  "Information Science and Engineering",
  "Mechanical Engineering",
  "Medical Electronics Engineering",
  "Robotics and Artificial Intelligence"
] as const;

export const BRANCHES_TO_DEPARTMENT: Record<string, string> = {
  'Artificial Intelligence and Machine Learning': 'AI',
  'Aeronautical Engineering': 'AE',
  'Automobile Engineering': 'AU',
  'Biotechnology': 'BT',
  'Computer Science and Design': 'CG',
  'Medical Electronics Engineering': 'MD',
  'Electronics and Telecommunication Engineering': 'ET',
  'Electronics & Communication Engineering': 'EC',
  'Electronics and Instrumentation Engineering': 'EI',
  'Mechanical Engineering': 'ME',
  'Electrical & Electronics Engineering': 'EE',
  'Chemical Engineering': 'CH',
  'Computer Science & Engineering (Cyber Security)': 'CY',
  'Computer Science & Engineering (Data Science)': 'CD',
  'Computer Science & Engineering (IoT and Cyber Security Including Blockchain)': 'IC',
  'Information Science and Engineering': 'IS',
  'Computer Science and Engineering': 'CS',
  'Computer Science and Business Systems': 'CB',
  'Civil Engineering': 'CV',
  'Robotics and Artificial Intelligence': 'RI',
};

export const getDepartmentFromBranch = (branch: string): string => {
  return BRANCHES_TO_DEPARTMENT[branch] || branch.substring(0, 2).toUpperCase();
};

export const getBranchFromDepartment = (department: string): string => {
  const entry = Object.entries(BRANCHES_TO_DEPARTMENT).find(([_, code]) => code === department);
  return entry ? entry[0] : department;
};

