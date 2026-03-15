export interface NoteLink {
  title: string;
  url: string;
}

export interface Lecture {
  id: string;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  topic: string;
  youtubeId: string;
  notesLink?: string;
  notesLinks?: NoteLink[];
}

export const LECTURES: Lecture[] = [
  // Mathematics Lectures
  { id: '1', title: 'Vectors - Complete Lecture', subject: 'Mathematics', topic: 'Vectors', youtubeId: 'cS64-wAFDuI' },
  { id: '2', title: 'Matrices - Complete Lecture', subject: 'Mathematics', topic: 'Matrices and Determinants', youtubeId: 'ZtTDs2FZ2Qw' },
  { id: '3', title: 'Basic Math - Complete Lecture', subject: 'Mathematics', topic: 'Algebra', youtubeId: 'UCdxT4d8k5c' },
  { id: '4', title: 'Determinants - Complete Lecture', subject: 'Mathematics', topic: 'Matrices and Determinants', youtubeId: 'hEFge5SsIz0' },
  { id: '5', title: 'Quadratic Equations - Complete Lecture', subject: 'Mathematics', topic: 'Algebra', youtubeId: 'yejWh3kni-o' },
  { id: '6', title: 'Sequence and Series - Complete Lecture', subject: 'Mathematics', topic: 'Sequences and Series', youtubeId: 'zOdUhsMydtM' },
  { id: '7', title: '3D Geometry - Complete Lecture', subject: 'Mathematics', topic: 'Coordinate Geometry', youtubeId: '7v2vYv6Pl7g' },
  { id: '8', title: 'Binomial Theorem - Complete Lecture', subject: 'Mathematics', topic: 'Binomial Theorem', youtubeId: 'YiY0Z5sQ47U' },
  { id: '9', title: 'Relations & Functions - Complete Lecture', subject: 'Mathematics', topic: 'Functions', youtubeId: 'NKth1h8pr7s' },
  { id: '10', title: 'Permutation & Combination - Complete Lecture', subject: 'Mathematics', topic: 'Permutations and Combinations', youtubeId: 'VQ3vHpJzcu0' },
  { id: '11', title: 'Inverse Trigonometric Functions - Complete Lecture', subject: 'Mathematics', topic: 'Trigonometry', youtubeId: 'II05jy4LZ4I' },
  { id: '12', title: 'Trigonometric Functions & Equations - Complete Lecture', subject: 'Mathematics', topic: 'Trigonometry', youtubeId: '-uZzrzAkHn0' },
  { id: '13', title: 'Straight Lines - Complete Lecture', subject: 'Mathematics', topic: 'Coordinate Geometry', youtubeId: 'gZ735nqr9FI' },
  { id: '14', title: 'Definite Integration - Complete Lecture', subject: 'Mathematics', topic: 'Calculus', youtubeId: 'ISth4dTVbWY' },
  { id: '15', title: 'Circles - Complete Lecture', subject: 'Mathematics', topic: 'Coordinate Geometry', youtubeId: 'J1Wv5VLvtXk' },
  { id: '16', title: 'Limits, Continuity & Differentiability - Complete Lecture', subject: 'Mathematics', topic: 'Calculus', youtubeId: '81v0t4OG6Wc' },
  { id: '17', title: 'Parabola - Complete Lecture', subject: 'Mathematics', topic: 'Coordinate Geometry', youtubeId: 'hIeh8YyqgO0' },
  { id: '18', title: 'Application of Derivatives - Complete Lecture', subject: 'Mathematics', topic: 'Calculus', youtubeId: 'ayePGxbHjus' },
  { id: '19', title: 'Hyperbola - Complete Lecture', subject: 'Mathematics', topic: 'Coordinate Geometry', youtubeId: '7ddTpufoqNc' },
  { id: '20', title: 'Complex Numbers - Complete Lecture', subject: 'Mathematics', topic: 'Complex Numbers', youtubeId: 'bOcosA28Ix4' },
  { id: '21', title: 'Statistics - Complete Lecture', subject: 'Mathematics', topic: 'Statistics', youtubeId: '4vI8K3qy3O0' },
  { id: '22', title: 'Differential Equations - Complete Lecture', subject: 'Mathematics', topic: 'Calculus', youtubeId: 'Kqmq47WOvdU' },
  { id: '23', title: 'Probability - Complete Lecture', subject: 'Mathematics', topic: 'Probability', youtubeId: 'xwBmzrCh4S0' },
  { id: '24', title: 'Methods of Differentiation - Complete Lecture', subject: 'Mathematics', topic: 'Calculus', youtubeId: 'e7bnfHnl6PE' },
  { id: '25', title: 'Indefinite Integration - Complete Lecture', subject: 'Mathematics', topic: 'Calculus', youtubeId: '925SY-xvuj8' },
  { id: '26', title: 'Ellipse - Complete Lecture', subject: 'Mathematics', topic: 'Coordinate Geometry', youtubeId: 'vZ_NN3fBhUc' },
  { id: '27', title: 'Area Under Curves - Complete Lecture', subject: 'Mathematics', topic: 'Calculus', youtubeId: 'doc6zf-pddw' },
  { id: '28', title: 'Sets - Complete Lecture', subject: 'Mathematics', topic: 'Algebra', youtubeId: 'ikj6hK55UIM' },

  // Physics Lectures
  { id: '29', title: 'Basic Maths - Complete Lecture', subject: 'Physics', topic: 'Mechanics', youtubeId: '2i0p2tidN88', notesLink: '/notes/physics-basic-maths.pdf' },
  { id: '30', title: 'Electric Charges and Fields - Complete Lecture', subject: 'Physics', topic: 'Electromagnetism', youtubeId: 'GLEZZdGwuXU', notesLink: '/notes/physics-electrostatics.pdf' },
  { id: '31', title: 'Motion in a Straight Line - Complete Lecture', subject: 'Physics', topic: 'Mechanics', youtubeId: 'v-kDOGM3214', notesLink: '/notes/physics-motion-in-1d.pdf' },
  { id: '32', title: 'Electric Potential, Dipole & Conductor - Complete Lecture', subject: 'Physics', topic: 'Electromagnetism', youtubeId: 'sGb3VLDvNRU' },
  { id: '33', title: 'Motion in a Plane - Complete Lecture', subject: 'Physics', topic: 'Mechanics', youtubeId: 'U-tlb7_vnhM', notesLink: '/notes/physics-motion-2d.pdf' },
  { id: '34', title: 'Capacitor - Complete Lecture', subject: 'Physics', topic: 'Electromagnetism', youtubeId: 'EJJGEpGFzQs', notesLink: '/notes/physics-capacitance.pdf' },
  { id: '35', title: 'Laws of Motion - Complete Lecture', subject: 'Physics', topic: 'Mechanics', youtubeId: 'cG2Sqj_dRgw', notesLink: '/notes/physics-nlm.pdf' },
  { id: '36', title: 'Current Electricity - Complete Lecture', subject: 'Physics', topic: 'Current Electricity', youtubeId: 'JY24andAvME', notesLink: '/notes/physics-current-electricity.pdf' },
  { id: '37', title: 'Work, Energy & Power - Complete Lecture', subject: 'Physics', topic: 'Mechanics', youtubeId: 'BX9EoW5sPE0', notesLink: '/notes/physics-work-energy-power.pdf' },
  { id: '38', title: 'Magnetism - Complete Lecture', subject: 'Physics', topic: 'Electromagnetism', youtubeId: 'I4kB3onwjpw', notesLink: '/notes/physics-magnetism.pdf' },
  { id: '39', title: 'Circular Motion - Complete Lecture', subject: 'Physics', topic: 'Mechanics', youtubeId: 'nsSeTLT3UF8', notesLink: '/notes/physics-circular-motion.pdf' },
  { id: '40', title: 'Electromagnetic Induction - Complete Lecture', subject: 'Physics', topic: 'Electromagnetic Induction', youtubeId: '_WXExQ4E-po', notesLink: '/notes/physics-emi.pdf' },
  { id: '41', title: 'Alternating Current - Complete Lecture', subject: 'Physics', topic: 'Alternating Current', youtubeId: 'fEOhYtyEEY8', notesLink: '/notes/physics-alternating-current.pdf' },
  { id: '42', title: 'Rotational Motion - Complete Lecture', subject: 'Physics', topic: 'Rotational Motion', youtubeId: 'Ag4tOx3cN7I', notesLink: '/notes/physics-rotational-motion.pdf' },
  {
    id: '43', title: 'Modern Physics - Complete Lecture', subject: 'Physics', topic: 'Modern Physics', youtubeId: 'V76QPpoWVwA',
    notesLinks: [
      { title: 'Modern Physics 1', url: '/notes/physics-modern-physics-1.pdf' },
      { title: 'Modern Physics 2', url: '/notes/physics-modern-physics-2.pdf' },
      { title: 'Modern Physics 3', url: '/notes/physics-modern-physics-3.pdf' },
      { title: 'Modern Physics 4', url: '/notes/physics-modern-physics-4.pdf' },
      { title: 'Modern Physics 5', url: '/notes/physics-modern-physics-5.pdf' },
    ]
  },
  { id: '44', title: 'Gravitation - Complete Lecture', subject: 'Physics', topic: 'Gravitation', youtubeId: 'MTtYUHd3rxs', notesLink: '/notes/physics-gravitation.pdf' },
  {
    id: '45', title: 'Mechanical Properties of Solids & Fluid - Complete Lecture', subject: 'Physics', topic: 'Fluid Mechanics', youtubeId: 'xiNKdCzjtLQ',
    notesLinks: [
      { title: 'Mech. Prop. of Fluid (Part 1)', url: '/notes/physics-mech-prop-fluid-1.pdf' },
      { title: 'Mech. Prop. of Solid', url: '/notes/physics-mech-prop-solid.pdf' },
      { title: 'Fluid Mechanics', url: '/notes/physics-fluid.pdf' },
    ]
  },
  {
    id: '46', title: 'KTG & Thermodynamics - Complete Lecture', subject: 'Physics', topic: 'Thermodynamics', youtubeId: '5upyHMKKmp0',
    notesLinks: [
      { title: 'KTG & Thermodynamics (Part 1)', url: '/notes/physics-ktg-thermo-1.pdf' },
      { title: 'KTG & Thermodynamics (Part 2)', url: '/notes/physics-ktg-thermo-2.pdf' },
    ]
  },
  { id: '47', title: 'Optics - Complete Lecture', subject: 'Physics', topic: 'Optics', youtubeId: '5M53eu3UI3U' },
  { id: '48', title: 'Thermal Properties of Matter - Complete Lecture', subject: 'Physics', topic: 'Thermodynamics', youtubeId: 'eL7uSfwY8Iw', notesLink: '/notes/physics-thermal-prop.pdf' },
  { id: '49', title: 'Oscillations - Complete Lecture', subject: 'Physics', topic: 'Oscillations', youtubeId: 'bv8qBsHK9bM', notesLink: '/notes/physics-oscillation.pdf' },
  { id: '50', title: 'Waves - Complete Lecture', subject: 'Physics', topic: 'Waves and Sound', youtubeId: 's-u1YoZNFTw', notesLink: '/notes/physics-waves.pdf' },
  { id: '51', title: 'Wave Optics - Complete Lecture', subject: 'Physics', topic: 'Optics', youtubeId: 'ct-NImkqlTw', notesLink: '/notes/physics-wave-optics.pdf' },
  { id: '52', title: 'Electromagnetic Waves - Complete Lecture', subject: 'Physics', topic: 'Electromagnetism', youtubeId: '8TnzQkZrztQ', notesLink: '/notes/physics-em-waves.pdf' },
  { id: '53', title: 'Centre of Mass - Complete Lecture', subject: 'Physics', topic: 'Mechanics', youtubeId: '7xy0V3FjxdY', notesLink: '/notes/physics-centre-of-mass.pdf' },
  { id: '54', title: 'Semiconductor - Complete Lecture', subject: 'Physics', topic: 'Modern Physics', youtubeId: 'rdnWOyqZTy4', notesLink: '/notes/physics-semiconductor.pdf' },

  // Chemistry Lectures
  { id: '55', title: 'Periodic Table - Complete Lecture', subject: 'Chemistry', topic: 'Inorganic Chemistry', youtubeId: 'nLE7_YBFQNQ' },
  { id: '56', title: 'Chemical Bonding - Complete Lecture', subject: 'Chemistry', topic: 'Chemical Bonding', youtubeId: 'kS8s_WX0IlY', notesLink: '/notes/chemistry-chemical-bonding.pdf' },
  { id: '57', title: 'Coordination Compound - Complete Lecture', subject: 'Chemistry', topic: 'Coordination Compounds', youtubeId: '5myJzBeN514' },
  { id: '58', title: 'P-Block - Complete Lecture', subject: 'Chemistry', topic: 'S and P Block Elements', youtubeId: 'b0k5LOk_uPk' },
  { id: '59', title: 'D and F Block - Complete Lecture', subject: 'Chemistry', topic: 'Inorganic Chemistry', youtubeId: 'SjILQ6cX_Vo' },
  { id: '60', title: 'Salt Analysis - Complete Lecture', subject: 'Chemistry', topic: 'Inorganic Chemistry', youtubeId: '8rRnn4ECwXI' },
  { id: '61', title: 'Mole Concept - Complete Lecture', subject: 'Chemistry', topic: 'Physical Chemistry', youtubeId: 'CAb8YZKLoac' },
  { id: '62', title: 'Solution - Complete Lecture', subject: 'Chemistry', topic: 'Physical Chemistry', youtubeId: 'f6ENSghG7T4' },
  { id: '63', title: 'Redox - Complete Lecture', subject: 'Chemistry', topic: 'Physical Chemistry', youtubeId: '8oypjDXAXZc' },
  { id: '64', title: 'Electrochemistry - Complete Lecture', subject: 'Chemistry', topic: 'Electrochemistry', youtubeId: 'GplPceRaMi0' },
  { id: '65', title: 'Thermodynamics - Complete Lecture', subject: 'Chemistry', topic: 'Thermodynamics', youtubeId: 'NwCmoh7Vd9g' },
  { id: '66', title: 'Chemical Equilibrium - Complete Lecture', subject: 'Chemistry', topic: 'Chemical Equilibrium', youtubeId: 'BceSksiNLD4' },
  { id: '67', title: 'Ionic Equilibrium - Complete Lecture', subject: 'Chemistry', topic: 'Chemical Equilibrium', youtubeId: '1W-UvePUAKo' },
  { id: '68', title: 'Chemical Kinetics - Complete Lecture', subject: 'Chemistry', topic: 'Chemical Kinetics', youtubeId: 'kwPNxC9AgZA' },
  { id: '69', title: 'Structure of Atoms - Complete Lecture', subject: 'Chemistry', topic: 'Atomic Structure', youtubeId: '7OkNy8vhDaw' },
  { id: '70', title: 'IUPAC Nomenclature - Complete Lecture', subject: 'Chemistry', topic: 'Organic Chemistry', youtubeId: 'A2QTsYu3fWo' },
  { id: '71', title: 'GOC - Complete Lecture', subject: 'Chemistry', topic: 'Organic Chemistry', youtubeId: 'FFCT-lh86tA' },
  { id: '72', title: 'Isomerism - Complete Lecture', subject: 'Chemistry', topic: 'Organic Chemistry', youtubeId: 'UOzWO2-Z9So' },
  { id: '73', title: 'Hydrocarbon - Complete Lecture', subject: 'Chemistry', topic: 'Hydrocarbons', youtubeId: '02CBTEOMMsA' },
  { id: '74', title: 'Haloalkanes and Haloarenes - Complete Lecture', subject: 'Chemistry', topic: 'Organic Chemistry', youtubeId: '7iJFvPI8vMM' },
  { id: '75', title: 'Alcohol, Phenol and Ethers - Complete Lecture', subject: 'Chemistry', topic: 'Alcohols', youtubeId: 'IDo8B0c5Xis' },
  { id: '76', title: 'Aldehydes, Ketones and Carboxylic Acids - Complete Lecture', subject: 'Chemistry', topic: 'Organic Chemistry', youtubeId: 'oR19BqbPBu4' },
  { id: '77', title: 'Amines - Complete Lecture', subject: 'Chemistry', topic: 'Organic Chemistry', youtubeId: 'SKHrfD34Kkc' },
  { id: '78', title: 'Biomolecules - Complete Lecture', subject: 'Chemistry', topic: 'Organic Chemistry', youtubeId: 'LcVNwEWJtyI' },
];

