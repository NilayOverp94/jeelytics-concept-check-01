-- Ensure we don't insert duplicate questions for the same subject/topic
CREATE UNIQUE INDEX IF NOT EXISTS questions_subject_topic_question_unique
  ON public.questions (subject, topic, question);

-- Seed: one starter MCQ per topic for all subjects
INSERT INTO public.questions (question, options, correct_answer, explanation, subject, topic)
VALUES
-- Physics
('Mechanics: For projectile motion without air resistance, the horizontal acceleration is',
 '[{"label":"A","text":"Zero"},{"label":"B","text":"g downward"},{"label":"C","text":"-g upward"},{"label":"D","text":"Variable"}]',
 'A',
 'Only gravity acts vertically; horizontal acceleration is zero.',
 'Physics','Mechanics'),

('Thermodynamics: Which form of the first law is correct for a closed system (sign convention Q to system, W by system)?',
 '[{"label":"A","text":"ΔU = Q − W"},{"label":"B","text":"ΔU = W − Q"},{"label":"C","text":"ΔU = Q + W"},{"label":"D","text":"ΔU = 0 always"}]',
 'A',
 'Internal energy change equals heat added minus work done by the system.',
 'Physics','Thermodynamics'),

('Waves & Oscillations: The relation between wave speed v, frequency f, and wavelength λ is',
 '[{"label":"A","text":"v = fλ"},{"label":"B","text":"v = f/λ"},{"label":"C","text":"v = λ/f"},{"label":"D","text":"v = f + λ"}]',
 'A',
 'Basic wave relation: v equals frequency times wavelength.',
 'Physics','Waves & Oscillations'),

('Optics: In reflection from a plane mirror, the law states',
 '[{"label":"A","text":"Angle of incidence equals angle of reflection"},{"label":"B","text":"Angle of refraction equals angle of incidence"},{"label":"C","text":"Angles are always 90°"},{"label":"D","text":"No definite relation"}]',
 'A',
 'Law of reflection: i = r for a plane mirror.',
 'Physics','Optics'),

('Electricity & Magnetism: Coulomb’s law states that electrostatic force between point charges varies as',
 '[{"label":"A","text":"Inverse square of distance"},{"label":"B","text":"Inverse of distance"},{"label":"C","text":"Directly with distance"},{"label":"D","text":"Independent of distance"}]',
 'A',
 'Magnitude ∝ 1/r² in vacuum/air.',
 'Physics','Electricity & Magnetism'),

('Modern Physics: In the photoelectric effect, electron emission depends primarily on the light’s',
 '[{"label":"A","text":"Frequency"},{"label":"B","text":"Intensity only"},{"label":"C","text":"Phase"},{"label":"D","text":"Polarization"}]',
 'A',
 'A threshold frequency is required; intensity affects current, not emission threshold.',
 'Physics','Modern Physics'),

('Current Electricity: Ohm’s law for an ohmic conductor is',
 '[{"label":"A","text":"V = IR"},{"label":"B","text":"V = I/R"},{"label":"C","text":"I = VR"},{"label":"D","text":"R = VI"}]',
 'A',
 'Voltage equals current times resistance.',
 'Physics','Current Electricity'),

('Electromagnetic Induction: Faraday’s law states that the induced emf is proportional to',
 '[{"label":"A","text":"Rate of change of magnetic flux"},{"label":"B","text":"Magnetic flux itself"},{"label":"C","text":"Square of flux"},{"label":"D","text":"Area only"}]',
 'A',
 'ε ∝ −dΦ/dt, with Lenz’s direction.',
 'Physics','Electromagnetic Induction'),

('AC Circuits: In a pure capacitive AC circuit, current leads voltage by',
 '[{"label":"A","text":"90°"},{"label":"B","text":"0°"},{"label":"C","text":"180°"},{"label":"D","text":"lags by 90°"}]',
 'A',
 'For a capacitor, I leads V by π/2.',
 'Physics','AC Circuits'),

('Atomic Physics: In Bohr’s model of hydrogen, electrons revolve in certain stable orbits where they',
 '[{"label":"A","text":"Do not radiate energy"},{"label":"B","text":"Continuously radiate energy"},{"label":"C","text":"Gain energy without absorption"},{"label":"D","text":"Have arbitrary energies"}]',
 'A',
 'Stationary orbits have quantized energies and no radiation.',
 'Physics','Atomic Physics'),

-- Chemistry
('Physical Chemistry: The ideal gas equation is',
 '[{"label":"A","text":"PV = nRT"},{"label":"B","text":"PV = RT"},{"label":"C","text":"P = nRT"},{"label":"D","text":"V = nR/T"}]',
 'A',
 'Relates pressure, volume, moles, gas constant, and temperature.',
 'Chemistry','Physical Chemistry'),

