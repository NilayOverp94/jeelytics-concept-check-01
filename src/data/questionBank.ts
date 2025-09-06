import { Subject } from '@/types/jee';

// Question bank now only stores topic structure - all questions are AI-generated
export const QUESTION_BANK: Record<Subject, Record<string, never[]>> = {
  Physics: {},
  Chemistry: {},
  Mathematics: {}
};

// Available topics for each subject
export const TOPICS: Record<Subject, string[]> = {
  Physics: [
    'Mechanics',
    'Thermodynamics', 
    'Electromagnetism',
    'Optics',
    'Modern Physics',
    'Waves and Sound',
    'Rotational Motion',
    'Gravitation',
    'Fluid Mechanics',
    'Oscillations',
    'Current Electricity',
    'Alternating Current',
    'Electromagnetic Induction',
    'Atomic Physics'
  ],
  Chemistry: [
    'Physical Chemistry',
    'Organic Chemistry', 
    'Inorganic Chemistry',
    'Chemical Bonding',
    'Atomic Structure',
    'Chemical Equilibrium',
    'Electrochemistry',
    'Surface Chemistry',
    'Nuclear Chemistry',
    'Coordination Compounds',
    'Chemical Kinetics',
    'Thermodynamics',
    'Alcohols',
    'Hydrocarbons',
    'S and P Block Elements'
  ],
  Mathematics: [
    'Algebra',
    'Calculus',
    'Coordinate Geometry',
    'Trigonometry',
    'Probability',
    'Statistics',
    'Vectors',
    'Complex Numbers',
    'Sequences and Series',
    'Matrices and Determinants',
    'Functions',
    'Permutations and Combinations',
    'Binomial Theorem'
  ]
};