// Helper function to get all notes for a lecture (supports both notesLink and notesLinks)
export function getLectureNotes(lecture: Lecture): NoteLink[] {
  if (lecture.notesLinks && lecture.notesLinks.length > 0) {
    return lecture.notesLinks;
  }
  if (lecture.notesLink) {
    return [{ title: 'Notes', url: lecture.notesLink }];
  }
  return [];
}

// Search function that tries subject-filtered first, then falls back to all lectures
function searchInPool(term: string, pool: Lecture[]): Lecture | undefined {
  const exactMatch = pool.find(l => l.title.replace(' - Complete Lecture', '').toLowerCase() === term);
  if (exactMatch) return exactMatch;

  const titleMatch = pool.find(l => l.title.toLowerCase().includes(term));
  if (titleMatch) return titleMatch;

  const topicMatch = pool.find(l => l.topic.toLowerCase().includes(term));
  if (topicMatch) return topicMatch;

  const titleKeywordMatch = pool.find(l => {
    const titleClean = l.title.replace(' - Complete Lecture', '').toLowerCase();
    return term.includes(titleClean);
  });
  if (titleKeywordMatch) return titleKeywordMatch;

  const searchWords = term.split(/\s+/).filter(w => w.length > 2);
  let bestMatch: Lecture | undefined;
  let bestScore = 0;

  for (const lecture of pool) {
    const titleClean = lecture.title.replace(' - Complete Lecture', '').toLowerCase();
    const titleWords = titleClean.split(/\s+/);
    const topicWords = lecture.topic.toLowerCase().split(/\s+/);
    const allWords = [...titleWords, ...topicWords];

    let score = 0;
    for (const sw of searchWords) {
      for (const tw of allWords) {
        if (tw.includes(sw) || sw.includes(tw)) score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = lecture;
    }
  }

  return bestScore > 0 ? bestMatch : undefined;
}

export function findLecture(searchTerm: string, subjectHint?: string): Lecture | undefined {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return undefined;

  if (subjectHint) {
    const subjectPool = LECTURES.filter(l => l.subject.toLowerCase() === subjectHint.toLowerCase());
    if (subjectPool.length > 0) {
      const result = searchInPool(term, subjectPool);
      if (result) return result;
    }
  }

  return searchInPool(term, LECTURES);
}

export function getLectureTitles(): string[] {
  return LECTURES.map(l => l.title.replace(' - Complete Lecture', ''));
}
