"""
Immutable Baseline Formulation (Formula A)
Extracted verbatim from inputs/sabzaar-living-walls-standalone.html.
DO NOT MODIFY. This represents the immutable reference benchmark.
"""

from typing import Dict, Any, List

# Layer 1: Receptor Coat (Coat A - Mix R-1)
# Total dry mass must sum to exactly 100.0%
BASELINE_LAYER_1: List[Dict[str, Any]] = [
    {
        "id": "opc_42_5",
        "name": "Portland cement, OPC 42.5",
        "category": "Binder",
        "color": "#7E8A80",
        "percentage": 22.0,
        "function": "Binder. Sets the coat and bonds it to the wall.",
        "cost_pkr_kg": 31.0,
        "density_g_cm3": 3.15,
        "chemical_formula": "CaO-SiO2-Al2O3-Fe2O3",
        "ph_initial": 12.8,
        "notes": "Hydration produces portlandite Ca(OH)2 which causes high initial alkalinity."
    },
    {
        "id": "fly_ash_rha",
        "name": "Fly ash or rice husk ash",
        "category": "Pozzolan",
        "color": "#7E8A80",
        "percentage": 14.0,
        "function": "Pozzolan. Uses up free lime so the surface loses its alkalinity sooner, and replaces cement.",
        "cost_pkr_kg": 10.0,
        "density_g_cm3": 2.20,
        "chemical_formula": "SiO2 (amorphous) + Al2O3",
        "ph_initial": 8.5,
        "notes": "Consumes Ca(OH)2 over 14-28 days via pozzolanic reaction to form secondary C-S-H."
    },
    {
        "id": "crushed_brick",
        "name": "Crushed burnt brick, 0.1–2 mm",
        "category": "Porous Grains",
        "color": "#B5654A",
        "percentage": 12.0,
        "function": "Porous grain. Holds water in its pores and roughens the face.",
        "cost_pkr_kg": 10.0,
        "density_g_cm3": 1.95,
        "porosity_pct": 28.0,
        "notes": "Ceramic matrix with pore sizes ideal for bryophyte rhizoid micro-anchorage."
    },
    {
        "id": "pumice",
        "name": "Pumice, 0.1–2 mm",
        "category": "Porous Grains",
        "color": "#B5654A",
        "percentage": 8.0,
        "function": "Light porous grain. The main water store.",
        "cost_pkr_kg": 60.0,
        "density_g_cm3": 1.10,
        "porosity_pct": 55.0,
        "notes": "Highly porous volcanic glass; lightweight water reservoir."
    },
    {
        "id": "washed_sand",
        "name": "Washed sand, 0–2 mm",
        "category": "Sand & Aggregate",
        "color": "#D9CFB4",
        "percentage": 29.5,
        "function": "Skeleton of the coat.",
        "cost_pkr_kg": 4.0,
        "density_g_cm3": 2.65,
        "porosity_pct": 5.0,
        "notes": "Inert quartz aggregate providing structural skeleton and controlling shrinkage."
    },
    {
        "id": "marble_limestone_powder",
        "name": "Marble or limestone powder",
        "category": "Filler",
        "color": "#D9CFB4",
        "percentage": 12.0,
        "function": "Fine filler that makes the slurry sprayable.",
        "cost_pkr_kg": 5.0,
        "density_g_cm3": 2.70,
        "notes": "Fine CaCO3 particle packing that lubricates wet slurry pumping and shotcreting."
    },
    {
        "id": "bone_ash",
        "name": "Bone ash",
        "category": "Nutrient Additive",
        "color": "#3C6E3A",
        "percentage": 1.0,
        "function": "Slow phosphorus source, the nutrient bare stone lacks.",
        "cost_pkr_kg": 150.0,
        "chemical_formula": "Ca3(PO4)2 / Ca5(PO4)3(OH)",
        "notes": "Slow-release inorganic phosphate donor for long-term moss survival."
    },
    {
        "id": "pp_fibre",
        "name": "Polypropylene fibre, 6 mm",
        "category": "Reinforcement",
        "color": "#3C6E3A",
        "percentage": 0.6,
        "function": "Stops a thin coat from cracking.",
        "cost_pkr_kg": 900.0,
        "tensile_strength_mpa": 400.0,
        "notes": "Controls plastic shrinkage micro-cracking in thin 8mm spray."
    },
    {
        "id": "coir_jute_fibre",
        "name": "Coir or jute fibre, 3–6 mm",
        "category": "Capillary Fibre",
        "color": "#3C6E3A",
        "percentage": 0.4,
        "function": "Natural fibre that wicks and holds water.",
        "cost_pkr_kg": 300.0,
        "notes": "Lignocellulosic natural fibres providing internal capillary conduits."
    },
    {
        "id": "sap",
        "name": "Superabsorbent polymer",
        "category": "Water Retainer",
        "color": "#3C6E3A",
        "percentage": 0.4,
        "function": "Swells with water and releases it slowly.",
        "cost_pkr_kg": 600.0,
        "swell_ratio": 200.0,
        "notes": "Crosslinked polyacrylate beads absorbing up to 200x mass in water."
    },
    {
        "id": "hpmc",
        "name": "Cellulose ether, HPMC",
        "category": "Rheology Modifier",
        "color": "#3C6E3A",
        "percentage": 0.1,
        "function": "Stops the wet coat sagging. Kept minimal because it blocks pores.",
        "cost_pkr_kg": 900.0,
        "notes": "Anti-sag water retention polymer. Minimal dosage preserves interconnected porosity."
    }
]

