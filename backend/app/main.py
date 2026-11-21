"""
FastAPI Application Entry Point for Sabzaar Moss Wall Research Laboratory
Provides full REST API for multi-agent coordination, formulas, simulations, processes, and optimization.
"""

import uuid
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .config import settings
from .db.database import (
    init_db,
    get_all_formulas,
    get_formula_by_id,
    save_formula_version,
    get_formula_history,
    save_simulation_run,
    get_simulations_history,
    get_simulation_detail
)
from .formulas.discovery import ALL_FORMULA_CATEGORIES
from .formulas.validator import validate_layer_1, validate_layer_2, calculate_layer_1_job_quantities
from .simulation.engine import simulate_formula_performance
from .simulation.scenarios import AVAILABLE_SCENARIOS
from .simulation.weather import LOCATIONS_REGISTRY, get_current_weather_for_location
from .processes.stages import PROCESS_STAGES_METADATA, ALTERNATIVE_WORKFLOWS
from .processes.comparison import evaluate_process_workflow, compare_all_workflows
from .agents.orchestrator import master_orchestrator, MASTER_RESEARCH_PROMPT_TEXT
from .agents.specialists import ALL_SPECIALIST_AGENTS
from .optimization.pareto import (
    run_multi_objective_comparison,
    OPTIMIZATION_CRITERIA_WEIGHTS,
    get_scientific_score_audit
)
from .reports.generator import generate_final_recommended_report, get_markdown_final_deliverable

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Multi-Agent Living Wall Research & Formulation Laboratory",
    version="2.0.0"
)

# Enable CORS for local Vite / frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database schema immediately
init_db()

@app.on_event("startup")
def on_startup():
    init_db()
    master_orchestrator.load_latest_cycle()

# ==================== HEALTH & OVERVIEW ====================

@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "system": settings.PROJECT_NAME,
        "database": "CONNECTED",
        "gemini_api_configured": bool(settings.GEMINI_API_KEY)
    }

class GeminiConfigRequest(BaseModel):
    api_key: str
    model: Optional[str] = "gemini-4-argon"

@app.get("/api/gemini/status")
def get_gemini_status():
    key = settings.GEMINI_API_KEY
    is_connected = bool(key and len(key.strip()) > 5)
    key_preview = f"{key[:4]}...{key[-4:]}" if is_connected else None
    return {
        "status": "CONNECTED" if is_connected else "DISCONNECTED",
        "connected": is_connected,
        "model": settings.GEMINI_MODEL,
        "key_preview": key_preview,
        "message": f"Gemini API connected and ready for genuine AI reasoning with model {settings.GEMINI_MODEL}." if is_connected else "Gemini API disconnected. AI agents will report NOT EXECUTED until an API key is provided."
    }

@app.post("/api/gemini/config")
def configure_gemini_api_key(payload: GeminiConfigRequest):
    if not payload.api_key or len(payload.api_key.strip()) < 5:
        raise HTTPException(status_code=400, detail="Invalid API key provided.")
    settings.set_gemini_key(payload.api_key.strip(), model=payload.model)
    return {
        "status": "CONNECTED",
        "connected": True,
        "model": settings.GEMINI_MODEL,
        "message": f"Gemini API key successfully configured for model {settings.GEMINI_MODEL}"
    }

@app.get("/api/overview")
def get_system_overview():
    formulas = get_all_formulas()
    return {
        "master_prompt_active": True,
        "total_formulas": len(formulas),
        "formula_categories": ["FORMULA_A", "FORMULA_B", "FORMULA_C", "FORMULA_D", "FORMULA_E", "FORMULA_F"],
        "total_specialist_agents": len(ALL_SPECIALIST_AGENTS),
        "simulation_scenarios_available": len(AVAILABLE_SCENARIOS),
        "manufacturing_process_stages": len(PROCESS_STAGES_METADATA),
        "baseline_status": "LOCKED_AND_VERIFIED",
        "immutable_baseline_file": "inputs/sabzaar-living-walls-standalone.html"
    }

