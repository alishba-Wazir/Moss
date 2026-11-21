import json
import sys
from backend.app.db.database import init_db, get_all_formulas, get_formula_by_id
from backend.app.formulas.discovery import ALL_FORMULA_CATEGORIES
from backend.app.formulas.validator import validate_layer_1, validate_layer_2, calculate_layer_1_job_quantities
from backend.app.simulation.engine import simulate_formula_performance
from backend.app.simulation.scenarios import AVAILABLE_SCENARIOS
from backend.app.agents.specialists import ALL_SPECIALIST_AGENTS
from backend.app.optimization.pareto import run_multi_objective_comparison

init_db()

print("--- INITIALIZING PROJECT & SIMULATING ---")
formulas = get_all_formulas()
print(f"Loaded {len(formulas)} formula configurations from database.")

# Pick Formula C (Recyclable-Material Matrix)
formula_c = ALL_FORMULA_CATEGORIES["FORMULA_C"]
print(f"Target Formula: {formula_c['code']} - {formula_c['name']}")

# Check mass balance
l1_valid, l1_msg, l1_sum = validate_layer_1(formula_c["layer_1"]["ingredients"])
l2_valid, l2_msg = validate_layer_2(formula_c["layer_2"]["ingredients"])
print(f"Layer 1 Validation: {l1_valid} (Sum: {l1_sum:.2f}%) - {l1_msg}")
print(f"Layer 2 Validation: {l2_valid} - {l2_msg}")

# Run simulation across scenarios
scenarios_to_test = [
    "islamabad_default",
    "islamabad_summer",
    "islamabad_monsoon",
    "lahore_summer",
    "karachi_coastal",
    "quetta_arid",
    "murree_hills",
    "standard_lab"
]

sim_results = {}
for sc_id in scenarios_to_test:
    res = simulate_formula_performance(
        formula_data=formula_c,
        scenario_id=sc_id,
        duration_hours=48,
        coat_thickness_mm=8.0
    )
    env = res["environmental_summary"]
    mat = res["material_properties"]
    eco = res["economic_summary"]
    sim_results[sc_id] = {
        "scenario_name": AVAILABLE_SCENARIOS[sc_id],
        "viability_score": env["biological_viability_score"],
        "evaporation_total_liters_m2": env["total_evaporation_liters_m2"],
        "peak_wall_temp_c": env["peak_wall_temperature_c"],
        "min_moisture_saturation_pct": env["min_moisture_saturation_pct"],
        "average_biological_stress_index": env["average_biological_stress_index"],
        "max_water_storage_liters_m2": mat["max_water_storage_liters_m2"],
        "compressive_strength_28d_mpa": mat["compressive_strength_28d_mpa"],
        "porosity_pct": mat["total_porosity_pct"],
        "bulk_density_kg_m3": mat["bulk_density_kg_m3"],
        "layer_1_cost_pkr_m2": eco["layer_1_cost_pkr_m2"],
        "layer_2_cost_pkr_m2": eco["layer_2_cost_pkr_m2"],
        "total_material_cost_pkr_m2": eco["total_material_cost_pkr_m2"]
    }
    print(f"Scenario [{sc_id}]: Viability = {env['biological_viability_score']}/100, Peak Wall Temp = {env['peak_wall_temperature_c']}C, Evap = {env['total_evaporation_liters_m2']} L/m2, Min Moisture = {env['min_moisture_saturation_pct']}%")

# Run all 13 specialist agents on Formula C
print("\n--- RUNNING 13 SPECIALIST AGENTS ---")
agent_evaluations = {}
for aid, agent in ALL_SPECIALIST_AGENTS.items():
    heuristics = agent._execute_scientific_heuristics(context={"formula": formula_c}, peer_critiques=None)
    agent_evaluations[aid] = heuristics
    print(f"Agent [{agent.name}]:\n  Verdict: {heuristics['verdict_summary']}")
    if heuristics.get("disagreements_with_peers"):
        print(f"  Adversarial Debate: {heuristics['disagreements_with_peers'][0]}")

# Pareto comparison
pareto = run_multi_objective_comparison()
print("\nPareto Ranking across 4 categories:")
for rank, item in enumerate(pareto["rankings"], 1):
    cost_score = item['dimensional_scores']['material_and_mfg_cost']
    carbon_score = item['dimensional_scores']['carbon_and_circularity']
    bio_score = item['dimensional_scores']['biological_viability']
    print(f"#{rank} {item['formula_code']} ({item['formula_name']}): Score={item['composite_utility_score']:.2f}/100, BioScore={bio_score}/100, CostScore={cost_score}/100, Circularity={carbon_score}/100")

# Write out simulation results to JSON for review
with open("simulation_run_results.json", "w") as f:
    json.dump({
        "formula_c": formula_c,
        "scenarios": sim_results,
        "agents": agent_evaluations,
        "pareto": pareto
    }, f, indent=2)
print("\nComplete simulation output saved to simulation_run_results.json")