# Physical and Application Constants for Layer 1
LAYER_1_PHYSICAL_SPECS: Dict[str, Any] = {
    "thickness_mm_default": 8.0,
    "thickness_range_mm": [5.0, 15.0],
    "mixing_water_liters_per_100kg_dry": 28.0,
    "mixing_water_range": [26.0, 30.0],
    "target_slump_mm": [100.0, 150.0],
    "dry_mass_density_kg_per_m2_per_mm": 1.37,
    "nominal_dry_mass_kg_m2_net": 10.96,  # 8mm * 1.37
    "standard_rebound_waste_pct": 15.0,
    "nominal_dry_mass_kg_m2_gross": 12.604, # 10.96 * 1.15
    "substrate_adhesion_target_mpa": 0.8,
    "in_situ_water_storage_liters_per_m2": 2.08, # 0.26 L/(m2*mm) * 8mm
    "carbonation_wait_days": 21
}

# Layer 2: Living Bio-Gel (Coat B - Blend L-1)
# Expressed in exact g/L of soft water (chlorine-free)
BASELINE_LAYER_2: List[Dict[str, Any]] = [
    {
        "id": "soft_water",
        "name": "Soft water, chlorine-free",
        "category": "Carrier Medium",
        "unit": "L",
        "amount": 1.0,
        "function": "Carrier medium (rainwater, AC condensate, or demineralized). Avoid hard water.",
        "cost_pkr_per_unit": 0.5,
        "notes": "Hard water contains divalent cations that trigger premature gelation in tank."
    },
    {
        "id": "sodium_alginate",
        "name": "Sodium alginate",
        "category": "Gelling Biopolymer",
        "unit": "g/L",
        "amount": 10.0,
        "patent_range_g_l": [5.0, 50.0],
        "function": "The carrier. Stays liquid in tank, gels into calcium alginate when meeting Ca2+ on wall.",
        "cost_pkr_per_unit": 2.5, # ~2500 PKR/kg
        "notes": "Anionic polysaccharide crosslinked by calcium diffusing from carbonating substrate."
    },
    {
        "id": "psyllium_husk",
        "name": "Psyllium husk powder (ispaghol)",
        "category": "Natural Tackifier",
        "unit": "g/L",
        "amount": 4.0,
        "function": "Tackifier. In field trials psyllium raised moss growth, while guar gum reduced it.",
        "cost_pkr_per_unit": 2.0, # ~2000 PKR/kg
        "notes": "Mucilage creates moisture retention jacket around propagules and enhances vertical adhesion."
    },
    {
        "id": "moss_fragments",
        "name": "Moss fragments, dry-milled, 0.5–2 mm",
        "category": "Biological Inoculant",
        "unit": "g/L",
        "amount": 30.0,
        "function": "Gives 45 g/m2 at 1.5 L/m2 spray rate. Optimal ecological restoration density.",
        "cost_pkr_per_unit": 8.0, # nursery cost ~8000 PKR/kg dry
        "notes": "Dry-milled gametophyte pieces with intact apical cells capable of protonemal regeneration."
    },
    {
        "id": "wall_algae_cyanobacteria",
        "name": "Wall algae and cyanobacteria culture",
        "category": "Pioneer Biocrust Inoculant",
        "unit": "g dry/L",
        "amount": 4.0,
        "wet_paste_equivalent_g": 80.0,
        "function": "Fast pioneers: creates green film in weeks, fixes nitrogen, protects moss against summer UV.",
        "cost_pkr_per_unit": 10.0,
        "notes": "Sheath-forming cyanobacteria and microalgae synthesize UV-absorbing scytonemin."
    },
    {
        "id": "kno3",
        "name": "Potassium nitrate",
        "category": "Nutrient",
        "unit": "g/L",
        "amount": 0.10,
        "function": "Nitrogen and potassium nutrition. Kept very dilute to prevent osmotic moss burn.",
        "cost_pkr_per_unit": 0.20,
        "notes": "Nitrate level calibrated to avoid plasmolysis or algae over-blooming."
    },
    {
        "id": "kh2po4",
        "name": "Monopotassium phosphate",
        "category": "Nutrient",
        "unit": "g/L",
        "amount": 0.014,
        "function": "Soluble phosphorus source for ATP and nucleic acid synthesis.",
        "cost_pkr_per_unit": 0.30,
        "notes": "Supplements the insoluble bone ash in Layer 1."
    },
    {
        "id": "mgso4",
        "name": "Magnesium sulphate",
        "category": "Nutrient",
        "unit": "g/L",
        "amount": 0.05,
        "function": "Magnesium for chlorophyll synthesis, sulfate for sulfur amino acids. No calcium in tank.",
        "cost_pkr_per_unit": 0.10,
        "notes": "Magnesium activates RuBisCO and is the central atom in chlorophyll."
    },
    {
        "id": "citrate_buffer",
        "name": "Trisodium citrate, citric acid",
        "category": "Chelator & Buffer",
        "unit": "g/L",
        "amount": 1.0,
        "target_ph": 6.0,
        "patent_range_ph": [4.0, 7.0],
        "function": "Citrate ties up stray calcium so the gel stays sprayable. Buffers solution to pH 6.0.",
        "cost_pkr_per_unit": 0.80,
        "notes": "Weak calcium chelator that prevents tank-clogging without hindering wall crosslinking."
    }
]

