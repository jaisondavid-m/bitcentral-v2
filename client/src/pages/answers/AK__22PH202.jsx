import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Simple equation formatter component
const EquationText = ({ text }) => {
  // Parse text for equations enclosed in $ $ and convert to readable format
  const parts = text.split(/(\$[^$]+\$)/g).map((part, idx) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const eq = part.slice(1, -1);
      return (
        <span key={idx} className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-sm border border-gray-200">
          {eq}
        </span>
      );
    }
    return part;
  });
  return <span>{parts}</span>;
};

const answerKey = [
  {
    q: 1, marks: 3, part: "i",
    question: "Construct logical steps to update coordinate transformation for high-speed conditions.",
    points: [
      "Identify that at speeds near c, Galilean transformations fail — use Lorentz transformations instead.",
      "Apply: $x' = γ(x − vt)$, $t' = γ(t − vx/c²)$, where $γ = 1/√(1 − v²/c²)$.",
      "Ensure the program computes γ first, then applies both space and time transforms simultaneously."
    ]
  },
  {
    q: 2, marks: 2, part: "ii", topic: "Classical vs Relativistic Equations",
    question: "Analyze the trade-off and determine when relativistic equations should be used.",
    points: [
      "Use classical equations when $v << c$ ($v < 0.1c$); error is negligible and computation is fast.",
      "Switch to relativistic equations when $v ≥ 0.1c$, as $γ$ deviates significantly from 1 causing measurable error."
    ]
  },
  {
    q: 3, marks: 3, part: "i", topic: "Invariant vs Relativistic Mass",
    question: "Assess trade-offs between invariant and relativistic mass for high-velocity scalability.",
    points: [
      "Invariant mass (rest mass $m₀$) is frame-independent and simplifies energy-momentum relation: $E² = (m₀c²)² + (pc)²$.",
      "Relativistic mass $m = γm₀$ increases with velocity but adds computational complexity at each step.",
      "Invariant mass model is preferred for high-velocity scalability — fewer transformations, consistent across frames."
    ]
  },
  {
    q: 4, marks: 2, part: "ii", topic: "Mass-Energy Equivalence",
    question: "Interpret the observed mass difference and justify its relation to energy release.",
    points: [
      "Mass defect $Δm = $ mass before $−$ mass after reaction; this lost mass converts to energy.",
      "By $E = Δmc²$, even small $Δm$ produces enormous energy output — validating nuclear energy release (Einstein's mass-energy equivalence)."
    ]
  },
  {
    q: 5, marks: 3, part: "i", topic: "Relativity of Simultaneity",
    question: "Integrate spacetime and observer motion to infer why simultaneity differs between observers.",
    points: [
      "Simultaneity is not absolute — it depends on the observer's frame of reference.",
      "The stationary observer receives light from equal distances simultaneously; the moving observer intercepts light at different times due to relative motion.",
      "Spacetime interval: $Δs² = c²Δt² − Δx²$; since $Δx$ differs for the moving frame, $Δt ≠ 0$, confirming relativity of simultaneity."
    ]
  },
  {
    q: 6, marks: 2, part: "ii", topic: "Need for Relativistic Concepts",
    question: "Assess the need for including relativistic concepts and recommend a teaching approach.",
    points: [
      "Satellites travel at ~4 km/s — relativistic corrections are necessary for GPS accuracy (time dilation causes ~38 µs/day error without correction).",
      "Teaching approach: introduce Newtonian mechanics first, then show its breakdown at high speeds using real-world examples like GPS and particle accelerators."
    ]
  },
  {
    q: 7, marks: 3, part: "i", topic: "Relativistic Kinetic Energy",
    question: "Analyze the calculation approach and infer the source of error.",
    points: [
      "Classical $KE = \\frac{1}{2}mv²$ underestimates energy at relativistic speeds — this is the source of error.",
      "Correct formula: $KE = (γ − 1)m₀c²$, where $γ = \\frac{1}{\\sqrt{1 − v²/c²}} >> 1$ at near-light speeds.",
      "At $v → c$, relativistic KE $→ ∞$, while classical formula gives a finite underestimate — always use relativistic formula for $v > 0.1c$."
    ]
  },
  {
    q: 8, marks: 2, part: "ii", topic: "Total Relativistic Energy",
    question: "Formulate the logical sequence to compute total relativistic energy.",
    points: [
      "Step 1: Input rest mass $m₀$ and velocity $v$ → compute $γ = \\frac{1}{\\sqrt{1 − v²/c²}}$.",
      "Step 2: Total energy $E = γm₀c²$ (includes rest energy + kinetic energy). Output $E$."
    ]
  },
  {
    q: 9, marks: 5, part: "i", topic: "Simultaneity & Frames of Reference",
    question: "Analyze how differing frames of reference influence simultaneity determination.",
    points: [
      "The platform observer is in an inertial frame equidistant from both strikes — receives signals simultaneously, judges them simultaneous.",
      "The train observer moves toward one strike and away from the other — signal from the front arrives earlier, so events appear non-simultaneous.",
      "According to Special Relativity, simultaneity is relative: two events simultaneous in one frame may not be in another moving frame.",
      "Mathematically: $Δt' = γ(Δt − vΔx/c²)$; if $Δt = 0$ but $Δx ≠ 0$, then $Δt' ≠ 0$ in the moving frame.",
      "Conclusion: Simultaneity is NOT absolute — it is a relative concept that depends on the observer's state of motion."
    ]
  },
  {
    q: 10, marks: 5, part: "i", topic: "de Broglie Hypothesis & Wave Behavior",
    question: "Determine design modifications to observe wave behavior and justify using de Broglie hypothesis.",
    points: [
      "Classical particle setup fails because it doesn't account for wave nature — no interference possible with particle-only design.",
      "Design modification: use a double-slit setup with slit width comparable to de Broglie wavelength $λ = h/mv$ of the electron.",
      "Use low-velocity electrons to increase $λ$ (larger $λ$ = more visible interference pattern).",
      "Use a detector screen (photographic plate / CCD) placed far behind slits to observe fringes.",
      "Justification: de Broglie proposed all matter has wave character; $λ = h/p$. Electrons with measurable momentum produce detectable wavelengths (~Å scale), matching atomic slit spacings."
    ]
  },
  {
    q: 11, marks: 5, part: "i", topic: "Time Dilation",
    question: "Formulate the mathematical relationship between proper time and dilated time.",
    points: [
      "In the spacecraft frame, light travels vertical distance 2d (proper path); time = $t_0 = 2d/c$.",
      "External observer sees diagonal path of length 2L where $L² = d² + (vt/2)²$.",
      "Time measured by external observer: $t = 2L/c > t_0$.",
      "Deriving: $t = t_0/\\sqrt{1 − v²/c²} = γt_0$, where $γ > 1$ for any $v > 0$.",
      "Conclusion: Moving clocks run slow (time dilation). Higher velocity → larger $γ$ → greater time dilation."
    ]
  },
  {
    q: 12, marks: 5, part: "i", topic: "de Broglie Wavelength & Observability",
    question: "Integrate wavelength, momentum, and observability to reconcile why only microscopic particles show wave characteristics.",
    points: [
      "de Broglie wavelength: $λ = h/mv$; for a tennis ball (mass ~0.06 kg, v ~30 m/s), $λ ≈ 3.7 × 10^{-34}$ m — far below observable scale.",
      "For an electron (m ≈ 9.1×10^{-31} kg), even at moderate speed $λ ≈ 10^{-10}$ m (Å scale) — comparable to atomic spacings, causing diffraction.",
      "Diffraction is only observable when $λ ≈$ slit/obstacle size; macroscopic objects have negligibly small $λ$.",
      "Momentum $p = mv$: larger mass means larger $p$ → smaller $λ$ → no wave behavior observed.",
      "Conclusion: Wave-particle duality is universal but practically observable only for microscopic particles (electrons, neutrons, photons) due to their extremely small mass and hence detectable $λ$."
    ]
  },
  {
    q: 13, marks: 5, part: "i", topic: "Length Contraction",
    question: "Determine observed length difference and formulate the relationship between proper and contracted length.",
    points: [
      "Proper length $L_0$: rod length measured by astronaut at rest in spacecraft frame.",
      "Earth observer measures contracted length $L = L_0/γ = L_0\\sqrt{1 − v²/c²}$.",
      "Contraction occurs only along the direction of motion; perpendicular dimensions are unchanged.",
      "Physical reason: simultaneity difference — Earth observer measures both ends of moving rod at the same time (in his frame), which corresponds to a shorter interval.",
      "Conclusion: $L < L_0$ always for $v > 0$; as $v → c$, $L → 0$. Length contraction is a real relativistic effect, not an illusion."
    ]
  },
  {
    q: 14, marks: 5, part: "i", topic: "de Broglie Wavelength of Electrons",
    question: "Formulate and derive the expression connecting wavelength and momentum for accelerated electrons.",
    points: [
      "Electron accelerated through potential V gains kinetic energy: $eV = \\frac{1}{2}mv²$.",
      "Momentum: $p = mv = \\sqrt{2meV}$.",
      "de Broglie wavelength: $λ = h/p = h/\\sqrt{2meV}$.",
      "Substituting constants: $λ = 1.226/\\sqrt{V}$ nm (where V is in volts) — directly measurable.",
      "This expression links measurable quantities (V, e, m) to wavelength, enabling experimental validation of wave nature of electrons."
    ]
  },
  {
    q: 15, marks: 5, part: "i", topic: "Length Contraction Experiment",
    question: "Recommend optimal experimental configuration to detect length contraction.",
    points: [
      "Orient measurement instruments parallel to the direction of particle motion to detect contraction (⊥ dimensions don't contract).",
      "Use particles at $v ≥ 0.5c$ to achieve $γ ≥ 1.15$, giving measurable length difference.",
      "Precision interferometry or time-of-flight measurements can detect the contracted dimension.",
      "Perpendicular instruments serve as reference to confirm no transverse change, isolating the relativistic effect.",
      "Justification: $L = L_0\\sqrt{1 − v²/c²}$ — contraction is only along the motion axis, so parallel alignment is mandatory for detection."
    ]
  },
  {
    q: 16, marks: 5, part: "i", topic: "Wave Nature of Electrons",
    question: "Determine and justify the most appropriate theoretical framework for the research team.",
    points: [
      "Classical particle theory predicts no diffraction — fails to explain observed interference patterns in crystal lattice.",
      "Adopt quantum mechanical wave model: electrons exhibit wave-particle duality (de Broglie, 1924).",
      "Electron wavelength λ = h/p matches lattice spacing (~Å) → diffraction occurs (Davisson-Germer experiment confirmed this).",
      "Quantum framework explains individual electron diffraction — each electron interferes with itself as a wave.",
      "Recommendation: Replace classical particle model with quantum wave model. This resolves all contradictions and aligns with verified experimental outcomes."
    ]
  },
  {
    q: 17, marks: 3, part: "i", topic: "Energy Bands & Electrical Conduction",
    question: "Analyze the reasoning flaw and infer why electron presence alone doesn't guarantee electrical conduction.",
    points: [
      "Electrons in completely filled valence bands cannot gain energy from an electric field (no available states) — so they cannot contribute to current.",
      "Conduction requires electrons in partially filled bands or thermally excited electrons in conduction band.",
      "Insulators have electrons but a large forbidden gap — electrons can't jump to conduction band at room temperature → no conduction despite electron presence."
    ]
  },
  {
    q: 18, marks: 2, part: "ii", topic: "Band Theory Classification",
    question: "Formulate a justified classification of the material based on band structure.",
    points: [
      "Partially occupied lower energy levels + small excitation energy → material has a narrow band gap (< 2 eV) → classified as a semiconductor.",
      "This matches semiconductor behavior: poor conductor at 0 K, conductivity increases with temperature or doping."
    ]
  },
  {
    q: 19, marks: 3, part: "i", topic: "Impurity Doping & Carrier Imbalance",
    question: "Analyze the scenario and infer the likely cause of increased conductivity.",
    points: [
      "Unexpected conductivity in an intrinsic design suggests unintentional doping during fabrication.",
      "Donor or acceptor impurities introduce additional charge carriers (electrons or holes), breaking intrinsic balance ($n = p = n_i$).",
      "Imbalance ($n ≠ p$) confirms extrinsic behavior; excess carriers increase conductivity beyond intrinsic level."
    ]
  },
  {
    q: 20, marks: 2, part: "ii", topic: "Doping Concentration Trade-off",
    question: "Assess the trade-off in increasing dopant concentration and its impact on semiconductor efficiency.",
    points: [
      "Increasing dopant concentration raises carrier density → higher conductivity and improved device performance.",
      "Excessive doping causes carrier scattering, impurity banding (merges with conduction band), and reduces mobility — degrading efficiency. Optimal doping is required."
    ]
  },
  {
    q: 21, marks: 3, part: "i", topic: "Density of States Function",
    question: "Interpret how the density of states function influences electron occupancy and material properties.",
    points: [
      "Density of States $g(E)$ gives number of available quantum states per unit energy — determines how many electrons can occupy each energy range.",
      "High $g(E)$ at an energy → more electrons can occupy that level when filled (especially near Fermi level).",
      "Material properties (conductivity, optical absorption) depend on electron population = $g(E) \\times f(E)$; DOS governs which transitions are possible."
    ]
  },
  {
    q: 22, marks: 2, part: "ii", topic: "Energy Band Formation",
    question: "Infer the logical sequence of steps leading to energy band formation in solids.",
    points: [
      "Isolated atoms have discrete energy levels → when atoms approach, orbitals overlap → energy levels split (Pauli exclusion) → multiple split levels form quasi-continuous energy bands.",
      "As N atoms form a crystal, each level splits into N sub-levels → valence and conduction bands emerge, separated by a forbidden gap whose width depends on atomic spacing and material."
    ]
  },
  {
    q: 23, marks: 3, part: "i", topic: "Carrier Concentration at Equilibrium",
    question: "Formulate logical steps to determine electron and hole concentrations at equilibrium.",
    points: [
      "At thermal equilibrium, mass action law holds: $n \\times p = n_i^2$ (where $n_i$ = intrinsic carrier concentration).",
      "For intrinsic semiconductor: $n = p = n_i$. For doped semiconductor: if $N_a$ or $N_d$ known, use charge neutrality to find $n$ or $p$.",
      "Electron and hole concentrations are interdependent — increasing $n$ by doping decreases $p$ proportionally ($n \\cdot p = n_i^2 =$ constant at fixed T)."
    ]
  },
  {
    q: 24, marks: 2, part: "ii", topic: "n-type vs p-type Semiconductors",
    question: "Evaluate how the choice between n-type and p-type materials influences current conduction.",
    points: [
      "n-type: majority carriers are electrons (negative charges) → conventional current flows opposite to electron flow; suitable for electron-dominated circuits.",
      "p-type: majority carriers are holes (positive charges) → current flows in direction of hole movement; both types together form p-n junctions enabling diodes and transistors."
    ]
  },
  {
    q: 25, marks: 5, part: "i", topic: "Theoretical Model Selection",
    question: "Recommend an appropriate theoretical framework for the crystalline material and justify the selection.",
    points: [
      "Material shows partial electron localization and slight deviation from free electron predictions → neither pure free electron nor pure tight-binding model is fully applicable.",
      "Recommend: Nearly Free Electron (NFE) model — assumes electrons are almost free but perturbed by periodic lattice potential.",
      "NFE model explains small band gaps (from Bragg reflection at zone boundaries) consistent with observed data.",
      "Partial localization aligns with moderate lattice potential strength in NFE — electrons are delocalized but influenced by lattice.",
      "Justification: NFE correctly predicts band structure, effective mass deviations, and conductivity behavior for moderate-mobility crystalline materials."
    ]
  },
  {
    q: 26, marks: 5, part: "i", topic: "Direct vs Indirect Band Gap",
    question: "Determine which semiconductor type should be selected for a high-speed light-emitting device.",
    points: [
      "Direct band gap semiconductor: electron transitions from conduction to valence band occur without momentum change → photon emitted directly (radiative recombination).",
      "Indirect band gap semiconductor: transition requires phonon (momentum conservation) → mostly non-radiative, energy lost as heat → poor light emitter.",
      "For optical communication device requiring fast carrier recombination and high photon emission → select direct band gap material (e.g., GaAs, InP).",
      "Momentum conservation: direct gap → Δk = 0, no phonon needed → higher recombination probability and faster emission.",
      "Conclusion: Direct band gap semiconductor is the correct choice; indirect gap materials (like Si, Ge) waste energy in phonon interactions and are unsuitable for LEDs/lasers."
    ]
  },
  {
    q: 27, marks: 5, part: "i", topic: "Tight-Binding vs Nearly Free Electron Models",
    question: "Integrate tight-binding and nearly free electron models to infer band formation differences.",
    points: [
      "Tight-Binding Model: electrons strongly localized near atoms; band forms from overlap of atomic orbitals; small overlap → narrow bands and large band gaps.",
      "Nearly Free Electron (NFE) Model: electrons nearly free; periodic lattice potential causes small perturbation → creates small band gaps at Brillouin zone boundaries.",
      "Tight-binding explains insulators and narrow-band materials; NFE better explains metals and semiconductors with broader bands.",
      "Overlap strength determines model applicability: large overlap → NFE-like; small overlap → tight-binding behavior.",
      "Conclusion: Tight-binding better explains localized electrons (insulators, transition metals); NFE better explains delocalized electrons (metals, semiconductors). Both predict band gaps but from opposite physical limits."
    ]
  },
  {
    q: 28, marks: 5, part: "i", topic: "Direct vs Indirect Transition & Emission Efficiency",
    question: "Formulate and analyze the relationship between transition mechanism and emission probability.",
    points: [
      "Direct transition (no phonon): probability ∝ |matrix element|² — high, since only electron-photon interaction involved.",
      "Indirect transition (phonon-assisted): probability ∝ product of electron-photon AND electron-phonon matrix elements — much lower.",
      "Emission rate R_direct >> R_indirect at same excitation; indirect transitions are second-order processes.",
      "Radiative efficiency η = R_radiative / (R_radiative + R_non-radiative); direct gap material has higher η.",
      "Conclusion: Material with direct band gap exhibits higher radiative efficiency; phonon-assisted (indirect) transitions are slower and less probable → lower emission efficiency."
    ]
  },
  {
    q: 29, marks: 5, part: "i", topic: "Temperature Effects on Semiconductors",
    question: "Analyze the root cause of malfunction by interpreting energy band behavior at elevated temperature.",
    points: [
      "Narrow band gap → at high temperature, thermal energy $kT$ becomes comparable to $E_g$ → massive intrinsic carrier generation.",
      "Intrinsic carrier concentration $n_i \\propto \\exp(-E_g/2kT)$ rises exponentially with T → conductivity increases uncontrollably.",
      "Fermi level shifts toward mid-gap as intrinsic excitation dominates over doping → device loses controlled switching behavior.",
      "Leakage current increases as minority carriers are thermally generated — device fails to switch off properly.",
      "Recommendation: Use wider band gap semiconductor (e.g., SiC, GaN) for high-temperature operation to prevent thermal runaway."
    ]
  },
  {
    q: 30, marks: 5, part: "i", topic: "Electrical Conductivity Calculation",
    question: "Determine electrical conductivity by formulating the appropriate relation.",
    points: [
      "Given: $n = 10^{16}$ cm$^{-3}$, $\\mu_e = 1400$ cm$^2$/V·s, hole concentration negligible → n-type dominant.",
      "Conductivity formula: $\\sigma = ne\\mu_e$ (electron contribution only, since $p ≈ 0$).",
      "Substituting: $\\sigma = (10^{16} \\text{ cm}^{-3})(1.6\\times10^{-19} \\text{ C})(1400 \\text{ cm}^2\\text{/V}\\cdot\\text{s}) = 2.24$ (Ω·cm)$^{-1}$.",
      "Justification: Drift conduction dominates at room temperature; electrons are majority carriers with high mobility.",
      "Resistivity $\\rho = 1/\\sigma ≈ 0.446$ Ω·cm — characteristic of lightly doped n-type silicon."
    ]
  },
  {
    q: 31, marks: 5, part: "i", topic: "Material Classification by Band Gap",
    question: "Determine and justify appropriate material classification for each component.",
    points: [
      "Wire (current flow): requires zero/negligible band gap and free electrons → Conductor (e.g., Cu, Al); overlapping valence and conduction bands.",
      "Switching element: needs controllable conductivity (on/off) → Semiconductor (e.g., Si, Ge); moderate band gap (0.1–2 eV), switchable by doping or electric field.",
      "Insulating cover: must resist electron flow even under voltage → Insulator (e.g., SiO₂, rubber); large band gap (> 5 eV), no carriers at room temperature.",
      "Each classification is justified by band structure: conductors have no gap, semiconductors have small gap, insulators have large gap.",
      "Temperature consideration: at moderate temperature, conductor and insulator properties remain stable; semiconductor conductivity is temperature-sensitive — acceptable for the switch role."
    ]
  },
  {
    q: 32, marks: 5, part: "i", topic: "Freeze-out Effect in Semiconductors",
    question: "Analyze the underlying cause for reduced conductivity by interpreting temperature dependence.",
    points: [
      "At low temperatures, thermal energy kT is insufficient to ionize acceptor impurity atoms → carriers are not generated (carrier freeze-out).",
      "Partially ionized impurities cannot supply holes to valence band → hole concentration drops drastically below nᵢ expected from doping.",
      "Carrier freeze-out is the dominant limiting mechanism: σ = peμₕ → p ≈ 0 → σ ≈ 0.",
      "Fermi level moves closer to acceptor level (below mid-gap) at low T, reflecting incomplete ionization.",
      "Conclusion: Reduced conductivity at low temperature in acceptor-doped semiconductor is caused by carrier freeze-out — impurities remain neutral, providing no free holes for conduction."
    ]
  }
];