# ==================== MASTER RESEARCH PROMPT ====================

@app.get("/api/master-prompt")
def get_master_prompt():
    return {
        "master_prompt": master_orchestrator.master_prompt,
        "is_orchestrator_running": master_orchestrator.is_running,
        "categories_coordinated": ["FORMULA_A", "FORMULA_B", "FORMULA_C", "FORMULA_D", "FORMULA_E", "FORMULA_F"]
    }

# ==================== FORMULA MANAGEMENT & EDITOR ====================

@app.get("/api/formulas")
def list_formulas():
    return get_all_formulas()

@app.get("/api/formulas/{formula_id}")
def get_formula(formula_id: str):
    f = get_formula_by_id(formula_id)
    if not f:
        raise HTTPException(status_code=404, detail="Formula not found")
    return f

class MassBalanceValidationRequest(BaseModel):
    layer_1_ingredients: List[Dict[str, Any]]
    layer_2_ingredients: Optional[List[Dict[str, Any]]] = None

@app.post("/api/formulas/validate")
def validate_formula_mass_balance(payload: MassBalanceValidationRequest):
    l1_valid, l1_msg, l1_sum = validate_layer_1(payload.layer_1_ingredients)
    l2_valid, l2_msg = True, "Not provided"
    if payload.layer_2_ingredients:
        l2_valid, l2_msg = validate_layer_2(payload.layer_2_ingredients)
        
    return {
        "layer_1_valid": l1_valid,
        "layer_1_message": l1_msg,
        "layer_1_sum_pct": round(l1_sum, 2),
        "layer_2_valid": l2_valid,
        "layer_2_message": l2_msg
    }

class SaveFormulaVersionRequest(BaseModel):
    updated_data: Dict[str, Any]
    notes: Optional[str] = "Version update via interactive editor"

@app.post("/api/formulas/{formula_id}/save-version")
def save_version(formula_id: str, payload: SaveFormulaVersionRequest):
    formula = get_formula_by_id(formula_id)
    if not formula:
        raise HTTPException(status_code=404, detail="Formula not found")
    if formula.get("is_baseline_locked"):
        raise HTTPException(status_code=400, detail="Cannot edit immutable baseline Formula A! Please clone it into a custom formula to make edits.")
        
    try:
        # Validate mass balance before saving!
        l1 = payload.updated_data.get("layer_1", {}).get("ingredients", [])
        l1_valid, l1_msg, _ = validate_layer_1(l1)
        if not l1_valid:
            raise HTTPException(status_code=400, detail=f"Cannot save: {l1_msg}")
            
        res = save_formula_version(formula_id, payload.updated_data, payload.notes)
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/formulas/{formula_id}/history")
def get_history(formula_id: str):
    return get_formula_history(formula_id)

@app.get("/api/formulas/{formula_id}/diff-baseline")
def diff_against_baseline(formula_id: str):
    f = get_formula_by_id(formula_id)
    if not f:
        raise HTTPException(status_code=404, detail="Formula not found")
    baseline = get_formula_by_id("formula_a")
    return {
        "target_formula": f["code"],
        "baseline_formula": "FORMULA_A",
        "target_layer_1": f["data"]["layer_1"]["ingredients"],
        "baseline_layer_1": baseline["data"]["layer_1"]["ingredients"],
        "target_layer_2": f["data"]["layer_2"]["ingredients"],
        "baseline_layer_2": baseline["data"]["layer_2"]["ingredients"]
    }

class JobSizeRequest(BaseModel):
    area_m2: float = 100.0
    thickness_mm: float = 8.0
    waste_pct: float = 15.0

@app.post("/api/formulas/{formula_id}/job-quantities")
def calculate_job(formula_id: str, payload: JobSizeRequest):
    f = get_formula_by_id(formula_id)
    if not f:
        raise HTTPException(status_code=404, detail="Formula not found")
    l1 = f["data"]["layer_1"]["ingredients"]
    return calculate_layer_1_job_quantities(
        ingredients=l1,
        wall_area_m2=payload.area_m2,
        thickness_mm=payload.thickness_mm,
        waste_pct=payload.waste_pct
    )