('Organic Chemistry: The general formula for alkanes is',
 '[{"label":"A","text":"CnH2n+2"},{"label":"B","text":"CnH2n"},{"label":"C","text":"CnH2n−2"},{"label":"D","text":"CnHn"}]',
 'A',
 'Saturated hydrocarbons follow CnH2n+2.',
 'Chemistry','Organic Chemistry'),

('Inorganic Chemistry: Transition elements are primarily the',
 '[{"label":"A","text":"d-block elements"},{"label":"B","text":"s-block elements"},{"label":"C","text":"p-block elements"},{"label":"D","text":"f-block only"}]',
 'A',
 'Transition metals occupy the d-block.',
 'Chemistry','Inorganic Chemistry'),

('Chemical Bonding: An ionic bond is best described as',
 '[{"label":"A","text":"Electrostatic attraction between ions"},{"label":"B","text":"Sharing of electron pairs"},{"label":"C","text":"Metallic bonding"},{"label":"D","text":"Hydrogen bonding"}]',
 'A',
 'Ionic bonding arises from cation–anion attraction.',
 'Chemistry','Chemical Bonding'),

('Thermodynamics: The Gibbs free energy relation is',
 '[{"label":"A","text":"ΔG = ΔH − TΔS"},{"label":"B","text":"ΔG = ΔH + TΔS"},{"label":"C","text":"ΔG = TΔS − ΔH"},{"label":"D","text":"ΔG = ΔU − TΔS"}]',
 'A',
 'Predicts spontaneity at constant T and P.',
 'Chemistry','Thermodynamics'),

('Electrochemistry: Oxidation occurs at the',
 '[{"label":"A","text":"Anode"},{"label":"B","text":"Cathode"},{"label":"C","text":"Salt bridge"},{"label":"D","text":"Electrolyte only"}]',
 'A',
 'AN OX (anode oxidation), RED CAT (cathode reduction).',
 'Chemistry','Electrochemistry'),

('Chemical Kinetics: A catalyst primarily',
 '[{"label":"A","text":"Lowers activation energy"},{"label":"B","text":"Raises activation energy"},{"label":"C","text":"Changes ΔG of reaction"},{"label":"D","text":"Shifts equilibrium constant"}]',
 'A',
 'Catalysts speed reactions by lowering Ea without changing ΔG or K.',
 'Chemistry','Chemical Kinetics'),

('Coordination Compounds: A ligand is a species that',
 '[{"label":"A","text":"Donates a lone pair to a metal center"},{"label":"B","text":"Always carries positive charge"},{"label":"C","text":"Is always monodentate"},{"label":"D","text":"Cannot form complexes"}]',
 'A',
 'Ligands act as Lewis bases to the metal.',
 'Chemistry','Coordination Compounds'),

('P-Block Elements: Down group 16 (O to Po), metallic character',
 '[{"label":"A","text":"Increases"},{"label":"B","text":"Decreases"},{"label":"C","text":"Remains constant"},{"label":"D","text":"Becomes zero"}]',
 'A',
 'Heavier p-block elements show greater metallic character.',
 'Chemistry','P-Block Elements'),

('S-Block Elements: Alkali metals typically exhibit oxidation state',
 '[{"label":"A","text":"+1"},{"label":"B","text":"0"},{"label":"C","text":"+2"},{"label":"D","text":"−1"}]',
 'A',
 'Group 1 elements are +1 in compounds.',
 'Chemistry','S-Block Elements'),

('Hydrocarbons: Alkenes are characterized by the presence of',
 '[{"label":"A","text":"A carbon–carbon double bond"},{"label":"B","text":"Only single bonds"},{"label":"C","text":"A triple bond"},{"label":"D","text":"No carbon–carbon bonds"}]',
 'A',
 'CnH2n for one double bond (acyclic).',
 'Chemistry','Hydrocarbons'),

('Alcohols & Ethers: Primary alcohols on mild oxidation generally give',
 '[{"label":"A","text":"Aldehydes"},{"label":"B","text":"Ketones"},{"label":"C","text":"Carboxylic acids directly"},{"label":"D","text":"Alkanes"}]',
 'A',
 'Controlled oxidation of 1° alcohols yields aldehydes.',
 'Chemistry','Alcohols & Ethers'),

-- Mathematics
('Algebra: The discriminant of ax^2+bx+c=0 is',
 '[{"label":"A","text":"b^2 − 4ac"},{"label":"B","text":"b^2 + 4ac"},{"label":"C","text":"(b−2ac)^2"},{"label":"D","text":"b^2/4ac"}]',
 'A',
 'Determines nature of roots.',
 'Mathematics','Algebra'),

