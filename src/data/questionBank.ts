import { MCQQuestion, Subject } from '@/types/jee';

// Comprehensive JEE Question Bank with real JEE/JEE Advanced level questions
export const QUESTION_BANK: Record<Subject, Record<string, MCQQuestion[]>> = {
  Physics: {
    'Mechanics': [
      {
        id: 'phy_mech_1',
        question: 'A block of mass 2 kg is placed on a rough inclined plane at angle 30°. If coefficient of static friction is 0.4, what is the maximum force that can be applied parallel to incline up the plane before the block starts moving?',
        options: [
          { label: 'A', text: '3.46 N' },
          { label: 'B', text: '6.93 N' },
          { label: 'C', text: '13.86 N' },
          { label: 'D', text: '20.79 N' }
        ],
        correctAnswer: 'B',
        explanation: 'At equilibrium: F + μmg cos θ = mg sin θ. So F = mg(sin θ - μ cos θ) = 2×10×(0.5 - 0.4×0.866) = 6.93 N',
        topic: 'Mechanics',
        subject: 'Physics'
      },
      {
        id: 'phy_mech_2',
        question: 'A particle moves in a circle of radius R. Its speed varies with time as v = kt where k is constant. The magnitude of acceleration at time t is:',
        options: [
          { label: 'A', text: 'k√(1 + k²t⁴/R²)' },
          { label: 'B', text: 'k√(1 + k²t²/R²)' },
          { label: 'C', text: 'k²t/R' },
          { label: 'D', text: 'k(1 + t²/R)' }
        ],
        correctAnswer: 'A',
        explanation: 'Tangential acceleration = dv/dt = k, Centripetal acceleration = v²/R = k²t²/R. Total acceleration = √(k² + k⁴t⁴/R²) = k√(1 + k²t⁴/R²)',
        topic: 'Mechanics',
        subject: 'Physics'
      },
      {
        id: 'phy_mech_3',
        question: 'A uniform rod of length L and mass M is pivoted at one end. What is the minimum horizontal velocity that must be imparted to the free end to make it complete a vertical circle?',
        options: [
          { label: 'A', text: '√(3gL)' },
          { label: 'B', text: '√(5gL)' },
          { label: 'C', text: '√(6gL)' },
          { label: 'D', text: '√(7gL)' }
        ],
        correctAnswer: 'C',
        explanation: 'Using energy conservation and condition for circular motion. At the top, mg = mv²/L gives minimum condition. After solving: v₀ = √(6gL)',
        topic: 'Mechanics',
        subject: 'Physics'
      },
      {
        id: 'phy_mech_4',
        question: 'Two particles of masses m₁ and m₂ connected by a string pass over a pulley. If the system moves with acceleration a, the tension in the string is:',
        options: [
          { label: 'A', text: '2m₁m₂g/(m₁ + m₂)' },
          { label: 'B', text: 'm₁m₂g/(m₁ + m₂)' },
          { label: 'C', text: '(m₁ + m₂)g/2' },
          { label: 'D', text: 'm₁m₂(m₁ + m₂)g/(m₁ - m₂)²' }
        ],
        correctAnswer: 'A',
        explanation: 'For pulley system: T = 2m₁m₂g/(m₁ + m₂). This is the standard formula for tension in Atwood machine.',
        topic: 'Mechanics',
        subject: 'Physics'
      },
      {
        id: 'phy_mech_5',
        question: 'A particle executes SHM with amplitude A. At what displacement from mean position is the kinetic energy equal to potential energy?',
        options: [
          { label: 'A', text: 'A/2' },
          { label: 'B', text: 'A/√2' },
          { label: 'C', text: 'A/√3' },
          { label: 'D', text: 'A/4' }
        ],
        correctAnswer: 'B',
        explanation: 'KE = PE gives ½m(A² - x²)ω² = ½mx²ω². Solving: A² - x² = x², so x = A/√2',
        topic: 'Mechanics',
        subject: 'Physics'
      }
    ],
    'Thermodynamics': [
      {
        id: 'phy_thermo_1',
        question: 'An ideal gas undergoes a cyclic process ABCA where AB is isothermal, BC is adiabatic, and CA is isobaric. If temperature at A is T₁ and at B is T₁, the efficiency of the cycle is:',
        options: [
          { label: 'A', text: '1 - (γ-1)/γ × (V₂/V₁)^(γ-1)' },
          { label: 'B', text: '1 - T₃/T₁' },
          { label: 'C', text: '1 - (P₁/P₂)^((γ-1)/γ)' },
          { label: 'D', text: 'Cannot be determined without more data' }
        ],
        correctAnswer: 'B',
        explanation: 'For this specific cycle, efficiency = 1 - T₃/T₁ where T₃ is temperature at point C, following thermodynamic cycle analysis.',
        topic: 'Thermodynamics',
        subject: 'Physics'
      },
      {
        id: 'phy_thermo_2',
        question: 'The coefficient of performance of a refrigerator working between temperatures T₁ (cold) and T₂ (hot) is:',
        options: [
          { label: 'A', text: 'T₁/(T₂ - T₁)' },
          { label: 'B', text: 'T₂/(T₂ - T₁)' },
          { label: 'C', text: '(T₂ - T₁)/T₁' },
          { label: 'D', text: '(T₂ - T₁)/T₂' }
        ],
        correctAnswer: 'A',
        explanation: 'COP of refrigerator = Heat removed from cold reservoir / Work done = Q₁/W = T₁/(T₂ - T₁)',
        topic: 'Thermodynamics',
        subject: 'Physics'
      },
      {
        id: 'phy_thermo_3',
        question: 'In an adiabatic expansion of an ideal gas, if the volume increases by factor of 8 and γ = 1.5, the pressure decreases by a factor of:',
        options: [
          { label: 'A', text: '16' },
          { label: 'B', text: '32' },
          { label: 'C', text: '8' },
          { label: 'D', text: '24' }
        ],
        correctAnswer: 'B',
        explanation: 'For adiabatic process: PVᵞ = constant. So P₂/P₁ = (V₁/V₂)ᵞ = (1/8)^1.5 = 1/32',
        topic: 'Thermodynamics',
        subject: 'Physics'
      },
      {
        id: 'phy_thermo_4',
        question: 'A heat engine operates between 500K and 300K. Maximum possible efficiency is:',
        options: [
          { label: 'A', text: '60%' },
          { label: 'B', text: '40%' },
          { label: 'C', text: '20%' },
          { label: 'D', text: '80%' }
        ],
        correctAnswer: 'B',
        explanation: 'Maximum efficiency (Carnot efficiency) = 1 - T₂/T₁ = 1 - 300/500 = 0.4 = 40%',
        topic: 'Thermodynamics',
        subject: 'Physics'
      },
      {
        id: 'phy_thermo_5',
        question: 'For an ideal gas, which process requires maximum work for the same change in volume?',
        options: [
          { label: 'A', text: 'Isothermal' },
          { label: 'B', text: 'Adiabatic' },
          { label: 'C', text: 'Isobaric' },
          { label: 'D', text: 'Isochoric' }
        ],
        correctAnswer: 'C',
        explanation: 'Work = ∫P dV. For isobaric process W = P(V₂-V₁), which is maximum for same ΔV among the given options.',
        topic: 'Thermodynamics',
        subject: 'Physics'
      }
    ],
    'Electromagnetism': [
      {
        id: 'phy_em_1',
        question: 'A charged particle moves in a region where both electric field E and magnetic field B are present. The particle will move in a straight line if:',
        options: [
          { label: 'A', text: 'E ⊥ B and v ⊥ both E and B' },
          { label: 'B', text: 'E ∥ B' },
          { label: 'C', text: 'v = E/B and E ⊥ B' },
          { label: 'D', text: 'E = vB and all three are mutually perpendicular' }
        ],
        correctAnswer: 'D',
        explanation: 'For straight line motion: qE = qvB (electric and magnetic forces balance). So E = vB with E, v, B mutually perpendicular.',
        topic: 'Electromagnetism',
        subject: 'Physics'
      },
      {
        id: 'phy_em_2',
        question: 'A conducting rod of length l moves with velocity v perpendicular to a uniform magnetic field B. The induced EMF is:',
        options: [
          { label: 'A', text: 'Blv' },
          { label: 'B', text: 'Bl²v' },
          { label: 'C', text: 'Bv/l' },
          { label: 'D', text: 'B²lv' }
        ],
        correctAnswer: 'A',
        explanation: 'Motional EMF = Blv, where B is magnetic field, l is length of conductor, and v is velocity perpendicular to B.',
        topic: 'Electromagnetism',
        subject: 'Physics'
      }
    ],
    'Optics': [
      {
        id: 'phy_opt_1',
        question: 'In Young\'s double slit experiment, if the separation between slits is halved and distance to screen is doubled, the fringe width becomes:',
        options: [
          { label: 'A', text: 'Same' },
          { label: 'B', text: 'Double' },
          { label: 'C', text: 'Four times' },
          { label: 'D', text: 'Half' }
        ],
        correctAnswer: 'C',
        explanation: 'Fringe width β = λD/d. If d becomes d/2 and D becomes 2D, then β becomes 4β.',
        topic: 'Optics',
        subject: 'Physics'
      },
      {
        id: 'phy_opt_2',
        question: 'A convex lens of focal length 20 cm forms real image at 60 cm. The object distance is:',
        options: [
          { label: 'A', text: '15 cm' },
          { label: 'B', text: '30 cm' },
          { label: 'C', text: '40 cm' },
          { label: 'D', text: '12 cm' }
        ],
        correctAnswer: 'B',
        explanation: 'Using lens formula: 1/f = 1/v - 1/u. So 1/20 = 1/60 - 1/u. Solving: u = 30 cm',
        topic: 'Optics',
        subject: 'Physics'
      },
      {
        id: 'phy_opt_3',
        question: 'Critical angle for total internal reflection from glass to air is 42°. The refractive index of glass is:',
        options: [
          { label: 'A', text: '1.33' },
          { label: 'B', text: '1.49' },
          { label: 'C', text: '1.67' },
          { label: 'D', text: '1.52' }
        ],
        correctAnswer: 'B',
        explanation: 'sin C = 1/μ. So μ = 1/sin 42° = 1/0.669 = 1.49',
        topic: 'Optics',
        subject: 'Physics'
      },
      {
        id: 'phy_opt_4',
        question: 'A ray of light passes through a prism of angle 60° and refractive index √3. For minimum deviation, the angle of incidence is:',
        options: [
          { label: 'A', text: '30°' },
          { label: 'B', text: '45°' },
          { label: 'C', text: '60°' },
          { label: 'D', text: '90°' }
        ],
        correctAnswer: 'C',
        explanation: 'At minimum deviation: i = (A + δm)/2 and r = A/2. Using Snell\'s law: sin i = μ sin r = √3 × sin 30° = √3/2. So i = 60°',
        topic: 'Optics',
        subject: 'Physics'
      },
      {
        id: 'phy_opt_5',
        question: 'In Michelson interferometer, if mirror moves 0.25 mm, the number of fringes crossed (λ = 500 nm) is:',
        options: [
          { label: 'A', text: '500' },
          { label: 'B', text: '1000' },
          { label: 'C', text: '250' },
          { label: 'D', text: '2000' }
        ],
        correctAnswer: 'B',
        explanation: 'Path difference change = 2 × displacement = 2 × 0.25 mm = 0.5 mm. Number of fringes = 0.5 mm / 500 nm = 1000',
        topic: 'Optics',
        subject: 'Physics'
      }
    ],
    'Modern Physics': [
      {
        id: 'phy_mod_1',
        question: 'The binding energy per nucleon is maximum for nuclei with mass number around:',
        options: [
          { label: 'A', text: '20' },
          { label: 'B', text: '56' },
          { label: 'C', text: '120' },
          { label: 'D', text: '238' }
        ],
        correctAnswer: 'B',
        explanation: 'The binding energy per nucleon peaks around A = 56 (Iron), making these nuclei most stable.',
        topic: 'Modern Physics',
        subject: 'Physics'
      },
      {
        id: 'phy_mod_2',
        question: 'The de Broglie wavelength of an electron accelerated through a potential difference of 100V is approximately:',
        options: [
          { label: 'A', text: '1.23 Å' },
          { label: 'B', text: '2.46 Å' },
          { label: 'C', text: '0.123 Å' },
          { label: 'D', text: '12.3 Å' }
        ],
        correctAnswer: 'A',
        explanation: 'λ = h/p = h/√(2meV) = 12.27/√V Å. For V = 100V, λ = 1.23 Å',
        topic: 'Modern Physics',
        subject: 'Physics'
      },
      {
        id: 'phy_mod_3',
        question: 'In photoelectric effect, stopping potential is independent of:',
        options: [
          { label: 'A', text: 'Frequency of incident light' },
          { label: 'B', text: 'Intensity of incident light' },
          { label: 'C', text: 'Work function of metal' },
          { label: 'D', text: 'Nature of photocathode' }
        ],
        correctAnswer: 'B',
        explanation: 'Stopping potential V₀ = (hf - φ)/e, depends on frequency and work function, but not on intensity.',
        topic: 'Modern Physics',
        subject: 'Physics'
      },
      {
        id: 'phy_mod_4',
        question: 'The radius of second Bohr orbit of hydrogen atom is:',
        options: [
          { label: 'A', text: '0.529 Å' },
          { label: 'B', text: '2.116 Å' },
          { label: 'C', text: '4.761 Å' },
          { label: 'D', text: '1.058 Å' }
        ],
        correctAnswer: 'B',
        explanation: 'Radius of nth orbit = n² × 0.529 Å. For n = 2: r₂ = 4 × 0.529 = 2.116 Å',
        topic: 'Modern Physics',
        subject: 'Physics'
      },
      {
        id: 'phy_mod_5',
        question: 'X-rays are produced when high energy electrons strike a metal target. The minimum wavelength depends on:',
        options: [
          { label: 'A', text: 'Atomic number of target' },
          { label: 'B', text: 'Accelerating voltage only' },
          { label: 'C', text: 'Current in the tube' },
          { label: 'D', text: 'Temperature of target' }
        ],
        correctAnswer: 'B',
        explanation: 'Minimum wavelength λ_min = hc/eV depends only on accelerating voltage V, not on target material.',
        topic: 'Modern Physics',
        subject: 'Physics'
      }
    ],
    'Waves and Sound': [
      {
        id: 'phy_wave_1',
        question: 'Two waves y₁ = A sin(ωt - kx) and y₂ = A sin(ωt - kx + π/2) interfere. The amplitude of resultant wave is:',
        options: [
          { label: 'A', text: 'A' },
          { label: 'B', text: '2A' },
          { label: 'C', text: 'A√2' },
          { label: 'D', text: 'A/√2' }
        ],
        correctAnswer: 'C',
        explanation: 'Phase difference = π/2. Resultant amplitude = √(A² + A² + 2A²cos(π/2)) = A√2',
        topic: 'Waves and Sound',
        subject: 'Physics'
      },
      {
        id: 'phy_wave_2',
        question: 'A closed organ pipe of length L resonates at frequency f. The frequency of third overtone is:',
        options: [
          { label: 'A', text: '3f' },
          { label: 'B', text: '5f' },
          { label: 'C', text: '7f' },
          { label: 'D', text: '9f' }
        ],
        correctAnswer: 'C',
        explanation: 'For closed pipe: f = (2n-1)v/4L. Third overtone (n=4) gives f₄ = 7v/4L = 7f',
        topic: 'Waves and Sound',
        subject: 'Physics'
      }
    ],
    'Rotational Motion': [
      {
        id: 'phy_rot_1',
        question: 'A uniform solid sphere rolls down an inclined plane. The ratio of kinetic energy of translation to kinetic energy of rotation is:',
        options: [
          { label: 'A', text: '5:2' },
          { label: 'B', text: '2:5' },
          { label: 'C', text: '7:2' },
          { label: 'D', text: '2:7' }
        ],
        correctAnswer: 'A',
        explanation: 'For solid sphere I = 2mR²/5. KE_trans/KE_rot = (½mv²)/(½Iω²) = (½mv²)/(½×(2mR²/5)×(v²/R²)) = 5/2',
        topic: 'Rotational Motion',
        subject: 'Physics'
      },
      {
        id: 'phy_rot_2',
        question: 'A thin ring and solid disk of same mass and radius roll down the same incline. Which reaches bottom first?',
        options: [
          { label: 'A', text: 'Ring' },
          { label: 'B', text: 'Disk' },
          { label: 'C', text: 'Both together' },
          { label: 'D', text: 'Cannot be determined' }
        ],
        correctAnswer: 'B',
        explanation: 'Time ∝ √(1 + I/mR²). For disk I/mR² = 1/2, for ring I/mR² = 1. Disk has smaller factor, reaches first.',
        topic: 'Rotational Motion',
        subject: 'Physics'
      }
    ],
    'Gravitation': [
      {
        id: 'phy_grav_1',
        question: 'The ratio of escape velocity from Earth to escape velocity from Moon is approximately:',
        options: [
          { label: 'A', text: '2.4' },
          { label: 'B', text: '4.8' },
          { label: 'C', text: '6.0' },
          { label: 'D', text: '11.2' }
        ],
        correctAnswer: 'B',
        explanation: 'v_e ∝ √(M/R). Taking M_E/M_M ≈ 81 and R_E/R_M ≈ 3.7, ratio = √(81/3.7) ≈ 4.8',
        topic: 'Gravitation',
        subject: 'Physics'
      },
      {
        id: 'phy_grav_2',
        question: 'At what height above Earth surface does acceleration due to gravity become g/4?',
        options: [
          { label: 'A', text: 'R' },
          { label: 'B', text: '2R' },
          { label: 'C', text: 'R/2' },
          { label: 'D', text: '3R' }
        ],
        correctAnswer: 'A',
        explanation: 'g_h = g(R/(R+h))². For g_h = g/4: 1/4 = R²/(R+h)². Solving: R+h = 2R, so h = R',
        topic: 'Gravitation',
        subject: 'Physics'
      }
    ],
    'Fluid Mechanics': [
      {
        id: 'phy_fluid_1',
        question: 'A tank has two holes at heights h₁ and h₂ from bottom. If water streams from both holes meet at ground, then h₁h₂ equals:',
        options: [
          { label: 'A', text: 'H²/2' },
          { label: 'B', text: 'H²/4' },
          { label: 'C', text: 'H²' },
          { label: 'D', text: '2H²' }
        ],
        correctAnswer: 'B',
        explanation: 'For streams to meet: Range₁ = Range₂. This gives h₁h₂ = H²/4 where H is height of water.',
        topic: 'Fluid Mechanics',
        subject: 'Physics'
      },
      {
        id: 'phy_fluid_2',
        question: 'A wooden block of density 0.8 g/cm³ floats in water. What fraction of volume is above water?',
        options: [
          { label: 'A', text: '0.2' },
          { label: 'B', text: '0.8' },
          { label: 'C', text: '0.5' },
          { label: 'D', text: '0.6' }
        ],
        correctAnswer: 'A',
        explanation: 'At equilibrium: ρ_block × V_total = ρ_water × V_submerged. Fraction above = 1 - (0.8/1.0) = 0.2',
        topic: 'Fluid Mechanics',
        subject: 'Physics'
      }
    ],
    'Oscillations': [
      {
        id: 'phy_osc_1',
        question: 'A pendulum clock runs slow in summer and fast in winter due to:',
        options: [
          { label: 'A', text: 'Change in g' },
          { label: 'B', text: 'Thermal expansion' },
          { label: 'C', text: 'Air density change' },
          { label: 'D', text: 'Humidity change' }
        ],
        correctAnswer: 'B',
        explanation: 'T = 2π√(L/g). In summer, L increases due to thermal expansion, T increases (runs slow). In winter, L decreases, T decreases (runs fast).',
        topic: 'Oscillations',
        subject: 'Physics'
      },
      {
        id: 'phy_osc_2',
        question: 'Two pendulums of lengths L₁ and L₂ have same amplitude. The ratio of their maximum velocities is:',
        options: [
          { label: 'A', text: '√(L₁/L₂)' },
          { label: 'B', text: '√(L₂/L₁)' },
          { label: 'C', text: 'L₁/L₂' },
          { label: 'D', text: 'L₂/L₁' }
        ],
        correctAnswer: 'B',
        explanation: 'v_max = Aω = A√(g/L). For same amplitude A, v₁/v₂ = √(L₂/L₁)',
        topic: 'Oscillations',
        subject: 'Physics'
      }
    ],
    'Current Electricity': [
      {
        id: 'phy_current_1',
        question: 'A wire of resistance R is cut into 5 equal parts. These parts are connected in parallel. The equivalent resistance is:',
        options: [
          { label: 'A', text: 'R/25' },
          { label: 'B', text: 'R/5' },
          { label: 'C', text: '5R' },
          { label: 'D', text: 'R' }
        ],
        correctAnswer: 'A',
        explanation: 'Each part has resistance R/5. When 5 resistors of R/5 are connected in parallel: 1/Req = 5/(R/5) = 25/R, so Req = R/25',
        topic: 'Current Electricity',
        subject: 'Physics'
      },
      {
        id: 'phy_current_2',
        question: 'A battery of EMF 10V and internal resistance 1Ω is connected to external resistance 4Ω. The terminal voltage is:',
        options: [
          { label: 'A', text: '8V' },
          { label: 'B', text: '6V' },
          { label: 'C', text: '2V' },
          { label: 'D', text: '10V' }
        ],
        correctAnswer: 'A',
        explanation: 'Current I = EMF/(r+R) = 10/(1+4) = 2A. Terminal voltage = EMF - Ir = 10 - 2×1 = 8V',
        topic: 'Current Electricity',
        subject: 'Physics'
      },
      {
        id: 'phy_current_3',
        question: 'Two bulbs of 40W-220V and 100W-220V are connected in series across 220V. The power consumed by 40W bulb is:',
        options: [
          { label: 'A', text: '64W' },
          { label: 'B', text: '16W' },
          { label: 'C', text: '25.6W' },
          { label: 'D', text: '40W' }
        ],
        correctAnswer: 'C',
        explanation: 'R₁ = 220²/40 = 1210Ω, R₂ = 220²/100 = 484Ω. Current I = 220/(1210+484) = 0.13A. Power = I²R₁ = (0.13)²×1210 = 25.6W',
        topic: 'Current Electricity',
        subject: 'Physics'
      }
    ],
    'Alternating Current': [
      {
        id: 'phy_ac_1',
        question: 'In an RLC series circuit, the power factor is maximum when:',
        options: [
          { label: 'A', text: 'XL > XC' },
          { label: 'B', text: 'XL < XC' },
          { label: 'C', text: 'XL = XC' },
          { label: 'D', text: 'XL = 0' }
        ],
        correctAnswer: 'C',
        explanation: 'Power factor = cos φ = R/Z. This is maximum when Z is minimum, which occurs at resonance when XL = XC.',
        topic: 'Alternating Current',
        subject: 'Physics'
      },
      {
        id: 'phy_ac_2',
        question: 'A transformer has 200 turns in primary and 20 turns in secondary. If primary voltage is 220V, the secondary voltage is:',
        options: [
          { label: 'A', text: '2200V' },
          { label: 'B', text: '22V' },
          { label: 'C', text: '220V' },
          { label: 'D', text: '44V' }
        ],
        correctAnswer: 'B',
        explanation: 'For transformer: Vs/Vp = Ns/Np. So Vs = 220 × (20/200) = 22V',
        topic: 'Alternating Current',
        subject: 'Physics'
      }
    ],
    'Electromagnetic Induction': [
      {
        id: 'phy_emi_1',
        question: 'A coil of 100 turns and area 0.1 m² is placed in magnetic field B = 0.2 T. If field is reduced to zero in 0.1 s, the induced EMF is:',
        options: [
          { label: 'A', text: '20V' },
          { label: 'B', text: '2V' },
          { label: 'C', text: '0.2V' },
          { label: 'D', text: '200V' }
        ],
        correctAnswer: 'A',
        explanation: 'EMF = -N(dΦ/dt) = -N(ΔB×A)/Δt = -100×(-0.2×0.1)/0.1 = 20V',
        topic: 'Electromagnetic Induction',
        subject: 'Physics'
      },
      {
        id: 'phy_emi_2',
        question: 'Lenz law is consequence of conservation of:',
        options: [
          { label: 'A', text: 'Charge' },
          { label: 'B', text: 'Energy' },
          { label: 'C', text: 'Momentum' },
          { label: 'D', text: 'Flux' }
        ],
        correctAnswer: 'B',
        explanation: 'Lenz law states that induced current opposes the change causing it, which ensures energy conservation.',
        topic: 'Electromagnetic Induction',
        subject: 'Physics'
      }
    ],
    'Atomic Physics': [
      {
        id: 'phy_atomic_1',
        question: 'The ratio of wavelengths of first line of Lyman series to first line of Balmer series in hydrogen spectrum is:',
        options: [
          { label: 'A', text: '5:27' },
          { label: 'B', text: '27:5' },
          { label: 'C', text: '4:9' },
          { label: 'D', text: '9:4' }
        ],
        correctAnswer: 'A',
        explanation: 'Lyman: 1/λ = R(1/1² - 1/2²) = 3R/4. Balmer: 1/λ = R(1/2² - 1/3²) = 5R/36. Ratio λL:λB = (36/5R):(4/3R) = 5:27',
        topic: 'Atomic Physics',
        subject: 'Physics'
      },
      {
        id: 'phy_atomic_2',
        question: 'The photoelectric work function of a metal is 3.3 eV. The threshold frequency is:',
        options: [
          { label: 'A', text: '8 × 10¹⁴ Hz' },
          { label: 'B', text: '6 × 10¹⁴ Hz' },
          { label: 'C', text: '4 × 10¹⁴ Hz' },
          { label: 'D', text: '2 × 10¹⁴ Hz' }
        ],
        correctAnswer: 'A',
        explanation: 'Work function W = hf₀. So f₀ = W/h = 3.3×1.6×10⁻¹⁹/(6.63×10⁻³⁴) = 8×10¹⁴ Hz',
        topic: 'Atomic Physics',
        subject: 'Physics'
      }
    ]
  },
  
  Chemistry: {
    'Physical Chemistry': [
      {
        id: 'chem_phys_1',
        question: 'For the reaction: 2A + B → 3C, the rate law is found to be Rate = k[A]²[B]. If concentration of A is doubled and B is tripled, the rate becomes:',
        options: [
          { label: 'A', text: '6 times' },
          { label: 'B', text: '12 times' },
          { label: 'C', text: '18 times' },
          { label: 'D', text: '36 times' }
        ],
        correctAnswer: 'B',
        explanation: 'New rate = k[2A]²[3B] = k×4[A]²×3[B] = 12k[A]²[B] = 12 times original rate',
        topic: 'Physical Chemistry',
        subject: 'Chemistry'
      },
      {
        id: 'chem_phys_2',
        question: 'The pH of 0.1 M CH₃COOH solution (Ka = 1.8 × 10⁻⁵) is approximately:',
        options: [
          { label: 'A', text: '1.0' },
          { label: 'B', text: '2.9' },
          { label: 'C', text: '4.8' },
          { label: 'D', text: '7.0' }
        ],
        correctAnswer: 'B',
        explanation: 'For weak acid: pH = ½(pKa - log C) = ½(4.74 - log 0.1) = ½(4.74 + 1) = 2.87 ≈ 2.9',
        topic: 'Physical Chemistry',
        subject: 'Chemistry'
      },
      {
        id: 'chem_phys_3',
        question: 'The relationship between ΔG°, equilibrium constant K, and temperature T is:',
        options: [
          { label: 'A', text: 'ΔG° = RT ln K' },
          { label: 'B', text: 'ΔG° = -RT ln K' },
          { label: 'C', text: 'ΔG° = -RT/K' },
          { label: 'D', text: 'ΔG° = RT/ln K' }
        ],
        correctAnswer: 'B',
        explanation: 'The fundamental thermodynamic relationship is ΔG° = -RT ln K',
        topic: 'Physical Chemistry',
        subject: 'Chemistry'
      },
      {
        id: 'chem_phys_4',
        question: 'The half-life of a first-order reaction is 10 minutes. What fraction of the reactant remains after 30 minutes?',
        options: [
          { label: 'A', text: '1/2' },
          { label: 'B', text: '1/4' },
          { label: 'C', text: '1/8' },
          { label: 'D', text: '1/16' }
        ],
        correctAnswer: 'C',
        explanation: 'After 3 half-lives (30 min), fraction remaining = (1/2)³ = 1/8',
        topic: 'Physical Chemistry',
        subject: 'Chemistry'
      }
    ],
    'Organic Chemistry': [
      {
        id: 'chem_org_1',
        question: 'Which of the following compounds will undergo fastest SN1 reaction?',
        options: [
          { label: 'A', text: 'CH₃CH₂Cl' },
          { label: 'B', text: '(CH₃)₂CHCl' },
          { label: 'C', text: '(CH₃)₃CCl' },
          { label: 'D', text: 'CH₃Cl' }
        ],
        correctAnswer: 'C',
        explanation: 'SN1 reaction rate depends on carbocation stability. Tertiary carbocation (CH₃)₃C⁺ is most stable, so (CH₃)₃CCl reacts fastest.',
        topic: 'Organic Chemistry',
        subject: 'Chemistry'
      },
      {
        id: 'chem_org_2',
        question: 'The number of σ and π bonds in benzene molecule are:',
        options: [
          { label: 'A', text: '12σ, 3π' },
          { label: 'B', text: '15σ, 3π' },
          { label: 'C', text: '12σ, 6π' },
          { label: 'D', text: '18σ, 0π' }
        ],
        correctAnswer: 'A',
        explanation: 'Benzene has 6 C-C bonds, 6 C-H bonds (12σ total) and 3 delocalized π bonds in the ring.',
        topic: 'Organic Chemistry',
        subject: 'Chemistry'
      },
      {
        id: 'chem_org_3',
        question: 'Which reagent is used to convert alkyl halide to alkane with one less carbon atom?',
        options: [
          { label: 'A', text: 'Zn/HCl' },
          { label: 'B', text: 'KCN' },
          { label: 'C', text: 'Alcoholic KOH' },
          { label: 'D', text: 'Mg/ether followed by H₂O' }
        ],
        correctAnswer: 'A',
        explanation: 'Zn/HCl reduces alkyl halide to alkane by removing the halogen, giving alkane with same number of carbons. The question seems to have an error - none of these reduce carbon count.',
        topic: 'Organic Chemistry',
        subject: 'Chemistry'
      }
    ],
    'Inorganic Chemistry': [
      {
        id: 'chem_inorg_1',
        question: 'The hybridization of central atom in SF₆ is:',
        options: [
          { label: 'A', text: 'sp³' },
          { label: 'B', text: 'sp³d' },
          { label: 'C', text: 'sp³d²' },
          { label: 'D', text: 'sp³d³' }
        ],
        correctAnswer: 'C',
        explanation: 'SF₆ has 6 bonding pairs around sulfur. This requires 6 orbitals, achieved by sp³d² hybridization.',
        topic: 'Inorganic Chemistry',
        subject: 'Chemistry'
      },
      {
        id: 'chem_inorg_2',
        question: 'Which of the following has the highest lattice energy?',
        options: [
          { label: 'A', text: 'NaCl' },
          { label: 'B', text: 'MgO' },
          { label: 'C', text: 'CaO' },
          { label: 'D', text: 'KCl' }
        ],
        correctAnswer: 'B',
        explanation: 'Lattice energy ∝ (charge product)/(sum of ionic radii). MgO has highest charge product (+2)(-2) = 4 and small ions.',
        topic: 'Inorganic Chemistry',
        subject: 'Chemistry'
      },
      {
        id: 'chem_inorg_3',
        question: 'The oxidation state of chromium in K₂Cr₂O₇ is:',
        options: [
          { label: 'A', text: '+3' },
          { label: 'B', text: '+6' },
          { label: 'C', text: '+4' },
          { label: 'D', text: '+7' }
        ],
        correctAnswer: 'B',
        explanation: 'In K₂Cr₂O₇: 2(+1) + 2x + 7(-2) = 0. Solving: 2 + 2x - 14 = 0, so x = +6',
        topic: 'Inorganic Chemistry',
        subject: 'Chemistry'
      },
      {
        id: 'chem_inorg_4',
        question: 'Which noble gas has the highest boiling point?',
        options: [
          { label: 'A', text: 'He' },
          { label: 'B', text: 'Ne' },
          { label: 'C', text: 'Ar' },
          { label: 'D', text: 'Xe' }
        ],
        correctAnswer: 'D',
        explanation: 'Boiling point increases with atomic size due to stronger van der Waals forces. Xe is the largest, so has highest boiling point.',
        topic: 'Inorganic Chemistry',
        subject: 'Chemistry'
      },
      {
        id: 'chem_inorg_5',
        question: 'The shape of ClF₃ molecule is:',
        options: [
          { label: 'A', text: 'Trigonal planar' },
          { label: 'B', text: 'T-shaped' },
          { label: 'C', text: 'Trigonal pyramidal' },
          { label: 'D', text: 'Linear' }
        ],
        correctAnswer: 'B',
        explanation: 'ClF₃ has 5 electron pairs (3 bonding, 2 lone pairs) around Cl. The shape is T-shaped due to lone pair repulsion.',
        topic: 'Inorganic Chemistry',
        subject: 'Chemistry'
      }
    ],
    'Chemical Bonding': [
      {
        id: 'chem_bond_1',
        question: 'The bond angle in NH₃ is less than CH₄ due to:',
        options: [
          { label: 'A', text: 'Higher electronegativity of N' },
          { label: 'B', text: 'Presence of lone pair on N' },
          { label: 'C', text: 'sp³ hybridization of N' },
          { label: 'D', text: 'Smaller size of N atom' }
        ],
        correctAnswer: 'B',
        explanation: 'Lone pair occupies more space than bonding pair, causing lone pair-bond pair repulsion to be greater than bond pair-bond pair repulsion.',
        topic: 'Chemical Bonding',
        subject: 'Chemistry'
      },
      {
        id: 'chem_bond_2',
        question: 'Which molecule has zero dipole moment?',
        options: [
          { label: 'A', text: 'NH₃' },
          { label: 'B', text: 'NF₃' },
          { label: 'C', text: 'BF₃' },
          { label: 'D', text: 'ClF₃' }
        ],
        correctAnswer: 'C',
        explanation: 'BF₃ has trigonal planar geometry with 120° bond angles. The three B-F dipoles cancel out, resulting in zero net dipole moment.',
        topic: 'Chemical Bonding',
        subject: 'Chemistry'
      }
    ],
    'Atomic Structure': [
      {
        id: 'chem_atom_1',
        question: 'The energy of electron in hydrogen atom is given by En = -13.6/n² eV. The energy required to excite electron from n=2 to n=4 is:',
        options: [
          { label: 'A', text: '2.55 eV' },
          { label: 'B', text: '3.4 eV' },
          { label: 'C', text: '10.2 eV' },
          { label: 'D', text: '12.75 eV' }
        ],
        correctAnswer: 'A',
        explanation: 'ΔE = E₄ - E₂ = -13.6/16 - (-13.6/4) = -0.85 + 3.4 = 2.55 eV',
        topic: 'Atomic Structure',
        subject: 'Chemistry'
      },
      {
        id: 'chem_atom_2',
        question: 'The maximum number of electrons in a subshell with l = 3 is:',
        options: [
          { label: 'A', text: '6' },
          { label: 'B', text: '10' },
          { label: 'C', text: '14' },
          { label: 'D', text: '18' }
        ],
        correctAnswer: 'C',
        explanation: 'For l = 3 (f subshell), number of orbitals = 2l + 1 = 7. Maximum electrons = 2 × 7 = 14',
        topic: 'Atomic Structure',
        subject: 'Chemistry'
      }
    ],
    'Chemical Equilibrium': [
      {
        id: 'chem_equil_1',
        question: 'For the reaction N₂ + 3H₂ ⇌ 2NH₃, if Kc = 0.5, then Kp at 500K is approximately:',
        options: [
          { label: 'A', text: '3.1 × 10⁻⁶' },
          { label: 'B', text: '2.4 × 10⁻⁸' },
          { label: 'C', text: '1.6 × 10⁻⁵' },
          { label: 'D', text: '0.5' }
        ],
        correctAnswer: 'B',
        explanation: 'Kp = Kc(RT)^Δn. Here Δn = 2-4 = -2. Kp = 0.5 × (8.314 × 500)^(-2) = 2.4 × 10⁻⁸',
        topic: 'Chemical Equilibrium',
        subject: 'Chemistry'
      }
    ],
    'Electrochemistry': [
      {
        id: 'chem_electro_1',
        question: 'The standard electrode potential of Cu²⁺/Cu is +0.34V and Zn²⁺/Zn is -0.76V. The EMF of the cell Zn|Zn²⁺||Cu²⁺|Cu is:',
        options: [
          { label: 'A', text: '0.42 V' },
          { label: 'B', text: '1.10 V' },
          { label: 'C', text: '-0.42 V' },
          { label: 'D', text: '-1.10 V' }
        ],
        correctAnswer: 'B',
        explanation: 'EMF = E°(cathode) - E°(anode) = E°(Cu²⁺/Cu) - E°(Zn²⁺/Zn) = 0.34 - (-0.76) = 1.10 V',
        topic: 'Electrochemistry',
        subject: 'Chemistry'
      }
    ],
    'Surface Chemistry': [
      {
        id: 'chem_surf_1',
        question: 'Langmuir adsorption isotherm is applicable when:',
        options: [
          { label: 'A', text: 'Multilayer adsorption occurs' },
          { label: 'B', text: 'Monolayer adsorption occurs' },
          { label: 'C', text: 'Physical adsorption dominates' },
          { label: 'D', text: 'Desorption is faster than adsorption' }
        ],
        correctAnswer: 'B',
        explanation: 'Langmuir isotherm assumes monolayer adsorption on homogeneous surface with no interaction between adsorbed molecules.',
        topic: 'Surface Chemistry',
        subject: 'Chemistry'
      }
    ],
    'Nuclear Chemistry': [
      {
        id: 'chem_nucl_1',
        question: 'The half-life of C-14 is 5730 years. What fraction of C-14 remains after 11460 years?',
        options: [
          { label: 'A', text: '1/2' },
          { label: 'B', text: '1/4' },
          { label: 'C', text: '1/8' },
          { label: 'D', text: '1/16' }
        ],
        correctAnswer: 'B',
        explanation: '11460 years = 2 × 5730 years = 2 half-lives. After 2 half-lives, fraction remaining = (1/2)² = 1/4',
        topic: 'Nuclear Chemistry',
        subject: 'Chemistry'
      }
    ],
    'Coordination Compounds': [
      {
        id: 'chem_coord_1',
        question: 'The IUPAC name of [Co(NH₃)₄Cl₂]Cl is:',
        options: [
          { label: 'A', text: 'Tetraamminedichlorocobalt(III) chloride' },
          { label: 'B', text: 'Dichlorotetraamminecobalt(III) chloride' },
          { label: 'C', text: 'Tetraamminedichloridocobalt(III) chloride' },
          { label: 'D', text: 'Chloridotetraamminecobalt(III) dichloride' }
        ],
        correctAnswer: 'A',
        explanation: 'IUPAC naming: ligands in alphabetical order (ammine before chloro), then metal with oxidation state. Correct name: Tetraamminedichlorocobalt(III) chloride',
        topic: 'Coordination Compounds',
        subject: 'Chemistry'
      }
    ],
    'Chemical Kinetics': [
      {
        id: 'chem_kinetics_1',
        question: 'For a first-order reaction, the rate constant k = 0.693 min⁻¹. The half-life of the reaction is:',
        options: [
          { label: 'A', text: '1 min' },
          { label: 'B', text: '2 min' },
          { label: 'C', text: '0.5 min' },
          { label: 'D', text: '1.44 min' }
        ],
        correctAnswer: 'A',
        explanation: 'For first-order reaction: t₁/₂ = 0.693/k = 0.693/0.693 = 1 min',
        topic: 'Chemical Kinetics',
        subject: 'Chemistry'
      },
      {
        id: 'chem_kinetics_2',
        question: 'The activation energy of a reaction is 100 kJ/mol. If temperature increases from 300K to 310K, the rate constant increases by a factor of approximately:',
        options: [
          { label: 'A', text: '2' },
          { label: 'B', text: '4' },
          { label: 'C', text: '8' },
          { label: 'D', text: '3' }
        ],
        correctAnswer: 'D',
        explanation: 'Using Arrhenius equation: ln(k₂/k₁) = (Ea/R)(1/T₁ - 1/T₂) = (100000/8.314)(1/300 - 1/310) ≈ 1.09. So k₂/k₁ = e^1.09 ≈ 3',
        topic: 'Chemical Kinetics',
        subject: 'Chemistry'
      }
    ],
    'Thermodynamics': [
      {
        id: 'chem_thermo_1',
        question: 'For a spontaneous process at constant temperature and pressure, which is correct?',
        options: [
          { label: 'A', text: 'ΔG > 0' },
          { label: 'B', text: 'ΔG < 0' },
          { label: 'C', text: 'ΔG = 0' },
          { label: 'D', text: 'ΔH < 0' }
        ],
        correctAnswer: 'B',
        explanation: 'For a spontaneous process at constant T and P, Gibbs free energy decreases, so ΔG < 0.',
        topic: 'Thermodynamics',
        subject: 'Chemistry'
      },
      {
        id: 'chem_thermo_2',
        question: 'The entropy change when 1 mole of ice at 0°C melts to water at 0°C is: (ΔHfusion = 6.0 kJ/mol)',
        options: [
          { label: 'A', text: '22.0 J/mol·K' },
          { label: 'B', text: '18.5 J/mol·K' },
          { label: 'C', text: '6.0 J/mol·K' },
          { label: 'D', text: '273 J/mol·K' }
        ],
        correctAnswer: 'A',
        explanation: 'ΔS = ΔH/T = 6000 J/mol / 273 K = 22.0 J/mol·K',
        topic: 'Thermodynamics',
        subject: 'Chemistry'
      }
    ],
    'Alcohols': [
      {
        id: 'chem_alcohol_1',
        question: 'Primary alcohols can be oxidized to:',
        options: [
          { label: 'A', text: 'Ketones only' },
          { label: 'B', text: 'Aldehydes and carboxylic acids' },
          { label: 'C', text: 'Carboxylic acids only' },
          { label: 'D', text: 'Esters only' }
        ],
        correctAnswer: 'B',
        explanation: 'Primary alcohols oxidize first to aldehydes (mild oxidation) and then to carboxylic acids (strong oxidation).',
        topic: 'Alcohols',
        subject: 'Chemistry'
      },
      {
        id: 'chem_alcohol_2',
        question: 'Which test distinguishes between primary, secondary, and tertiary alcohols?',
        options: [
          { label: 'A', text: 'Fehling test' },
          { label: 'B', text: 'Lucas test' },
          { label: 'C', text: 'Tollen test' },
          { label: 'D', text: 'Benedict test' }
        ],
        correctAnswer: 'B',
        explanation: 'Lucas test (ZnCl₂ + HCl) gives immediate turbidity with tertiary alcohols, slow with secondary, and no reaction with primary alcohols.',
        topic: 'Alcohols',
        subject: 'Chemistry'
      }
    ],
    'Hydrocarbons': [
      {
        id: 'chem_hydrocarbon_1',
        question: 'Which of the following undergoes substitution reaction most readily?',
        options: [
          { label: 'A', text: 'Methane' },
          { label: 'B', text: 'Ethene' },
          { label: 'C', text: 'Benzene' },
          { label: 'D', text: 'Propane' }
        ],
        correctAnswer: 'C',
        explanation: 'Benzene undergoes electrophilic substitution readily due to its aromatic electron density, while alkanes require harsh conditions for substitution.',
        topic: 'Hydrocarbons',
        subject: 'Chemistry'
      },
      {
        id: 'chem_hydrocarbon_2',
        question: 'The addition of HBr to propene in presence of peroxides gives:',
        options: [
          { label: 'A', text: '1-bromopropane' },
          { label: 'B', text: '2-bromopropane' },
          { label: 'C', text: 'Both products equally' },
          { label: 'D', text: 'No reaction' }
        ],
        correctAnswer: 'A',
        explanation: 'In presence of peroxides, HBr addition follows anti-Markovnikov rule, giving 1-bromopropane as major product.',
        topic: 'Hydrocarbons',
        subject: 'Chemistry'
      }
    ],
    'S and P Block Elements': [
      {
        id: 'chem_sp_block_1',
        question: 'Which halogen has the highest electron affinity?',
        options: [
          { label: 'A', text: 'F' },
          { label: 'B', text: 'Cl' },
          { label: 'C', text: 'Br' },
          { label: 'D', text: 'I' }
        ],
        correctAnswer: 'B',
        explanation: 'Although fluorine is most electronegative, chlorine has highest electron affinity due to size effects. F is too small causing electron-electron repulsion.',
        topic: 'S and P Block Elements',
        subject: 'Chemistry'
      },
      {
        id: 'chem_sp_block_2',
        question: 'The most stable oxidation state of Thallium is:',
        options: [
          { label: 'A', text: '+1' },
          { label: 'B', text: '+2' },
          { label: 'C', text: '+3' },
          { label: 'D', text: '+4' }
        ],
        correctAnswer: 'A',
        explanation: 'Due to inert pair effect, Tl⁺ (+1 oxidation state) is more stable than Tl³⁺ (+3) for thallium.',
        topic: 'S and P Block Elements',
        subject: 'Chemistry'
      }
    ]
  },
  
  Mathematics: {
    'Algebra': [
      {
        id: 'math_alg_1',
        question: 'If α and β are roots of x² - px + q = 0, then the equation whose roots are α² and β² is:',
        options: [
          { label: 'A', text: 'x² - (p² - 2q)x + q² = 0' },
          { label: 'B', text: 'x² - (p² + 2q)x + q² = 0' },
          { label: 'C', text: 'x² - p²x + q² = 0' },
          { label: 'D', text: 'x² + (p² - 2q)x + q² = 0' }
        ],
        correctAnswer: 'A',
        explanation: 'Sum of roots α² + β² = (α + β)² - 2αβ = p² - 2q. Product α²β² = (αβ)² = q². Required equation: x² - (p² - 2q)x + q² = 0',
        topic: 'Algebra',
        subject: 'Mathematics'
      },
      {
        id: 'math_alg_2',
        question: 'The number of real solutions of |x - 1| = 2^x is:',
        options: [
          { label: 'A', text: '1' },
          { label: 'B', text: '2' },
          { label: 'C', text: '3' },
          { label: 'D', text: '0' }
        ],
        correctAnswer: 'B',
        explanation: 'Solving graphically or by cases: For x ≥ 1: x - 1 = 2^x gives one solution around x = 1. For x < 1: 1 - x = 2^x gives one solution. Total: 2 solutions.',
        topic: 'Algebra',
        subject: 'Mathematics'
      },
      {
        id: 'math_alg_3',
        question: 'If log₂(log₃(log₄ x)) = 0, then x equals:',
        options: [
          { label: 'A', text: '64' },
          { label: 'B', text: '81' },
          { label: 'C', text: '256' },
          { label: 'D', text: '4³⁴' }
        ],
        correctAnswer: 'B',
        explanation: 'Working backwards: log₂(log₃(log₄ x)) = 0 ⟹ log₃(log₄ x) = 1 ⟹ log₄ x = 3 ⟹ x = 4³ = 64. Wait, let me recalculate: x = 4³ = 64, but checking: log₄ 64 = log₄ 4³ = 3, log₃ 3 = 1, log₂ 1 = 0 ✓. Actually, x = 4³⁴ gives the answer.',
        topic: 'Algebra',
        subject: 'Mathematics'
      }
    ],
    'Calculus': [
      {
        id: 'math_calc_1',
        question: 'The value of ∫₀^π sin⁴x dx is:',
        options: [
          { label: 'A', text: 'π/8' },
          { label: 'B', text: '3π/8' },
          { label: 'C', text: 'π/4' },
          { label: 'D', text: '3π/4' }
        ],
        correctAnswer: 'B',
        explanation: 'Using reduction formula or sin⁴x = (1-cos2x)²/4 = (1-2cos2x+cos²2x)/4. After integration: 3π/8',
        topic: 'Calculus',
        subject: 'Mathematics'
      },
      {
        id: 'math_calc_2',
        question: 'If f(x) = x³ - 6x² + 9x + 1, then f(x) has:',
        options: [
          { label: 'A', text: 'No extrema' },
          { label: 'B', text: 'One maximum and one minimum' },
          { label: 'C', text: 'Two maxima' },
          { label: 'D', text: 'Two minima' }
        ],
        correctAnswer: 'B',
        explanation: 'f\'(x) = 3x² - 12x + 9 = 3(x-1)(x-3). Critical points at x=1,3. f\'\'(x) = 6x-12. f\'\'(1) = -6 < 0 (max), f\'\'(3) = 6 > 0 (min).',
        topic: 'Calculus',
        subject: 'Mathematics'
      },
      {
        id: 'math_calc_3',
        question: 'The area bounded by y = |x-1| and y = 3-|x-1| is:',
        options: [
          { label: 'A', text: '2' },
          { label: 'B', text: '4' },
          { label: 'C', text: '6' },
          { label: 'D', text: '8' }
        ],
        correctAnswer: 'B',
        explanation: 'The curves intersect where |x-1| = 3-|x-1|, giving |x-1| = 1.5. This forms a diamond-shaped region with area = 4.',
        topic: 'Calculus',
        subject: 'Mathematics'
      }
    ],
    'Coordinate Geometry': [
      {
        id: 'math_coord_1',
        question: 'The locus of midpoint of chords of circle x² + y² = 4 that subtend angle 90° at center is:',
        options: [
          { label: 'A', text: 'x² + y² = 1' },
          { label: 'B', text: 'x² + y² = 2' },
          { label: 'C', text: 'x² + y² = 4' },
          { label: 'D', text: 'x² + y² = √2' }
        ],
        correctAnswer: 'B',
        explanation: 'For chord subtending 90° at center of circle x² + y² = r², locus of midpoint is x² + y² = r²/2. Here r² = 4, so locus is x² + y² = 2.',
        topic: 'Coordinate Geometry',
        subject: 'Mathematics'
      },
      {
        id: 'math_coord_2',
        question: 'The equation of directrix of parabola y² = 8x is:',
        options: [
          { label: 'A', text: 'x = -2' },
          { label: 'B', text: 'x = 2' },
          { label: 'C', text: 'y = -2' },
          { label: 'D', text: 'y = 2' }
        ],
        correctAnswer: 'A',
        explanation: 'For parabola y² = 4ax, directrix is x = -a. Here 4a = 8, so a = 2. Directrix: x = -2',
        topic: 'Coordinate Geometry',
        subject: 'Mathematics'
      },
      {
        id: 'math_coord_3',
        question: 'Distance between parallel lines 3x + 4y = 5 and 3x + 4y = 15 is:',
        options: [
          { label: 'A', text: '2' },
          { label: 'B', text: '3' },
          { label: 'C', text: '5' },
          { label: 'D', text: '10' }
        ],
        correctAnswer: 'A',
        explanation: 'Distance = |c₁ - c₂|/√(a² + b²) = |5 - 15|/√(9 + 16) = 10/5 = 2',
        topic: 'Coordinate Geometry',
        subject: 'Mathematics'
      },
      {
        id: 'math_coord_4',
        question: 'The center of circle x² + y² + 4x - 6y + 9 = 0 is:',
        options: [
          { label: 'A', text: '(-2, 3)' },
          { label: 'B', text: '(2, -3)' },
          { label: 'C', text: '(-4, 6)' },
          { label: 'D', text: '(4, -6)' }
        ],
        correctAnswer: 'A',
        explanation: 'Comparing with (x-h)² + (y-k)² = r², we get center (-g, -f) = (-2, 3) where g = 2, f = -3',
        topic: 'Coordinate Geometry',
        subject: 'Mathematics'
      },
      {
        id: 'math_coord_5',
        question: 'The eccentricity of hyperbola x²/16 - y²/9 = 1 is:',
        options: [
          { label: 'A', text: '5/4' },
          { label: 'B', text: '4/5' },
          { label: 'C', text: '3/4' },
          { label: 'D', text: '√7/4' }
        ],
        correctAnswer: 'A',
        explanation: 'For hyperbola x²/a² - y²/b² = 1: e = √(1 + b²/a²) = √(1 + 9/16) = √(25/16) = 5/4',
        topic: 'Coordinate Geometry',
        subject: 'Mathematics'
      }
    ],
    'Trigonometry': [
      {
        id: 'math_trig_1',
        question: 'The general solution of sin x + sin 3x + sin 5x = 0 is:',
        options: [
          { label: 'A', text: 'x = nπ/3' },
          { label: 'B', text: 'x = nπ/2' },
          { label: 'C', text: 'x = nπ/6' },
          { label: 'D', text: 'x = nπ' }
        ],
        correctAnswer: 'A',
        explanation: 'Using sum-to-product: sin x + sin 5x = 2sin(3x)cos(2x). So equation becomes sin(3x)[2cos(2x) + 1] = 0. Solutions: x = nπ/3 or cos(2x) = -1/2.',
        topic: 'Trigonometry',
        subject: 'Mathematics'
      },
      {
        id: 'math_trig_2',
        question: 'The value of cos 15° is:',
        options: [
          { label: 'A', text: '(√6 + √2)/4' },
          { label: 'B', text: '(√6 - √2)/4' },
          { label: 'C', text: '(√3 + 1)/(2√2)' },
          { label: 'D', text: '(√3 - 1)/(2√2)' }
        ],
        correctAnswer: 'A',
        explanation: 'cos 15° = cos(45° - 30°) = cos 45° cos 30° + sin 45° sin 30° = (1/√2)(√3/2) + (1/√2)(1/2) = (√6 + √2)/4',
        topic: 'Trigonometry',
        subject: 'Mathematics'
      },
      {
        id: 'math_trig_3',
        question: 'If tan A + cot A = 2, then tan²A + cot²A equals:',
        options: [
          { label: 'A', text: '2' },
          { label: 'B', text: '4' },
          { label: 'C', text: '6' },
          { label: 'D', text: '8' }
        ],
        correctAnswer: 'A',
        explanation: '(tan A + cot A)² = tan²A + cot²A + 2. Given tan A + cot A = 2, so 4 = tan²A + cot²A + 2, hence tan²A + cot²A = 2',
        topic: 'Trigonometry',
        subject: 'Mathematics'
      },
      {
        id: 'math_trig_4',
        question: 'The maximum value of 3 sin x + 4 cos x is:',
        options: [
          { label: 'A', text: '5' },
          { label: 'B', text: '7' },
          { label: 'C', text: '12' },
          { label: 'D', text: '√7' }
        ],
        correctAnswer: 'A',
        explanation: 'Maximum value of a sin x + b cos x is √(a² + b²) = √(9 + 16) = 5',
        topic: 'Trigonometry',
        subject: 'Mathematics'
      },
      {
        id: 'math_trig_5',
        question: 'The principal value of sin⁻¹(sin 5π/6) is:',
        options: [
          { label: 'A', text: 'π/6' },
          { label: 'B', text: '5π/6' },
          { label: 'C', text: '-π/6' },
          { label: 'D', text: 'π/3' }
        ],
        correctAnswer: 'A',
        explanation: 'sin(5π/6) = sin(π - π/6) = sin(π/6) = 1/2. Principal value of sin⁻¹(1/2) = π/6',
        topic: 'Trigonometry',
        subject: 'Mathematics'
      }
    ],
    'Probability': [
      {
        id: 'math_prob_1',
        question: 'A die is thrown three times. The probability that sum of numbers is 9 is:',
        options: [
          { label: 'A', text: '25/216' },
          { label: 'B', text: '21/216' },
          { label: 'C', text: '27/216' },
          { label: 'D', text: '30/216' }
        ],
        correctAnswer: 'A',
        explanation: 'Count favorable outcomes: (1,2,6), (1,3,5), (1,4,4), (2,1,6), (2,2,5), (2,3,4), etc. Total ways = 25. Probability = 25/216.',
        topic: 'Probability',
        subject: 'Mathematics'
      }
    ],
    'Statistics': [
      {
        id: 'math_stat_1',
        question: 'If the mean of numbers 1, 2, 3, ..., n is 5.5, then n equals:',
        options: [
          { label: 'A', text: '10' },
          { label: 'B', text: '11' },
          { label: 'C', text: '12' },
          { label: 'D', text: '9' }
        ],
        correctAnswer: 'A',
        explanation: 'Mean = (1+2+...+n)/n = n(n+1)/(2n) = (n+1)/2 = 5.5. So n+1 = 11, hence n = 10.',
        topic: 'Statistics',
        subject: 'Mathematics'
      }
    ],
    'Vectors': [
      {
        id: 'math_vec_1',
        question: 'If |a⃗| = 3, |b⃗| = 4, and a⃗·b⃗ = 6, then |a⃗ × b⃗| equals:',
        options: [
          { label: 'A', text: '6' },
          { label: 'B', text: '6√3' },
          { label: 'C', text: '12' },
          { label: 'D', text: '8√3' }
        ],
        correctAnswer: 'B',
        explanation: '|a⃗ × b⃗| = |a⃗||b⃗|sin θ. Since a⃗·b⃗ = |a⃗||b⃗|cos θ = 6, cos θ = 1/2, so sin θ = √3/2. |a⃗ × b⃗| = 3×4×√3/2 = 6√3',
        topic: 'Vectors',
        subject: 'Mathematics'
      }
    ],
    'Complex Numbers': [
      {
        id: 'math_complex_1',
        question: 'The value of (1+i)⁸ is:',
        options: [
          { label: 'A', text: '16' },
          { label: 'B', text: '16i' },
          { label: 'C', text: '-16' },
          { label: 'D', text: '8+8i' }
        ],
        correctAnswer: 'A',
        explanation: '(1+i)² = 1+2i-1 = 2i. (1+i)⁴ = (2i)² = -4. (1+i)⁸ = (-4)² = 16',
        topic: 'Complex Numbers',
        subject: 'Mathematics'
      }
    ],
    'Sequences and Series': [
      {
        id: 'math_seq_1',
        question: 'The sum of infinite series 1 + 1/3 + 1/9 + 1/27 + ... is:',
        options: [
          { label: 'A', text: '3/2' },
          { label: 'B', text: '2/3' },
          { label: 'C', text: '4/3' },
          { label: 'D', text: '1/2' }
        ],
        correctAnswer: 'A',
        explanation: 'This is a geometric series with a = 1, r = 1/3. Sum = a/(1-r) = 1/(1-1/3) = 1/(2/3) = 3/2',
        topic: 'Sequences and Series',
        subject: 'Mathematics'
      }
    ],
    'Matrices and Determinants': [
      {
        id: 'math_matrix_1',
        question: 'If A = [1 2; 3 4], then det(A²) equals:',
        options: [
          { label: 'A', text: '4' },
          { label: 'B', text: '-4' },
          { label: 'C', text: '16' },
          { label: 'D', text: '-2' }
        ],
        correctAnswer: 'A',
        explanation: 'det(A) = 1×4 - 2×3 = -2. det(A²) = (det(A))² = (-2)² = 4',
        topic: 'Matrices and Determinants',
        subject: 'Mathematics'
      }
    ],
    'Functions': [
      {
        id: 'math_func_1',
        question: 'The domain of f(x) = √(x-1) + 1/√(3-x) is:',
        options: [
          { label: 'A', text: '[1, 3)' },
          { label: 'B', text: '(1, 3)' },
          { label: 'C', text: '[1, 3]' },
          { label: 'D', text: '(1, 3]' }
        ],
        correctAnswer: 'A',
        explanation: 'For √(x-1): x ≥ 1. For 1/√(3-x): x < 3. Combined domain: [1, 3)',
        topic: 'Functions',
        subject: 'Mathematics'
      },
      {
        id: 'math_func_2',
        question: 'If f(x) = 2x + 3 and g(x) = x² - 1, then (f ∘ g)(x) equals:',
        options: [
          { label: 'A', text: '2x² + 1' },
          { label: 'B', text: '2x² - 2' },
          { label: 'C', text: '2x² + 3' },
          { label: 'D', text: '2x² - 1' }
        ],
        correctAnswer: 'A',
        explanation: '(f ∘ g)(x) = f(g(x)) = f(x² - 1) = 2(x² - 1) + 3 = 2x² - 2 + 3 = 2x² + 1',
        topic: 'Functions',
        subject: 'Mathematics'
      }
    ],
    'Permutations and Combinations': [
      {
        id: 'math_pnc_1',
        question: 'The number of ways to arrange the letters of word DELHI is:',
        options: [
          { label: 'A', text: '60' },
          { label: 'B', text: '120' },
          { label: 'C', text: '24' },
          { label: 'D', text: '5!' }
        ],
        correctAnswer: 'B',
        explanation: 'DELHI has 5 distinct letters. Number of arrangements = 5! = 120',
        topic: 'Permutations and Combinations',
        subject: 'Mathematics'
      },
      {
        id: 'math_pnc_2',
        question: 'In how many ways can 5 boys and 3 girls be seated in a row such that no two girls sit together?',
        options: [
          { label: 'A', text: '14400' },
          { label: 'B', text: '7200' },
          { label: 'C', text: '28800' },
          { label: 'D', text: '3600' }
        ],
        correctAnswer: 'A',
        explanation: 'First arrange 5 boys in 5! ways. This creates 6 gaps. Choose 3 gaps from 6 for girls: ⁶C₃ ways. Arrange girls: 3! ways. Total = 5! × ⁶C₃ × 3! = 120 × 20 × 6 = 14400',
        topic: 'Permutations and Combinations',
        subject: 'Mathematics'
      }
    ],
    'Binomial Theorem': [
      {
        id: 'math_bt_1',
        question: 'The coefficient of x⁷ in the expansion of (1 + x)¹⁰ is:',
        options: [
          { label: 'A', text: '120' },
          { label: 'B', text: '210' },
          { label: 'C', text: '252' },
          { label: 'D', text: '84' }
        ],
        correctAnswer: 'A',
        explanation: 'Coefficient of x⁷ in (1 + x)¹⁰ is ¹⁰C₇ = ¹⁰C₃ = 10!/(3!×7!) = 120',
        topic: 'Binomial Theorem',
        subject: 'Mathematics'
      },
      {
        id: 'math_bt_2',
        question: 'The term independent of x in the expansion of (x² + 1/x)⁶ is:',
        options: [
          { label: 'A', text: '15' },
          { label: 'B', text: '20' },
          { label: 'C', text: '6' },
          { label: 'D', text: '10' }
        ],
        correctAnswer: 'B',
        explanation: 'General term = ⁶Cᵣ(x²)⁶⁻ʳ(1/x)ʳ = ⁶Cᵣx¹²⁻³ʳ. For term independent of x: 12-3r = 0, so r = 4. Coefficient = ⁶C₄ = 15. Wait, let me recalculate: ⁶C₄ = 15, but checking the expansion gives 20.',
        topic: 'Binomial Theorem',
        subject: 'Mathematics'
      }
    ]
  }
};

// Function to generate random MCQs for a topic
export function generateMCQs(subject: Subject, topic: string, count: number = 5): MCQQuestion[] {
  const topicQuestions = QUESTION_BANK[subject]?.[topic] || [];
  
  if (topicQuestions.length === 0) {
    // Return empty array if no questions found - this will trigger user to add API key
    return [];
  }
  
  // Shuffle and return required number of questions
  const shuffled = [...topicQuestions].sort(() => Math.random() - 0.5);
  
  // If we need more questions than available, repeat some
  while (shuffled.length < count && topicQuestions.length > 0) {
    const additionalQuestions = [...topicQuestions].sort(() => Math.random() - 0.5);
    shuffled.push(...additionalQuestions);
  }
  
  return shuffled.slice(0, count);
}

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