# ==================== WEATHER & ENVIRONMENTAL LOCATIONS ====================

@app.get("/api/weather/locations")
def list_weather_locations():
    return {
        "default_location_id": "islamabad_default",
        "default_location_name": "Islamabad, Pakistan",
        "locations": [
            {
                "id": loc_id,
                "name": loc["name"],
                "elevation_m": loc.get("elevation_m", 0),
                "climate_zone": loc.get("climate_zone", "N/A"),
                "pmd_station_id": loc.get("pmd_station_id", "N/A"),
                "is_default": loc.get("is_default", False)
            }
            for loc_id, loc in LOCATIONS_REGISTRY.items()
        ]
    }

@app.get("/api/weather/current")
async def get_current_weather(location_id: str = "islamabad_default"):
    return await get_current_weather_for_location(location_id)

# ==================== ENVIRONMENTAL SIMULATION ====================

@app.get("/api/scenarios")
def list_scenarios():
    return AVAILABLE_SCENARIOS

class SimulationRunRequest(BaseModel):
    formula_id: str
    scenario_id: str = "islamabad_default"
    duration_hours: int = 48
    coat_thickness_mm: float = 8.0
    custom_temp_min: Optional[float] = None
    custom_temp_max: Optional[float] = None
    custom_rh_min: Optional[float] = None
    custom_rh_max: Optional[float] = None
    custom_wind_mean: Optional[float] = None
    custom_solar_peak: Optional[float] = None
    irrigation_hours: Optional[List[int]] = None
    irrigation_volume_l: Optional[float] = None

@app.post("/api/simulations/run")
def run_simulation(payload: SimulationRunRequest):
    f = get_formula_by_id(payload.formula_id)
    if not f:
        raise HTTPException(status_code=404, detail="Formula not found")
        
    sim_result = simulate_formula_performance(
        formula_data=f["data"],
        scenario_id=payload.scenario_id,
        duration_hours=payload.duration_hours,
        coat_thickness_mm=payload.coat_thickness_mm,
        custom_temp_min=payload.custom_temp_min,
        custom_temp_max=payload.custom_temp_max,
        custom_rh_min=payload.custom_rh_min,
        custom_rh_max=payload.custom_rh_max,
        custom_wind_mean=payload.custom_wind_mean,
        custom_solar_peak=payload.custom_solar_peak,
        irrigation_hours=payload.irrigation_hours,
        irrigation_volume_l=payload.irrigation_volume_l
    )
    
    sim_id = f"SIM-{uuid.uuid4().hex[:8].upper()}"
    save_simulation_run(
        sim_id=sim_id,
        formula_id=payload.formula_id,
        scenario_id=payload.scenario_id,
        duration=payload.duration_hours,
        results=sim_result
    )
    sim_result["simulation_id"] = sim_id
    return sim_result

@app.get("/api/simulations/history")
def list_simulations_history(limit: int = 20):
    return get_simulations_history(limit)

@app.get("/api/simulations/{sim_id}")
def get_simulation_run(sim_id: str):
    res = get_simulation_detail(sim_id)
    if not res:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return res

# ==================== PROCESS DISCOVERY & COMPARISON ====================

@app.get("/api/processes/stages")
def get_process_stages():
    return PROCESS_STAGES_METADATA

@app.get("/api/processes/workflows")
def list_workflows():
    return ALTERNATIVE_WORKFLOWS

@app.get("/api/processes/compare")
def compare_workflows(formula_category: str = "FORMULA_A"):
    return compare_all_workflows(formula_category)

@app.get("/api/processes/evaluate/{workflow_id}")
def evaluate_workflow(workflow_id: str, formula_category: str = "FORMULA_A"):
    return evaluate_process_workflow(workflow_id, formula_category)

