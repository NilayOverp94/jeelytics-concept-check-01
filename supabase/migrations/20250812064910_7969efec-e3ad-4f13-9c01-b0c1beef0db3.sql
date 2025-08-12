
-- 1) Secure the questions table (block direct reads; RPCs will still work)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Optionally revoke direct privileges from anon/authenticated
REVOKE SELECT ON TABLE public.questions FROM anon, authenticated;
REVOKE INSERT ON TABLE public.questions FROM anon, authenticated;
REVOKE UPDATE ON TABLE public.questions FROM anon, authenticated;
REVOKE DELETE ON TABLE public.questions FROM anon, authenticated;

-- 2) Guard against duplicate entries in answered_questions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'answered_questions_user_qid_unique'
  ) THEN
    CREATE UNIQUE INDEX answered_questions_user_qid_unique
      ON public.answered_questions (user_id, question_id);
  END IF;
END$$;

-- 3) Seed questions across subjects/topics (5 per topic)

-- ========== Physics - Thermodynamics ==========
INSERT INTO public.questions (question, options, correct_answer, explanation, subject, topic) VALUES
('Which statement best represents the First Law of Thermodynamics?', 
 '[{"label":"A","text":"Energy can be created and destroyed"},{"label":"B","text":"Heat supplied = increase in internal energy + work done"},{"label":"C","text":"Entropy of the universe always decreases"},{"label":"D","text":"Pressure is constant in all processes"}]'::jsonb,
 'B','ΔQ = ΔU + W relates heat, internal energy, and work.','Physics','Thermodynamics'),
('For an ideal gas, which relation is correct for a reversible isothermal process?', 
 '[{"label":"A","text":"PV = constant"},{"label":"B","text":"P/T = constant"},{"label":"C","text":"V/T = constant"},{"label":"D","text":"U = constant"}]'::jsonb,
 'A','In isothermal (ideal gas), PV = constant since T is constant.','Physics','Thermodynamics'),
('For an ideal gas, the relation between molar heats is:', 
 '[{"label":"A","text":"Cp = Cv"},{"label":"B","text":"Cp - Cv = R"},{"label":"C","text":"Cp + Cv = R"},{"label":"D","text":"2Cp = Cv"}]'::jsonb,
 'B','Mayer’s relation: Cp - Cv = R for ideal gas.','Physics','Thermodynamics'),
('Which statement about entropy is correct?', 
 '[{"label":"A","text":"Entropy decreases in all natural processes"},{"label":"B","text":"Entropy remains constant in all real processes"},{"label":"C","text":"Entropy increases in irreversible processes"},{"label":"D","text":"Entropy is independent of temperature"}]'::jsonb,
 'C','Entropy increases for spontaneous (irreversible) processes.','Physics','Thermodynamics'),
('In an adiabatic expansion of an ideal gas:', 
 '[{"label":"A","text":"Heat is supplied to the system"},{"label":"B","text":"Temperature remains constant"},{"label":"C","text":"No heat exchange occurs"},{"label":"D","text":"Internal energy does not change"}]'::jsonb,
 'C','Adiabatic: Q = 0 (no heat exchange).','Physics','Thermodynamics');

-- ========== Physics - Modern Physics ==========
INSERT INTO public.questions (question, options, correct_answer, explanation, subject, topic) VALUES
('In the photoelectric effect, the maximum kinetic energy of emitted electrons depends on:', 
 '[{"label":"A","text":"Light intensity only"},{"label":"B","text":"Light frequency only"},{"label":"C","text":"Both intensity and frequency equally"},{"label":"D","text":"Area of the metal"}]'::jsonb,
 'B','Kmax = h(f - f0); it depends on frequency, not intensity.','Physics','Modern Physics'),
('The de Broglie wavelength of a particle is given by:', 
 '[{"label":"A","text":"λ = h/p"},{"label":"B","text":"λ = p/h"},{"label":"C","text":"λ = hc/E"},{"label":"D","text":"λ = E/h"}]'::jsonb,
 'A','de Broglie relation: λ = h/p.','Physics','Modern Physics'),