export default function AK22PH202() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});

  return (
    <div className="min-h-screen bg-blue-50 font-sans text-gray-800">
      {/* Simple Header */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 mb-3"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">22PH202 Answer Key</h1>
        <p className="text-gray-600 mt-1 text-sm">Electromagnetism & Modern Physics</p>
      </div>

      {/* Questions */}
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-2">
        {answerKey.map(item => {
          const isOpen = expanded[item.q];
          return (
            <div
              key={item.q}
              className="border border-gray-300 rounded overflow-hidden bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Question Section */}
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [item.q]: !prev[item.q] }))}
                className="w-full text-left px-6 py-4 flex items-start gap-4 hover:bg-blue-50 transition bg-blue-50"
              >
                {/* Q Number */}
                <div className="text-blue-700 font-bold text-lg flex-shrink-0 min-w-[2rem]">
                  Q{item.q}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-semibold bg-blue-200 text-blue-800 border border-blue-400 rounded px-2 py-0.5">
                      {item.marks} Marks
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 leading-relaxed break-words">{item.question}</p>
                </div>
                <div className="text-blue-700 mt-1 text-lg flex-shrink-0 font-bold">{isOpen ? "−" : "+"}</div>
              </button>

              {/* Answer Section */}
              {isOpen && (
                <div className="px-6 pb-6 pt-5 border-t-2 border-blue-300 bg-white">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-4">✓ Answer Points</p>
                  <ol className="space-y-3">
                    {item.points.map((pt, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <span className="min-w-[1.75rem] h-7 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-gray-700 leading-relaxed pt-0.5">
                          <EquationText text={pt} />
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-xs text-gray-500 mt-8 bg-white">
        22PH202 Answer Key • Bannari Amman Institute of Technology
      </div>
    </div>
  );
}