# ==================== SPECIALIST SUBAGENTS ====================

@app.get("/api/agents")
def list_agents():
    res = []
    for aid, agent in ALL_SPECIALIST_AGENTS.items():
        res.append({
            "agent_id": agent.agent_id,
            "name": agent.name,
            "role": agent.role,
            "status": agent.status,
            "responsibilities": agent.responsibilities,
            "has_last_report": agent.last_report is not None
        })
    return res

@app.get("/api/agents/{agent_id}/report")
def get_agent_report(agent_id: str):
    agent = ALL_SPECIALIST_AGENTS.get(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    if not agent.last_report:
        return {
            "agent_id": agent.agent_id,
            "name": agent.name,
            "status": "NOT_EXECUTED",
            "message": "Agent has not executed a Gemini API request. Provide GEMINI_API_KEY and run an Orchestrator research cycle to generate genuine AI findings."
        }
    return agent.last_report

class RunAgentCycleRequest(BaseModel):
    formula_category: str = "FORMULA_E"
    api_key: Optional[str] = None

@app.post("/api/agents/run-cycle")
async def run_agents_cycle(payload: RunAgentCycleRequest):
    result = await master_orchestrator.run_full_research_cycle(
        target_formula_category=payload.formula_category,
        api_key=payload.api_key
    )
    return result

@app.get("/api/agents/latest-cycle")
def get_latest_agent_cycle():
    cycle = master_orchestrator.load_latest_cycle()
    if not cycle and master_orchestrator.execution_history:
        cycle = master_orchestrator.execution_history[-1]
    return cycle or {"status": "NO_CYCLE_RUN_YET"}

class WasteScanRequest(BaseModel):
    material_name: str
    origin_context: Optional[str] = "Pakistan industrial or agricultural byproduct"

@app.post("/api/agents/scan-waste-material")
async def scan_waste_material(payload: WasteScanRequest):
    """
    Scans published scientific literature and chemical databases for untested local waste products
    using Gemini API to determine toxic contaminants, heavy metals, pozzolanic activity, and moss biocompatibility.
    """
    key = settings.GEMINI_API_KEY
    if not key or len(key.strip()) < 5:
        raise HTTPException(status_code=400, detail="Gemini API key is not configured in .env.")
    
    import httpx
    import json
    from .agents.base import extract_json_from_llm_text

    prompt = f"""
You are the Chief Chemical Materials Scientist and Toxicologist at Sabzaar Living Walls Research Laboratory.
Task: Deep scientific literature scan for an exotic or untested local waste material for use in bioreceptive concrete and living moss walls in Pakistan.

Candidate Material: "{payload.material_name}"
Local Origin Context: "{payload.origin_context}"

Scan chemical literature, patent disclosures, and environmental toxicology studies. Evaluate:
1. Primary chemical and mineral composition (crystalline phases, amorphous content, organics).
2. Toxic heavy metals or deleterious chemical compounds (e.g. Lead, hexavalent Chromium, Cadmium, synthetic azo dyes, sulfides, phenols, excessive salts).
3. Pozzolanic reactivity index / hydraulic binding capability when blended with cement/lime.
4. Biocompatibility with bryophytes (moss protonema and gametophytes).
5. Pre-treatment required (calcination, water washing, fermentation, charring).
6. Living wall feasibility score (0 to 100).
7. Realistic acquisition cost in Pakistan (PKR / kg).

You MUST respond strictly with a valid JSON object matching this schema:
{{
  "material_name": "{payload.material_name}",
  "origin_context": "{payload.origin_context}",
  "chemical_composition": ["phase or compound 1", "phase 2"],
  "heavy_metals_and_toxins": [
    {{"contaminant": "name", "risk_level": "HIGH|MEDIUM|LOW|NEGLIGIBLE", "mechanism": "toxicity details"}}
  ],
  "pozzolanic_and_structural_assessment": "detailed analysis of cementitious or aggregate behaviour",
  "bryophyte_biocompatibility": "COMPATIBLE|CONDITIONAL|LETHAL_TOXIC",
  "mandatory_pretreatment_protocol": ["step 1", "step 2"],
  "living_wall_suitability_score": 85.0,
  "estimated_pakistan_cost_pkr_kg": 4.5,
  "verdict_and_recommendation": "comprehensive scientific synthesis and recommendation paragraph",
  "academic_citations": ["relevant literature or ASTM standard"]
}}
"""
    models_to_try = [settings.GEMINI_MODEL, "gemini-flash-lite-latest", "gemini-flash-latest"]
    async with httpx.AsyncClient(timeout=60.0) as client:
        last_err = ""
        for model in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
            req_body = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"responseMimeType": "application/json", "temperature": 0.2}
            }
            try:
                resp = await client.post(url, json=req_body)
                if resp.status_code == 200:
                    cand = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
                    parsed = extract_json_from_llm_text(cand)
                    parsed["scanned_model"] = model
                    return parsed
                else:
                    last_err = f"Gemini error {resp.status_code}: {resp.text[:200]}"
            except Exception as e:
                last_err = str(e)
        raise HTTPException(status_code=500, detail=f"Exotic waste scan failed: {last_err}")

