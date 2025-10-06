export interface MCQOption {
  label: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: MCQOption[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  subject: string;
  questionType?: 'mcq' | 'integer'; // integer type has no options, answer is a number
}

export interface TestResult {
  score: number;
  totalQuestions: number;
  conceptStrength: 'Strong' | 'Moderate' | 'Weak';
  percentage: number;
  topic: string;
  subject: string;
  userAnswers: string[];
  correctAnswers: string[];
  timestamp: Date;
}

export interface UserStats {
  streak: number;
  lastTestDate: Date | null;
  testHistory: TestResult[];
  totalTests: number;
  totalScore: number;
}

export const SUBJECTS = {
  Physics: [
    'Mechanics', 'Thermodynamics', 'Waves & Oscillations', 'Optics', 
    'Electricity & Magnetism', 'Modern Physics', 'Current Electricity',
    'Electromagnetic Induction', 'AC Circuits', 'Atomic Physics'
  ],
  Chemistry: [
    'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 
    'Chemical Bonding', 'Thermodynamics', 'Electrochemistry',
    'Chemical Kinetics', 'Coordination Compounds', 'P-Block Elements',
    'S-Block Elements', 'Hydrocarbons', 'Alcohols & Ethers'
  ],
  Mathematics: [
    'Algebra', 'Trigonometry', 'Calculus', 'Coordinate Geometry',
    'Vectors', 'Probability', 'Statistics', 'Complex Numbers',
    'Sequences & Series', 'Matrices & Determinants', 'Functions',
    'Binomial Theorem', 'Permutations & Combinations'
  ]
} as const;

export type Subject = keyof typeof SUBJECTS;