('Trigonometry: The identity valid for all θ is',
 '[{"label":"A","text":"sin^2θ + cos^2θ = 1"},{"label":"B","text":"sinθ + cosθ = 1"},{"label":"C","text":"tanθ = sinθ·cosθ"},{"label":"D","text":"cotθ = sinθ"}]',
 'A',
 'Pythagorean identity.',
 'Mathematics','Trigonometry'),

('Calculus: The derivative of x^n with respect to x (n is real) is',
 '[{"label":"A","text":"n x^{n−1}"},{"label":"B","text":"x^n"},{"label":"C","text":"n x^n"},{"label":"D","text":"x^{n+1}"}]',
 'A',
 'Power rule for differentiation.',
 'Mathematics','Calculus'),

('Coordinate Geometry: The distance between (x1,y1) and (x2,y2) is',
 '[{"label":"A","text":"√[(x2−x1)^2 + (y2−y1)^2]"},{"label":"B","text":"(x2−x1) + (y2−y1)"},{"label":"C","text":"(x2+x1)(y2+y1)"},{"label":"D","text":"(x2−x1)^2 − (y2−y1)^2"}]',
 'A',
 'Standard distance formula.',
 'Mathematics','Coordinate Geometry'),

('Vectors: The dot product a·b equals',
 '[{"label":"A","text":"|a||b|cosθ"},{"label":"B","text":"|a||b|sinθ"},{"label":"C","text":"|a|/|b|"},{"label":"D","text":"|a|+|b|"}]',
 'A',
 'Projection-based scalar product.',
 'Mathematics','Vectors'),

('Probability: For independent events A and B, P(A ∩ B) equals',
 '[{"label":"A","text":"P(A)P(B)"},{"label":"B","text":"P(A)+P(B)"},{"label":"C","text":"P(A)/P(B)"},{"label":"D","text":"P(A)−P(B)"}]',
 'A',
 'Definition of independence.',
 'Mathematics','Probability'),

('Statistics: The median of an ordered dataset',
 '[{"label":"A","text":"Divides it into two equal halves"},{"label":"B","text":"Equals the mode always"},{"label":"C","text":"Is unaffected by ordering"},{"label":"D","text":"Is sum divided by count"}]',
 'A',
 'Median is the middle value(s).',
 'Mathematics','Statistics'),

('Complex Numbers: The modulus of z = x + iy is',
 '[{"label":"A","text":"√(x^2 + y^2)"},{"label":"B","text":"x + y"},{"label":"C","text":"x/y"},{"label":"D","text":"xy"}]',
 'A',
 'Distance from origin in Argand plane.',
 'Mathematics','Complex Numbers'),

('Sequences & Series: Sum of first n terms of an AP is',
 '[{"label":"A","text":"n/2 [2a + (n−1)d]"},{"label":"B","text":"na^n"},{"label":"C","text":"a(1−r^n)/(1−r)"},{"label":"D","text":"a+d"}]',
 'A',
 'AP sum formula.',
 'Mathematics','Sequences & Series'),

('Matrices & Determinants: For square matrices A and B of same order, det(AB) equals',
 '[{"label":"A","text":"det(A) det(B)"},{"label":"B","text":"det(A) + det(B)"},{"label":"C","text":"det(A)/det(B)"},{"label":"D","text":"det(A)−det(B)"}]',
 'A',
 'Multiplicative property of determinant.',
 'Mathematics','Matrices & Determinants'),

('Functions: The composition (f ∘ g)(x) equals',
 '[{"label":"A","text":"f(g(x))"},{"label":"B","text":"g(f(x))"},{"label":"C","text":"f(x)+g(x)"},{"label":"D","text":"f(x)g(x)"}]',
 'A',
 'Apply g first, then f.',
 'Mathematics','Functions'),

('Binomial Theorem: The expansion of (a + b)^n uses',
 '[{"label":"A","text":"Binomial coefficients"},{"label":"B","text":"Only Pascal’s triangle without coefficients"},{"label":"C","text":"Random coefficients"},{"label":"D","text":"No coefficients"}]',
 'A',
 'nCk weights each term.',
 'Mathematics','Binomial Theorem'),

('Permutations & Combinations: The number of permutations of n distinct objects taken r at a time is',
 '[{"label":"A","text":"n!/(n−r)!"},{"label":"B","text":"n!/r!(n−r)!"},{"label":"C","text":"r!/n!"},{"label":"D","text":"n^r/r!"}]',
 'A',
 'Definition of nPr.',
 'Mathematics','Permutations & Combinations')
ON CONFLICT (subject, topic, question) DO NOTHING;