class LivePaperRequest(BaseModel):
    formula_category: Optional[str] = "FORMULA_E"

@app.post("/api/reports/generate-live-paper")
async def generate_live_paper(payload: LivePaperRequest):
    """
    Generates a full peer-reviewed caliber research paper dynamically via Gemini API,
    synthesizing materials chemistry, Pakistan climate data, and the 13-agent consensus.
    """
    key = settings.GEMINI_API_KEY
    if not key or len(key.strip()) < 5:
        raise HTTPException(status_code=400, detail="Gemini API key is not configured in .env.")
    
    import httpx
    import json
    from .agents.base import extract_json_from_llm_text

    cat = payload.formula_category or "FORMULA_E"
    fdata = ALL_FORMULA_CATEGORIES.get(cat, ALL_FORMULA_CATEGORIES["FORMULA_E"])

    prompt = f"""
You are the Lead Scientific Author at Sabzaar Living Walls Research Laboratory.
Task: Write a rigorous, authoritative academic research paper on the breakthrough formula:
Formula Code: {cat}
Formula Name: {fdata.get('name')}
Target Microclimate: Islamabad & Lahore, Pakistan (Subtropical Cwa/BSh, 45°C extreme summer, monsoon cycles).
Target Substrate: Existing, already-built concrete infrastructure.
Achieved Target Cost: PKR 54.15 / m² (100% recyclable, non-chemical regional Pakistani materials).

Structure your dynamic prose paper to be publication-ready for 'Construction and Building Materials' or 'Ecological Engineering'.
Include:
1. Title
2. Abstract (200 words, quantitative findings)
3. 1. Introduction (Urban heat island in Pakistan, concrete alkalinity barrier, limitations of imported 800 PKR systems)
4. 2. Two-Layer Bioreceptive System Architecture (Layer 1 Mineral Render + Layer 2 Living Spray)
5. 3. Stoichiometric Mass Balance & Pozzolanic Lime-Scavenging Kinetics
6. 4. Microclimate Hydrological Trajectory & Penman-Monteith Evaporative Resistance
7. 5. Multi-Agent Red-Team Critique & Adversarial Resolution (Thermal stress at 45°C, ASTM C1583 shear bond >=0.75 MPa)
8. 6. Circular Economy & Life-Cycle Cost Analysis (PKR 54.15 / m² breakdown vs 816 PKR baseline)
9. 7. Conclusion & Field Implementation Test Gates

Respond strictly with a valid JSON object:
{{
  "title": "full formal title",
  "abstract": "abstract text",
  "introduction": "introduction text",
  "materials_and_architecture": "methodology text",
  "pozzolanic_and_microclimate_results": "results and discussion text",
  "red_team_adversarial_resolution": "synthesis of critical review",
  "life_cycle_economics": "cost and carbon analysis text",
  "conclusion": "conclusion text",
  "references": ["citation 1", "citation 2", "citation 3"]
}}
"""
    models_to_try = [settings.GEMINI_MODEL, "gemini-flash-lite-latest", "gemini-flash-latest"]
    async with httpx.AsyncClient(timeout=90.0) as client:
        last_err = ""
        for model in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
            req_body = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"responseMimeType": "application/json", "temperature": 0.3}
            }
            try:
                resp = await client.post(url, json=req_body)
                if resp.status_code == 200:
                    cand = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
                    parsed = extract_json_from_llm_text(cand)
                    parsed["model"] = model
                    return parsed
                else:
                    last_err = f"Gemini error {resp.status_code}: {resp.text[:200]}"
            except Exception as e:
                last_err = str(e)
        raise HTTPException(status_code=500, detail=f"Paper generation failed: {last_err}")

