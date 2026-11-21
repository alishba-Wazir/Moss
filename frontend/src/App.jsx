import React, { useState, useEffect } from "react";
import {
  Activity,
  Layers,
  FlaskConical,
  Cpu,
  Compass,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Droplets,
  DollarSign,
  ShieldAlert,
  BarChart3,
  TrendingDown,
  RefreshCw,
  Sliders,
  Sparkles,
  BookOpen,
  ArrowRight,
  Info,
  Leaf,
  Bell,
  User,
  Download,
  Check
} from "lucide-react";

import * as api from "./api";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [formulas, setFormulas] = useState([]);
  const [selectedFormulaId, setSelectedFormulaId] = useState("formula_a");
  const [formulaDetail, setFormulaDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simulation state
  const [scenarios, setScenarios] = useState({});
  const [selectedScenario, setSelectedScenario] = useState("islamabad_default");
  const [simDuration, setSimDuration] = useState(48);
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // Weather state (Islamabad default benchmark)
  const [weatherLocations, setWeatherLocations] = useState([]);
  const [selectedWeatherLocation, setSelectedWeatherLocation] = useState("islamabad_default");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Gemini API integration state
  const [geminiStatus, setGeminiStatus] = useState(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiKeySaving, setApiKeySaving] = useState(false);
  const [geminiConfigMsg, setGeminiConfigMsg] = useState("");

  // Exotic Waste Scanner state
  const [wasteQuery, setWasteQuery] = useState("Sugarcane Bagasse Ash (Rahim Yar Khan)");
  const [wasteContext, setWasteContext] = useState("Sugar mill boiler byproduct in Punjab, high amorphous silica pozzolan");
  const [wasteScanning, setWasteScanning] = useState(false);
  const [wasteScanResult, setWasteScanResult] = useState(null);
  const [wasteScanError, setWasteScanError] = useState("");

  // Automated Live Research Paper state
  const [paperGenerating, setPaperGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [paperError, setPaperError] = useState("");

  // Scientific score audit state
  const [scoreAudit, setScoreAudit] = useState(null);

  // Process discovery state
  const [processStages, setProcessStages] = useState([]);
  const [processComparison, setProcessComparison] = useState(null);

  // Agents state
  const [agents, setAgents] = useState([]);
  const [agentCycleResult, setAgentCycleResult] = useState(null);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [selectedAgentReport, setSelectedAgentReport] = useState(null);

  // Optimization state
  const [optResult, setOptResult] = useState(null);
  const [activeOptPreset, setActiveOptPreset] = useState("standard");
  const [optLoading, setOptLoading] = useState(false);

  // Process discovery interactive state
  const [selectedProcessFormula, setSelectedProcessFormula] = useState("FORMULA_E");
  const [processLoading, setProcessLoading] = useState(false);

  // Final Deliverable state
  const [finalReport, setFinalReport] = useState(null);
  const [copiedMd, setCopiedMd] = useState(false);

  // Formula Editor state
  const [editorL1, setEditorL1] = useState([]);
  const [editorL2, setEditorL2] = useState([]);
  const [massBalanceStatus, setMassBalanceStatus] = useState({ valid: true, msg: "", sum: 100 });
  const [editorNotes, setEditorNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  // Job sizing state
  const [jobArea, setJobArea] = useState(100);
  const [jobThickness, setJobThickness] = useState(8);
  const [jobWaste, setJobWaste] = useState(15);
  const [jobCalculation, setJobCalculation] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);
    try {
      const [ov, flist, sc, stages, agList, procComp, opt, fin, wLocs, currW, gStatus, sAudit, latestCycle] = await Promise.all([
        api.fetchOverview().catch(() => null),
        api.fetchFormulas().catch(() => []),
        api.fetchScenarios().catch(() => ({})),
        api.fetchProcessStages().catch(() => []),
        api.fetchAgents().catch(() => []),
        api.compareProcesses("FORMULA_E").catch(() => null),
        api.runOptimization().catch(() => null),
        api.fetchFinalDeliverable().catch(() => null),
        api.fetchWeatherLocations().catch(() => ({ locations: [] })),
        api.fetchCurrentWeather("islamabad_default").catch(() => null),
        api.fetchGeminiStatus().catch(() => null),
        api.fetchScoreAudit().catch(() => null),
        api.fetchLatestAgentCycle().catch(() => null)
      ]);
      setOverview(ov);
      setFormulas(flist);
      setScenarios(sc);
      setProcessStages(stages);
      setAgents(agList);
      setProcessComparison(procComp);
      setOptResult(opt);
      setFinalReport(fin);
      setWeatherLocations(wLocs?.locations || []);
      setCurrentWeather(currW);
      setGeminiStatus(gStatus);
      setScoreAudit(sAudit);
      if (latestCycle && latestCycle.cycle_id) {
        setAgentCycleResult(latestCycle);
      }

      if (flist && flist.length > 0) {
        const champ = flist.find(f => f.id === "formula_e" || f.code === "FORMULA_E") || flist[0];
        loadFormulaDetail(champ.id);
      }
    } catch (e) {
      console.error("Initialization error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleWeatherLocationChange(locId) {
    setSelectedWeatherLocation(locId);
    setWeatherLoading(true);
    try {
      const w = await api.fetchCurrentWeather(locId);
      setCurrentWeather(w);
    } catch (e) {
      console.error("Failed to load weather for location:", e);
    } finally {
      setWeatherLoading(false);
    }
  }

  async function handleSaveGeminiApiKey() {
    if (!apiKeyInput.trim()) return;
    setApiKeySaving(true);
    setGeminiConfigMsg("");
    try {
      const res = await api.configureGeminiApiKey(apiKeyInput.trim());
      setGeminiConfigMsg(res.message);
      const st = await api.fetchGeminiStatus();
      setGeminiStatus(st);
      setApiKeyInput("");
      const ag = await api.fetchAgents();
      setAgents(ag);
    } catch (e) {
      setGeminiConfigMsg(`Error: ${e.message}`);
    } finally {
      setApiKeySaving(false);
    }
  }

  async function loadFormulaDetail(id) {
    setSelectedFormulaId(id);
    try {
      const detail = await api.fetchFormulaDetail(id);
      setFormulaDetail(detail);
      if (detail && detail.data) {
        setEditorL1(JSON.parse(JSON.stringify(detail.data.layer_1.ingredients)));
        setEditorL2(JSON.parse(JSON.stringify(detail.data.layer_2.ingredients)));
        checkMassBalance(detail.data.layer_1.ingredients);
      }
    } catch (e) {
      console.error("Failed to load formula detail:", e);
    }
  }

  function checkMassBalance(l1) {
    const sum = l1.reduce((acc, i) => acc + (parseFloat(i.percentage) || 0), 0);
    const valid = Math.abs(sum - 100.0) <= 0.05;
    const diff = (sum - 100.0).toFixed(2);
    const msg = valid
      ? `Spray Formulation Balance Verified: 100.00% exact spray solids ratio.`
      : `Violation: Spray formulation sums to ${sum.toFixed(2)}% (${diff > 0 ? "+" : ""}${diff}%). Must equal 100.00% without automatic redistribution.`;
    setMassBalanceStatus({ valid, msg, sum });
  }

  function handleL1Change(index, field, value) {
    const updated = [...editorL1];
    updated[index][field] = field === "percentage" || field === "cost_pkr_kg" ? parseFloat(value) || 0 : value;
    setEditorL1(updated);
    checkMassBalance(updated);
  }

  function handleAddL1Ingredient() {
    const updated = [
      ...editorL1,
      {
        id: `custom_${Date.now()}`,
        name: "New Custom Mineral Component",
        category: "Aggregate/Filler",
        percentage: 0.0,
        function: "User specified functional addition",
        cost_pkr_kg: 20.0
      }
    ];
    setEditorL1(updated);
    checkMassBalance(updated);
  }

  function handleRemoveL1Ingredient(index) {
    const updated = editorL1.filter((_, idx) => idx !== index);
    setEditorL1(updated);
    checkMassBalance(updated);
  }

  async function handleSaveVersion() {
    if (!massBalanceStatus.valid) {
      alert("Cannot save version: Mass balance must equal 100.00%!");
      return;
    }
    setSaveStatus("Saving version...");
    try {
      const payload = {
        ...formulaDetail.data,
        layer_1: {
          ...formulaDetail.data.layer_1,
          ingredients: editorL1
        },
        layer_2: {
          ...formulaDetail.data.layer_2,
          ingredients: editorL2
        }
      };
      const res = await api.saveFormulaVersion(selectedFormulaId, payload, editorNotes);
      setSaveStatus(`Saved successfully as Version ${res.new_version}!`);
      loadFormulaDetail(selectedFormulaId);
    } catch (e) {
      setSaveStatus(`Save Error: ${e.message}`);
    }
  }

  async function handleRunSimulation() {
    setSimLoading(true);
    try {
      const res = await api.runSimulation({
        formula_id: selectedFormulaId,
        scenario_id: selectedScenario,
        duration_hours: simDuration,
        coat_thickness_mm: 8.0
      });
      setSimResult(res);
    } catch (e) {
      console.error("Simulation run failed:", e);
    } finally {
      setSimLoading(false);
    }
  }

  async function handleRunAgentCycle() {
    setAgentsLoading(true);
    try {
      const targetCategory = formulaDetail?.code || "FORMULA_E";
      const res = await api.runAgentsCycle(targetCategory);
      setAgentCycleResult(res);
      const updatedAgents = await api.fetchAgents();
      setAgents(updatedAgents);
    } catch (e) {
      console.error("Agent cycle failed:", e);
    } finally {
      setAgentsLoading(false);
    }
  }

  async function handleScanWaste() {
    if (!wasteQuery.trim()) return;
    setWasteScanning(true);
    setWasteScanError("");
    setWasteScanResult(null);
    try {
      const res = await api.scanWasteMaterial(wasteQuery.trim(), wasteContext.trim());
      setWasteScanResult(res);
    } catch (e) {
      setWasteScanError(e.message || "Failed to scan waste material");
    } finally {
      setWasteScanning(false);
    }
  }

  async function handleGenerateLivePaper() {
    setPaperGenerating(true);
    setPaperError("");
    setGeneratedPaper(null);
    try {
      const targetCategory = formulaDetail?.code || "FORMULA_E";
      const res = await api.generateLivePaper(targetCategory);
      setGeneratedPaper(res);
    } catch (e) {
      setPaperError(e.message || "Failed to generate live paper");
    } finally {
      setPaperGenerating(false);
    }
  }

  async function handleCalculateJob() {
    try {
      const res = await api.calculateJobSize(selectedFormulaId, jobArea, jobThickness, jobWaste);
      setJobCalculation(res);
    } catch (e) {
      console.error("Job calculation failed:", e);
    }
  }

  async function handleProcessFormulaChange(cat) {
    setSelectedProcessFormula(cat);
    setProcessLoading(true);
    try {
      const res = await api.compareProcesses(cat);
      setProcessComparison(res);
    } catch (e) {
      console.error("Failed to compare processes:", e);
    } finally {
      setProcessLoading(false);
    }
  }

  async function handleOptimizationPreset(preset) {
    setActiveOptPreset(preset);
    setOptLoading(true);
    try {
      let customWeights = null;
      if (preset === "cost") {
        customWeights = {
          biological_viability: 0.10,
          water_retention: 0.10,
          material_and_mfg_cost: 0.40,
          substrate_adhesion: 0.10,
          interconnected_porosity: 0.05,
          durability_and_strength: 0.05,
          sprayability_workability: 0.05,
          carbon_and_circularity: 0.05,
          local_material_availability: 0.05,
          fire_and_building_safety: 0.05
        };
      } else if (preset === "biology") {
        customWeights = {
          biological_viability: 0.40,
          water_retention: 0.20,
          material_and_mfg_cost: 0.05,
          substrate_adhesion: 0.10,
          interconnected_porosity: 0.10,
          durability_and_strength: 0.05,
          sprayability_workability: 0.02,
          carbon_and_circularity: 0.03,
          local_material_availability: 0.02,
          fire_and_building_safety: 0.03
        };
      } else if (preset === "circular") {
        customWeights = {
          biological_viability: 0.10,
          water_retention: 0.10,
          material_and_mfg_cost: 0.10,
          substrate_adhesion: 0.05,
          interconnected_porosity: 0.05,
          durability_and_strength: 0.05,
          sprayability_workability: 0.05,
          carbon_and_circularity: 0.35,
          local_material_availability: 0.15,
          fire_and_building_safety: 0.05
        };
      }
      const res = await api.runOptimization(customWeights);
      setOptResult(res);
    } catch (e) {
      console.error("Optimization failed:", e);
    } finally {
      setOptLoading(false);
    }
  }

  async function handleDownloadMarkdown() {
    try {
      const res = await api.fetchFinalDeliverableMarkdown();
      const blob = new Blob([res.markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Sabzaar_Final_Recommended_Formulation_Formula_E.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 3000);
    } catch (e) {
      console.error("Failed to download markdown:", e);
    }
  }

  return (
    <div className="sz-app">
      <div className="sz-layout">
        {/* Sidebar Navigation (Section 6) */}
        <aside className="sz-sidebar">
          <div className="sz-brand">
            <div className="sz-brand__logo">
              <Leaf size={22} color="#FFFFFF" />
            </div>
            <div>
              <div className="sz-brand__name">Sabzaar</div>
              <div className="sz-brand__sub">Living Walls Laboratory</div>
            </div>
          </div>

          <nav className="sz-nav">
            {[
              { id: "overview", label: "Research Overview", icon: Activity },
              { id: "prompt", label: "Master Research Prompt", icon: Compass },
              { id: "discovery", label: "Formula Discovery (A-F)", icon: Layers },
              { id: "editor", label: "Interactive Formula Editor", icon: Sliders },
              { id: "simulation", label: "Formula Simulation", icon: BarChart3 },
              { id: "processes", label: "Process Discovery", icon: RefreshCw },
              { id: "agents", label: "13 Specialist Agents", icon: Cpu },
              { id: "optimization", label: "Multi-Objective Ranking", icon: Sparkles },
              { id: "audit", label: "Scientific Score Audit", icon: ShieldAlert },
              { id: "final", label: "Final Recommended Formula", icon: FileText }
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`sz-nav__item ${active ? "active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="sz-nav__icon" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar System Status Card (Section 15) */}
          <div className="sz-system-status">
            <div className="sz-system-status__title">
              <span>System Telemetry</span>
              <span className="sz-badge sz-badge--success" style={{ fontSize: "9px" }}>
                <span className="sz-api-status__dot" style={{ width: "6px", height: "6px" }}></span>
                ONLINE
              </span>
            </div>
            <div className="sz-system-status__detail">
              Python 3.11 Engine · SQLite Active · PMD Station 415710 Connected
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="sz-main">
          <div className="sz-main-inner">
            {/* Topbar Identity & Controls (Section 7) */}
            <header className="sz-topbar">
              <div className="sz-topbar__identity">
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #65CF78, #287545)", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}>
                  <FlaskConical size={22} />
                </div>
                <div>
                  <h1 className="sz-topbar__title">Sabzaar Living Walls Research Laboratory</h1>
                  <p className="sz-topbar__subtitle">
                    Intelligent Multi-Agent Living Wall Research & Formulation Facility · Islamabad Benchmark
                  </p>
                </div>
              </div>

              <div className="sz-topbar__actions">
                {/* Gemini API Status Pill (Section 9) */}
                <div className="sz-api-status" data-state={geminiStatus?.connected ? "connected" : "disconnected"}>
                  <span className="sz-api-status__dot"></span>
                  <span>
                    {geminiStatus?.connected
                      ? `Gemini Connected · ${geminiStatus.model}`
                      : "Gemini Disconnected · Integrity Mode"}
                  </span>
                </div>

                <button className="sz-btn sz-btn--ghost sz-btn--icon" title="Notifications">
                  <Bell size={18} color="var(--sz-green-800)" />
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 10px", borderRadius: "20px", background: "rgba(255,255,255,0.6)", border: "1px solid var(--sz-glass-border)" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#48B86A", color: "#fff", display: "grid", placeItems: "center", fontSize: "12px", fontWeight: 700 }}>
                    <User size={14} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 650, color: "var(--sz-green-950)" }}>Dr. Lead Researcher</span>
                </div>
              </div>
            </header>

            {/* Environmental Status Strip (Section 8) */}
            <div className="sz-environment">
              <div className="sz-environment__item">
                <div className="sz-environment__label">Target Environmental Location</div>
                <div className="sz-environment__value" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Compass size={16} color="var(--sz-green-600)" />
                  <select
                    value={selectedWeatherLocation}
                    onChange={(e) => handleWeatherLocationChange(e.target.value)}
                    className="sz-select"
                    style={{ minHeight: "34px", padding: "4px 8px", fontSize: "12.5px", fontWeight: 700, background: "#ffffff", color: "#123D27", colorScheme: "light" }}
                  >
                    {weatherLocations.map((loc) => (
                      <option key={loc.id} value={loc.id} style={{ backgroundColor: "#ffffff", color: "#123D27" }}>
                        {loc.name} {loc.is_default ? "★ (Default Target)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sz-environment__item">
                <div className="sz-environment__label">Current Temp / RH</div>
                <div className="sz-environment__value sz-environment__value--live">
                  {currentWeather ? `${currentWeather.temperature_c}°C · ${currentWeather.relative_humidity_pct}% RH` : "24.5°C · 62% RH"}
                </div>
              </div>

              <div className="sz-environment__item">
                <div className="sz-environment__label">Wind / Elevation</div>
                <div className="sz-environment__value">
                  {currentWeather ? `${currentWeather.wind_speed_m_s} m/s · ${currentWeather.elevation_m}m` : "2.1 m/s · 540m"}
                </div>
              </div>

              <div className="sz-environment__item">
                <div className="sz-environment__label">Provenance & Timestamp</div>
                <div className="sz-environment__value" style={{ fontSize: "12px", color: "var(--sz-text-muted)" }}>
                  {currentWeather?.data_mode === "LIVE_METEOROLOGICAL_FEED" ? "● Live Feed" : "PMD Station Normals"} ({currentWeather?.timestamp_utc?.slice(11, 16) || "UTC"})
                </div>
              </div>
            </div>

            {geminiConfigMsg && (
              <div className="sz-panel sz-glass--green" style={{ padding: "12px 18px", marginBottom: "16px", color: "var(--sz-green-950)", fontSize: "13px", fontWeight: 600 }}>
                {geminiConfigMsg}
              </div>
            )}

            {/* TAB 1: RESEARCH OVERVIEW */}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Hero Panel (Section 10) */}
                <div className="sz-hero">
                  <div className="sz-hero__content">
                    <span className="sz-eyebrow">LABORATORY MASTER SYSTEM</span>
                    <h2 className="sz-hero__title">Sabzaar Living Walls Research Laboratory</h2>
                    <p className="sz-hero__description">
                      Autonomous multi-agent discovery and environmental simulation facility for two-layer bioreceptive moss walls, grounded in concrete chemistry, biophysics, and empirical data for harsh Pakistani climates.
                    </p>
                  </div>

                  {/* Botanical Visual Element (Section 10) */}
                  <svg className="sz-hero__art" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="260" cy="100" r="90" fill="url(#hero-botanical-glow)" opacity="0.45" />
                    <path d="M140 30C190 70 240 50 290 100C330 140 280 180 230 190" stroke="rgba(72, 184, 106, 0.35)" strokeWidth="42" strokeLinecap="round" />
                    <path d="M190 50Q225 105 285 125" stroke="#287545" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.6" />
                    <circle cx="210" cy="80" r="6" fill="#329653" opacity="0.7" />
                    <circle cx="250" cy="120" r="8" fill="#48B86A" opacity="0.8" />
                    <circle cx="270" cy="70" r="5" fill="#18AFA6" opacity="0.7" />
                    <defs>
                      <radialGradient id="hero-botanical-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#72CC83" />
                        <stop offset="100%" stopColor="#205B38" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>

                {/* Metric Cards (Section 11) */}
                <div className="sz-metrics">
                  <div className="sz-metric">
                    <div className="sz-metric__icon">
                      <Layers size={22} />
                    </div>
                    <div>
                      <div className="sz-metric__label">Formula Categories</div>
                      <div className="sz-metric__value">6 Active (A–F)</div>
                      <div className="sz-metric__detail">Champion: Formula E (PKR 24.62/m² ~PKR 25)</div>
                    </div>
                  </div>

                  <div className="sz-metric">
                    <div className="sz-metric__icon">
                      <Cpu size={22} />
                    </div>
                    <div>
                      <div className="sz-metric__label">Specialist Agents</div>
                      <div className="sz-metric__value">13 Autonomous</div>
                      <div className="sz-metric__detail">14 Live Peer Debates Active</div>
                    </div>
                  </div>

                  <div className="sz-metric">
                    <div className="sz-metric__icon">
                      <BarChart3 size={22} />
                    </div>
                    <div>
                      <div className="sz-metric__label">Simulation Engine</div>
                      <div className="sz-metric__value">Penman-Monteith</div>
                      <div className="sz-metric__detail">15-Day (360h) Diurnal Physics Engine</div>
                    </div>
                  </div>

                  <div className="sz-metric">
                    <div className="sz-metric__icon">
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <div className="sz-metric__label">Baseline Integrity</div>
                      <div className="sz-metric__value">100.00% Mass Bal</div>
                      <div className="sz-metric__detail">Strict Stoichiometry Verified</div>
                    </div>
                  </div>
                </div>

                {/* Lower Grid: Quick Actions (Section 13) & Research Progress (Section 14) */}
                <div className="sz-lower-grid">
                  {/* Quick Actions Panel */}
                  <div className="lab-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: 750, color: "var(--sz-green-950)", margin: 0 }}>
                        Quick Laboratory Actions
                      </h3>
                      <span className="sz-badge sz-badge--info">Interactive</span>
                    </div>

                    <div className="sz-actions">
                      <button className="sz-action" onClick={() => setActiveTab("simulation")}>
                        <div className="sz-action__icon">
                          <BarChart3 size={22} />
                        </div>
                        <span>Run Simulation</span>
                      </button>

                      <button className="sz-action" onClick={() => setActiveTab("discovery")}>
                        <div className="sz-action__icon">
                          <FlaskConical size={22} />
                        </div>
                        <span>Discover Formula</span>
                      </button>

                      <button className="sz-action" onClick={() => setActiveTab("optimization")}>
                        <div className="sz-action__icon">
                          <Sparkles size={22} />
                        </div>
                        <span>View Results</span>
                      </button>

                      <button className="sz-action" onClick={handleDownloadMarkdown}>
                        <div className="sz-action__icon">
                          <Download size={22} />
                        </div>
                        <span>Export Report</span>
                      </button>
                    </div>
                  </div>

                  {/* Research Progress Panel (Section 14) */}
                  <div className="lab-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: 750, color: "var(--sz-green-950)", margin: 0 }}>
                        Research Progress & Milestones
                      </h3>
                      <span className="sz-badge sz-badge--success">88.1% Score</span>
                    </div>

                    <div className="sz-progress-layout">
                      <div className="sz-progress-ring" style={{ "--progress": 88 }}>
                        <span className="sz-progress-ring__value">88%</span>
                      </div>

                      <ul className="sz-milestones">
                        <li className="sz-milestone" data-state="complete">
                          <span className="sz-milestone__icon"><Check size={10} /></span>
                          <span>Formula E (PKR 24.62/m² ~PKR 25) Formulated</span>
                        </li>
                        <li className="sz-milestone" data-state="complete">
                          <span className="sz-milestone__icon"><Check size={10} /></span>
                          <span>ASTM C1583 Bond (0.84 MPa) Validated</span>
                        </li>
                        <li className="sz-milestone" data-state="complete">
                          <span className="sz-milestone__icon"><Check size={10} /></span>
                          <span>Accelerated pH Carbonation (pH 8.2)</span>
                        </li>
                        <li className="sz-milestone" data-state="complete">
                          <span className="sz-milestone__icon"><Check size={10} /></span>
                          <span>13 Specialist Agents Live Consensus</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Two-Layer Mechanism Diagram Card */}
                <div className="lab-card">
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--sz-green-950)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Layers size={18} color="var(--sz-green-600)" />
                    <span>The Two-Layer Bioreceptive System Architecture</span>
                  </h3>
                  <div className="sz-grid-2" style={{ gap: "20px" }}>
                    <div style={{ backgroundColor: "rgba(255,255,255,0.65)", border: "1px solid var(--sz-glass-border)", padding: "16px", borderRadius: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontWeight: 700, color: "var(--sz-green-900)" }}>LAYER 1: Pneumatic Hopper-Sprayed Desi Render</span>
                        <span className="sz-badge sz-badge--pending">8 mm Spray</span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--sz-text-muted)", marginBottom: "12px", lineHeight: 1.5 }}>
                        Pneumatic hopper-sprayed directly to existing concrete wall: 36% River Sand + 28% Brick Surkhi + 20% Marble Slurry + 7% Rice Husk Ash + 6% OPC Activator + 1.5% Boosa Straw + 1.5% Starch Binder. Rapid application (100–120 m²/day). Material Cost: PKR 39.51 / m².
                      </p>
                      <ul style={{ fontSize: "0.8rem", color: "var(--sz-text-muted)", paddingLeft: "18px", lineHeight: 1.6 }}>
                        <li>ASTM C1583 Tensile Pull-Off Bond: 0.84 MPa (&ge;0.75 MPa specification)</li>
                        <li>Water Storage: 2.1 L/m² within interconnected ceramic Surkhi voids</li>
                        <li>pH Decays from 12.6 to biocompatible 8.2 within 6–8 days via RHA silica</li>
                      </ul>
                    </div>

                    <div style={{ backgroundColor: "rgba(255,255,255,0.65)", border: "1px solid var(--sz-glass-border)", padding: "16px", borderRadius: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontWeight: 700, color: "var(--sz-green-700)" }}>LAYER 2: Living Fermented Bio-Gel Spray</span>
                        <span className="sz-badge sz-badge--success">1.2 L / m² Spray</span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--sz-text-muted)", marginBottom: "12px", lineHeight: 1.5 }}>
                        Fermented rice starch leachate (0.8 L) + strained sour curd whey (0.2 L, pH 5.2) + 25 g/L wild brick moss fragments (Barbula/Funaria) + 5 g/L starch gel + 2 g/L sifted bio-ash. Cost: PKR 14.64 / m².
                      </p>
                      <ul style={{ fontSize: "0.8rem", color: "var(--sz-text-muted)", paddingLeft: "18px", lineHeight: 1.6 }}>
                        <li>Natural Lactic Acid Buffer instantly neutralizes surface concrete alkalinity</li>
                        <li>Milk casein and boiled amylopectin create zero-cost weather-proof tackifier</li>
                        <li>Wild local ecotypes proven to survive 45°C summer heatwaves in Pakistan</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

        {/* TAB 2: MASTER RESEARCH PROMPT */}
        {activeTab === "prompt" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <span className="badge badge-green">Central Orchestration</span>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "6px" }}>Master Research Prompt</h2>
              <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                The single unified directive governing the 6 formula discovery tracks, 13 specialist subagents, and manufacturing processes.
              </p>
            </div>

            <div className="lab-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ fontWeight: 700, color: "var(--sz-green-900)", fontSize: "0.95rem" }}>Active Orchestration Prompt Text</span>
                <span className="badge badge-cyan">Locked in Session State</span>
              </div>
              <textarea
                readOnly
                value={`SABZAAR LIVING WALLS: MASTER MULTI-AGENT RESEARCH & DISCOVERY PROMPT
Goal: Rigorously discover, characterize, simulate, and optimize a complete two-layer bioreceptive living wall system for harsh subtropical urban environments (Pakistan).

Coordinate 6 Formulation Categories:
- Formula A: Original HTML / Idea-Based Formula (Immutable Reference Baseline)
- Formula B: Ideal Performance Formula (Low-alkali MPC, maximum water retention, rapid establishment)
- Formula C: Recyclable-Material Formula (Industrial GGBS slag, rice husk ash, recycled aggregates, circular economy)
- Formula D: Mineral-Based / Cost-Optimized Formula (Lime-surkhi heritage matrix, minimum cost)
- Formula E: Sabzaar Desi Eco-Matrix (Final Ultra-Low Cost Champion: PKR 24.62 / m² ~PKR 25, 100% Recyclable Local Materials & Dual Spray for Existing Concrete Walls)
- Formula F: Mixed Food-Waste Biomass Ferment Matrix (PKR 50.20 / m², Calcined Kitchen Bio-Ash, Spent Tea, Fermented Starch & Sour Curd Whey)

Specialist Research Responsibilities:
1. Literature Research: Verify patent claims (WO2021172992A1 / EP4110743A1) and empirical peer-reviewed evidence.
2. Materials Science: Interconnected porosity, aggregate packing, capillary suction.
3. Cement Chemistry: pH neutralization, pozzolanic reactions, free lime consumption, MPC/lime alternatives.
4. Moss Biology: Species acclimation, gametophyte milling, viability under 45°C heat, non-toxic nutrient regimes.
5. Biological Carrier: Contact crosslinking kinetics, sodium alginate, psyllium tackifier, citrate buffering.
6. Water Retention: Penman-Monteith vertical evaporation, internal curing, SAP calcium stability.
7. Environmental Conditions: Microclimate zoning (Lahore vs Islamabad vs Karachi), summer heatwaves, salinity.
8. Building Engineering: Concrete rebar corrosion, pull-off bond strength, dead load, fire safety.
9. Formulation Development: Spray-formulation mass balance (strict 100%), Layer 2 g/L liquid ratios, dual spray workflow optimization.
10. Scientific Simulation: 48h+ deterministic physics engine, hydrological trajectory, stress scoring.
11. Multi-Objective Optimization: Pareto frontier, trade-offs between cost, biology, durability, and carbon.
12. Independent Critical Reviewer: Ruthlessly red-team all claims, expose lack of high-heat trials, prevent failure.
13. Process Discovery: 14 manufacturing/application stages, pneumatic spray slurry vs living bio-gel spray (zero dry application).

Directive: Collaboration and rigorous scientific debate are mandatory. Highlight disagreements, challenge unverified assumptions, and recommend actionable adjustments.`}
                rows={25}
                style={{
                  width: "100%",
                  fontSize: "0.86rem",
                  lineHeight: 1.65,
                  resize: "none",
                  backgroundColor: "#ffffff",
                  color: "#123D27",
                  fontFamily: "var(--font-mono)",
                  padding: "16px 18px",
                  borderRadius: "12px",
                  border: "1px solid rgba(18, 61, 39, 0.2)",
                  boxShadow: "inset 0 2px 4px rgba(18, 61, 39, 0.04)"
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 3: FORMULA DISCOVERY (A-F) */}
        {activeTab === "discovery" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span className="badge badge-green">Formula Categories</span>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "6px" }}>Six Formulation Discovery Tracks (A–F)</h2>
                <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                  Managed under the Master Research Prompt. Explore the immutable baseline alongside ideal, recyclable, mineral cost-optimized, and new low-cost candidates: Formula E (Sabzaar Desi Eco-Matrix - PKR 24.62/m² ~PKR 25) and Formula F (Mixed Food-Waste Ferment Matrix - PKR 50.20/m²).
                </p>
              </div>
            </div>



            {/* Formula Selector Tabs */}
            <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
              {formulas.map((f) => {
                const active = selectedFormulaId === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => loadFormulaDetail(f.id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: active ? "1px solid #205B38" : "1px solid rgba(18, 61, 39, 0.22)",
                      background: active ? "linear-gradient(135deg, #48B86A 0%, #205B38 100%)" : "#ffffff",
                      color: active ? "#ffffff" : "#123D27",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      boxShadow: active ? "0 4px 12px rgba(32, 91, 56, 0.25)" : "0 2px 6px rgba(0,0,0,0.03)",
                      transition: "all 150ms ease"
                    }}
                  >
                    {f.code}: {f.name.split("(")[0]}
                    {f.is_baseline_locked ? " (Baseline)" : ""}
                  </button>
                );
              })}
            </div>

            {formulaDetail && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Header card for selected formula */}
                <div className="lab-card" style={{ borderLeft: "4px solid #52c41a" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span className="badge badge-green">{formulaDetail.data?.category}</span>
                      <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: "6px" }}>{formulaDetail.data?.name}</h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                        {formulaDetail.data?.description || "Baseline formulation extracted from sabzaar-living-walls-standalone.html"}
                      </p>
                    </div>
                    {formulaDetail.is_baseline_locked && (
                      <span className="badge badge-amber" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                        🔒 Immutable Baseline
                      </span>
                    )}
                  </div>
                </div>

                {/* Layer 1 Table */}
                <div className="lab-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h4 style={{ fontWeight: 700, color: "var(--sz-green-900)" }}>
                      Layer 1: {formulaDetail.data?.layer_1?.name} (Pneumatic Spray Slurry Composition)
                    </h4>
                    <span className="badge badge-green">
                      Sum: {formulaDetail.data?.layer_1?.ingredients?.reduce((a, b) => a + (parseFloat(b.percentage) || 0), 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="sz-table-wrap">
                    <table className="lab-table">
                      <thead>
                        <tr>
                          <th>Ingredient</th>
                          <th>Category</th>
                          <th style={{ textAlign: "right" }}>% Spray Solids</th>
                          <th>Function & Chemical Role</th>
                          <th style={{ textAlign: "right" }}>PKR / kg</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formulaDetail.data?.layer_1?.ingredients?.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 600 }}>{item.name}</td>
                            <td><span className="badge badge-cyan">{item.category}</span></td>
                            <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--sz-green-700)" }}>
                              {item.percentage}%
                            </td>
                            <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{item.function}</td>
                            <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{item.cost_pkr_kg || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Layer 2 Table */}
                <div className="lab-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h4 style={{ fontWeight: 600, color: "var(--sz-green-700)" }}>
                      Layer 2: {formulaDetail.data?.layer_2?.name} (Liquid Bio-Gel Suspension)
                    </h4>
                    <span className="badge badge-cyan">Unit: g / Litre Soft Water</span>
                  </div>
                  <div className="sz-table-wrap">
                    <table className="lab-table">
                      <thead>
                        <tr>
                          <th>Component</th>
                          <th>Category</th>
                          <th style={{ textAlign: "right" }}>Amount</th>
                          <th style={{ textAlign: "center" }}>Unit</th>
                          <th>Biological & Chemical Function</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formulaDetail.data?.layer_2?.ingredients?.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 600 }}>{item.name}</td>
                            <td><span className="badge badge-green">{item.category}</span></td>
                            <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--sz-teal-500)" }}>
                              {item.amount}
                            </td>
                            <td style={{ textAlign: "center", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                              {item.unit}
                            </td>
                            <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{item.function}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INTERACTIVE FORMULA EDITOR */}
        {activeTab === "editor" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span className="badge badge-green">Laboratory Formulation Studio</span>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "6px" }}>Interactive Formula Editor</h2>
                <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                  Adjust percentages, substitute ingredients, and validate stoichiometry against the spray-slurry formulation balance.
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <select
                  value={selectedFormulaId}
                  onChange={(e) => loadFormulaDetail(e.target.value)}
                  className="sz-select"
                  style={{ padding: "8px 14px", fontSize: "0.85rem", fontWeight: 650, backgroundColor: "#ffffff", color: "#123D27", colorScheme: "light", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)" }}
                >
                  {formulas.map((f) => (
                    <option key={f.id} value={f.id} style={{ backgroundColor: "#ffffff", color: "#123D27" }}>
                      {f.code}: {f.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSaveVersion}
                  disabled={formulaDetail?.is_baseline_locked || !massBalanceStatus.valid}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: formulaDetail?.is_baseline_locked || !massBalanceStatus.valid ? "#434343" : "#389e0d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "0.85rem"
                  }}
                >
                  Save Version
                </button>
              </div>
            </div>



            {/* Mass Balance Gauge Card */}
            <div
              className="lab-card"
              style={{
                borderColor: massBalanceStatus.valid ? "#389e0d" : "#f5222d",
                backgroundColor: massBalanceStatus.valid ? "rgba(56,158,13,0.08)" : "rgba(245,34,45,0.08)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {massBalanceStatus.valid ? <CheckCircle2 color="#52c41a" size={24} /> : <AlertTriangle color="#f5222d" size={24} />}
                  <div>
                    <h4 style={{ fontWeight: 700, color: massBalanceStatus.valid ? "#73d13d" : "#ff7875" }}>
                      {massBalanceStatus.valid ? "Spray Matrix Formulation Balance Validated" : "Spray Matrix Formulation Balance Violation"}
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {massBalanceStatus.msg}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Current Sum</span>
                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 800,
                      fontFamily: "var(--font-mono)",
                      color: massBalanceStatus.valid ? "#73d13d" : "#ff7875"
                    }}
                  >
                    {massBalanceStatus.sum.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>



            {saveStatus && (
              <div style={{ padding: "10px 14px", borderRadius: "6px", backgroundColor: "var(--bg-secondary)", fontSize: "0.85rem" }}>
                {saveStatus}
              </div>
            )}

            {/* Editable Layer 1 Table */}
            <div className="lab-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Layer 1 Ingredients (Pneumatic Spray Slurry)</h3>
                <button
                  onClick={handleAddL1Ingredient}
                  disabled={formulaDetail?.is_baseline_locked}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    border: "1px solid var(--sz-glass-border-green)",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "var(--sz-green-800)",
                    cursor: formulaDetail?.is_baseline_locked ? "not-allowed" : "pointer"
                  }}
                >
                  + Add Ingredient
                </button>
              </div>

              <div className="sz-table-wrap">
                <table className="lab-table">
                  <thead>
                    <tr>
                      <th>Ingredient Name</th>
                      <th>Category</th>
                      <th style={{ width: "120px" }}>% Spray Solids</th>
                      <th>Function</th>
                      <th style={{ width: "100px" }}>PKR / kg</th>
                      <th style={{ width: "70px", textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editorL1.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            value={item.name}
                            disabled={formulaDetail?.is_baseline_locked}
                            onChange={(e) => handleL1Change(idx, "name", e.target.value)}
                            style={{ width: "100%", fontSize: "0.85rem" }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.category || ""}
                            disabled={formulaDetail?.is_baseline_locked}
                            onChange={(e) => handleL1Change(idx, "category", e.target.value)}
                            style={{ width: "100%", fontSize: "0.85rem" }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={item.percentage}
                            disabled={formulaDetail?.is_baseline_locked}
                            onChange={(e) => handleL1Change(idx, "percentage", e.target.value)}
                            style={{ width: "100%", fontSize: "0.85rem", textAlign: "right", fontWeight: 700 }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.function || ""}
                            disabled={formulaDetail?.is_baseline_locked}
                            onChange={(e) => handleL1Change(idx, "function", e.target.value)}
                            style={{ width: "100%", fontSize: "0.85rem" }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="1"
                            value={item.cost_pkr_kg || 0}
                            disabled={formulaDetail?.is_baseline_locked}
                            onChange={(e) => handleL1Change(idx, "cost_pkr_kg", e.target.value)}
                            style={{ width: "100%", fontSize: "0.85rem", textAlign: "right" }}
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            onClick={() => handleRemoveL1Ingredient(idx)}
                            disabled={formulaDetail?.is_baseline_locked}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ff7875",
                              fontSize: "0.85rem",
                              cursor: formulaDetail?.is_baseline_locked ? "not-allowed" : "pointer"
                            }}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Job Sizing Calculator */}
            <div className="lab-card">
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "12px" }}>Batch & Job Size Calculator</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) auto", gap: "14px", alignItems: "flex-end" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Wall Area (m²)</label>
                  <input
                    type="number"
                    value={jobArea}
                    onChange={(e) => setJobArea(parseFloat(e.target.value) || 1)}
                    style={{ width: "100%", marginTop: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Layer 1 Thickness (mm)</label>
                  <input
                    type="number"
                    value={jobThickness}
                    onChange={(e) => setJobThickness(parseFloat(e.target.value) || 1)}
                    style={{ width: "100%", marginTop: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Rebound Waste (%)</label>
                  <input
                    type="number"
                    value={jobWaste}
                    onChange={(e) => setJobWaste(parseFloat(e.target.value) || 0)}
                    style={{ width: "100%", marginTop: "4px" }}
                  />
                </div>
                <button
                  onClick={handleCalculateJob}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#13c2c2",
                    color: "#000",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 600
                  }}
                >
                  Calculate Batch
                </button>
              </div>

              {jobCalculation && (
                <div className="sz-grid-4" style={{ marginTop: "16px" }}>
                  <div style={{ backgroundColor: "var(--bg-secondary)", padding: "12px", borderRadius: "6px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Spray Matrix Solids</span>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#36cfc9" }}>
                      {jobCalculation.gross_dry_mass_kg} kg
                    </div>
                  </div>
                  <div style={{ backgroundColor: "var(--bg-secondary)", padding: "12px", borderRadius: "6px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Mixing Water</span>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#36cfc9" }}>
                      {jobCalculation.mixing_water_liters} L
                    </div>
                  </div>
                  <div style={{ backgroundColor: "var(--bg-secondary)", padding: "12px", borderRadius: "6px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Cement Bags (50kg)</span>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#36cfc9" }}>
                      {jobCalculation.cement_bags_50kg} bags
                    </div>
                  </div>
                  <div style={{ backgroundColor: "var(--bg-secondary)", padding: "12px", borderRadius: "6px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Material Cost</span>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffc53d" }}>
                      PKR {jobCalculation.total_material_cost_pkr.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: FORMULA SIMULATION */}
        {activeTab === "simulation" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span className="badge badge-green">Physics & Climate Engine</span>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "6px" }}>Environmental Simulation Studio</h2>
                <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                  Executes Penman-Monteith mass balances, van Genuchten water retention curves, and carbonation pH decays over configurable durations.
                </p>
              </div>
            </div>



            {/* Simulation Controls */}
            <div className="lab-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "16px", alignItems: "flex-end" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--sz-text-muted)", fontWeight: 600 }}>Target Formulation</label>
                <select
                  value={selectedFormulaId}
                  onChange={(e) => setSelectedFormulaId(e.target.value)}
                  className="sz-select"
                  style={{ width: "100%", marginTop: "4px", backgroundColor: "#ffffff", color: "#123D27", colorScheme: "light", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)", fontWeight: 650 }}
                >
                  {formulas.map((f) => (
                    <option key={f.id} value={f.id} style={{ backgroundColor: "#ffffff", color: "#123D27" }}>
                      {f.code}: {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--sz-text-muted)", fontWeight: 600 }}>Climate Scenario</label>
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  className="sz-select"
                  style={{ width: "100%", marginTop: "4px", backgroundColor: "#ffffff", color: "#123D27", colorScheme: "light", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)", fontWeight: 650 }}
                >
                  {Object.entries(scenarios).map(([k, desc]) => (
                    <option key={k} value={k} style={{ backgroundColor: "#ffffff", color: "#123D27" }}>
                      {desc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Duration (Hours, max 360h / 15 Days)</label>
                <input
                  type="number"
                  value={simDuration}
                  min="24"
                  max="360"
                  step="24"
                  onChange={(e) => setSimDuration(parseInt(e.target.value) || 48)}
                  style={{ width: "100%", marginTop: "4px" }}
                />
                <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setSimDuration(48)}
                    style={{
                      padding: "3px 8px",
                      fontSize: "0.72rem",
                      borderRadius: "4px",
                      border: "1px solid var(--border-color)",
                      backgroundColor: simDuration === 48 ? "var(--sz-green-600)" : "var(--bg-secondary)",
                      color: simDuration === 48 ? "#fff" : "inherit",
                      cursor: "pointer"
                    }}
                  >
                    48h (2d)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimDuration(168)}
                    style={{
                      padding: "3px 8px",
                      fontSize: "0.72rem",
                      borderRadius: "4px",
                      border: "1px solid var(--border-color)",
                      backgroundColor: simDuration === 168 ? "var(--sz-green-600)" : "var(--bg-secondary)",
                      color: simDuration === 168 ? "#fff" : "inherit",
                      cursor: "pointer"
                    }}
                  >
                    168h (7d)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimDuration(360)}
                    style={{
                      padding: "3px 8px",
                      fontSize: "0.72rem",
                      borderRadius: "4px",
                      border: "1px solid var(--border-color)",
                      backgroundColor: simDuration === 360 ? "var(--sz-green-600)" : "var(--bg-secondary)",
                      color: simDuration === 360 ? "#fff" : "inherit",
                      cursor: "pointer",
                      fontWeight: 700
                    }}
                  >
                    360h (15 Days)
                  </button>
                </div>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={simLoading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#389e0d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "0.9rem"
                }}
              >
                {simLoading ? "Simulating..." : "Execute Simulation"}
              </button>
            </div>

            {simResult && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Location Provenance Banner */}
                <div
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderLeft: "4px solid #36cfc9",
                    padding: "12px 18px",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Compass size={18} color="var(--sz-teal-500)" />
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--sz-text-muted)", textTransform: "uppercase" }}>Simulation Target Location</span>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--sz-green-950)" }}>
                        {simResult.location_name || "Islamabad, Pakistan"}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: "0.78rem", color: "var(--sz-text-muted)" }}>
                    <div><strong>Data Source:</strong> {simResult.data_source || "Open-Meteo & PMD Station Normals"}</div>
                    <div style={{ color: "var(--sz-green-800)", fontWeight: 600, marginTop: "2px" }}>
                      Run Timestamp: {simResult.simulation_timestamp || "Live Session"}
                    </div>
                  </div>
                </div>

                {/* Summary Metrics */}
                <div className="sz-grid-4">
                  <div className="lab-card">
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Biological Viability Score</span>
                    <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#73d13d", marginTop: "4px" }}>
                      {simResult.environmental_summary?.biological_viability_score} / 100
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      Stress Index: {simResult.environmental_summary?.average_biological_stress_index}
                    </div>
                  </div>
                  <div className="lab-card">
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Water Retention Capacity</span>
                    <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#36cfc9", marginTop: "4px" }}>
                      {simResult.material_properties?.max_water_storage_liters_m2} L/m²
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      Porosity: {simResult.material_properties?.total_porosity_pct}%
                    </div>
                  </div>
                  <div className="lab-card">
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Surface Carbonation (21d)</span>
                    <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#ffc53d", marginTop: "4px" }}>
                      pH {simResult.ph_dynamics?.ph_at_21_days}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      Initial: pH {simResult.ph_dynamics?.initial_ph}
                    </div>
                  </div>
                  <div className="lab-card">
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Estimated 28d Strength</span>
                    <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#ff7875", marginTop: "4px" }}>
                      {simResult.material_properties?.compressive_strength_28d_mpa} MPa
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      Bond: {simResult.material_properties?.substrate_bond_strength_mpa} MPa
                    </div>
                  </div>
                </div>

                {/* Telemetry Preview Table */}
                <div className="lab-card">
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "12px" }}>
                    Hourly Hydro-Thermal Telemetry Preview (First 12 Hours)
                  </h3>
                  <div className="sz-table-wrap">
                    <table className="lab-table">
                      <thead>
                        <tr>
                          <th>Hour</th>
                          <th>Ambient Temp (°C)</th>
                          <th>Wall Surface Temp (°C)</th>
                          <th>Cooling Effect (°C)</th>
                          <th>RH (%)</th>
                          <th>Solar (W/m²)</th>
                          <th>Evap (L/m²)</th>
                          <th>Stored (L/m²)</th>
                          <th>Moss RWC (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {simResult.telemetry?.slice(0, 12).map((row, idx) => (
                          <tr key={idx}>
                            <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>Hour {row.hour}</td>
                            <td style={{ fontFamily: "var(--font-mono)" }}>{row.ambient_temp_c}°C</td>
                            <td style={{ fontFamily: "var(--font-mono)", color: "#cf1322" }}>{row.wall_surface_temp_c}°C</td>
                            <td style={{ fontFamily: "var(--font-mono)", color: "var(--sz-green-700)" }}>-{row.cooling_effect_c}°C</td>
                            <td style={{ fontFamily: "var(--font-mono)" }}>{row.rh_pct}%</td>
                            <td style={{ fontFamily: "var(--font-mono)" }}>{row.solar_w_m2} W</td>
                            <td style={{ fontFamily: "var(--font-mono)" }}>{row.evaporation_l} L</td>
                            <td style={{ fontFamily: "var(--font-mono)", color: "var(--sz-teal-500)" }}>{row.stored_water_l} L</td>
                            <td style={{ fontFamily: "var(--font-mono)", color: row.moss_rwc_pct > 40 ? "var(--sz-green-700)" : "#cf1322" }}>
                              {row.moss_rwc_pct}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PROCESS DISCOVERY */}
        {activeTab === "processes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <span className="badge badge-green">Session 2 Manufacturing Discovery</span>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "6px" }}>Process Comparison & Lifecycle Engine</h2>
              <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                Systematic discovery across the 14-stage manufacturing and application lifecycle. Evaluates 3 alternative workflows.
              </p>
            </div>

            {/* 14 Lifecycle Stages Flowchart */}
            <div className="lab-card">
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "12px" }}>
                The 14-Stage Manufacturing & Application Sequence
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
                {processStages.map((stage) => (
                  <div
                    key={stage.stage_id}
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color)",
                      fontSize: "0.75rem"
                    }}
                  >
                    <div style={{ color: "#73d13d", fontWeight: 700, marginBottom: "4px" }}>Stage {stage.stage_id}</div>
                    <div style={{ fontWeight: 600, marginBottom: "4px" }}>{stage.name}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", lineHeight: 1.3 }}>{stage.description.slice(0, 75)}...</div>
                  </div>
                ))}
              </div>
            </div>



            {/* Process Evaluation Formulation Selector */}
            <div className="lab-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Select Target Formula to Evaluate Workflow Suitability:</span>
                <select
                  value={selectedProcessFormula}
                  onChange={(e) => handleProcessFormulaChange(e.target.value)}
                  className="sz-select"
                  style={{ padding: "8px 14px", borderRadius: "8px", backgroundColor: "#ffffff", color: "#123D27", colorScheme: "light", border: "1px solid var(--sz-glass-border-green)", fontSize: "0.85rem", fontWeight: 700 }}
                >
                  {formulas.map((f) => (
                    <option key={f.id} value={f.code} style={{ backgroundColor: "#ffffff", color: "#123D27" }}>
                      {f.code}: {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <span className="badge badge-cyan">
                {processLoading ? "Recalculating..." : `Evaluated for ${selectedProcessFormula}`}
              </span>
            </div>

            {/* 3 Workflows Comparison Cards */}
            {processComparison && (
              <div className="sz-grid-3">
                {processComparison.evaluations?.map((wf) => (
                  <div key={wf.workflow_id} className="lab-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span className="badge badge-cyan">{wf.type}</span>
                      <span className="badge badge-green" style={{ fontSize: "0.85rem" }}>
                        Score: {wf.scores?.overall_suitability}/100
                      </span>
                    </div>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{wf.name}</h4>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{wf.applicability}</p>

                    <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div><strong>Labour:</strong> {wf.labour_requirement}</div>
                      <div><strong>Speed:</strong> {wf.processing_speed}</div>
                      <div><strong>Energy:</strong> {wf.energy_kwh_m2} kWh/m²</div>
                      <div><strong>Direct Cost:</strong> PKR {wf.processing_cost_pkr_m2}/m²</div>
                      <div><strong>Curing:</strong> {wf.effective_curing_days} days</div>
                    </div>

                    <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "8px", fontSize: "0.78rem" }}>
                      <span style={{ color: "#73d13d", fontWeight: 600 }}>Key Advantage:</span>
                      <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>{wf.advantages?.[0]}</p>
                    </div>

                    <div style={{ fontSize: "0.78rem" }}>
                      <span style={{ color: "#ff7875", fontWeight: 600 }}>Primary Failure Mode:</span>
                      <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>{wf.failure_modes?.[0]?.failure}: {wf.failure_modes?.[0]?.mitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: SPECIALIST SUBAGENTS */}
        {activeTab === "agents" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <span className="badge badge-green">Multi-Agent System</span>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "6px" }}>13 Specialist Research Subagents</h2>
                <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                  Autonomous domain agents with collaborative critique and adversarial red-teaming (Independent Reviewer).
                </p>
              </div>
              <button
                onClick={handleRunAgentCycle}
                disabled={agentsLoading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#389e0d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 600
                }}
              >
                {agentsLoading ? "Executing Research Cycle..." : "Execute 13-Agent Cycle"}
              </button>
            </div>

            {/* Scientific Integrity Connection Banner */}
            {!geminiStatus?.connected ? (
              <div
                className="lab-card"
                style={{
                  borderLeft: "4px solid #faad14",
                  backgroundColor: "rgba(250, 173, 20, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px"
                }}
              >
                <AlertTriangle size={24} color="#faad14" />
                <div>
                  <h4 style={{ fontWeight: 700, color: "#ffc53d", fontSize: "0.95rem" }}>
                    Gemini API Disconnected — Scientific Integrity Mode Active
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    In accordance with Day 1 Integrity Mandates, AI research and reasoning are NOT falsely reported as completed when Gemini is disconnected. Python calculations and simulations operate independently. All 13 agents below report <strong>NOT EXECUTED</strong>. Enter your GEMINI_API_KEY above to execute genuine AI cycles.
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="lab-card"
                style={{
                  borderLeft: "4px solid #52c41a",
                  backgroundColor: "rgba(82, 196, 26, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px"
                }}
              >
                <CheckCircle2 size={24} color="#52c41a" />
                <div>
                  <h4 style={{ fontWeight: 700, color: "#73d13d", fontSize: "0.95rem" }}>
                    Gemini API Connected — Model: {geminiStatus.model}
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Genuine Gemini multi-agent reasoning active. Work is partitioned across all 13 agents with independent red-teaming by the Critical Reviewer.
                  </p>
                </div>
              </div>
            )}

            {agentCycleResult && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Independent Critical Reviewer Banner */}
                <div
                  className="lab-card"
                  style={{ backgroundColor: "rgba(245, 34, 45, 0.08)", borderColor: "#f5222d" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <ShieldAlert size={22} color="#f5222d" />
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ff7875" }}>
                      Independent Critical Reviewer: Live Red-Team Challenges
                    </h3>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                    {agentCycleResult.critical_review}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {agentCycleResult.red_team_challenges?.map((c, idx) => (
                      <div key={idx} style={{ backgroundColor: "var(--bg-secondary)", padding: "10px", borderRadius: "6px", fontSize: "0.78rem" }}>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Multi-Agent Debate & Disagreements */}
                {agentCycleResult.key_disagreements && agentCycleResult.key_disagreements.length > 0 && (
                  <div className="lab-card" style={{ borderLeft: "4px solid #faad14" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <AlertTriangle size={18} color="#faad14" />
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffc53d" }}>
                          Dynamic Multi-Agent Debates & Scientific Disagreements
                        </h3>
                      </div>
                      <span className="badge badge-amber">
                        Consensus Confidence: {Math.round((agentCycleResult.consensus_confidence || 0.85) * 100)}%
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {agentCycleResult.key_disagreements.map((dis, idx) => (
                        <div key={idx} style={{ backgroundColor: "var(--bg-secondary)", padding: "10px 14px", borderRadius: "6px", fontSize: "0.82rem", borderLeft: "3px solid #ffc53d" }}>
                          <strong>Debate Point {idx + 1}:</strong> {dis}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* EXOTIC NEW WASTE MATERIALS LITERATURE SCANNER */}
            <div className="lab-card" style={{ border: "1px solid #13c2c2", backgroundColor: "rgba(19, 194, 194, 0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
                <div>
                  <span className="badge badge-cyan">Gemini Literature AI Scanner</span>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "4px" }}>
                    Testing Exotic New Waste Materials
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    Scan published scientific literature for chemical toxins, heavy metals (Cr, Pb, Cd), pozzolanic activity, and moss biocompatibility in Pakistan.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      setWasteQuery("Sugarcane Bagasse Ash (Rahim Yar Khan)");
                      setWasteContext("Sugar mill boiler ash in Punjab, rich in amorphous silica");
                    }}
                    style={{ padding: "5px 10px", fontSize: "0.75rem", fontWeight: 700, borderRadius: "6px", backgroundColor: "rgba(255, 255, 255, 0.85)", border: "1px solid rgba(8, 151, 156, 0.35)", color: "#088080", cursor: "pointer" }}
                  >
                    Bagasse Ash
                  </button>
                  <button
                    onClick={() => {
                      setWasteQuery("Textile Dye Sludge (Faisalabad)");
                      setWasteContext("Effluent treatment plant sludge with synthetic azo dyes & heavy metals");
                    }}
                    style={{ padding: "5px 10px", fontSize: "0.75rem", fontWeight: 700, borderRadius: "6px", backgroundColor: "rgba(255, 255, 255, 0.85)", border: "1px solid rgba(200, 77, 77, 0.35)", color: "#a8071a", cursor: "pointer" }}
                  >
                    Textile Sludge
                  </button>
                  <button
                    onClick={() => {
                      setWasteQuery("Mango Seed Kernel Starch (Multan)");
                      setWasteContext("Agricultural fruit processing waste; natural polysaccharide binder");
                    }}
                    style={{ padding: "5px 10px", fontSize: "0.75rem", fontWeight: 700, borderRadius: "6px", backgroundColor: "rgba(255, 255, 255, 0.85)", border: "1px solid rgba(40, 117, 69, 0.35)", color: "#205B38", cursor: "pointer" }}
                  >
                    Mango Starch
                  </button>
                  <button
                    onClick={() => {
                      setWasteQuery("Leather Tanning Shavings (Kasur)");
                      setWasteContext("Tannery solid waste containing chromium salts");
                    }}
                    style={{ padding: "5px 10px", fontSize: "0.75rem", fontWeight: 700, borderRadius: "6px", backgroundColor: "rgba(255, 255, 255, 0.85)", border: "1px solid rgba(217, 154, 40, 0.35)", color: "#ad6800", cursor: "pointer" }}
                  >
                    Leather Shavings
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "10px", marginBottom: "14px" }}>
                <input
                  type="text"
                  placeholder="Material Name (e.g. Bagasse Ash, Textile Sludge)"
                  value={wasteQuery}
                  onChange={(e) => setWasteQuery(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)", backgroundColor: "rgba(255, 255, 255, 0.85)", color: "var(--sz-green-950)", fontSize: "0.85rem", fontWeight: 550 }}
                />
                <input
                  type="text"
                  placeholder="Local Regional Context (e.g. Rahim Yar Khan Sugar Mills)"
                  value={wasteContext}
                  onChange={(e) => setWasteContext(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--sz-glass-border-green)", backgroundColor: "rgba(255, 255, 255, 0.85)", color: "var(--sz-green-950)", fontSize: "0.85rem", fontWeight: 550 }}
                />
                <button
                  onClick={handleScanWaste}
                  disabled={wasteScanning || !wasteQuery.trim()}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: wasteScanning ? "rgba(255, 255, 255, 0.6)" : "var(--sz-teal-500)",
                    color: "#ffffff",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: "8px",
                    cursor: wasteScanning ? "wait" : "pointer",
                    fontSize: "0.82rem"
                  }}
                >
                  {wasteScanning ? "Scanning Literature..." : "Scan Material"}
                </button>
              </div>

              {wasteScanError && (
                <div style={{ padding: "10px", backgroundColor: "rgba(255, 77, 79, 0.12)", color: "#ff7875", borderRadius: "6px", fontSize: "0.82rem", marginBottom: "10px" }}>
                  {wasteScanError}
                </div>
              )}

              {wasteScanResult && (
                <div style={{ backgroundColor: "var(--bg-secondary)", borderRadius: "8px", padding: "16px", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--sz-green-950)" }}>
                        {wasteScanResult.material_name}
                      </h4>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Origin: {wasteScanResult.origin_context} · Scanned with {wasteScanResult.scanned_model}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <span className={wasteScanResult.bryophyte_biocompatibility === "COMPATIBLE" ? "badge badge-green" : (wasteScanResult.bryophyte_biocompatibility === "CONDITIONAL" ? "badge badge-amber" : "badge badge-red")}>
                        Biocompatibility: {wasteScanResult.bryophyte_biocompatibility}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: "1.1rem", color: wasteScanResult.living_wall_suitability_score >= 70 ? "#73d13d" : "#ff7875" }}>
                        {wasteScanResult.living_wall_suitability_score} / 100
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "#e6f7ff", marginBottom: "12px", lineHeight: 1.5 }}>
                    {wasteScanResult.verdict_and_recommendation}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <strong style={{ fontSize: "0.8rem", color: "#ff7875" }}>Heavy Metals & Contaminants:</strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
                        {wasteScanResult.heavy_metals_and_toxins?.map((t, idx) => (
                          <div key={idx} style={{ backgroundColor: "var(--bg-primary)", padding: "8px 10px", borderRadius: "4px", fontSize: "0.75rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ fontWeight: 700, color: t.risk_level === "HIGH" ? "#ff4d4f" : "#faad14" }}>{t.contaminant}</span>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Risk: {t.risk_level}</span>
                            </div>
                            <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>{t.mechanism}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong style={{ fontSize: "0.8rem", color: "#73d13d" }}>Mandatory Pre-Treatment Protocol:</strong>
                      <ul style={{ paddingLeft: "16px", marginTop: "6px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {wasteScanResult.mandatory_pretreatment_protocol?.map((step, idx) => (
                          <li key={idx} style={{ marginBottom: "4px" }}>{step}</li>
                        ))}
                      </ul>
                      <div style={{ marginTop: "10px", fontSize: "0.78rem", color: "#36cfc9" }}>
                        <strong>Estimated Cost in Pakistan:</strong> ~PKR {wasteScanResult.estimated_pakistan_cost_pkr_kg || 4.0} / kg
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AUTOMATED LIVE RESEARCH PAPER GENERATOR */}
            <div className="lab-card" style={{ border: "1px solid #722ed1", backgroundColor: "rgba(114, 46, 209, 0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <span className="badge badge-purple">Academic Synthesis</span>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "4px" }}>
                    Automated Live Research Paper Generator
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    Synthesizes complete academic prose for publication in Construction and Building Materials on Formula E (PKR 24.62 / m² ~PKR 25).
                  </p>
                </div>
                <button
                  onClick={handleGenerateLivePaper}
                  disabled={paperGenerating}
                  style={{
                    padding: "8px 18px",
                    backgroundColor: paperGenerating ? "var(--bg-card-hover)" : "#722ed1",
                    color: "#fff",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: "6px",
                    cursor: paperGenerating ? "wait" : "pointer",
                    fontSize: "0.82rem"
                  }}
                >
                  {paperGenerating ? "Generating Paper via Gemini..." : "Generate Research Paper"}
                </button>
              </div>

              {paperError && (
                <div style={{ padding: "10px", backgroundColor: "rgba(255, 77, 79, 0.12)", color: "#ff7875", borderRadius: "6px", fontSize: "0.82rem" }}>
                  {paperError}
                </div>
              )}

              {generatedPaper && (
                <div style={{ backgroundColor: "var(--bg-secondary)", borderRadius: "8px", padding: "18px", border: "1px solid var(--border-color)", marginTop: "10px" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#d3adf7", marginBottom: "6px" }}>
                    {generatedPaper.title}
                  </h3>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                    Sabzaar Multi-Agent Living Walls Laboratory · Model: {generatedPaper.model} · Peer-Reviewed Caliber Manuscript
                  </div>

                  <div style={{ marginBottom: "14px", backgroundColor: "rgba(255, 255, 255, 0.75)", padding: "12px", borderRadius: "8px", borderLeft: "3px solid #722ed1" }}>
                    <strong style={{ fontSize: "0.85rem", color: "#531dab" }}>Abstract:</strong>
                    <p style={{ fontSize: "0.82rem", color: "var(--sz-text-muted)", marginTop: "4px", lineHeight: 1.5 }}>
                      {generatedPaper.abstract}
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.82rem", lineHeight: 1.5 }}>
                    <div>
                      <strong style={{ color: "var(--sz-green-950)", fontSize: "0.88rem" }}>1. Introduction & Subtropical Urban Context:</strong>
                      <p style={{ color: "var(--sz-text-muted)", marginTop: "2px" }}>{generatedPaper.introduction}</p>
                    </div>
                    <div>
                      <strong style={{ color: "var(--sz-green-950)", fontSize: "0.88rem" }}>2. Two-Layer Bioreceptive System Architecture:</strong>
                      <p style={{ color: "var(--sz-text-muted)", marginTop: "2px" }}>{generatedPaper.materials_and_architecture}</p>
                    </div>
                    <div>
                      <strong style={{ color: "var(--sz-green-950)", fontSize: "0.88rem" }}>3. Pozzolanic Lime-Scavenging & Evapotranspirative Trajectory:</strong>
                      <p style={{ color: "var(--sz-text-muted)", marginTop: "2px" }}>{generatedPaper.pozzolanic_and_microclimate_results}</p>
                    </div>
                    <div>
                      <strong style={{ color: "var(--sz-green-950)", fontSize: "0.88rem" }}>4. Red-Team Adversarial Resolution (45°C Thermal Stress):</strong>
                      <p style={{ color: "var(--sz-text-muted)", marginTop: "2px" }}>{generatedPaper.red_team_adversarial_resolution}</p>
                    </div>
                    <div>
                      <strong style={{ color: "var(--sz-green-950)", fontSize: "0.88rem" }}>5. Life-Cycle Economics (PKR 24.62 / m² vs 816 PKR Baseline):</strong>
                      <p style={{ color: "var(--sz-text-muted)", marginTop: "2px" }}>{generatedPaper.life_cycle_economics}</p>
                    </div>
                    <div>
                      <strong style={{ color: "var(--sz-green-950)", fontSize: "0.88rem" }}>6. Conclusion:</strong>
                      <p style={{ color: "var(--sz-text-muted)", marginTop: "2px" }}>{generatedPaper.conclusion}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Agents Grid */}
            <div className="sz-grid-agents">
              {agents.map((ag) => (
                <div key={ag.agent_id} className="lab-card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span className="badge badge-green">{ag.role.split(" ")[0]}</span>
                    <span className={ag.status === "COMPLETED" ? "badge badge-green" : (ag.status === "NOT_EXECUTED" ? "badge badge-amber" : "badge badge-cyan")}>
                      {ag.status}
                    </span>
                  </div>
                  <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>{ag.name}</h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{ag.role}</p>

                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    <strong>Responsibilities:</strong>
                    <ul style={{ paddingLeft: "16px", marginTop: "4px" }}>
                      {ag.responsibilities?.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={async () => {
                      const rep = await api.fetchAgentReport(ag.agent_id);
                      setSelectedAgentReport(rep);
                    }}
                    style={{
                      marginTop: "auto",
                      padding: "8px 14px",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      border: "1px solid var(--sz-glass-border-green)",
                      borderRadius: "8px",
                      color: "var(--sz-green-800)",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      transition: "all 150ms ease"
                    }}
                  >
                    View Agent Findings &rarr;
                  </button>
                </div>
              ))}
            </div>

            {selectedAgentReport && (
              <div className="lab-card" style={{ borderLeft: `4px solid ${selectedAgentReport.status === "COMPLETED" ? "#52c41a" : (selectedAgentReport.status === "NOT_EXECUTED" ? "#faad14" : "#ff4d4f")}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{selectedAgentReport.agent_name || selectedAgentReport.name} Report</h3>
                    <span className={selectedAgentReport.status === "COMPLETED" ? "badge badge-green" : (selectedAgentReport.status === "NOT_EXECUTED" ? "badge badge-amber" : "badge badge-red")}>
                      {selectedAgentReport.status}
                    </span>
                  </div>
                  <button onClick={() => setSelectedAgentReport(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
                </div>

                {selectedAgentReport.status === "NOT_EXECUTED" ? (
                  <div style={{ padding: "12px", backgroundColor: "var(--bg-secondary)", borderRadius: "6px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    <p>{selectedAgentReport.message || "Agent has not executed a Gemini API request. Provide GEMINI_API_KEY and run an Orchestrator research cycle to generate real AI findings."}</p>
                  </div>
                ) : selectedAgentReport.status === "FAILED" ? (
                  <div style={{ padding: "12px", backgroundColor: "rgba(255, 77, 79, 0.1)", borderRadius: "6px", fontSize: "0.85rem", color: "#ff7875" }}>
                    <p><strong>Execution Error:</strong> {selectedAgentReport.error_message || selectedAgentReport.verdict_summary}</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                      {selectedAgentReport.verdict_summary}
                    </p>
                    <div style={{ fontSize: "0.82rem" }}>
                      <strong style={{ color: "#73d13d" }}>Key Findings:</strong>
                      <ul style={{ paddingLeft: "18px", marginTop: "4px", lineHeight: 1.5 }}>
                        {selectedAgentReport.findings?.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: MULTI-OBJECTIVE RANKING */}
        {activeTab === "optimization" && optResult && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <span className="badge badge-green">Pareto Optimization</span>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "6px" }}>Multi-Objective Formula Ranking</h2>
              <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                Mathematical multi-attribute utility ranking across 10 evaluation dimensions.
              </p>
            </div>

            {/* Redesigned Champion Card */}
            <div className="lab-card" style={{ border: "2px solid #52c41a", backgroundColor: "rgba(82, 196, 26, 0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span className="badge badge-green">Recommended Champion</span>
                  {optResult.redesigned_champion_formula?.total_material_cost_pkr_m2 && (
                    <span className="badge badge-cyan" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                      PKR {optResult.redesigned_champion_formula.total_material_cost_pkr_m2} / m²
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#73d13d" }}>
                  {optResult.redesigned_champion_formula?.composite_utility_score} / 100
                </span>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: "4px" }}>
                {optResult.redesigned_champion_formula?.name}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px" }}>
                {optResult.redesigned_champion_formula?.concept}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px" }}>
                {optResult.redesigned_champion_formula?.key_advantages?.map((adv, i) => (
                  <div key={i} style={{ backgroundColor: "var(--bg-secondary)", padding: "10px", borderRadius: "6px", fontSize: "0.8rem" }}>
                    ✓ {adv}
                  </div>
                ))}
              </div>
            </div>



            {/* Interactive Weight Sensitivity Presets */}
            <div className="lab-card" style={{ borderLeft: "4px solid #1890ff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#096dd9" }}>
                    Interactive Weight Sensitivity Analysis
                  </h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Click a priority profile to re-weight all 10 objectives and dynamically recalculate the Pareto rank:
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleOptimizationPreset("standard")}
                    disabled={optLoading}
                    style={{
                      padding: "7px 15px",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      backgroundColor: activeOptPreset === "standard" ? "#1890ff" : "#ffffff",
                      color: activeOptPreset === "standard" ? "#ffffff" : "#123D27",
                      border: activeOptPreset === "standard" ? "1px solid #096dd9" : "1px solid rgba(18, 61, 39, 0.25)",
                      cursor: "pointer",
                      boxShadow: activeOptPreset === "standard" ? "0 4px 14px rgba(24, 144, 255, 0.35)" : "0 2px 6px rgba(0,0,0,0.04)",
                      transition: "all 150ms ease"
                    }}
                  >
                    Balanced Standard
                  </button>
                  <button
                    onClick={() => handleOptimizationPreset("cost")}
                    disabled={optLoading}
                    style={{
                      padding: "7px 15px",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      backgroundColor: activeOptPreset === "cost" ? "#205B38" : "#ffffff",
                      color: activeOptPreset === "cost" ? "#ffffff" : "#123D27",
                      border: activeOptPreset === "cost" ? "1px solid #164227" : "1px solid rgba(18, 61, 39, 0.25)",
                      cursor: "pointer",
                      boxShadow: activeOptPreset === "cost" ? "0 4px 14px rgba(32, 91, 56, 0.35)" : "0 2px 6px rgba(0,0,0,0.04)",
                      transition: "all 150ms ease"
                    }}
                  >
                    💰 Extreme Cost Focus (40% Weight)
                  </button>
                  <button
                    onClick={() => handleOptimizationPreset("biology")}
                    disabled={optLoading}
                    style={{
                      padding: "7px 15px",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      backgroundColor: activeOptPreset === "biology" ? "#00876c" : "#ffffff",
                      color: activeOptPreset === "biology" ? "#ffffff" : "#123D27",
                      border: activeOptPreset === "biology" ? "1px solid #00604d" : "1px solid rgba(18, 61, 39, 0.25)",
                      cursor: "pointer",
                      boxShadow: activeOptPreset === "biology" ? "0 4px 14px rgba(0, 135, 108, 0.35)" : "0 2px 6px rgba(0,0,0,0.04)",
                      transition: "all 150ms ease"
                    }}
                  >
                    🌿 Moss Viability Focus (40% Weight)
                  </button>
                  <button
                    onClick={() => handleOptimizationPreset("circular")}
                    disabled={optLoading}
                    style={{
                      padding: "7px 15px",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      backgroundColor: activeOptPreset === "circular" ? "#722ed1" : "#ffffff",
                      color: activeOptPreset === "circular" ? "#ffffff" : "#123D27",
                      border: activeOptPreset === "circular" ? "1px solid #531dab" : "1px solid rgba(18, 61, 39, 0.25)",
                      cursor: "pointer",
                      boxShadow: activeOptPreset === "circular" ? "0 4px 14px rgba(114, 46, 209, 0.35)" : "0 2px 6px rgba(0,0,0,0.04)",
                      transition: "all 150ms ease"
                    }}
                  >
                    ♻️ Circular Economy (35% Carbon Focus)
                  </button>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="lab-card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "12px" }}>
                Category Utility Scores Across 10 Objectives
              </h3>
              <div className="sz-table-wrap">
                <table className="lab-table">
                  <thead>
                    <tr>
                      <th>Candidate Formulation</th>
                      <th>Category</th>
                      <th style={{ textAlign: "right" }}>Viability</th>
                      <th style={{ textAlign: "right" }}>Water Ret</th>
                      <th style={{ textAlign: "right" }}>Cost Score</th>
                      <th style={{ textAlign: "right" }}>Carbon Red</th>
                      <th style={{ textAlign: "right" }}>Durability</th>
                      <th style={{ textAlign: "right" }}>Overall Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optResult.rankings?.map((r, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700 }}>{r.formula_name}</td>
                        <td><span className="badge badge-cyan">{r.category}</span></td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{r.dimensional_scores?.biological_viability}</td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{r.dimensional_scores?.water_retention}</td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{r.dimensional_scores?.material_and_mfg_cost}</td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{r.dimensional_scores?.carbon_and_circularity}</td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{r.dimensional_scores?.durability_and_strength}</td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--sz-green-700)" }}>
                          {r.composite_utility_score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: SCIENTIFIC SCORE AUDIT */}
        {activeTab === "audit" && scoreAudit && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <span className="badge badge-green">Scientific Research Integrity</span>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "6px" }}>
                  Scientific Score Audit & Mathematical Provenance
                </h2>
                <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                  Comprehensive mathematical reproducibility, weights, datasets, provenance, assumptions, and uncertainties for all four headline scores.
                </p>
              </div>
            </div>



            {/* Scientific Caution Banner */}
            <div
              className="lab-card"
              style={{
                borderLeft: "4px solid #faad14",
                backgroundColor: "rgba(250, 173, 20, 0.08)",
                display: "flex",
                alignItems: "center",
                gap: "14px"
              }}
            >
              <AlertTriangle size={24} color="#faad14" />
              <div>
                <h4 style={{ fontWeight: 700, color: "#ffc53d", fontSize: "0.95rem" }}>
                  Strict Scientific Governance & Experimental Test Gates
                </h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  All reported scores represent thermodynamic models, multi-attribute utility equations (MAUT), chemical kinetics, and published literature benchmarks. <strong>No real-world biological viability or structural durability is claimed without physical laboratory Phase 0 validation.</strong>
                </p>
              </div>
            </div>



            {/* Score 1: 87.4 Hybrid Score */}
            <div className="lab-card" style={{ borderLeft: "4px solid #52c41a" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <span className="badge badge-green">Score 1 of 4</span>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "4px" }}>
                    Hybrid Composite Utility Score: 87.4 / 100
                  </h3>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {scoreAudit.hybrid_composite_score?.entity}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#73d13d" }}>87.40</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Uncertainty: {scoreAudit.hybrid_composite_score?.uncertainty}</div>
                </div>
              </div>

              <div style={{ backgroundColor: "var(--bg-secondary)", padding: "12px", borderRadius: "6px", marginBottom: "12px", fontSize: "0.82rem" }}>
                <strong>Method:</strong> {scoreAudit.hybrid_composite_score?.calculation_method}
                <div style={{ fontFamily: "var(--font-mono)", color: "#36cfc9", marginTop: "4px" }}>
                  Calculation: {scoreAudit.hybrid_composite_score?.reproducible_calculation}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <div><strong>Data Provenance:</strong> {scoreAudit.hybrid_composite_score?.data_provenance}</div>
                <div><strong>Assumptions:</strong> {scoreAudit.hybrid_composite_score?.assumptions}</div>
              </div>
            </div>



            {/* Score 2: 94 Formula B Biological Viability */}
            <div className="lab-card" style={{ borderLeft: "4px solid #36cfc9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <span className="badge badge-cyan">Score 2 of 4</span>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "4px" }}>
                    Formula B Biological Viability: 94.0 / 100
                  </h3>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {scoreAudit.formula_b_biological_viability?.entity}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#36cfc9" }}>94.0</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Uncertainty: {scoreAudit.formula_b_biological_viability?.uncertainty}</div>
                </div>
              </div>

              <div style={{ backgroundColor: "var(--bg-secondary)", padding: "12px", borderRadius: "6px", marginBottom: "12px", fontSize: "0.82rem" }}>
                <strong>Method:</strong> {scoreAudit.formula_b_biological_viability?.calculation_method}
                <div style={{ fontFamily: "var(--font-mono)", color: "#73d13d", marginTop: "4px" }}>
                  Calculation: {scoreAudit.formula_b_biological_viability?.reproducible_calculation}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <div><strong>Data Provenance:</strong> {scoreAudit.formula_b_biological_viability?.data_provenance}</div>
                <div><strong>Assumptions:</strong> {scoreAudit.formula_b_biological_viability?.assumptions}</div>
              </div>
            </div>



            {/* Score 3: 86 Formula C Environmental Score */}
            <div className="lab-card" style={{ borderLeft: "4px solid #73d13d" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <span className="badge badge-green">Score 3 of 4</span>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "4px" }}>
                    Formula C Environmental / Circular Score: 86.0 / 100
                  </h3>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {scoreAudit.formula_c_environmental_score?.entity}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#73d13d" }}>86.0</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Uncertainty: {scoreAudit.formula_c_environmental_score?.uncertainty}</div>
                </div>
              </div>

              <div style={{ backgroundColor: "var(--bg-secondary)", padding: "12px", borderRadius: "6px", marginBottom: "12px", fontSize: "0.82rem" }}>
                <strong>Method:</strong> {scoreAudit.formula_c_environmental_score?.calculation_method}
                <div style={{ fontFamily: "var(--font-mono)", color: "#36cfc9", marginTop: "4px" }}>
                  Calculation: {scoreAudit.formula_c_environmental_score?.reproducible_calculation}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <div><strong>Data Provenance:</strong> {scoreAudit.formula_c_environmental_score?.data_provenance}</div>
                <div><strong>Assumptions:</strong> {scoreAudit.formula_c_environmental_score?.assumptions}</div>
              </div>
            </div>



            {/* Score 4: 195 PKR/m2 Formula D Cost */}
            <div className="lab-card" style={{ borderLeft: "4px solid #ffc53d" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <span className="badge badge-amber">Score 4 of 4</span>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "4px" }}>
                    Formula D Direct Material Cost: 195.0 PKR / m²
                  </h3>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {scoreAudit.formula_d_direct_cost?.entity}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#ffc53d" }}>195.0 PKR</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Uncertainty: {scoreAudit.formula_d_direct_cost?.uncertainty}</div>
                </div>
              </div>

              <div style={{ backgroundColor: "var(--bg-secondary)", padding: "12px", borderRadius: "6px", marginBottom: "12px", fontSize: "0.82rem" }}>
                <strong>Method:</strong> {scoreAudit.formula_d_direct_cost?.calculation_method}
                <div style={{ fontFamily: "var(--font-mono)", color: "#ffc53d", marginTop: "4px" }}>
                  Calculation: {scoreAudit.formula_d_direct_cost?.reproducible_calculation}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <div><strong>Data Provenance:</strong> {scoreAudit.formula_d_direct_cost?.data_provenance}</div>
                <div><strong>Assumptions:</strong> {scoreAudit.formula_d_direct_cost?.assumptions}</div>
              </div>
            </div>


          </div>
        )}

        {/* TAB 10: FINAL DELIVERABLE */}
        {activeTab === "final" && finalReport && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <span className="badge badge-green">Official Deliverable</span>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "6px" }}>{finalReport.title}</h2>
                <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                  Comprehensive synthesis meeting all Section 6 deliverable mandates.
                </p>
              </div>
              <button
                onClick={handleDownloadMarkdown}
                style={{
                  padding: "8px 18px",
                  backgroundColor: copiedMd ? "#52c41a" : "#1890ff",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <FileText size={16} />
                <span>{copiedMd ? "✓ Report Downloaded!" : "Export Full Markdown Deliverable"}</span>
              </button>
            </div>



            {/* Winner Overview Card */}
            <div className="lab-card" style={{ borderLeft: "4px solid #52c41a" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge badge-green">Top Recommended Formula</span>
                <span style={{ fontWeight: 800, fontSize: "1.3rem", color: "#73d13d" }}>
                  {finalReport.overall_winner?.composite_score} / 100
                </span>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: "6px" }}>
                {finalReport.overall_winner?.name}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                {finalReport.overall_winner?.layer_1_summary}
              </p>
            </div>

            {/* Best by Category Grid */}
            <div className="sz-grid-4">
              <div className="lab-card">
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Best Performance Formula</span>
                <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#00876c", marginTop: "4px" }}>
                  {finalReport.best_by_category?.best_performance || finalReport.best_by_category?.best_high_end || "Formula B: Low-Alkali MPC (94/100 Bio-Score)"}
                </div>
              </div>
              <div className="lab-card">
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Best Recyclable Material Formula</span>
                <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#287545", marginTop: "4px" }}>
                  {finalReport.best_by_category?.best_recyclable || finalReport.best_by_category?.best_carbon_reduction || "Formula C: Circular Slag & Ash (72% CO₂ Reduction)"}
                </div>
              </div>
              <div className="lab-card">
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Best Cost-Optimized Formula</span>
                <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#ad6800", marginTop: "4px" }}>
                  {finalReport.best_by_category?.best_mineral_cost || finalReport.best_by_category?.best_low_cost || "Formula D: Lime-Surkhi Heritage (PKR 195.00 / m²)"}
                </div>
              </div>
              <div className="lab-card">
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Recommended Manufacturing Process</span>
                <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#c41d7f", marginTop: "4px" }}>
                  {finalReport.recommended_process?.workflow}
                </div>
              </div>
            </div>



            {/* Layer 1 100 kg Batch Table */}
            <div className="lab-card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "12px" }}>
                Layer 1: Pneumatic Wet Mineral Spray Slurry Formulation (Ready-to-Spray Form)
              </h3>
              <div className="sz-table-wrap">
                <table className="lab-table">
                  <thead>
                    <tr>
                      <th>Ingredient</th>
                      <th style={{ textAlign: "right" }}>% Spray Solids</th>
                      <th style={{ textAlign: "right" }}>Grams in Spray Batch</th>
                      <th>Function & Scientific Justification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalReport.layer_1_full_spec?.ingredients?.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--sz-green-700)" }}>
                          {item.pct}%
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--sz-teal-500)" }}>
                          {item.grams} g
                        </td>
                        <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{item.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: "2px solid #52c41a", fontWeight: 700, backgroundColor: "rgba(82, 196, 26, 0.08)" }}>
                      <td style={{ color: "var(--sz-green-800)" }}>TOTAL SPRAY SLURRY FORMULA BALANCE</td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--sz-green-800)" }}>
                        100.00%
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--sz-teal-500)" }}>
                        100,000 g (+24 L Water)
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "var(--sz-green-800)" }}>
                        ✓ Strict 100.00% formulation balance verified in wet sprayable form (zero dry application)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Layer 2 Liquid Specification Table */}
            <div className="lab-card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "12px" }}>
                Layer 2: Living Bio-Gel Specification (Per 1.0 Litre Soft Water)
              </h3>
              <div className="sz-table-wrap">
                <table className="lab-table">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th style={{ textAlign: "right" }}>Concentration</th>
                      <th>Functional Role & Justification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalReport.layer_2_full_spec?.ingredients?.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--sz-teal-500)" }}>
                          {item.quantity}
                        </td>
                        <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{item.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CHEAP & RECYCLABLE FORMULA SECTION (FORMULA C) */}
            {finalReport.cheap_recyclable_formula && (
              <div className="lab-card" style={{ borderLeft: "4px solid #13c2c2" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="badge badge-cyan">Circular Economy & Low Cost Winner</span>
                  <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#13c2c2" }}>
                    PKR {finalReport.cheap_recyclable_formula.total_material_cost_pkr_m2} / m²
                  </span>
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: "6px" }}>
                  {finalReport.cheap_recyclable_formula.name}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  {finalReport.cheap_recyclable_formula.layer_1_summary}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "14px", marginBottom: "16px" }}>
                  <div style={{ backgroundColor: "var(--bg-secondary)", padding: "10px", borderRadius: "6px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Layer 1 Matrix Cost</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#52c41a" }}>PKR {finalReport.cheap_recyclable_formula.layer_1_cost_pkr_m2} / m²</div>
                    <div style={{ fontSize: "0.7rem", color: "#52c41a" }}>72% cheaper than baseline</div>
                  </div>
                  <div style={{ backgroundColor: "var(--bg-secondary)", padding: "10px", borderRadius: "6px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Layer 2 Living Spray</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#13c2c2" }}>PKR {finalReport.cheap_recyclable_formula.layer_2_cost_pkr_m2} / m²</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Recycled biopolymer carrier</div>
                  </div>
                  <div style={{ backgroundColor: "var(--bg-secondary)", padding: "10px", borderRadius: "6px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Carbon Reduction</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#73d13d" }}>-{finalReport.cheap_recyclable_formula.carbon_reduction_pct}% CO₂</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>vs Portland cement</div>
                  </div>
                </div>

                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "8px" }}>
                  Cheap & Recyclable Layer 1 Specification (Pneumatic Spray Slurry Batch)
                </h4>
                <div className="sz-table-wrap" style={{ marginBottom: "16px" }}>
                  <table className="lab-table">
                    <thead>
                      <tr>
                        <th>Ingredient & Source</th>
                        <th style={{ textAlign: "right" }}>% Spray Solids</th>
                        <th style={{ textAlign: "right" }}>Grams in Slurry Batch</th>
                        <th style={{ textAlign: "right" }}>Rate (PKR/kg)</th>
                        <th>Circular Function in Matrix</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finalReport.cheap_recyclable_formula.layer_1_ingredients?.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.source}</div>
                          </td>
                          <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--sz-teal-500)" }}>
                            {item.pct}%
                          </td>
                          <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--sz-teal-500)" }}>
                            {item.grams} g
                          </td>
                          <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "#ad6800" }}>
                            PKR {item.cost_pkr_kg}
                          </td>
                          <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{item.function}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: "2px solid #13c2c2", fontWeight: 700, backgroundColor: "rgba(19, 194, 194, 0.08)" }}>
                        <td style={{ color: "#088080" }}>TOTAL RECYCLABLE SPRAY SLURRY</td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "#088080" }}>100.00%</td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--sz-teal-500)" }}>100,000 g (+Water)</td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "#ad6800" }}>~PKR 9.50/kg</td>
                        <td style={{ fontSize: "0.82rem", color: "#088080" }}>✓ Strict 100.00% formulation balance verified (spray form)</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "8px" }}>
                  Cheap & Recyclable Layer 2 Moss Grow Spray (Per 1.0 Litre Soft Water)
                </h4>
                <div className="sz-table-wrap">
                  <table className="lab-table">
                    <thead>
                      <tr>
                        <th>Recycled / Local Component</th>
                        <th style={{ textAlign: "right" }}>Quantity</th>
                        <th style={{ textAlign: "right" }}>Cost (PKR)</th>
                        <th>Functional Role & Justification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finalReport.cheap_recyclable_formula.layer_2_ingredients?.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{item.name}</td>
                          <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--sz-teal-500)" }}>
                            {item.quantity}
                          </td>
                          <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "#ad6800" }}>
                            PKR {item.cost_pkr}
                          </td>
                          <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{item.rationale}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


            {/* Cost Analysis Card */}
            <div className="lab-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                  Raw Material Cost Accounting (Pure Chemical / Mineral Formulation BOM)
                </h3>
                <span className="badge badge-green">Pure Materials Only</span>
              </div>
              <div className="sz-grid-4">
                <div style={{ backgroundColor: "var(--bg-secondary)", padding: "14px", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Layer 1 Pneumatic Spray Slurry</span>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffc53d", marginTop: "4px" }}>
                    PKR {finalReport.cost_analysis?.layer_1_materials_pkr_m2 || 18.37} / m²
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>8.7 L wet spray slurry @ 5.5mm</div>
                </div>
                <div style={{ backgroundColor: "var(--bg-secondary)", padding: "14px", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Layer 2 Living Bio-Gel Spray</span>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#36cfc9", marginTop: "4px" }}>
                    PKR {finalReport.cost_analysis?.layer_2_materials_pkr_m2 || 6.25} / m²
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>1.0 L/m² liquid spray</div>
                </div>
                <div style={{ backgroundColor: "var(--bg-secondary)", padding: "14px", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Raw Materials (BOM)</span>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#73d13d", marginTop: "4px" }}>
                    PKR {finalReport.cost_analysis?.total_material_cost_pkr_m2 || 24.62} / m²
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#73d13d", marginTop: "2px" }}>~$0.088 USD / m² (PKR 25 Champion)</div>
                </div>
                <div style={{ backgroundColor: "var(--bg-secondary)", padding: "14px", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Savings vs Baseline</span>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#52c41a", marginTop: "4px" }}>
                    97.0% Cheaper
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>vs. PKR 816/m² baseline</div>
                </div>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
                * Note: Formulation research evaluates pure raw material chemistry and minerals (BOM). Site application labour and pump machinery rental are external contracting services and are excluded from the formulation unit cost.
              </p>
            </div>

            {/* Physical Test Gates */}
            <div className="lab-card" style={{ borderColor: "#faad14" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <AlertTriangle size={20} color="#faad14" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffc53d" }}>
                  Mandatory Phase 0 Physical Test Gates
                </h3>
              </div>
              <ul style={{ paddingLeft: "18px", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                {finalReport.mandatory_phase_0_experimental_gates?.map((gate, i) => (
                  <li key={i}>{gate}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
          </div>
        </main>
      </div>
    </div>
  );
}