('In Bohr''s model, the energy of the nth orbit in hydrogen varies as:', 
 '[{"label":"A","text":"+1/n"},{"label":"B","text":"-1/n"},{"label":"C","text":"-1/n^2"},{"label":"D","text":"+1/n^2"}]'::jsonb,
 'C','En ∝ -1/n^2 for hydrogen-like atoms.','Physics','Modern Physics'),
('Isotopes are atoms of the same element that have:', 
 '[{"label":"A","text":"Same mass number, different atomic number"},{"label":"B","text":"Same atomic number, different mass number"},{"label":"C","text":"Different atomic and mass numbers"},{"label":"D","text":"Same number of neutrons"}]'::jsonb,
 'B','Isotopes: same Z (protons), different A (mass).','Physics','Modern Physics'),
('Energy released in nuclear reactions primarily comes from:', 
 '[{"label":"A","text":"Electron transitions"},{"label":"B","text":"Chemical bonds breaking"},{"label":"C","text":"Mass defect (E = mc^2)"},{"label":"D","text":"Thermal energy"}]'::jsonb,
 'C','Binding energy from mass defect is converted to energy.','Physics','Modern Physics');

-- ========== Chemistry - Organic Chemistry ==========
INSERT INTO public.questions (question, options, correct_answer, explanation, subject, topic) VALUES
('The functional group present in alcohols is:', 
 '[{"label":"A","text":"-CHO"},{"label":"B","text":"-COOH"},{"label":"C","text":"-OH"},{"label":"D","text":"-NH2"}]'::jsonb,
 'C','Alcohols contain the hydroxyl (-OH) group.','Chemistry','Organic Chemistry'),
('Tertiary alkyl halides mostly undergo:', 
 '[{"label":"A","text":"SN1 reactions"},{"label":"B","text":"SN2 reactions"},{"label":"C","text":"E2 only"},{"label":"D","text":"Free radical substitution"}]'::jsonb,
 'A','Tertiary carbocations are stable → SN1 favored.','Chemistry','Organic Chemistry'),
('Nitration of benzene uses the nitrating mixture:', 
 '[{"label":"A","text":"H2SO4 + H2O"},{"label":"B","text":"HNO3 + H2SO4"},{"label":"C","text":"HCl + HNO3"},{"label":"D","text":"NaNO2 + HCl"}]'::jsonb,
 'B','Mixed acid generates the electrophile NO2+.','Chemistry','Organic Chemistry'),
('Oxidation of a primary alcohol generally gives:', 
 '[{"label":"A","text":"Ketone"},{"label":"B","text":"Aldehyde (then acid on further oxidation)"},{"label":"C","text":"Amine"},{"label":"D","text":"Ether"}]'::jsonb,
 'B','Primary alcohol → aldehyde → carboxylic acid (strong oxidants).','Chemistry','Organic Chemistry'),
('The IUPAC name of isobutane is:', 
 '[{"label":"A","text":"2-methylpropane"},{"label":"B","text":"methylpropane"},{"label":"C","text":"1-methylpropane"},{"label":"D","text":"2-ethylmethane"}]'::jsonb,
 'A','Isobutane is 2-methylpropane.','Chemistry','Organic Chemistry');

-- ========== Chemistry - Chemical Bonding ==========
INSERT INTO public.questions (question, options, correct_answer, explanation, subject, topic) VALUES
('The hybridization of carbon in methane (CH4) is:', 
 '[{"label":"A","text":"sp"},{"label":"B","text":"sp2"},{"label":"C","text":"sp3"},{"label":"D","text":"sp3d"}]'::jsonb,
 'C','CH4 has tetrahedral geometry with sp3 hybridization.','Chemistry','Chemical Bonding'),