# ==================== MULTI-OBJECTIVE OPTIMIZATION ====================

@app.get("/api/optimization/weights")
def get_optimization_weights():
    return OPTIMIZATION_CRITERIA_WEIGHTS

@app.get("/api/optimization/score-audit")
def get_score_audit():
    return get_scientific_score_audit()

class CustomWeightsRequest(BaseModel):
    weights: Optional[Dict[str, float]] = None

@app.post("/api/optimization/compare")
def run_optimization(payload: CustomWeightsRequest):
    return run_multi_objective_comparison(payload.weights)

# ==================== DUAL-SPRAY COMPREHENSIVE SIMULATION SUITE ====================
from .simulation.mass_volume_auditor import audit_dual_spray_mass_volume
from .simulation.layer1_mineral_spray import simulate_layer1_mineral_spray
from .simulation.layer2_bio_gel import simulate_layer2_bio_gel
from .simulation.combined_system import simulate_combined_dual_spray_system
from .simulation.dual_spray_orchestrator import run_full_dual_spray_simulation, get_experimental_alternatives_and_scenarios

class DualSpraySimulateRequest(BaseModel):
    spray_pressure_bar: float = 5.0
    nozzle_diameter_mm: float = 6.0
    water_ratio_l_per_100kg: float = 24.0
    nominal_thickness_mm: float = 5.5
    bio_spray_nozzle_mm: float = 5.0
    misting_frequency_per_day: int = 2
    ambient_temp_c: float = 32.0
    ambient_rh_pct: float = 45.0
    storage_hours_before_spray: float = 4.0

@app.get("/api/dual-spray/baseline")
def get_dual_spray_baseline():
    """Returns the immutable baseline specification for Layer 1 and Layer 2 dual spray."""
    return {
        "title": "Dual-Spray Living Wall Immutable Baseline (V1)",
        "layer_1_mineral_spray": {
            "name": "Bioreceptive Mineral Spray Slurry",
            "form": "Pneumatic Wet Spray Slurry (Zero Dry Application)",
            "ingredients": [
                {"name": "River Sand", "percentage": 38.0, "role": "Inert skeleton"},
                {"name": "Recycled Brick Surkhi", "percentage": 30.0, "role": "Ceramic water reservoir"},
                {"name": "Marble Slurry Powder", "percentage": 16.0, "role": "Micro-filler"},
                {"name": "Rice Husk / Tandoor Ash", "percentage": 10.0, "role": "Reactive pozzolan"},
                {"name": "Ordinary Portland Cement (OPC)", "percentage": 4.0, "role": "Hydraulic activator"},
                {"name": "Boosa Straw (5–10 mm)", "percentage": 1.0, "role": "Fiber reinforcement"},
                {"name": "Cooked Starch Binder", "percentage": 1.0, "role": "Anti-sag thixotropic binder"}
            ],
            "water_ratio": "24 L per 100 kg dry solids",
            "application_rate": "7 kg dry solids / m²",
            "claimed_wet_slurry_volume": "8.7 L / m²",
            "claimed_nominal_thickness": "5.5 mm",
            "pneumatic_pressure": "4–6 bar"
        },
        "layer_2_living_bio_gel": {
            "name": "Living Moss Bio-Gel Spray",
            "form": "Aerosolized Liquid Bio-Inoculant",
            "ingredients": [
                {"name": "Leftover Rice Starch Water", "amount": "0.82 L", "role": "Carbohydrate liquid carrier"},
                {"name": "Strained Sour Curd Whey", "amount": "0.18 L", "role": "Natural lactic acid buffer & tackifier"},
                {"name": "Living Wild Brick Moss Fragments", "amount": "20.0 g", "role": "Biological bryophyte propagules"},
                {"name": "Boiled Starch Slurry Gel", "amount": "5.0 g", "role": "Viscous suspension gel"},
                {"name": "Sifted Wood Ash", "amount": "2.0 g", "role": "Mineral electrolyte donor"}
            ],
            "spray_rate": "1.0 L / m²",
            "spray_nozzle": "4–6 mm wide-orifice tip"
        }
    }

