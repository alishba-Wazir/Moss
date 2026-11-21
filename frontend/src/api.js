/**
 * API client for Sabzaar Living Walls Research Laboratory
 */

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://127.0.0.1:8000/api"
      : "/api");

export async function fetchOverview() {
  const res = await fetch(`${API_BASE}/overview`);
  return res.json();
}

export async function fetchMasterPrompt() {
  const res = await fetch(`${API_BASE}/master-prompt`);
  return res.json();
}

export async function fetchFormulas() {
  const res = await fetch(`${API_BASE}/formulas`);
  return res.json();
}

export async function fetchFormulaDetail(id) {
  const res = await fetch(`${API_BASE}/formulas/${id}`);
  return res.json();
}

export async function validateMassBalance(layer1, layer2) {
  const res = await fetch(`${API_BASE}/formulas/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ layer_1_ingredients: layer1, layer_2_ingredients: layer2 })
  });
  return res.json();
}

export async function saveFormulaVersion(id, updatedData, notes) {
  const res = await fetch(`${API_BASE}/formulas/${id}/save-version`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updated_data: updatedData, notes })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to save version");
  }
  return res.json();
}

export async function fetchFormulaHistory(id) {
  const res = await fetch(`${API_BASE}/formulas/${id}/history`);
  return res.json();
}

export async function calculateJobSize(id, areaM2, thicknessMm, wastePct) {
  const res = await fetch(`${API_BASE}/formulas/${id}/job-quantities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ area_m2: areaM2, thickness_mm: thicknessMm, waste_pct: wastePct })
  });
  return res.json();
}

export async function fetchScenarios() {
  const res = await fetch(`${API_BASE}/scenarios`);
  return res.json();
}

export async function runSimulation(payload) {
  const res = await fetch(`${API_BASE}/simulations/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchProcessStages() {
  const res = await fetch(`${API_BASE}/processes/stages`);
  return res.json();
}

export async function fetchProcessWorkflows() {
  const res = await fetch(`${API_BASE}/processes/workflows`);
  return res.json();
}

export async function compareProcesses(formulaCategory = "FORMULA_A") {
  const res = await fetch(`${API_BASE}/processes/compare?formula_category=${formulaCategory}`);
  return res.json();
}

export async function fetchAgents() {
  const res = await fetch(`${API_BASE}/agents`);
  return res.json();
}

export async function fetchAgentReport(agentId) {
  const res = await fetch(`${API_BASE}/agents/${agentId}/report`);
  return res.json();
}

export async function runAgentsCycle(formulaCategory = "FORMULA_A", apiKey = "") {
  const res = await fetch(`${API_BASE}/agents/run-cycle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formula_category: formulaCategory, api_key: apiKey })
  });
  return res.json();
}

export async function fetchOptimizationWeights() {
  const res = await fetch(`${API_BASE}/optimization/weights`);
  return res.json();
}

export async function runOptimization(weights = null) {
  const res = await fetch(`${API_BASE}/optimization/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weights })
  });
  return res.json();
}

export async function fetchFinalDeliverable() {
  const res = await fetch(`${API_BASE}/reports/final-deliverable`);
  return res.json();
}

export async function fetchFinalDeliverableMarkdown() {
  const res = await fetch(`${API_BASE}/reports/final-deliverable/markdown`);
  return res.json();
}

export async function fetchWeatherLocations() {
  const res = await fetch(`${API_BASE}/weather/locations`);
  return res.json();
}

export async function fetchCurrentWeather(locationId = "islamabad_default") {
  const res = await fetch(`${API_BASE}/weather/current?location_id=${encodeURIComponent(locationId)}`);
  return res.json();
}

export async function fetchGeminiStatus() {
  const res = await fetch(`${API_BASE}/gemini/status`);
  return res.json();
}

export async function configureGeminiApiKey(apiKey, model = "gemini-4-argon") {
  const res = await fetch(`${API_BASE}/gemini/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, model })
  });
  return res.json();
}

export async function fetchScoreAudit() {
  const res = await fetch(`${API_BASE}/optimization/score-audit`);
  return res.json();
}

export async function fetchLatestAgentCycle() {
  const res = await fetch(`${API_BASE}/agents/latest-cycle`);
  return res.json();
}

export async function scanWasteMaterial(materialName, originContext = "Pakistan industrial or agricultural byproduct") {
  const res = await fetch(`${API_BASE}/agents/scan-waste-material`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ material_name: materialName, origin_context: originContext })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to scan waste material");
  }
  return res.json();
}

export async function generateLivePaper(formulaCategory = "FORMULA_E") {
  const res = await fetch(`${API_BASE}/reports/generate-live-paper`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formula_category: formulaCategory })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to generate research paper");
  }
  return res.json();
}

export async function fetchDualSprayBaseline() {
  const res = await fetch(`${API_BASE}/dual-spray/baseline`);
  return res.json();
}

export async function fetchDualSprayAudit(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/dual-spray/mass-volume-audit${query ? `?${query}` : ''}`);
  return res.json();
}

export async function runDualSpraySimulation(params = {}) {
  const res = await fetch(`${API_BASE}/dual-spray/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });
  return res.json();
}

export async function fetchDualSprayExperiments() {
  const res = await fetch(`${API_BASE}/dual-spray/experiments`);
  return res.json();
}

export async function fetchDualSprayDashboard() {
  const res = await fetch(`${API_BASE}/dual-spray/comparison-dashboard`);
  return res.json();
}