('The shape of CO2 according to VSEPR theory is:', 
 '[{"label":"A","text":"Bent"},{"label":"B","text":"Linear"},{"label":"C","text":"Trigonal planar"},{"label":"D","text":"Tetrahedral"}]'::jsonb,
 'B','CO2 is linear (O=C=O).','Chemistry','Chemical Bonding'),
('Ionic bonds are generally formed between:', 
 '[{"label":"A","text":"Two non-metals"},{"label":"B","text":"Two metals"},{"label":"C","text":"Metal and non-metal"},{"label":"D","text":"Metalloid and non-metal"}]'::jsonb,
 'C','Large electronegativity difference → ionic bonding.','Chemistry','Chemical Bonding'),
('Hydrogen bonding is strongest in:', 
 '[{"label":"A","text":"HF"},{"label":"B","text":"HCl"},{"label":"C","text":"HBr"},{"label":"D","text":"HI"}]'::jsonb,
 'A','HF shows strong H-bonding, raising its boiling point.','Chemistry','Chemical Bonding'),
('Lattice energy increases when:', 
 '[{"label":"A","text":"Ion charges decrease"},{"label":"B","text":"Ion size increases"},{"label":"C","text":"Ion charges increase and size decreases"},{"label":"D","text":"Crystal becomes amorphous"}]'::jsonb,
 'C','Higher charges and smaller ions → stronger attraction.','Chemistry','Chemical Bonding');

-- ========== Mathematics - Algebra ==========
INSERT INTO public.questions (question, options, correct_answer, explanation, subject, topic) VALUES
('The discriminant of ax^2 + bx + c = 0 is:', 
 '[{"label":"A","text":"b^2 - 4ac"},{"label":"B","text":"b^2 + 4ac"},{"label":"C","text":"(b - 2ac)^2"},{"label":"D","text":"(b + 2ac)^2"}]'::jsonb,
 'A','D = b^2 - 4ac.','Mathematics','Algebra'),
('If roots of x^2 - 5x + 6 = 0 are α, β, then α + β and αβ are:', 
 '[{"label":"A","text":"5 and 6"},{"label":"B","text":"6 and 5"},{"label":"C","text":"-5 and 6"},{"label":"D","text":"5 and -6"}]'::jsonb,
 'A','Sum = 5, product = 6 (Vieta’s formulas).','Mathematics','Algebra'),
('If log_a b = x and log_b a = y, then xy equals:', 
 '[{"label":"A","text":"1"},{"label":"B","text":"0"},{"label":"C","text":"a"},{"label":"D","text":"b"}]'::jsonb,
 'A','log_a b * log_b a = 1.','Mathematics','Algebra'),
('The determinant of [[a, b],[c, d]] is:', 
 '[{"label":"A","text":"ab - cd"},{"label":"B","text":"ad - bc"},{"label":"C","text":"ac - bd"},{"label":"D","text":"a + d"}]'::jsonb,
 'B','2x2 determinant = ad - bc.','Mathematics','Algebra'),
('If (1 + x)^n expanded, the general term is:', 
 '[{"label":"A","text":"nCk x^k"},{"label":"B","text":"nPk x^k"},{"label":"C","text":"nCk x^{k-1}"},{"label":"D","text":"nCk x^{k+1}"}]'::jsonb,
 'A','General term T_{k+1} = C(n,k) x^k.','Mathematics','Algebra');

-- ========== Mathematics - Calculus ==========
INSERT INTO public.questions (question, options, correct_answer, explanation, subject, topic) VALUES
('d/dx [sin x] equals:', 
 '[{"label":"A","text":"sin x"},{"label":"B","text":"cos x"},{"label":"C","text":"-sin x"},{"label":"D","text":"-cos x"}]'::jsonb,
 'B','Derivative of sin x is cos x.','Mathematics','Calculus'),
('∫ x dx equals:', 
 '[{"label":"A","text":"x^2"},{"label":"B","text":"x^2/2 + C"},{"label":"C","text":"2x + C"},{"label":"D","text":"ln x + C"}]'::jsonb,
 'B','Power rule: ∫ x dx = x^2/2 + C.','Mathematics','Calculus'),
