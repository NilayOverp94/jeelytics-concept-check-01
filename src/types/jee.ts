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
  questionType?: 'mcq' | 'integer';
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
    'Electromagnetic Induction', 'AC Circuits', 'Atomic Physics',
    'Rotational Motion', 'Gravitation', 'Fluid Mechanics',
    'Oscillations', 'Waves and Sound', 'Electrostatics',
    'Centre of Mass', 'Circular Motion', 'Wave Optics',
    'Electromagnetic Waves', 'Semiconductor', 'Thermal Properties of Matter',
    'KTG & Thermodynamics', 'Ray Optics'
  ],
  Chemistry: [
    'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry',
    'Chemical Bonding', 'Thermodynamics', 'Electrochemistry',
    'Chemical Kinetics', 'Coordination Compounds', 'P-Block Elements',
    'S-Block Elements', 'D & F Block Elements', 'Hydrocarbons', 'Alcohols & Ethers',
    'Atomic Structure', 'Chemical Equilibrium', 'Ionic Equilibrium',
    'Mole Concept', 'Solutions', 'Redox Reactions',
    'IUPAC Nomenclature', 'GOC (General Organic Chemistry)', 'Isomerism',
    'Haloalkanes & Haloarenes', 'Aldehydes Ketones & Carboxylic Acids',
    'Amines', 'Biomolecules', 'Periodic Table', 'Salt Analysis',
    'S & P Block Elements'
  ],
  Mathematics: [
    'Algebra', 'Trigonometry', 'Calculus', 'Coordinate Geometry',
    'Vectors', 'Probability', 'Statistics', 'Complex Numbers',
    'Sequences & Series', 'Matrices & Determinants', 'Functions',
    'Binomial Theorem', 'Permutations & Combinations',
    'Sets', 'Relations & Functions', 'Limits Continuity & Differentiability',
    'Methods of Differentiation', 'Application of Derivatives',
    'Indefinite Integration', 'Definite Integration', 'Area Under Curves',
    'Differential Equations', 'Straight Lines', 'Circles',
    'Parabola', 'Ellipse', 'Hyperbola', '3D Geometry',
    'Inverse Trigonometric Functions'
  ]
} as const;

export type Subject = keyof typeof SUBJECTS;