# Physical and Application Constants for Layer 2
LAYER_2_PHYSICAL_SPECS: Dict[str, Any] = {
    "application_rate_liters_per_m2": 1.5,
    "spray_passes": 2,
    "pass_interval_minutes": 30,
    "target_moss_biomass_delivery_g_per_m2": 45.0, # 1.5 L/m2 * 30 g/L
    "establishment_duration_weeks": 12,
    "establishment_misting_water_liters_per_m2": 80.0,
    "recommended_shade_net_attenuation_pct": 60.0
}

FORMULA_A_DOCUMENTATION: Dict[str, Any] = {
    "code": "FORMULA-A",
    "name": "Original HTML Baseline Formula (Sabzaar Mix R-1 / Blend L-1)",
    "status": "IMMUTABLE_BASELINE",
    "category": "Original Idea-Based Baseline",
    "source_file": "inputs/sabzaar-living-walls-standalone.html",
    "layer_1": {
        "name": "Receptor Coat A (Mix R-1)",
        "ingredients": BASELINE_LAYER_1,
        "specs": LAYER_1_PHYSICAL_SPECS,
        "mass_balance_sum_pct": sum(item["percentage"] for item in BASELINE_LAYER_1)
    },
    "layer_2": {
        "name": "Living Bio-Gel Coat B (Blend L-1)",
        "ingredients": BASELINE_LAYER_2,
        "specs": LAYER_2_PHYSICAL_SPECS
    },
    "strengths": [
        "100% dry mass balance strictly verified (sum = 100.00%).",
        "Excellent water retention capacity (~2.08 L/m2 in 8mm Layer 1).",
        "Innovative contact-gelation mechanism using alginate crosslinking via wall-diffused Ca2+.",
        "Psyllium husk tackifier proven superior to guar gum in restoration literature.",
        "Bimicrobial biological inoculant: moss fragments + wall algae/cyanobacteria crust pioneers.",
        "Low-cost local mineral aggregate substitution (crushed burnt brick, local sand, marble powder)."
    ],
    "weaknesses_and_limitations": [
        "OPC 42.5 generates high initial pH (12.5-13.0); requires a 21-day curing window before seeding.",
        "Vulnerable to extreme Pakistani summer heat (45°C ambient, >50°C wall surface); moss die-back risk.",
        "High groundwater TDS in Lahore (193-613 mg/L) can cause efflorescence crust if used for misting.",
        "Risk of accelerated rebar corrosion on older damaged concrete under continuous wetting.",
        "Opportunistic fungal attack during high-humidity monsoons (July-August) on moist organic gel.",
        "Higher cost of pumice in Pakistan (~60 PKR/kg bulk, ~199 PKR/kg retail) vs standard sands."
    ]
}