('Chain rule gives d/dx [f(g(x))] as:', 
 '[{"label":"A","text":"f''(g(x))"},{"label":"B","text":"f(g(x)) · g(x)"},{"label":"C","text":"f''(x) g''(x)"},{"label":"D","text":"f''(g(x)) not needed"},{"label":"E","text":"f'' incorrect option"}]'::jsonb,
 'B','It is f''(g(x))? No; correct is f''? Careful: correct is f''? This option set is wrong.','Mathematics','Calculus');

-- Correct chain rule question fix (replace previous with correct options)
DELETE FROM public.questions
WHERE subject = 'Mathematics' AND topic = 'Calculus' AND question LIKE 'Chain rule gives%';

INSERT INTO public.questions (question, options, correct_answer, explanation, subject, topic) VALUES
('Chain rule: d/dx [f(g(x))] equals:', 
 '[{"label":"A","text":"f''(g(x))"},{"label":"B","text":"f(g(x)) · g''(x)"},{"label":"C","text":"f''(x) g''(x)"},{"label":"D","text":"f''(g(x)) · g''(x)"},{"label":"E","text":"f'' incorrect"}]'::jsonb,
 'A','This is still incorrect. Correct form is f''(g(x))·g''(x).','Mathematics','Calculus');

-- Fix again: use a clean, correct set
DELETE FROM public.questions
WHERE subject = 'Mathematics' AND topic = 'Calculus' AND question LIKE 'Chain rule:%';

INSERT INTO public.questions (question, options, correct_answer, explanation, subject, topic) VALUES
('Using the chain rule, d/dx [f(g(x))] equals:', 
 '[{"label":"A","text":"f''(g(x))"},{"label":"B","text":"f''(x) g''(x)"},{"label":"C","text":"f''(g(x)) · g''(x)"},{"label":"D","text":"f''(x) g(x)"}]'::jsonb,
 'C','Chain rule: (f∘g)''(x) = f''(g(x)) · g''(x).','Mathematics','Calculus'),
('If y = e^{2x}, dy/dx equals:', 
 '[{"label":"A","text":"2e^{2x}"},{"label":"B","text":"e^{x}"},{"label":"C","text":"e^{2x}"},{"label":"D","text":"2e^{x}"}]'::jsonb,
 'A','Derivative of e^{kx} is k e^{kx}.','Mathematics','Calculus'),
('If F(x) = ∫_0^x t^2 dt, then F''(x) equals:', 
 '[{"label":"A","text":"x"},{"label":"B","text":"x^2"},{"label":"C","text":"2x"},{"label":"D","text":"3x^2"}]'::jsonb,
 'B','F(x) = x^3/3 so F''(x) = 2x. Wait correction below.', 'Mathematics','Calculus');

-- Fix the last one with correct explanation/answer
DELETE FROM public.questions
WHERE subject = 'Mathematics' AND topic = 'Calculus' AND question LIKE 'If F(x) = ∫_0^x t^2 dt%';

INSERT INTO public.questions (question, options, correct_answer, explanation, subject, topic) VALUES
('If F(x) = ∫_0^x t^2 dt, then F''(x) equals:', 
 '[{"label":"A","text":"x"},{"label":"B","text":"x^2"},{"label":"C","text":"2x"},{"label":"D","text":"3x^2"}]'::jsonb,
 'B','F(x) = x^3/3, so F''(x) = x^2.', 'Mathematics','Calculus');

-- Ensure total of 5 calculus questions
INSERT INTO public.questions (question, options, correct_answer, explanation, subject, topic) VALUES
('Limit: lim_{x→0} (sin x)/x equals:', 
 '[{"label":"A","text":"0"},{"label":"B","text":"1"},{"label":"C","text":"∞"},{"label":"D","text":"Does not exist"}]'::jsonb,
 'B','Standard limit lim (sin x)/x = 1.','Mathematics','Calculus');

-- After these seeds, each listed topic has at least 5 questions
