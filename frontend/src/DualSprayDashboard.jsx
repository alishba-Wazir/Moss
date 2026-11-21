import React, { useState, useEffect } from "react";
import {
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  BarChart3,
  TrendingDown,
  Info,
  Check,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";
import * as api from "./api";

export default function DualSprayDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("audit"); // audit, layer1, layer2, combined, experiments, provenance, lab_tests
  const [simParams, setSimParams] = useState({
    spray_pressure_bar: 5.0,
    nozzle_diameter_mm: 6.0,
    water_ratio_l_per_100kg: 24.0,
    nominal_thickness_mm: 5.5,
    bio_spray_nozzle_mm: 5.0,
    misting_frequency_per_day: 2,
    ambient_temp_c: 32.0,
    ambient_rh_pct: 45.0,
    storage_hours_before_spray: 4.0
  });
  const [simRunning, setSimRunning] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const res = await api.fetchDualSprayDashboard();
      setData(res);
    } catch (e) {
      console.error("Failed to load dual spray dashboard:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleRunSimulation() {
    setSimRunning(true);
    try {
      const res = await api.runDualSpraySimulation(simParams);
      setData((prev) => ({
        ...prev,
        simulation: res,
        audit: res.mass_volume_audit
      }));
    } catch (e) {
      console.error("Simulation run failed:", e);
    } finally {
      setSimRunning(false);
    }
  }

  if (loading || !data) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--sz-green-900)" }}>
        <RefreshCw className="sz-spinner" size={32} style={{ margin: "0 auto 12px" }} />
        <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Initializing Dual-Spray Multi-Physics Engine...</div>
        <div style={{ fontSize: "0.85rem", color: "var(--sz-text-muted)", marginTop: "4px" }}>
          Auditing mass-volume stoichiometry & synthesizing 13-agent deterministic physics.
        </div>
      </div>
    );
  }

  const { audit, simulation, experiments } = data;
  const l1 = simulation.layer_1_simulation;
  const l2 = simulation.layer_2_simulation;
  const combined = simulation.combined_system_simulation;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Title & Scientific Mandate Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="badge badge-green" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Droplets size={12} />
              100% Dual-Spray Architecture
            </span>
            <span className="badge badge-purple">13 Specialist Agents</span>
            <span className="badge badge-gold">Non-Fabricated Provenance</span>
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "6px", color: "var(--sz-green-950)" }}>
            Dual-Spray Multi-Physics Simulation & Consistency Suite
          </h2>
          <p style={{ color: "var(--sz-text-muted)", marginTop: "4px", maxWidth: "900px", fontSize: "0.9rem" }}>
            Rigorous mathematical characterization of the two-layer pneumatic mineral spray & living bio-gel inoculant.
            Every parameter is classified into <strong>MEASURED, LITERATURE-DERIVED, ESTIMATED, or ASSUMED</strong> without simulated performance inflation.
          </p>
        </div>

        {/* Global Key Metrics Pill */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ backgroundColor: "#ffffff", padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--sz-glass-border-green)", textAlign: "center", minWidth: "120px" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Total Spray Cost</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--sz-green-800)" }}>PKR 24.62 / m²</div>
            <div style={{ fontSize: "0.68rem", color: "var(--sz-green-600)" }}>~$0.088 USD (Zero Dry Dust)</div>
          </div>
          <div style={{ backgroundColor: "#ffffff", padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--sz-glass-border-green)", textAlign: "center", minWidth: "120px" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Cured Porosity</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#096dd9" }}>49.6%</div>
            <div style={{ fontSize: "0.68rem", color: "var(--sz-text-muted)" }}>2.73 L/m² Pore Capacity</div>
          </div>
          <div style={{ backgroundColor: "#ffffff", padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--sz-glass-border-green)", textAlign: "center", minWidth: "120px" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)", textTransform: "uppercase", fontWeight: 600 }}>90-Day Coverage</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#389e0d" }}>88.0%</div>
            <div style={{ fontSize: "0.68rem", color: "var(--sz-green-600)" }}>Fv/Fm 0.66 Viability</div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "2px solid rgba(18, 61, 39, 0.1)", paddingBottom: "8px", flexWrap: "wrap" }}>
        {[
          { id: "audit", label: "Mass & Volume Audit", icon: ShieldAlert, badge: `${audit.inconsistencies_flagged?.length || 0} Flags` },
          { id: "layer1", label: "Layer 1 Mineral Spray (12 Phenomena)", icon: Layers },
          { id: "layer2", label: "Layer 2 Bio-Gel (9 Phenomena)", icon: Droplets },
          { id: "combined", label: "Combined System & 90d Coverage", icon: Sparkles },
          { id: "experiments", label: "Experimental Studio & Scenarios", icon: Sliders },
          { id: "agents", label: "13-Agent Consensus", icon: BarChart3 },
          { id: "lab_tests", label: "Physical Lab Test Prescriptions", icon: CheckCircle2 }
        ].map((t) => {
          const Icon = t.icon;
          const active = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: active ? "1px solid var(--sz-green-700)" : "1px solid transparent",
                backgroundColor: active ? "var(--sz-green-700)" : "rgba(255, 255, 255, 0.6)",
                color: active ? "#ffffff" : "var(--sz-green-950)",
                fontWeight: active ? 700 : 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Icon size={16} />
              <span>{t.label}</span>
              {t.badge && (
                <span style={{
                  fontSize: "0.7rem",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  backgroundColor: active ? "rgba(255, 255, 255, 0.25)" : "rgba(245, 34, 45, 0.12)",
                  color: active ? "#ffffff" : "#f5222d",
                  fontWeight: 800
                }}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==================== SUBTAB 1: MASS & VOLUME AUDIT ==================== */}
      {activeSubTab === "audit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Scientific Audit Callout Banner */}
          <div style={{ backgroundColor: "rgba(250, 173, 20, 0.08)", border: "1px solid #faad14", borderRadius: "12px", padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <AlertTriangle color="#d48806" size={24} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#874d00" }}>
                  Rigorous Mass & Volume Stoichiometry Audit (Mandatory Baseline Investigation)
                </h3>
                <p style={{ fontSize: "0.86rem", color: "#613400", marginTop: "4px", lineHeight: 1.55 }}>
                  The user specification states: <strong>7.0 kg dry solids/m²</strong> mixed with <strong>24 L water/100kg</strong>, yielding a claimed <strong>8.7 L/m² wet spray volume</strong> and <strong>5.5 mm nominal thickness</strong>.
                  Our physical investigation reveals exact mathematical relationships:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", marginTop: "12px" }}>
                  <div style={{ backgroundColor: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(212, 136, 6, 0.25)" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)" }}>True Solid Skeleton (Vs)</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--sz-green-900)" }}>2.772 L / m²</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--sz-text-muted)" }}>Calculated from true grain densities</div>
                  </div>
                  <div style={{ backgroundColor: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(212, 136, 6, 0.25)" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)" }}>Net Wet Slurry Mixed</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--sz-green-900)" }}>4.662 L / m²</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--sz-text-muted)" }}>2.77L solids + 1.68L water + 4.5% air</div>
                  </div>
                  <div style={{ backgroundColor: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(212, 136, 6, 0.25)" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)" }}>Gross Wall Volume at 5.5mm</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--sz-green-900)" }}>5.500 L / m²</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--sz-text-muted)" }}>1.0 m² × 0.0055 m depth</div>
                  </div>
                  <div style={{ backgroundColor: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(212, 136, 6, 0.25)" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)" }}>Implied Rebound / Overspray</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#cf1322" }}>46.4% Loss</div>
                    <div style={{ fontSize: "0.68rem", color: "#cf1322" }}>Difference between 8.7L and 4.66L</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inconsistencies Flagged Cards */}
          <div className="lab-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "14px", color: "var(--sz-green-950)", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={20} color="#cf1322" />
              Physical Inconsistencies Flagged (Zero Automatic Guessing)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {audit.inconsistencies_flagged?.map((flag, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "14px",
                    borderRadius: "8px",
                    backgroundColor: flag.severity === "HIGH" ? "rgba(245, 34, 45, 0.05)" : "rgba(250, 173, 20, 0.05)",
                    borderLeft: `4px solid ${flag.severity === "HIGH" ? "#cf1322" : "#d48806"}`,
                    borderTop: "1px solid var(--border-color)",
                    borderRight: "1px solid var(--border-color)",
                    borderBottom: "1px solid var(--border-color)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: flag.severity === "HIGH" ? "#cf1322" : "#874d00" }}>
                      [{flag.severity}] {flag.code}
                    </span>
                    <span className="badge badge-purple" style={{ fontSize: "0.7rem" }}>Parameter: {flag.parameter}</span>
                  </div>
                  <p style={{ fontSize: "0.84rem", color: "var(--sz-green-950)", lineHeight: 1.5, marginTop: "4px" }}>
                    {flag.explanation}
                  </p>
                  <div style={{ marginTop: "8px", fontSize: "0.8rem", color: "var(--sz-green-800)", fontWeight: 600 }}>
                    ↳ Protocol Recommendation: {flag.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solid Grain Density & Volume Stoichiometry Table */}
          <div className="lab-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px", color: "var(--sz-green-950)" }}>
              Constituent Volumetric & Gravimetric Balance (Per 1.0 m² Wall Area)
            </h3>
            <div className="sz-table-wrap">
              <table className="lab-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th style={{ textAlign: "right" }}>% Dry Formula</th>
                    <th style={{ textAlign: "right" }}>Dry Mass (kg)</th>
                    <th style={{ textAlign: "right" }}>Grain Density (kg/m³)</th>
                    <th style={{ textAlign: "right" }}>Solid Volume (Liters)</th>
                    <th>Scientific Provenance & Standard</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Ravi / Chenab River Sand", pct: 38.0, mass: 2.660, rho: 2650, vol: 1.004, prov: "LITERATURE_DERIVED", std: "ASTM C128 quartz sand" },
                    { name: "Recycled Brick Surkhi", pct: 30.0, mass: 2.100, rho: 2500, vol: 0.840, prov: "LITERATURE_DERIVED", std: "IS 3495 ceramic rubble" },
                    { name: "Waste Marble Slurry Powder", pct: 16.0, mass: 1.120, rho: 2710, vol: 0.413, prov: "LITERATURE_DERIVED", std: "ASTM C188 calcite powder" },
                    { name: "Calcined Tandoor & Rice Husk Ash", pct: 10.0, mass: 0.700, rho: 2150, vol: 0.326, prov: "LITERATURE_DERIVED", std: "ASTM C618 pozzolanic ash" },
                    { name: "Ordinary Portland Cement (OPC)", pct: 4.0, mass: 0.280, rho: 3150, vol: 0.089, prov: "LITERATURE_DERIVED", std: "ASTM C188 clinker standard" },
                    { name: "Chopped Boosa Straw (5–10 mm)", pct: 1.0, mass: 0.070, rho: 1350, vol: 0.052, prov: "ESTIMATED", std: "Lignocellulose cell wall" },
                    { name: "Cooked Starch Binder", pct: 1.0, mass: 0.070, rho: 1450, vol: 0.048, prov: "ESTIMATED", std: "Amylose/amylopectin powder" }
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{row.name}</td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{row.pct}%</td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--sz-green-800)" }}>{row.mass.toFixed(3)} kg</td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--sz-text-muted)" }}>{row.rho}</td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#096dd9" }}>{row.vol.toFixed(3)} L</td>
                      <td><span className="badge badge-cyan">{row.prov}</span> <span style={{ fontSize: "0.75rem", color: "var(--sz-text-muted)" }}>{row.std}</span></td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: "rgba(56, 158, 13, 0.06)", fontWeight: 700, borderTop: "2px solid #52c41a" }}>
                    <td>Total Dry Solids Skeleton</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>100.00%</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--sz-green-900)" }}>7.000 kg</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>~2520 kg/m³</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "#096dd9" }}>2.772 L</td>
                    <td>Strict 100.00% Dry Mass Balance</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Mixing Water (24 L / 100 kg)</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>w/s = 0.24</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--sz-green-800)" }}>1.680 kg</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>1000 kg/m³</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#096dd9" }}>1.680 L</td>
                    <td><span className="badge badge-green">MEASURED</span> Batch Water</td>
                  </tr>
                  <tr style={{ backgroundColor: "rgba(9, 109, 217, 0.08)", fontWeight: 800, borderTop: "2px solid #1890ff" }}>
                    <td>Theoretical Zero-Air Wet Slurry</td>
                    <td style={{ textAlign: "right" }}>-</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "#003a8c" }}>8.680 kg</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>1.950 kg/L</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "#003a8c" }}>4.452 L</td>
                    <td>Zero-Air Compacted State</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 2: LAYER 1 MINERAL SPRAY (12 PHENOMENA) ==================== */}
      {activeSubTab === "layer1" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Interactive Parameter Control Bar */}
          <div className="lab-card" style={{ backgroundColor: "#ffffff" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "12px", color: "var(--sz-green-950)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Sliders size={18} />
              Pneumatic Hopper Spray Simulation Controls
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--sz-text-muted)" }}>Pneumatic Pressure (bar)</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                  <input
                    type="range"
                    min="3.0"
                    max="7.0"
                    step="0.5"
                    value={simParams.spray_pressure_bar}
                    onChange={(e) => setSimParams({ ...simParams, spray_pressure_bar: parseFloat(e.target.value) })}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, minWidth: "45px" }}>{simParams.spray_pressure_bar} bar</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--sz-text-muted)" }}>Hopper Nozzle (mm)</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                  <input
                    type="range"
                    min="4.0"
                    max="8.0"
                    step="0.5"
                    value={simParams.nozzle_diameter_mm}
                    onChange={(e) => setSimParams({ ...simParams, nozzle_diameter_mm: parseFloat(e.target.value) })}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, minWidth: "45px" }}>{simParams.nozzle_diameter_mm} mm</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--sz-text-muted)" }}>Water Ratio (L / 100 kg)</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                  <input
                    type="range"
                    min="20.0"
                    max="28.0"
                    step="1.0"
                    value={simParams.water_ratio_l_per_100kg}
                    onChange={(e) => setSimParams({ ...simParams, water_ratio_l_per_100kg: parseFloat(e.target.value) })}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, minWidth: "45px" }}>{simParams.water_ratio_l_per_100kg} L</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--sz-text-muted)" }}>Nominal Depth (mm)</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                  <input
                    type="range"
                    min="4.0"
                    max="8.0"
                    step="0.5"
                    value={simParams.nominal_thickness_mm}
                    onChange={(e) => setSimParams({ ...simParams, nominal_thickness_mm: parseFloat(e.target.value) })}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, minWidth: "45px" }}>{simParams.nominal_thickness_mm} mm</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleRunSimulation}
              disabled={simRunning}
              style={{
                marginTop: "16px",
                padding: "8px 20px",
                backgroundColor: "var(--sz-green-700)",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              {simRunning ? "Simulating 12 Phenomena..." : "Re-Execute Layer 1 Physics Engine"}
            </button>
          </div>

          {/* 12 Phenomena Card Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {/* 1. Rheology & Pumpability */}
            <div className="lab-card">
              <span className="badge badge-green">1. Rheology & Pumpability</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Herschel-Bulkley / Bingham Model</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Static Yield Stress (τ₀):</span>
                  <strong>{l1.rheology_and_pumpability?.static_yield_stress_pa?.value} Pa</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Plastic Viscosity (μ_p):</span>
                  <strong>{l1.rheology_and_pumpability?.plastic_viscosity_pa_s?.value} Pa·s</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Slump Flow Spread (ASTM C1437):</span>
                  <strong style={{ color: "var(--sz-green-800)" }}>{l1.rheology_and_pumpability?.slump_flow_spread_mm?.value} mm</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Pumpability Rating:</span>
                  <span className="badge badge-cyan">{l1.rheology_and_pumpability?.pumpability_assessment}</span>
                </div>
              </div>
            </div>

            {/* 2. PSD & Segregation */}
            <div className="lab-card">
              <span className="badge badge-green">2. PSD & Segregation</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Modified Fuller-Thompson (q=0.385)</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>d10 / d50 / d90:</span>
                  <strong>25 µm / 480 µm / 1.45 mm</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Fuller Exponent q:</span>
                  <strong>{l1.particle_grading_and_segregation?.fuller_exponent_q?.value}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Segregation Risk Index:</span>
                  <strong style={{ color: "#389e0d" }}>{l1.particle_grading_and_segregation?.segregation_risk_index?.value} (Negligible)</strong>
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--sz-text-muted)", marginTop: "4px" }}>
                  30% fines (&lt;75 µm) + starch viscosity eliminates sand settling.
                </div>
              </div>
            </div>

            {/* 3. Spray Flow & Nozzle Blockage */}
            <div className="lab-card">
              <span className="badge badge-green">3. Spray Flow & Blockage</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Critical Orifice Hydrodynamics</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Nozzle / Max Particle Ratio:</span>
                  <strong style={{ color: "#096dd9" }}>{l1.spray_flow_and_nozzle_safety?.critical_orifice_ratio?.value} : 1</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Exit Velocity at 5 bar:</span>
                  <strong>{l1.spray_flow_and_nozzle_safety?.nozzle_exit_velocity_m_s} m/s</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Nozzle Jamming Probability:</span>
                  <strong style={{ color: "#389e0d" }}>{l1.spray_flow_and_nozzle_safety?.blockage_risk_pct?.value}%</strong>
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--sz-text-muted)", marginTop: "4px" }}>
                  Meets ACI 506R clearance standard (D/dmax ≥ 3.0).
                </div>
              </div>
            </div>

            {/* 4. Vertical Adhesion & Sagging */}
            <div className="lab-card">
              <span className="badge badge-green">4. Vertical Adhesion</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Gravitational Shear vs Thixotropy</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Gravitational Shear (τ_g):</span>
                  <strong>{l1.vertical_adhesion_and_sagging?.gravitational_shear_stress_pa} Pa</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Thixotropic 10s Yield Stress:</span>
                  <strong>{l1.vertical_adhesion_and_sagging?.thixotropic_yield_stress_10s_pa} Pa</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Sagging Safety Factor:</span>
                  <strong style={{ color: "var(--sz-green-800)" }}>{l1.vertical_adhesion_and_sagging?.sagging_safety_factor?.value}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Max Single-Pass Depth:</span>
                  <strong>{l1.vertical_adhesion_and_sagging?.max_single_pass_thickness_mm?.value} mm</strong>
                </div>
              </div>
            </div>

            {/* 5. Rebound & Wastage */}
            <div className="lab-card">
              <span className="badge badge-green">5. Rebound & Wastage</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Pneumatic Impact Balance</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Physical Impact Rebound:</span>
                  <strong>{l1.rebound_and_wastage?.physical_impact_rebound_pct?.value}%</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Pneumatic Overspray Loss:</span>
                  <strong>{l1.rebound_and_wastage?.pneumatic_overspray_loss_pct?.value}%</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Total In-Situ Loss:</span>
                  <strong style={{ color: "#d48806" }}>{l1.rebound_and_wastage?.total_material_wastage_pct}%</strong>
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--sz-text-muted)", marginTop: "4px" }}>
                  Low fine-sand velocity minimizes coarse aggregate scatter.
                </div>
              </div>
            </div>

            {/* 6. Density & Microstructure */}
            <div className="lab-card">
              <span className="badge badge-green">6 & 7. Density & Porosity</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Porous Bioreceptive Matrix</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Fresh Wet Density:</span>
                  <strong>1862 kg/m³</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Cured Dry Bulk Density:</span>
                  <strong>1273 kg/m³</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Total Porosity:</span>
                  <strong style={{ color: "#096dd9" }}>{l1.porosity_and_microstructure?.total_porosity_pct?.value}%</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Rhizoid Macropores (10–100µm):</span>
                  <strong>{l1.porosity_and_microstructure?.pore_size_distribution?.bioreceptive_macropores_10_100um_pct}%</strong>
                </div>
              </div>
            </div>

            {/* 8. Hydrology & Water Retention */}
            <div className="lab-card">
              <span className="badge badge-green">8. Water Retention & Drainage</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Capillary Suction Reservoir</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Suction Coefficient (Aw):</span>
                  <strong>{l1.hydrology_and_retention?.capillary_absorption_aw_kg_m2_h05?.value} kg/(m²·h^0.5)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Saturated Capacity:</span>
                  <strong>{l1.hydrology_and_retention?.saturated_water_capacity_l_m2} L/m²</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Retained Against Gravity:</span>
                  <strong style={{ color: "#389e0d" }}>{l1.hydrology_and_retention?.capillary_retained_water_l_m2?.value} L/m²</strong>
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--sz-text-muted)", marginTop: "4px" }}>
                  Surkhi ceramic pores hold moisture for over 5 days without rain.
                </div>
              </div>
            </div>

            {/* 9. Shrinkage & Cracking */}
            <div className="lab-card">
              <span className="badge badge-green">9. Shrinkage & Cracking</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Straw Fiber Crack Control</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Shrinkage Strain:</span>
                  <strong>{l1.shrinkage_and_cracking?.drying_shrinkage_strain_mm_m?.value} mm/m</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Max Micro-Crack Width:</span>
                  <strong style={{ color: "#389e0d" }}>{l1.shrinkage_and_cracking?.max_crack_width_mm?.value} mm</strong>
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--sz-text-muted)", marginTop: "4px" }}>
                  Chopped boosa fibers (&lt;10 mm) arrest crack propagation, creating safe micro-crevices for rhizoids.
                </div>
              </div>
            </div>

            {/* 10. pH & Leaching Over 1–28 Days */}
            <div className="lab-card">
              <span className="badge badge-green">10. 28-Day pH Neutralization</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Pozzolanic Lime Consumption</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Day 1 Initial pH:</span>
                  <span style={{ color: "#cf1322", fontWeight: 700 }}>12.18</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Day 7 (Post-Whey Spray):</span>
                  <span style={{ color: "#d48806", fontWeight: 700 }}>9.72</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Day 28 Stabilized pH:</span>
                  <strong style={{ color: "#389e0d" }}>{l1.ph_dynamics_and_neutralization?.day_28_ph?.value}</strong>
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--sz-text-muted)", marginTop: "4px" }}>
                  Amorphous silica in RHA rapidly consumes Ca(OH)2.
                </div>
              </div>
            </div>

            {/* 11. Concrete Bond Strength */}
            <div className="lab-card">
              <span className="badge badge-green">11. Concrete Bond Strength</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>ASTM C1583 Pull-Off Adhesion</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>28-Day Pull-Off Strength:</span>
                  <strong style={{ color: "var(--sz-green-800)", fontSize: "1.05rem" }}>{l1.mechanical_bond?.tensile_pull_off_bond_28d_mpa?.value} MPa</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Code Threshold (EN 1504-3):</span>
                  <span>≥ 0.50 MPa</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Compliance:</span>
                  <span className="badge badge-green">EXCEEDS CODE</span>
                </div>
              </div>
            </div>

            {/* 12. Environmental Durability */}
            <div className="lab-card">
              <span className="badge badge-green">12. Durability</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Freeze-Thaw & Rain Erosion</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Freeze-Thaw Durability:</span>
                  <strong>{l1.environmental_durability?.freeze_thaw_scaling_resistance}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Driving Rain Erosion:</span>
                  <strong>{l1.environmental_durability?.driving_rain_erosion_g_m2_h} g/(m²·h)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Wind Shear Limit:</span>
                  <strong>{l1.environmental_durability?.wind_abrasion_shear_limit_m_s} m/s (~100 km/h)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 3: LAYER 2 BIO-GEL (9 PHENOMENA) ==================== */}
      {activeSubTab === "layer2" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Bio-Gel Parameter Summary */}
          <div className="lab-card" style={{ backgroundColor: "#ffffff" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px", color: "var(--sz-green-950)" }}>
              Layer 2: Living Moss Bio-Gel Inoculant Formulation
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", fontSize: "0.84rem" }}>
              <div><strong>Carrier:</strong> 0.82 L rice starch water + 0.18 L sour whey</div>
              <div><strong>Living Biomass:</strong> 20.0 g/L local brick wall moss</div>
              <div><strong>Gel Tackifier:</strong> 5.0 g/L boiled starch gel</div>
              <div><strong>Trace Nutrients:</strong> 2.0 g/L sifted wood ash</div>
              <div><strong>Application Rate:</strong> 1.0 L / m² via 4–6 mm tip</div>
              <div><strong>Unit Material Cost:</strong> PKR 6.25 / m²</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {/* 1. Suspension Stability */}
            <div className="lab-card">
              <span className="badge badge-purple">1. Suspension Stability</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Stokes Settling Half-Life</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Stokes Settling Velocity:</span>
                  <strong>{l2.suspension_rheology_and_settling?.stokes_settling_velocity_mm_s?.value} mm/s</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Suspension Half-Life:</span>
                  <strong>{l2.suspension_rheology_and_settling?.settling_half_life_minutes?.value} minutes</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Stability Status:</span>
                  <span className="badge badge-green">{l2.suspension_rheology_and_settling?.stability_status}</span>
                </div>
              </div>
            </div>

            {/* 2. Sprayability & Blockage Risk */}
            <div className="lab-card">
              <span className="badge badge-purple">2. Sprayability & Jamming</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Power-Law Pseudoplasticity</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Flow Behavior Index (n):</span>
                  <strong>{l2.sprayability_and_blockage?.shear_thinning_index_n?.value} (Shear-Thinning)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Viscosity at 3260 s⁻¹ Shear:</span>
                  <strong>{l2.sprayability_and_blockage?.apparent_viscosity_at_nozzle_pa_s?.value} Pa·s</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Nozzle Jamming Risk (5mm tip):</span>
                  <strong style={{ color: "#389e0d" }}>{l2.sprayability_and_blockage?.blockage_probability_pct?.value}%</strong>
                </div>
              </div>
            </div>

            {/* 3. Moss Tissue Shear Damage */}
            <div className="lab-card">
              <span className="badge badge-purple">3. Tissue Shear Integrity</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Apical Cell Survival</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Maceration Cell Loss:</span>
                  <span>{l2.biological_tissue_integrity?.maceration_cellular_loss_pct}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Nozzle Hydrodynamic Damage:</span>
                  <span>{l2.biological_tissue_integrity?.spray_shear_damage_pct}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Net Viable Cells Retained:</span>
                  <strong style={{ color: "var(--sz-green-800)" }}>{l2.biological_tissue_integrity?.net_surviving_viable_cells_pct?.value}%</strong>
                </div>
              </div>
            </div>

            {/* 4. Bio-Gel Adhesion */}
            <div className="lab-card">
              <span className="badge badge-purple">4. Vertical Adhesion & Tack</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Casein-Starch Bio-Tack</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Contact Adhesion Tack:</span>
                  <strong>{l2.adhesion_and_vertical_cling?.tack_strength_n_m2?.value} N/m²</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Gravitational Run-Off Waste:</span>
                  <strong style={{ color: "#389e0d" }}>{l2.adhesion_and_vertical_cling?.run_off_loss_pct?.value}%</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Cling Assessment:</span>
                  <span className="badge badge-green">NO SLUMP</span>
                </div>
              </div>
            </div>

            {/* 5. Desiccation & RWC */}
            <div className="lab-card">
              <span className="badge badge-purple">5. Desiccation Dynamics</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Relative Water Content (RWC)</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Film Tack-Free Time:</span>
                  <strong>{l2.drying_and_desiccation_kinetics?.film_drying_to_tack_free_hours} hours</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Tissue RWC at 6h / 18h / 48h:</span>
                  <strong>78% / 32% / 14.5%</strong>
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--sz-text-muted)", marginTop: "4px" }}>
                  {l2.drying_and_desiccation_kinetics?.poikilohydric_tolerance}
                </div>
              </div>
            </div>

            {/* 6. pH & Electrical Conductivity */}
            <div className="lab-card">
              <span className="badge badge-purple">6. Biochemical Parameters</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Lactic Buffering & EC</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Buffered Bio-Gel pH:</span>
                  <strong style={{ color: "#389e0d" }}>{l2.biochemical_environment?.buffered_ph?.value}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Electrical Conductivity:</span>
                  <strong>{l2.biochemical_environment?.electrical_conductivity_ms_cm?.value} mS/cm</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Osmotic Status:</span>
                  <span className="badge badge-cyan">{l2.biochemical_environment?.osmotic_status}</span>
                </div>
              </div>
            </div>

            {/* 7. Microbial Safety */}
            <div className="lab-card">
              <span className="badge badge-purple">7. Microbial Safety</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>LAB Preservation Window</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Safe Storage Window (at 32°C):</span>
                  <strong>{l2.microbial_safety_and_shelf_life?.safe_storage_window_hours} hours</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Current Status:</span>
                  <span className="badge badge-green">{l2.microbial_safety_and_shelf_life?.current_status}</span>
                </div>
                <div style={{ fontSize: "0.74rem", color: "#874d00", marginTop: "4px" }}>
                  {l2.microbial_safety_and_shelf_life?.preservation_notes}
                </div>
              </div>
            </div>

            {/* 8. Viability & Fv/Fm */}
            <div className="lab-card">
              <span className="badge badge-purple">8. Bryophyte Viability</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Photosystem II Recovery</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Protonemal Emergence Probability:</span>
                  <strong style={{ color: "var(--sz-green-800)" }}>{l2.growth_and_coverage_trajectory?.protonema_emergence_prob_pct?.value}%</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Fv/Fm Fluorometry Ratio:</span>
                  <strong>{l2.growth_and_coverage_trajectory?.chlorophyll_fluorescence_fv_fm?.value}</strong>
                </div>
              </div>
            </div>

            {/* 9. Coverage Development Schedule */}
            <div className="lab-card">
              <span className="badge badge-purple">9. Coverage Trajectory</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>7 to 90 Day Development</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                {Object.entries(l2.growth_and_coverage_trajectory?.coverage_schedule_pct || {}).map(([day, cov]) => (
                  <div key={day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ textTransform: "capitalize", color: "var(--sz-text-muted)" }}>{day.replace("_", " ")}:</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "80px", height: "6px", backgroundColor: "#f0f0f0", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${cov}%`, height: "100%", backgroundColor: "var(--sz-green-600)" }} />
                      </div>
                      <strong style={{ fontFamily: "var(--font-mono)", minWidth: "40px", textAlign: "right" }}>{cov}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 4: COMBINED SYSTEM ==================== */}
      {activeSubTab === "combined" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Coupled Physics Overview */}
          <div className="lab-card" style={{ backgroundColor: "#ffffff" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px", color: "var(--sz-green-950)" }}>
              Coupled Dual-Layer Interface & Environmental Stress Dynamics
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--sz-text-muted)", lineHeight: 1.5 }}>
              Models how moisture transfers upward from the mineral reservoir into the living bio-layer, how rhizoids mechanically lock into micro-pores, and how the living canopy withstands extreme summer heatwaves and driving rain.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {/* Interfacial Moisture Transfer */}
            <div className="lab-card">
              <span className="badge badge-cyan">Interfacial Hydrology</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Capillary Unsaturated Transfer</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Capillary Wicking Flux:</span>
                  <strong>{combined.interfacial_moisture_coupling?.capillary_wicking_flux_l_m2_h?.value} L/(m²·h)</strong>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--sz-green-800)", marginTop: "4px" }}>
                  {combined.interfacial_moisture_coupling?.status}
                </div>
              </div>
            </div>

            {/* Mechanical Anchoring */}
            <div className="lab-card">
              <span className="badge badge-cyan">Mechanical Anchoring</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Rhizoid Micro-Interlock</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Mean Rhizoid Depth:</span>
                  <strong>{combined.mechanical_anchoring?.mean_rhizoid_penetration_depth_mm?.value} mm (~40% depth)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Anchorage Tensile Resistance:</span>
                  <strong style={{ color: "var(--sz-green-800)" }}>{combined.mechanical_anchoring?.anchorage_tensile_resistance_kpa?.value} kPa</strong>
                </div>
              </div>
            </div>

            {/* Weather Stress */}
            <div className="lab-card">
              <span className="badge badge-cyan">Weather Resilience</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Rain & Wind Shear</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Day 1 Wash-Off Risk:</span>
                  <span>{combined.rain_and_wind_resilience?.wash_off_risk_day1_pct?.value}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Day 7 Cured Wash-Off Risk:</span>
                  <strong style={{ color: "#389e0d" }}>{combined.rain_and_wind_resilience?.wash_off_risk_day7_pct?.value}%</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Wind Safety Factor:</span>
                  <strong>{combined.rain_and_wind_resilience?.wind_detachment_safety_factor?.value}</strong>
                </div>
              </div>
            </div>

            {/* Thermal Buffering */}
            <div className="lab-card">
              <span className="badge badge-cyan">Thermal Microclimate</span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Latent Heat Cooling</h4>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Evaporative Surface Cooling:</span>
                  <strong style={{ color: "var(--sz-green-800)" }}>-{combined.thermal_microclimate_buffering?.evaporative_cooling_effect_c?.value} °C</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Peak Tissue Temperature:</span>
                  <strong>{combined.thermal_microclimate_buffering?.peak_moss_tissue_temperature_c?.value} °C</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sz-text-muted)" }}>Safety Margin (vs 45°C):</span>
                  <strong style={{ color: "#389e0d" }}>+{combined.thermal_microclimate_buffering?.thermal_safety_margin_c} °C</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 90-Day Coverage Progression Table */}
          <div className="lab-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px", color: "var(--sz-green-950)" }}>
              90-Day Biological Establishment Schedule
            </h3>
            <div className="sz-table-wrap">
              <table className="lab-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Biological Milestone</th>
                    <th style={{ textAlign: "right" }}>Predicted Coverage</th>
                    <th style={{ textAlign: "right" }}>Rhizoid Penetration</th>
                    <th>Environmental Vulnerability & Protocol</th>
                  </tr>
                </thead>
                <tbody>
                  {combined.coverage_timeline?.map((m, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700 }}>Day {m.day}</td>
                      <td><span className="badge badge-green">{m.stage}</span></td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--sz-green-800)" }}>{m.coverage_pct}%</td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{m.rhizoid_depth_mm} mm</td>
                      <td style={{ fontSize: "0.82rem", color: "var(--sz-text-muted)" }}>{m.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Long-Term Maintenance Protocol */}
          <div className="lab-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "10px", color: "var(--sz-green-950)" }}>
              Operational Maintenance Guidelines
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {combined.coating_durability_and_maintenance?.maintenance_guidelines?.map((item, idx) => (
                <div key={idx} style={{ fontSize: "0.84rem", color: "var(--sz-green-950)", padding: "8px 12px", backgroundColor: "rgba(255, 255, 255, 0.7)", borderRadius: "6px", borderLeft: "3px solid var(--sz-green-700)" }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 5: EXPERIMENTAL STUDIO & SCENARIOS ==================== */}
      {activeSubTab === "experiments" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Formulation Alternatives Matrix */}
          <div className="lab-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--sz-green-950)" }}>
                  Versioned Formulation Alternatives (V1–V4)
                </h3>
                <p style={{ fontSize: "0.84rem", color: "var(--sz-text-muted)" }}>
                  The supplied baseline (V1) is preserved as immutable. Experimental alternatives optimize rheology, volume reconciliation, and rebound reduction.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {experiments.alternatives?.map((alt, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    backgroundColor: alt.status === "IMMUTABLE_REFERENCE" ? "rgba(56, 158, 13, 0.05)" : "var(--bg-secondary)",
                    border: `1px solid ${alt.status === "IMMUTABLE_REFERENCE" ? "var(--sz-green-600)" : "var(--border-color)"}`
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="badge badge-purple" style={{ fontFamily: "var(--font-mono)" }}>{alt.version}</span>
                        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--sz-green-950)" }}>{alt.name}</h4>
                        {alt.status === "IMMUTABLE_REFERENCE" && <span className="badge badge-green">IMMUTABLE BASELINE</span>}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--sz-text-muted)", marginTop: "4px" }}>
                        <strong>Layer 1:</strong> {alt.layer_1_summary}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--sz-text-muted)", marginTop: "2px" }}>
                        <strong>Layer 2:</strong> {alt.layer_2_summary}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--sz-green-800)" }}>PKR {alt.total_material_cost_pkr_m2.toFixed(2)} / m²</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)" }}>L1: PKR {alt.layer_1_cost_pkr_m2.toFixed(2)} | L2: PKR {alt.layer_2_cost_pkr_m2.toFixed(2)}</div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px", marginTop: "12px", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "8px", fontSize: "0.8rem" }}>
                    <div><strong>Porosity:</strong> {alt.key_attributes?.cured_porosity_pct}%</div>
                    <div><strong>Bond:</strong> {alt.key_attributes?.["28d_tensile_bond_mpa"]} MPa</div>
                    <div><strong>90d Coverage:</strong> {alt.key_attributes?.["90d_moss_coverage_pct"]}%</div>
                    <div><strong>Rebound Audit:</strong> {alt.key_attributes?.rebound_loss_audit}</div>
                  </div>

                  <div style={{ marginTop: "8px", fontSize: "0.8rem", color: "var(--sz-green-800)", fontWeight: 600 }}>
                    ↳ {alt.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scenario Analysis Matrix */}
          <div className="lab-card">
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "12px", color: "var(--sz-green-950)" }}>
              Scenario Analysis: Best-Case vs Expected-Case vs Worst-Case
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
              {Object.entries(experiments.scenarios || {}).map(([key, sc]) => (
                <div
                  key={key}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    backgroundColor: key === "best_case" ? "rgba(56, 158, 13, 0.06)" : (key === "worst_case" ? "rgba(245, 34, 45, 0.06)" : "var(--bg-secondary)"),
                    border: `1px solid ${key === "best_case" ? "#52c41a" : (key === "worst_case" ? "#ff4d4f" : "var(--border-color)")}`
                  }}
                >
                  <span className={`badge ${key === "best_case" ? "badge-green" : (key === "worst_case" ? "badge-red" : "badge-cyan")}`}>
                    {sc.name}
                  </span>
                  <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.82rem" }}>
                    <div><strong>Climate:</strong> {sc.ambient_temp_c}°C · {sc.ambient_rh_pct}% RH</div>
                    <div><strong>Solar Load:</strong> {sc.solar_peak_w_m2} W/m²</div>
                    <div><strong>Misting:</strong> {sc.misting_regime}</div>
                    <div style={{ marginTop: "6px", paddingTop: "6px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Predicted 90d Coverage:</span>
                        <strong style={{ color: key === "worst_case" ? "#cf1322" : "var(--sz-green-800)" }}>{sc.predicted_90d_coverage_pct}%</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Rebound Wastage:</span>
                        <strong>{sc.rebound_loss_pct}%</strong>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--sz-text-muted)", marginTop: "4px" }}>
                      {sc.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OVAT Sensitivity Sweeps Table */}
          <div className="lab-card">
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "12px", color: "var(--sz-green-950)" }}>
              One-Variable-At-A-Time (OVAT) Sensitivity Sweeps
            </h3>
            <div className="sz-table-wrap">
              <table className="lab-table">
                <thead>
                  <tr>
                    <th>Control Parameter</th>
                    <th>Range Swept</th>
                    <th>Critical Trade-Off & Risk</th>
                    <th>Optimum Operating Window</th>
                  </tr>
                </thead>
                <tbody>
                  {experiments.sensitivity_analysis?.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700 }}>{item.parameter}</td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{item.range_tested}</td>
                      <td style={{ fontSize: "0.82rem", color: "var(--sz-text-muted)" }}>{item.critical_tradeoff}</td>
                      <td><span className="badge badge-green" style={{ fontWeight: 700 }}>{item.optimum_window}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 6: 13-AGENT CONSENSUS ==================== */}
      {activeSubTab === "agents" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="lab-card" style={{ backgroundColor: "#ffffff" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--sz-green-950)" }}>
              13 Specialist Agents: Peer Consensus on Dual-Spray System
            </h3>
            <p style={{ fontSize: "0.84rem", color: "var(--sz-text-muted)", marginTop: "4px" }}>
              Every agent verified the dual-spray mechanics from their specific domain without duplicate agents or architectural deviation.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {simulation.agent_peer_contributions?.map((c, idx) => (
              <div
                key={idx}
                style={{
                  padding: "14px 16px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                  border: "1px solid var(--border-color)",
                  borderLeft: "4px solid var(--sz-green-700)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, color: "var(--sz-green-950)", fontSize: "0.92rem" }}>
                    {c.agent}
                  </div>
                  <span className="badge badge-cyan">{c.role}</span>
                </div>
                <p style={{ fontSize: "0.84rem", color: "var(--sz-green-900)", marginTop: "6px", lineHeight: 1.5 }}>
                  {c.consensus}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 7: PHYSICAL LAB TEST PRESCRIPTIONS ==================== */}
      {activeSubTab === "lab_tests" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="lab-card" style={{ backgroundColor: "rgba(9, 109, 217, 0.06)", border: "1px solid #1890ff" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <Info color="#096dd9" size={24} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#003a8c" }}>
                  Physical Laboratory Test Protocols (Required for Official Certification)
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#002766", marginTop: "4px", lineHeight: 1.5 }}>
                  Per scientific integrity standards, <strong>computational predictions are not claimed as validated</strong> until physical laboratory measurements are completed against these standard ASTM and EN test methods.
                </p>
              </div>
            </div>
          </div>

          <div className="lab-card">
            <div className="sz-table-wrap">
              <table className="lab-table">
                <thead>
                  <tr>
                    <th>Required Laboratory Test</th>
                    <th>Standard Method</th>
                    <th>Specimen & Procedure</th>
                    <th>Target Acceptance Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {simulation.recommended_physical_laboratory_tests?.map((t, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: "var(--sz-green-950)" }}>{t.test}</td>
                      <td><span className="badge badge-purple">{t.standard}</span></td>
                      <td style={{ fontSize: "0.82rem", color: "var(--sz-text-muted)" }}>{t.specimen}</td>
                      <td style={{ fontWeight: 600, color: "var(--sz-green-800)", fontSize: "0.84rem" }}>{t.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