@app.get("/api/dual-spray/mass-volume-audit")
def get_dual_spray_audit(
    dry_solids: float = 7.0,
    claimed_slurry_l: float = 8.7,
    thickness_mm: float = 5.5,
    water_l_100kg: float = 24.0
):
    """Executes stoichiometric and volumetric consistency audit, flagging any physical discrepancies."""
    return audit_dual_spray_mass_volume(
        dry_solids_kg_m2=dry_solids,
        claimed_wet_slurry_l_m2=claimed_slurry_l,
        claimed_nominal_thickness_mm=thickness_mm,
        water_liters_per_100kg_dry=water_l_100kg
    )

@app.post("/api/dual-spray/simulate")
def run_dual_spray_simulation_endpoint(payload: DualSpraySimulateRequest):
    """Executes complete 13-agent deterministic multi-physics simulation."""
    return run_full_dual_spray_simulation(
        spray_pressure_bar=payload.spray_pressure_bar,
        nozzle_diameter_mm=payload.nozzle_diameter_mm,
        water_ratio_l_per_100kg=payload.water_ratio_l_per_100kg,
        nominal_thickness_mm=payload.nominal_thickness_mm,
        bio_spray_nozzle_mm=payload.bio_spray_nozzle_mm,
        misting_frequency_per_day=payload.misting_frequency_per_day,
        ambient_temp_c=payload.ambient_temp_c,
        ambient_rh_pct=payload.ambient_rh_pct,
        storage_hours_before_spray=payload.storage_hours_before_spray
    )

@app.get("/api/dual-spray/experiments")
def get_dual_spray_experiments():
    """Returns versioned alternatives, scenario matrix, and sensitivity sweeps."""
    return get_experimental_alternatives_and_scenarios()

@app.get("/api/dual-spray/comparison-dashboard")
def get_dual_spray_dashboard():
    """Aggregates all components for one-click comprehensive dashboard visualization."""
    audit = audit_dual_spray_mass_volume(7.0, 8.7, 5.5, 24.0)
    sim = run_full_dual_spray_simulation(5.0, 6.0, 24.0, 5.5, 5.0, 2, 32.0, 45.0, 4.0)
    experiments = get_experimental_alternatives_and_scenarios()
    return {
        "audit": audit,
        "simulation": sim,
        "experiments": experiments
    }

# ==================== FINAL DELIVERABLE & REPORTS ====================

@app.get("/api/reports/final-deliverable")
def get_final_deliverable():
    return generate_final_recommended_report()

@app.get("/api/reports/final-deliverable/markdown")
def get_final_deliverable_markdown():
    return {"markdown": get_markdown_final_deliverable()}

# ==================== STATIC FRONTEND MOUNT ====================
from fastapi.staticfiles import StaticFiles

dist_path = settings.ROOT_DIR / "frontend" / "dist"
if dist_path.exists():
    app.mount("/", StaticFiles(directory=str(dist_path), html=True), name="frontend")

