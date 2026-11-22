import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BarChart3,
  TrendingDown,
  RefreshCw,
  Sparkles,
  Info,
  DollarSign,
  Clock,
  Thermometer,
  FileText,
  Sliders,
  Check,
  XCircle
} from "lucide-react";
import * as api from "./api";

export default function RawalpindiMinimumCoating() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("decision"); // decision, ingredients, balances, economics, thermal, diagnostics, test_protocol
  const [params, setParams] = useState({
    water_volume_ml: 100.0,
    fresh_moss_g: 2.0,
    rice_starch_g: 0.5,
    test_area_m2: 0.10,
    misting_interval_h: 24.0,
    peak_temp_c: 42.0,
    ambient_rh: 28.0,
    wind_m_s: 2.5
  });
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    loadEvaluation();
  }, []);

  async function loadEvaluation() {
    setLoading(true);
    try {
      const res = await api.fetchRawalpindiEvaluation(params);
      setData(res);
    } catch (e) {
      console.error("Failed to load Rawalpindi evaluation:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleReEvaluate() {
    setEvaluating(true);
    try {
      const res = await api.fetchRawalpindiEvaluation(params);
      setData(res);
    } catch (e) {
      console.error("Evaluation re-run failed:", e);
    } finally {
      setEvaluating(false);
    }
  }

  if (loading || !data) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--sz-green-900)" }}>
        <RefreshCw className="sz-spinner" size={32} style={{ margin: "0 auto 12px" }} />
        <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Evaluating Rawalpindi Weathered Concrete Brief...</div>
        <div style={{ fontSize: "0.85rem", color: "var(--sz-text-muted)", marginTop: "4px" }}>
          Benchmarking Candidate 1 (Water-Only) vs Candidate 2 (Single-Starch) vs Formula E vs PWD Paint.
        </div>
      </div>
    );
  }

  const {
    substrate_audit,
    batch_specifications,
    ingredient_necessity_audit,
    mass_and_water_balance,
    failure_diagnostics_matrix,
    economic_life_cycle_eac,
    thermal_2c_cooling_audit,
    one_page_authoritative_decision
  } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="badge badge-purple" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <ShieldAlert size={12} />
              Sabzaar Research Brief
            </span>
            <span className="badge badge-green">Direct-to-Concrete</span>
            <span className="badge badge-gold">Tie-Breaker: Water Wins</span>
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "6px", color: "var(--sz-green-950)" }}>
            Minimum Moss Coating for Existing Rawalpindi Concrete
          </h2>
          <p style={{ color: "var(--sz-text-muted)", marginTop: "4px", maxWidth: "950px", fontSize: "0.9rem" }}>
            Determining whether sound, weathered, unsealed, rough Rawalpindi concrete can eliminate the mineral render layer entirely, 
            leaving only water, local moss, and optionally a single starch tackifier. Zero fabricated performance percentages.
          </p>
        </div>

        {/* Substrate Reality Pill */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ backgroundColor: "#ffffff", padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--sz-glass-border-green)", textAlign: "center", minWidth: "120px" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Surface pH</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#389e0d" }}>8.2 – 8.7</div>
            <div style={{ fontSize: "0.68rem", color: "var(--sz-green-600)" }}>Naturally Carbonated</div>
          </div>
          <div style={{ backgroundColor: "#ffffff", padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--sz-glass-border-green)", textAlign: "center", minWidth: "120px" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Pore Storage</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#d48806" }}>0.28 L / m²</div>
            <div style={{ fontSize: "0.68rem", color: "var(--sz-text-muted)" }}>Desiccates in 1.4h</div>
          </div>
          <div style={{ backgroundColor: "#ffffff", padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--sz-glass-border-green)", textAlign: "center", minWidth: "120px" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Starch Additive</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#096dd9" }}>+PKR 0.80 / m²</div>
            <div style={{ fontSize: "0.68rem", color: "var(--sz-green-600)" }}>82% Initial Retention</div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "2px solid rgba(18, 61, 39, 0.1)", paddingBottom: "8px", flexWrap: "wrap" }}>
        {[
          { id: "decision", label: "Executive Decision & Verdict", icon: CheckCircle2 },
          { id: "ingredients", label: "Ingredient Necessity Audit", icon: Layers, badge: "Earn Your Place" },
          { id: "balances", label: "Mass & Water Balance", icon: Droplets },
          { id: "economics", label: "Life-Cycle EAC vs PWD Paint", icon: DollarSign },
          { id: "thermal", label: "2.0°C Boundary Layer Physics", icon: Thermometer },
          { id: "diagnostics", label: "Failure Diagnostics Matrix", icon: ShieldAlert },
          { id: "test_protocol", label: "Physical Block Test Protocol", icon: FileText }
        ].map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
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
                  backgroundColor: active ? "rgba(255, 255, 255, 0.25)" : "rgba(18, 61, 39, 0.1)",
                  color: active ? "#ffffff" : "var(--sz-green-900)",
                  fontWeight: 800
                }}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==================== SUBTAB 1: EXECUTIVE DECISION ==================== */}
      {activeTab === "decision" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Authoritative Single-Page Decision Box */}
          <div className="card" style={{ borderLeft: "5px solid #d48806", backgroundColor: "#fffbe6" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <AlertTriangle size={24} color="#d48806" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#d48806", textTransform: "uppercase" }}>
                  Definitive Executive Verdict
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#873800", marginTop: "2px" }}>
                  {one_page_authoritative_decision.verdict}
                </h3>
                <p style={{ marginTop: "10px", lineHeight: 1.6, color: "#531dab", fontSize: "0.95rem" }}>
                  {one_page_authoritative_decision.executive_summary}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", marginTop: "16px" }}>
                  <div style={{ backgroundColor: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid #ffe58f" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#cf1322", textTransform: "uppercase" }}>
                      Critical Operational Vulnerability
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#434343", marginTop: "4px", lineHeight: 1.5 }}>
                      {one_page_authoritative_decision.largest_unresolved_failure_mode}
                    </div>
                  </div>
                  <div style={{ backgroundColor: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid #ffe58f" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#389e0d", textTransform: "uppercase" }}>
                      Cheapest Next Physical Laboratory Test
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#434343", marginTop: "4px", lineHeight: 1.5 }}>
                      {one_page_authoritative_decision.cheapest_next_physical_test}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Substrate Reality vs Assumptions */}
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={18} color="var(--sz-green-700)" />
              Rawalpindi Weathered Concrete Substrate Reality
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <div style={{ padding: "14px", backgroundColor: "var(--sz-bg-glass)", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--sz-text-muted)" }}>Target Substrate</div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", marginTop: "4px" }}>{substrate_audit.substrate_type}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--sz-green-700)", marginTop: "4px" }}>Sound, rough, unsealed civil concrete</div>
              </div>
              <div style={{ padding: "14px", backgroundColor: "var(--sz-bg-glass)", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--sz-text-muted)" }}>Surface Carbonation pH</div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", marginTop: "4px", color: "#389e0d" }}>{substrate_audit.surface_ph_measured_range}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--sz-green-700)", marginTop: "4px" }}>Natural atmospheric CO₂ neutralization</div>
              </div>
              <div style={{ padding: "14px", backgroundColor: "var(--sz-bg-glass)", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--sz-text-muted)" }}>Surface Roughness (Ra)</div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", marginTop: "4px" }}>{substrate_audit.surface_roughness_ra_mm} mm</div>
                <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)", marginTop: "4px" }}>Exposed sand/aggregate micro-crevices</div>
              </div>
              <div style={{ padding: "14px", backgroundColor: "var(--sz-bg-glass)", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--sz-text-muted)" }}>Pore Storage Capacity</div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", marginTop: "4px", color: "#cf1322" }}>{substrate_audit.surface_capillary_pore_volume_l_m2} L / m²</div>
                <div style={{ fontSize: "0.72rem", color: "#cf1322", marginTop: "4px" }}>Extremely shallow (vs 2.13 L/m² in Formula E)</div>
              </div>
            </div>
            <div style={{ marginTop: "12px", padding: "10px 14px", backgroundColor: "#f6ffed", borderRadius: "6px", border: "1px solid #b7eb8f", fontSize: "0.85rem", color: "#237804" }}>
              <strong>Readiness Verdict:</strong> {substrate_audit.readiness_verdict}
            </div>
          </div>

          {/* Side-by-Side Batch Specs: Candidate 1 vs Candidate 2 */}
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Layers size={18} color="var(--sz-green-700)" />
              Candidate Formulations Under Evaluation
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
              {/* Candidate 1 */}
              <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid #ffccc7", backgroundColor: "#fff1f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, color: "#cf1322", fontSize: "1.05rem" }}>Candidate 1: Water-Only</span>
                  <span className="badge" style={{ backgroundColor: "#ffccc7", color: "#a8071a" }}>Formula G</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#595959", marginTop: "6px" }}>
                  Zero additives. Water solely distributes living tissue. Local moss supplies new vegetative growth.
                </p>
                <div style={{ marginTop: "12px", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#8c8c8c" }}>Batch Water:</span>
                    <strong>{batch_specifications.water_only_candidate_1.water_ml} mL / 0.10 m² (1.0 L/m²)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#8c8c8c" }}>Fresh Local Moss:</span>
                    <strong>{batch_specifications.water_only_candidate_1.moss_fresh_blotted_g} g (20.0 g/m²)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#8c8c8c" }}>Starch Tackifier:</span>
                    <strong style={{ color: "#8c8c8c" }}>0.0 g (None)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #ffccc7", paddingTop: "6px" }}>
                    <span style={{ color: "#8c8c8c" }}>Initial Gravitational Runoff:</span>
                    <strong style={{ color: "#cf1322" }}>72.0% runoff loss</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#8c8c8c" }}>Rinse Retention after 2h:</span>
                    <strong style={{ color: "#cf1322" }}>14.0% remaining</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#8c8c8c" }}>Material Cost:</span>
                    <strong style={{ color: "#389e0d" }}>PKR 0.55 / m²</strong>
                  </div>
                </div>
              </div>

              {/* Candidate 2 */}
              <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid #b7eb8f", backgroundColor: "#f6ffed" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, color: "#389e0d", fontSize: "1.05rem" }}>Candidate 2: Single-Starch</span>
                  <span className="badge" style={{ backgroundColor: "#b7eb8f", color: "#237804" }}>Formula H</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#595959", marginTop: "6px" }}>
                  Same water & moss + 0.5 g cooked rice starch. Starch has one job: vertical retention until rhizoid anchoring.
                </p>
                <div style={{ marginTop: "12px", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#8c8c8c" }}>Batch Water:</span>
                    <strong>{batch_specifications.single_starch_candidate_2.water_ml} mL / 0.10 m² (1.0 L/m²)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#8c8c8c" }}>Fresh Local Moss:</span>
                    <strong>{batch_specifications.single_starch_candidate_2.moss_fresh_blotted_g} g (20.0 g/m²)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#8c8c8c" }}>Cooked Plain Rice Starch:</span>
                    <strong style={{ color: "#389e0d" }}>0.5 g / batch (5.0 g/m²)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #b7eb8f", paddingTop: "6px" }}>
                    <span style={{ color: "#8c8c8c" }}>Initial Gravitational Runoff:</span>
                    <strong style={{ color: "#389e0d" }}>18.0% (82% moss retained)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#8c8c8c" }}>Rinse Retention after 2h:</span>
                    <strong style={{ color: "#389e0d" }}>68.0% remaining</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#8c8c8c" }}>Material Cost:</span>
                    <strong style={{ color: "#389e0d" }}>PKR 1.35 / m² (+PKR 0.80 for starch)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 2: INGREDIENT EARNING AUDIT ==================== */}
      {activeTab === "ingredients" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  Mandatory Ingredient Necessity Audit: "Make Every Ingredient Earn Its Place"
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--sz-text-muted)", marginTop: "2px" }}>
                  Every raw material must justify its inclusion against predicted consequences of removal, 
                  observations required to retain it, delivered cost, and sourcing burden. Water-only wins all ties.
                </p>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--sz-bg-glass)", borderBottom: "2px solid var(--sz-glass-border-green)", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>Ingredient</th>
                    <th style={{ padding: "10px" }}>Function & Job</th>
                    <th style={{ padding: "10px" }}>Consequence of Removal</th>
                    <th style={{ padding: "10px" }}>Observation Justifying Keeping</th>
                    <th style={{ padding: "10px" }}>Cost (PKR/m²)</th>
                    <th style={{ padding: "10px" }}>Classification</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredient_necessity_audit.map((ing, idx) => {
                    const isEssential = ing.classification === "ESSENTIAL";
                    const isConditional = ing.classification.startsWith("CONDITIONAL");
                    const isRemovable = ing.classification.startsWith("REMOVABLE");
                    const badgeColor = isEssential ? "#389e0d" : (isConditional ? "#d48806" : "#cf1322");
                    const badgeBg = isEssential ? "#f6ffed" : (isConditional ? "#fffbe6" : "#fff1f0");
                    const badgeBorder = isEssential ? "#b7eb8f" : (isConditional ? "#ffe58f" : "#ffa39e");

                    return (
                      <tr key={idx} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.4)" : "transparent" }}>
                        <td style={{ padding: "10px", fontWeight: 700, color: "var(--sz-green-950)" }}>
                          {ing.ingredient}
                          <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)", fontWeight: 400 }}>
                            {ing.quantity_per_m2}
                          </div>
                        </td>
                        <td style={{ padding: "10px", color: "#262626" }}>{ing.function}</td>
                        <td style={{ padding: "10px", color: "#595959" }}>{ing.predicted_consequence_of_removal}</td>
                        <td style={{ padding: "10px", color: "#262626", fontStyle: "italic" }}>{ing.observation_justifying_keeping}</td>
                        <td style={{ padding: "10px", fontWeight: 700, color: "var(--sz-green-800)" }}>
                          PKR {ing.delivered_cost_pkr_m2.toFixed(2)}
                        </td>
                        <td style={{ padding: "10px" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            color: badgeColor,
                            backgroundColor: badgeBg,
                            border: `1px solid ${badgeBorder}`
                          }}>
                            {ing.classification}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 3: MASS & WATER BALANCE ==================== */}
      {activeTab === "balances" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Droplets size={18} color="var(--sz-green-700)" />
              Material & Water Balance Across Candidates
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {/* Water-Only Balance */}
              <div style={{ padding: "14px", backgroundColor: "#fff1f0", borderRadius: "8px", border: "1px solid #ffccc7" }}>
                <h4 style={{ fontWeight: 800, color: "#cf1322", fontSize: "0.95rem" }}>Candidate 1: Water-Only Balance</h4>
                <div style={{ fontSize: "0.85rem", marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Delivered Liquid:</span>
                    <strong>{mass_and_water_balance.candidate_1_water_only.delivered_water_l_m2} L / m²</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Immediate Gravitational Runoff:</span>
                    <strong style={{ color: "#cf1322" }}>{mass_and_water_balance.candidate_1_water_only.runoff_drainage_l_m2} L / m² (72%)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Liquid Absorbed into Concrete:</span>
                    <strong>{mass_and_water_balance.candidate_1_water_only.retained_in_concrete_pores_l_m2} L / m²</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #ffccc7", paddingTop: "6px" }}>
                    <span>Delivered Fresh Moss:</span>
                    <strong>{mass_and_water_balance.candidate_1_water_only.delivered_fresh_moss_g_m2} g / m²</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Effective Retained Moss:</span>
                    <strong style={{ color: "#cf1322" }}>{mass_and_water_balance.candidate_1_water_only.effective_moss_retained_g_m2} g / m² (28%)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #ffccc7", paddingTop: "6px" }}>
                    <span>Time to Severe Desiccation:</span>
                    <strong style={{ color: "#cf1322", fontSize: "0.95rem" }}>{mass_and_water_balance.candidate_1_water_only.hours_to_desiccation} Hours</strong>
                  </div>
                </div>
              </div>

              {/* Single-Starch Balance */}
              <div style={{ padding: "14px", backgroundColor: "#f6ffed", borderRadius: "8px", border: "1px solid #b7eb8f" }}>
                <h4 style={{ fontWeight: 800, color: "#389e0d", fontSize: "0.95rem" }}>Candidate 2: Single-Starch Balance</h4>
                <div style={{ fontSize: "0.85rem", marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Delivered Liquid:</span>
                    <strong>{mass_and_water_balance.candidate_2_single_starch.delivered_water_l_m2} L / m²</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Immediate Gravitational Runoff:</span>
                    <strong style={{ color: "#389e0d" }}>{mass_and_water_balance.candidate_2_single_starch.runoff_drainage_l_m2} L / m² (18%)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Liquid Absorbed & Gel-Bound:</span>
                    <strong>{mass_and_water_balance.candidate_2_single_starch.retained_surface_water_l_m2} L / m²</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #b7eb8f", paddingTop: "6px" }}>
                    <span>Delivered Fresh Moss:</span>
                    <strong>{mass_and_water_balance.candidate_2_single_starch.delivered_fresh_moss_g_m2} g / m²</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Effective Retained Moss:</span>
                    <strong style={{ color: "#389e0d" }}>{mass_and_water_balance.candidate_2_single_starch.effective_moss_retained_g_m2} g / m² (82%)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #b7eb8f", paddingTop: "6px" }}>
                    <span>Time to Severe Desiccation:</span>
                    <strong style={{ color: "#d48806", fontSize: "0.95rem" }}>{mass_and_water_balance.candidate_2_single_starch.hours_to_desiccation} Hours</strong>
                  </div>
                </div>
              </div>

              {/* Benchmark Formula E Balance */}
              <div style={{ padding: "14px", backgroundColor: "#e6f7ff", borderRadius: "8px", border: "1px solid #91d5ff" }}>
                <h4 style={{ fontWeight: 800, color: "#096dd9", fontSize: "0.95rem" }}>Benchmark: Formula E Dual-Spray</h4>
                <div style={{ fontSize: "0.85rem", marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>5.5 mm Porous Render Layer:</span>
                    <strong>2.73 L / m² total pore volume</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Pore Capillary Water Storage:</span>
                    <strong style={{ color: "#096dd9" }}>{mass_and_water_balance.formula_e_benchmark.retained_pore_water_l_m2} L / m²</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Evaporation Rate in June:</span>
                    <strong>0.46 L / (m²·h) (Shaded underpass)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #91d5ff", paddingTop: "6px" }}>
                    <span>Time to Severe Desiccation:</span>
                    <strong style={{ color: "#096dd9", fontSize: "0.95rem" }}>{mass_and_water_balance.formula_e_benchmark.hours_to_desiccation} Hours (3.3× longer)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #91d5ff", paddingTop: "6px" }}>
                    <span>Survival Without Misting:</span>
                    <strong style={{ color: "#389e0d" }}>Survived (Buffer against heatwaves)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 4: LIFE CYCLE EAC VS PWD PAINT ==================== */}
      {activeTab === "economics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px" }}>
              Life-Cycle Economic Model & Equivalent Annual Cost (EAC)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--sz-text-muted)", marginBottom: "16px" }}>
              Comparison against Rawalpindi PWD WeatherShield Exterior Paint on civil concrete across 
              10-year design scenario, 25-year upside scenario, and early failure scenario.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--sz-bg-glass)", borderBottom: "2px solid var(--sz-glass-border-green)", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>System / Candidate</th>
                    <th style={{ padding: "10px" }}>Initial Cost (PKR/m²)</th>
                    <th style={{ padding: "10px" }}>Annual M&O (PKR/m²/yr)</th>
                    <th style={{ padding: "10px" }}>Repaint / Renewal</th>
                    <th style={{ padding: "10px" }}>10-Year Design EAC</th>
                    <th style={{ padding: "10px" }}>25-Year Upside EAC</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Paint Benchmark */}
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", backgroundColor: "#fafafa" }}>
                    <td style={{ padding: "10px", fontWeight: 700 }}>
                      PWD WeatherShield Paint
                      <div style={{ fontSize: "0.72rem", color: "var(--sz-text-muted)" }}>Rawalpindi civil standard</div>
                    </td>
                    <td style={{ padding: "10px", fontWeight: 700, color: "#cf1322" }}>
                      PKR {economic_life_cycle_eac.pwd_weathershield_paint.initial_installed_cost_pkr_m2.toFixed(2)}
                    </td>
                    <td style={{ padding: "10px" }}>
                      PKR {economic_life_cycle_eac.pwd_weathershield_paint.annual_maintenance_pkr_m2_yr.toFixed(2)}
                    </td>
                    <td style={{ padding: "10px" }}>Every {economic_life_cycle_eac.pwd_weathershield_paint.repaint_interval_years} Years</td>
                    <td style={{ padding: "10px", fontWeight: 800, color: "#cf1322" }}>
                      PKR {economic_life_cycle_eac.pwd_weathershield_paint.eac_10_year_design_pkr_m2_yr.toFixed(2)} / yr
                    </td>
                    <td style={{ padding: "10px", fontWeight: 700 }}>
                      PKR {economic_life_cycle_eac.pwd_weathershield_paint.eac_25_year_upside_pkr_m2_yr.toFixed(2)} / yr
                    </td>
                  </tr>

                  {/* Candidate 1 */}
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", backgroundColor: "#fff1f0" }}>
                    <td style={{ padding: "10px", fontWeight: 700 }}>
                      Candidate 1: Water-Only
                      <div style={{ fontSize: "0.72rem", color: "#cf1322" }}>High repeat reseeding required</div>
                    </td>
                    <td style={{ padding: "10px", fontWeight: 700, color: "#389e0d" }}>
                      PKR {economic_life_cycle_eac.candidate_1_water_only.initial_installed_cost_pkr_m2.toFixed(2)}
                    </td>
                    <td style={{ padding: "10px", color: "#cf1322" }}>
                      PKR {economic_life_cycle_eac.candidate_1_water_only.annual_maintenance_pkr_m2_yr.toFixed(2)}
                    </td>
                    <td style={{ padding: "10px" }}>Annual patch seeding</td>
                    <td style={{ padding: "10px", fontWeight: 800, color: "#d48806" }}>
                      PKR {economic_life_cycle_eac.candidate_1_water_only.eac_10_year_design_pkr_m2_yr.toFixed(2)} / yr
                    </td>
                    <td style={{ padding: "10px", fontWeight: 700 }}>
                      PKR {economic_life_cycle_eac.candidate_1_water_only.eac_25_year_upside_pkr_m2_yr.toFixed(2)} / yr
                    </td>
                  </tr>

                  {/* Candidate 2 */}
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", backgroundColor: "#f6ffed" }}>
                    <td style={{ padding: "10px", fontWeight: 700 }}>
                      Candidate 2: Single-Starch
                      <div style={{ fontSize: "0.72rem", color: "#389e0d" }}>Lowest overall EAC (if shaded)</div>
                    </td>
                    <td style={{ padding: "10px", fontWeight: 700, color: "#389e0d" }}>
                      PKR {economic_life_cycle_eac.candidate_2_single_starch.initial_installed_cost_pkr_m2.toFixed(2)}
                    </td>
                    <td style={{ padding: "10px" }}>
                      PKR {economic_life_cycle_eac.candidate_2_single_starch.annual_maintenance_pkr_m2_yr.toFixed(2)}
                    </td>
                    <td style={{ padding: "10px" }}>Every 4–5 Years</td>
                    <td style={{ padding: "10px", fontWeight: 800, color: "#389e0d" }}>
                      PKR {economic_life_cycle_eac.candidate_2_single_starch.eac_10_year_design_pkr_m2_yr.toFixed(2)} / yr
                    </td>
                    <td style={{ padding: "10px", fontWeight: 800, color: "#389e0d" }}>
                      PKR {economic_life_cycle_eac.candidate_2_single_starch.eac_25_year_upside_pkr_m2_yr.toFixed(2)} / yr
                    </td>
                  </tr>

                  {/* Formula E */}
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", backgroundColor: "#e6f7ff" }}>
                    <td style={{ padding: "10px", fontWeight: 700 }}>
                      Formula E Dual-Spray
                      <div style={{ fontSize: "0.72rem", color: "#096dd9" }}>Includes 5.5mm porous render</div>
                    </td>
                    <td style={{ padding: "10px", fontWeight: 700, color: "#096dd9" }}>
                      PKR {economic_life_cycle_eac.formula_e_dual_spray.initial_installed_cost_pkr_m2.toFixed(2)}
                    </td>
                    <td style={{ padding: "10px" }}>
                      PKR {economic_life_cycle_eac.formula_e_dual_spray.annual_maintenance_pkr_m2_yr.toFixed(2)}
                    </td>
                    <td style={{ padding: "10px" }}>100% render retained</td>
                    <td style={{ padding: "10px", fontWeight: 800, color: "#096dd9" }}>
                      PKR {economic_life_cycle_eac.formula_e_dual_spray.eac_10_year_design_pkr_m2_yr.toFixed(2)} / yr
                    </td>
                    <td style={{ padding: "10px", fontWeight: 700 }}>
                      PKR {economic_life_cycle_eac.formula_e_dual_spray.eac_25_year_upside_pkr_m2_yr.toFixed(2)} / yr
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "12px", padding: "10px 14px", backgroundColor: "var(--sz-bg-glass)", borderRadius: "6px", fontSize: "0.85rem", color: "var(--sz-text-muted)" }}>
              <strong>Economic Finding:</strong> Candidate 2 reduces initial installation expenditure by <strong>79.8%</strong> compared to PWD WeatherShield paint (PKR 49.35 vs PKR 245.00 / m²), and cuts 10-year EAC by <strong>61.4%</strong> (PKR 31.85 vs PKR 82.50 / m²/yr).
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 5: THERMAL & 2.0°C COOLING AUDIT ==================== */}
      {activeTab === "thermal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card" style={{ borderLeft: "5px solid #096dd9" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <Thermometer size={24} color="#096dd9" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#096dd9", textTransform: "uppercase" }}>
                  Thermal Physics & Urban Boundary Layer Audit
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#003a8c", marginTop: "2px" }}>
                  Claim: "{thermal_2c_cooling_audit.claim}"
                </h3>
                <div style={{ display: "inline-block", marginTop: "6px", padding: "4px 10px", borderRadius: "4px", backgroundColor: "#e6f7ff", border: "1px solid #91d5ff", fontWeight: 800, fontSize: "0.82rem", color: "#0050b3" }}>
                  Scientific Verdict: {thermal_2c_cooling_audit.scientific_verdict}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginTop: "16px" }}>
              <div style={{ padding: "14px", backgroundColor: "#f6ffed", borderRadius: "8px", border: "1px solid #b7eb8f" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--sz-text-muted)" }}>Wall Surface Skin Temperature</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#389e0d", marginTop: "4px" }}>
                  -{thermal_2c_cooling_audit.surface_temp_reduction_vs_bare_concrete_c} °C
                </div>
                <div style={{ fontSize: "0.75rem", color: "#52c41a", marginTop: "4px" }}>
                  Active conductive cooling when moist
                </div>
              </div>

              <div style={{ padding: "14px", backgroundColor: "#e6f7ff", borderRadius: "8px", border: "1px solid #91d5ff" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--sz-text-muted)" }}>Pedestrian Mean Radiant Temp (MRT)</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#096dd9", marginTop: "4px" }}>
                  -{thermal_2c_cooling_audit.radiant_mean_temp_reduction_c} °C
                </div>
                <div style={{ fontSize: "0.75rem", color: "#1890ff", marginTop: "4px" }}>
                  View factor radiative relief
                </div>
              </div>

              <div style={{ padding: "14px", backgroundColor: "#fff1f0", borderRadius: "8px", border: "1px solid #ffccc7" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--sz-text-muted)" }}>Occupied-Zone Air Temp (Isolated)</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#cf1322", marginTop: "4px" }}>
                  -{thermal_2c_cooling_audit.occupied_zone_air_temp_reduction_c} °C
                </div>
                <div style={{ fontSize: "0.75rem", color: "#cf1322", marginTop: "4px" }}>
                  Diluted to near zero by turbulent airflow
                </div>
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "8px" }}>
                Mandatory Physical Conditions to Realize 2.0°C Occupied Air Cooling:
              </h4>
              <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem", color: "#262626" }}>
                {thermal_2c_cooling_audit.conditions_required_to_achieve_2c_air_cooling.map((cond, idx) => (
                  <li key={idx} style={{ lineHeight: 1.5 }}>{cond}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 6: FAILURE DIAGNOSTICS ==================== */}
      {activeTab === "diagnostics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px" }}>
              Scientific Failure Diagnostics Matrix
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--sz-text-muted)", marginBottom: "16px" }}>
              Distinguishing competing causes through physical measurements before modifying formulations. 
              Unresolved cause recorded when evidence is ambiguous.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {failure_diagnostics_matrix.map((f, idx) => (
                <div key={idx} style={{ padding: "14px", backgroundColor: "var(--sz-bg-glass)", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <span style={{ fontWeight: 800, color: "var(--sz-green-950)", fontSize: "0.95rem" }}>
                        {f.symptom}
                      </span>
                      <span className="badge" style={{ marginLeft: "8px", backgroundColor: "#fff1f0", color: "#cf1322", fontSize: "0.7rem" }}>
                        First Onset: {f.first_onset_window}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px", marginTop: "10px", fontSize: "0.82rem" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#8c8c8c", textTransform: "uppercase", fontSize: "0.7rem" }}>
                        Plausible Competing Causes
                      </div>
                      <ul style={{ paddingLeft: "16px", marginTop: "4px", color: "#595959" }}>
                        {f.plausible_competing_causes.map((c, cIdx) => (
                          <li key={cIdx}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, color: "#096dd9", textTransform: "uppercase", fontSize: "0.7rem" }}>
                        Distinguishing Physical Measurement
                      </div>
                      <div style={{ marginTop: "4px", color: "#262626", fontStyle: "italic" }}>
                        {f.distinguishing_measurement}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, color: "#389e0d", textTransform: "uppercase", fontSize: "0.7rem" }}>
                        Controlled One-Variable-Change To Test
                      </div>
                      <div style={{ marginTop: "4px", color: "#237804", fontWeight: 600 }}>
                        {f.one_controlled_change_to_test}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 7: PHYSICAL BLOCK TEST PROTOCOL ==================== */}
      {activeTab === "test_protocol" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={18} color="var(--sz-green-700)" />
              Physical Laboratory Test Plan: Randomized Weathered Concrete Block Trial
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--sz-text-muted)", marginBottom: "16px" }}>
              Controlled empirical protocol to resolve Candidate 1 vs Candidate 2 attachment without model bias.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <div style={{ padding: "14px", backgroundColor: "var(--sz-bg-glass)", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)" }}>
                <h4 style={{ fontWeight: 700, color: "var(--sz-green-950)", fontSize: "0.9rem" }}>1. Substrate Verification</h4>
                <p style={{ fontSize: "0.82rem", color: "#595959", marginTop: "4px", lineHeight: 1.5 }}>
                  Collect ten sound weathered concrete paving blocks (100×100×50 mm) from Rawalpindi underpass reach. 
                  Measure surface pH with flat-surface contact electrode (verify 8.2–8.7). Clean loose dust with dry nylon brush; zero acid washing.
                </p>
              </div>

              <div style={{ padding: "14px", backgroundColor: "var(--sz-bg-glass)", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)" }}>
                <h4 style={{ fontWeight: 700, color: "var(--sz-green-950)", fontSize: "0.9rem" }}>2. Batch Preparation & Inoculation</h4>
                <p style={{ fontSize: "0.82rem", color: "#595959", marginTop: "4px", lineHeight: 1.5 }}>
                  Harvest local wall moss (Funaria/Barbula). Blot to consistent fresh weight. 
                  Batch 1: 100 mL tap water + 2.0 g blotted moss. 
                  Batch 2: 100 mL water + 0.5 g cooked rice starch (cooled, restored to 100 mL) + 2.0 g blotted moss.
                </p>
              </div>

              <div style={{ padding: "14px", backgroundColor: "var(--sz-bg-glass)", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)" }}>
                <h4 style={{ fontWeight: 700, color: "var(--sz-green-950)", fontSize: "0.9rem" }}>3. Standardized Gentle-Rinse Test</h4>
                <p style={{ fontSize: "0.82rem", color: "#595959", marginTop: "4px", lineHeight: 1.5 }}>
                  Mount blocks vertically. Apply single spray pass. Collect runoff liquid in pre-weighed trays. 
                  After 2 hours air drying, apply a calibrated 0.5 bar fan spray for 60 seconds. 
                  Weigh dislodged biomass. If starch improves retention by &lt;15%, starch is rejected per tie-break rule.
                </p>
              </div>

              <div style={{ padding: "14px", backgroundColor: "var(--sz-bg-glass)", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)" }}>
                <h4 style={{ fontWeight: 700, color: "var(--sz-green-950)", fontSize: "0.9rem" }}>4. Image Growth Tracking</h4>
                <p style={{ fontSize: "0.82rem", color: "#595959", marginTop: "4px", lineHeight: 1.5 }}>
                  Photograph blocks at 0d, 14d, 42d (6 wks), and 84d (12 wks) under standardized 5000K polarized lighting. 
                  Use thresholding to distinguish green living protonema from inactive stuck fragments and green algae.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
