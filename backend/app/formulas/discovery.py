"""
Four Formula Discovery Categories:
- Formula A: Original HTML / Idea-Based Baseline (Immutable)
- Formula B: Ideal Performance Formula (Low-alkali MPC binder, engineered porosity, rapid establishment)
- Formula C: Recyclable-Material Formula (Industrial & agricultural waste: GGBS, RHA, crushed brick/ceramic, natural fibers)
- Formula D: Mineral-Based / Cost-Optimized Formula (Local pozzolanic limestone/brick matrix, minimal synthetic additives)
"""

from typing import Dict, Any, List
from .baseline import BASELINE_LAYER_1, BASELINE_LAYER_2, LAYER_1_PHYSICAL_SPECS, LAYER_2_PHYSICAL_SPECS, FORMULA_A_DOCUMENTATION

# FORMULA B: IDEAL PERFORMANCE (High Bioreceptivity, Neutral pH, Superior Water Retention)
# Uses Magnesium Phosphate Cement (MPC) binder system: initial pH 7.5-8.5 eliminates the 21-day delay.
FORMULA_B_LAYER_1: List[Dict[str, Any]] = [
    {
        "id": "dead_burned_mgo",
        "name": "Dead-burned Magnesium Oxide (MgO)",
        "category": "MPC Binder Component",
        "color": "#8C9BAE",
        "percentage": 14.0,
        "function": "Low-solubility basic component of Magnesium Phosphate Cement (MPC).",
        "cost_pkr_kg": 65.0,
        "ph_initial": 8.5,
        "notes": "Reacts with phosphate salt to form struvite-K (MgKPO4·6H2O); neutral biocompatible pH from day 1."
    },
    {
        "id": "mkp_binder",
        "name": "Monopotassium Phosphate (KH2PO4, industrial)",
        "category": "MPC Binder Component",
        "color": "#8C9BAE",
        "percentage": 16.0,
        "function": "Acidic phosphate component of MPC binder; provides intrinsic potassium and phosphate nutrients.",
        "cost_pkr_kg": 85.0,
        "ph_initial": 7.5,
        "notes": "Chemical bond sets in 30 minutes; non-alkaline pore solution."
    },
    {
        "id": "borax_retarder",
        "name": "Borax (Sodium tetraborate decahydrate)",
        "category": "Set Retarder",
        "color": "#8C9BAE",
        "percentage": 1.0,
        "function": "Extends MPC setting time to 45 minutes for sprayability.",
        "cost_pkr_kg": 95.0,
        "notes": "Prevents flash-setting in shotcrete pump and hose."
    },
    {
        "id": "expanded_glass_lightweight",
        "name": "Expanded recycled glass granulate (0.25–1.5 mm)",
        "category": "Engineered Porous Grain",
        "color": "#3B82F6",
        "percentage": 18.0,
        "function": "Vesicular closed-and-open micro-pore structure; extreme water retention and low thermal conductivity.",
        "cost_pkr_kg": 55.0,
        "porosity_pct": 65.0,
        "notes": "Thermal insulation barrier that prevents wall overheating in summer."
    },
    {
        "id": "crushed_pumice_graded",
        "name": "High-purity graded pumice (0.1–2 mm)",
        "category": "Porous Aggregate",
        "color": "#60A5FA",
        "percentage": 12.0,
        "function": "Continuous capillary water reservoir supporting moss rhizoids.",
        "cost_pkr_kg": 60.0,
        "porosity_pct": 55.0,
        "notes": "Uniform pore connectivity."
    },
    {
        "id": "quartz_filler_sand",
        "name": "Graded washed silica sand (0.1–1.2 mm)",
        "category": "Inert Aggregate",
        "color": "#D1D5DB",
        "percentage": 25.0,
        "function": "High-density skeletal matrix resisting weathering and rain erosion.",
        "cost_pkr_kg": 5.0,
        "notes": "Chemically inert framework."
    },
    {
        "id": "wollastonite_microfibres",
        "name": "Wollastonite mineral acicular microfibres",
        "category": "Mineral Reinforcement",
        "color": "#10B981",
        "percentage": 10.5,
        "function": "Natural calcium metasilicate needle-like crystals; boosts flexural strength and toughness.",
        "cost_pkr_kg": 40.0,
        "notes": "Replaces synthetic fibres with biocompatible mineral needles."
    },
    {
        "id": "nano_silica",
        "name": "Colloidal amorphous silica",
        "category": "Micro-filler & Pozzolan",
        "color": "#10B981",
        "percentage": 2.0,
        "function": "Fills interstitial sub-micron voids, enhancing paste pumpability and spray adhesion.",
        "cost_pkr_kg": 110.0,
        "notes": "Rheology enhancer."
    },
    {
        "id": "cellulose_nanofibres",
        "name": "Cellulose microfibrillated powder",
        "category": "Internal Curing Agent",
        "color": "#10B981",
        "percentage": 0.8,
        "function": "Bio-derived water-retentive network preventing desiccation cracking.",
        "cost_pkr_kg": 350.0,
        "notes": "Bio-compatible alternative to synthetic SAP."
    },
    {
        "id": "fe_micronutrient_chelate",
        "name": "Ferrous sulfate heptahydrate",
        "category": "Micronutrient",
        "color": "#059669",
        "percentage": 0.7,
        "function": "Iron micronutrient essential for moss protonema chloroplast synthesis.",
        "cost_pkr_kg": 80.0,
        "notes": "Trace mineral preventing chlorosis."
    }
]

FORMULA_B_LAYER_2: List[Dict[str, Any]] = [
    {
        "id": "purified_water",
        "name": "Purified rainwater / RO water",
        "category": "Carrier Medium",
        "unit": "L",
        "amount": 1.0,
        "cost_pkr_per_unit": 0.5,
        "function": "Pure solvent."
    },
    {
        "id": "sodium_alginate_high_guluronate",
        "name": "High-Guluronate Sodium Alginate (high gel strength)",
        "category": "Gelling Polymer",
        "unit": "g/L",
        "amount": 12.0,
        "cost_pkr_per_unit": 3.2,
        "function": "High-M/G ratio polymer providing superior gel rigidity and wind resistance."
    },
    {
        "id": "chitosan_lactate",
        "name": "Chitosan lactate (water-soluble)",
        "category": "Cationic Antimicrobial Tackifier",
        "unit": "g/L",
        "amount": 3.0,
        "cost_pkr_per_unit": 5.0,
        "function": "Forms polyelectrolyte complex with alginate, suppressing fungal mould while anchoring moss."
    },
    {
        "id": "moss_fragments_conditioned",
        "name": "Pre-conditioned acclimated moss fragments (Bryum & Tortula)",
        "category": "Biological Propagules",
        "unit": "g/L",
        "amount": 35.0,
        "cost_pkr_per_unit": 9.0,
        "function": "High density propagules giving 52.5 g/m2 coverage; cold-hardened and drought-primed."
    },
    {
        "id": "cyanobacteria_sheath_culture",
        "name": "Scytonema & Nostoc nitrogen-fixing biocrust paste",
        "category": "Photoprotective Pioneer Inoculant",
        "unit": "g dry/L",
        "amount": 5.0,
        "cost_pkr_per_unit": 12.0,
        "function": "Produces scytonemin sunscreen pigment and fixes atmospheric N2 directly on wall."
    },
    {
        "id": "glycine_betaine",
        "name": "Glycine betaine osmoprotectant",
        "category": "Osmoprotectant Additive",
        "unit": "g/L",
        "amount": 1.5,
        "cost_pkr_per_unit": 4.0,
        "function": "Cellular osmolyte that protects moss cell membranes against 45°C thermal shock."
    },
    {
        "id": "murashige_skoog_vitamins",
        "name": "Bryophyte micronutrient vitamin mix (MS modified)",
        "category": "Micronutrients",
        "unit": "g/L",
        "amount": 0.25,
        "cost_pkr_per_unit": 1.5,
        "function": "Trace vitamins (B1, myo-inositol) stimulating rapid bud formation."
    },
    {
        "id": "trisodium_citrate",
        "name": "Trisodium citrate buffer (pH 6.2)",
        "category": "Chelator & Buffer",
        "unit": "g/L",
        "amount": 1.2,
        "cost_pkr_per_unit": 0.9,
        "function": "Maintains fluid spray rheology in tank."
    }
]

# FORMULA C: RECYCLABLE-MATERIAL (Circular Economy, Industrial By-Products, Low Carbon)
# Uses Blast Furnace Slag (GGBS) + Rice Husk Ash (RHA) + Recycled Aggregate + Bio-fibres
FORMULA_C_LAYER_1: List[Dict[str, Any]] = [
    {
        "id": "ggbs_slag",
        "name": "Ground Granulated Blast-Furnace Slag (GGBS)",
        "category": "Industrial By-Product Binder",
        "color": "#6B7280",
        "percentage": 20.0,
        "function": "Steel industry slag latent hydraulic binder; low heat of hydration, dense micro-structure.",
        "cost_pkr_kg": 12.0,
        "notes": "80% embodied carbon reduction compared to pure OPC."
    },
    {
        "id": "rice_husk_ash_calcined",
        "name": "Calcined Rice Husk Ash (RHA, amorphous)",
        "category": "Agricultural Waste Pozzolan",
        "color": "#6B7280",
        "percentage": 14.0,
        "function": "Hyper-reactive biogenic silica (>90% SiO2); scavenges alkalis and increases pore tortuosity.",
        "cost_pkr_kg": 8.0,
        "notes": "Abundant agricultural waste from rice mills in Punjab."
    },
    {
        "id": "opc_activator",
        "name": "Portland Cement (OPC 42.5, alkali activator)",
        "category": "Activator Binder",
        "color": "#9CA3AF",
        "percentage": 8.0,
        "function": "Provides minimum Ca(OH)2 needed to activate the GGBS slag hydration.",
        "cost_pkr_kg": 31.0,
        "notes": "Kept to minimal 8% to prevent caustic alkalinity."
    },
    {
        "id": "recycled_crushed_brick",
        "name": "Recycled crushed clay brick waste (0.2–2 mm)",
        "category": "Construction Waste Aggregate",
        "color": "#B45309",
        "percentage": 22.0,
        "function": "Sourced from demolition rubble; highly porous ceramic internal water reservoir.",
        "cost_pkr_kg": 4.0,
        "porosity_pct": 30.0,
        "notes": "Diverts construction and demolition waste."
    },
    {
        "id": "crushed_recycled_glass",
        "name": "Crushed recycled container glass fines (0.1–1 mm)",
        "category": "Recycled Mineral Aggregate",
        "color": "#059669",
        "percentage": 18.0,
        "function": "Sharp angular particle skeleton from waste glass bottles; enhances shear bond.",
        "cost_pkr_kg": 3.0,
        "notes": "Cullet waste, washed and crushed."
    },
    {
        "id": "marble_slurry_waste_powder",
        "name": "Recycled marble cutting slurry powder",
        "category": "Industrial Mineral Waste Filler",
        "color": "#E5E7EB",
        "percentage": 14.0,
        "function": "Dry filter-cake dust from marble sawing factories; free fine filler improving sprayability.",
        "cost_pkr_kg": 2.5,
        "notes": "Abundant waste material from marble processing mills in Khyber Pakhtunkhwa & Punjab."
    },
    {
        "id": "spent_bone_char",
        "name": "Spent bone char / sugar refinery waste",
        "category": "Organic Waste Nutrient",
        "color": "#4B5563",
        "percentage": 1.5,
        "function": "Recycled bone char from sugar de-colorization; rich in calcium phosphate.",
        "cost_pkr_kg": 25.0,
        "notes": "Industrial waste product delivering slow-release phosphate."
    },
    {
        "id": "shredded_jute_waste",
        "name": "Shredded recycled jute sacking fibre (3–6 mm)",
        "category": "Natural Textile Waste Fibre",
        "color": "#92400E",
        "percentage": 1.2,
        "function": "Post-industrial jute burlap waste; provides hydrophilic capillary wicking networks.",
        "cost_pkr_kg": 45.0,
        "notes": "Natural plant bast fibre, fully biodegradable and wicking."
    },
    {
        "id": "crushed_eggshell_powder",
        "name": "Micro-milled avian eggshell powder",
        "category": "Bio-waste Filler",
        "color": "#F3F4F6",
        "percentage": 1.0,
        "function": "Bio-calcite and organic protein matrix enhancing microbial surface adhesion.",
        "cost_pkr_kg": 15.0,
        "notes": "Food processing waste."
    },
    {
        "id": "sodium_carboxymethyl_cellulose",
        "name": "Bio-cellulose / CMC (cotton linters waste)",
        "category": "Recycled Rheology Modifier",
        "color": "#F59E0B",
        "percentage": 0.3,
        "function": "Sourced from textile cotton waste; provides anti-sag vertical cohesion.",
        "cost_pkr_kg": 220.0,
        "notes": "Controls slurry workability."
    }
]

FORMULA_C_LAYER_2: List[Dict[str, Any]] = [
    {
        "id": "filtered_greywater_condensate",
        "name": "Filtered AC condensate / distilled water",
        "category": "Carrier Medium",
        "unit": "L",
        "amount": 1.0,
        "cost_pkr_per_unit": 0.2,
        "function": "Zero-cost soft water recovered from building air-conditioners."
    },
    {
        "id": "citrus_pectin_waste",
        "name": "Citrus peel waste pectin / Low-methoxyl pectin",
        "category": "Bio-waste Gelling Agent",
        "unit": "g/L",
        "amount": 8.0,
        "cost_pkr_per_unit": 1.8,
        "function": "Extracted from orange and kinnow juice pressing waste; gels in presence of Ca2+."
    },
    {
        "id": "ispaghol_processing_dust",
        "name": "Psyllium husk sieving byproduct dust",
        "category": "Agricultural By-product Tackifier",
        "unit": "g/L",
        "amount": 5.0,
        "cost_pkr_per_unit": 1.0,
        "function": "Low-grade sieving residue with identical arabinoxylan tackifying properties at 1/2 cost."
    },
    {
        "id": "salvaged_urban_moss_fragments",
        "name": "Salvaged local urban brick moss (Bryum, Funaria)",
        "category": "Salvaged Biological Inoculant",
        "unit": "g/L",
        "amount": 30.0,
        "cost_pkr_per_unit": 4.0,
        "function": "Propagules collected from existing local urban brickwork; highly adapted to pollution."
    },
    {
        "id": "isolated_local_cyanobacteria",
        "name": "Locally isolated wall biofilm crust culture",
        "category": "Local Biocrust Inoculant",
        "unit": "g dry/L",
        "amount": 4.0,
        "cost_pkr_per_unit": 5.0,
        "function": "Pre-adapted to city smog and intermittent rainfall."
    },
    {
        "id": "compost_tea_extract",
        "name": "Aerated vermicompost bio-nutrient extract (liquid)",
        "category": "Recycled Organic Nutrition",
        "unit": "g/L",
        "amount": 2.0,
        "cost_pkr_per_unit": 0.5,
        "function": "Balanced organic humic acids, nitrogen, phosphorus, and trace minerals."
    },
    {
        "id": "fermented_fruit_citric_buffer",
        "name": "Natural molasses/citrus organic buffer (pH 6.0)",
        "category": "Bio-derived Buffer",
        "unit": "g/L",
        "amount": 1.0,
        "cost_pkr_per_unit": 0.4,
        "function": "Buffers carrier against premature crosslinking."
    }
]

# FORMULA D: MINERAL-BASED / COST-OPTIMIZED (Lowest Direct Capex, Widely Available Minerals)
# Uses Hydrated Lime + Natural Pozzolan (brick dust/clay) + Local Sand, minimizing expensive binders & polymers
FORMULA_D_LAYER_1: List[Dict[str, Any]] = [
    {
        "id": "hydrated_lime",
        "name": "Hydrated building lime (Ca(OH)2 powder)",
        "category": "Low-Cost Mineral Binder",
        "color": "#94A3B8",
        "percentage": 15.0,
        "function": "Traditional non-hydraulic mineral binder; carbonates slowly from atmospheric CO2 into limestone.",
        "cost_pkr_kg": 12.0,
        "notes": "Low cost, vapor-permeable, antimicrobial initially, converts completely to biocompatible CaCO3."
    },
    {
        "id": "low_heat_opc",
        "name": "Portland Pozzolana Cement (PPC)",
        "category": "Hydraulic Binder",
        "color": "#64748B",
        "percentage": 10.0,
        "function": "Provides early 7-day handling and shower-resistance strength.",
        "cost_pkr_kg": 24.0,
        "notes": "More economical than pure OPC 42.5."
    },
    {
        "id": "surkhi_brick_dust",
        "name": "Surkhi (Traditional calcined brick dust pozzolan)",
        "category": "Indigenous Mineral Pozzolan",
        "color": "#C2410C",
        "percentage": 18.0,
        "function": "Sub-sieve powdered clay brick; reacts with lime to form hydraulic C-S-H at low cost.",
        "cost_pkr_kg": 5.0,
        "notes": "Centuries-old subcontinental heritage material used in Mughal water structures."
    },
    {
        "id": "local_pit_sand",
        "name": "Local pit sand, sieved (0.1–1.5 mm)",
        "category": "Local Mineral Aggregate",
        "color": "#CA8A04",
        "percentage": 35.0,
        "function": "Readily accessible regional aggregate forming the dense physical bulk.",
        "cost_pkr_kg": 2.5,
        "notes": "Lowest cost skeleton component."
    },
    {
        "id": "crushed_limestone_fines",
        "name": "Crushed limestone rock flour (0.05–0.5 mm)",
        "category": "Mineral Filler",
        "color": "#E2E8F0",
        "percentage": 17.0,
        "function": "Quarry dust from aggregate crushers; stabilizes paste volume and increases spray density.",
        "cost_pkr_kg": 3.0,
        "notes": "Extremely economical byproduct."
    },
    {
        "id": "raw_gypsum_powder",
        "name": "Natural mineral gypsum (CaSO4·2H2O)",
        "category": "Mineral Setting Regulator & Sulfur Source",
        "color": "#F8FAFC",
        "percentage": 2.5,
        "function": "Natural mineral source of calcium and sulfur, regulates setting shrinkage.",
        "cost_pkr_kg": 6.0,
        "notes": "Mined locally in Salt Range of Pakistan."
    },
    {
        "id": "bentonite_clay",
        "name": "Natural calcium bentonite clay",
        "category": "Mineral Water Absorber & Anti-sag",
        "color": "#A16207",
        "percentage": 1.8,
        "function": "Smectite swelling clay; provides natural thixotropy, prevents slurry segregation, retains moisture.",
        "cost_pkr_kg": 15.0,
        "notes": "100% mineral alternative to expensive synthetic SAP and HPMC."
    },
    {
        "id": "chopped_wheat_straw",
        "name": "Finely chopped wheat straw (Toori, 2–5 mm)",
        "category": "Indigenous Agricultural Fibre",
        "color": "#EAB308",
        "percentage": 0.7,
        "function": "Traditional plaster fibre reinforcement; stops micro-cracking and wicks moisture.",
        "cost_pkr_kg": 12.0,
        "notes": "Zero-toxicity local agricultural straw."
    }
]

FORMULA_D_LAYER_2: List[Dict[str, Any]] = [
    {
        "id": "tubewell_softened_water",
        "name": "Decanted / filtered water",
        "category": "Carrier Medium",
        "unit": "L",
        "amount": 1.0,
        "cost_pkr_per_unit": 0.1,
        "function": "Local decanted water."
    },
    {
        "id": "food_grade_alginate_commercial",
        "name": "Standard industrial sodium alginate",
        "category": "Gelling Agent",
        "unit": "g/L",
        "amount": 8.0,
        "cost_pkr_per_unit": 1.8,
        "function": "Economic technical grade alginate."
    },
    {
        "id": "native_cornstarch_tackifier",
        "name": "Pre-gelatinized indigenous corn starch",
        "category": "Economical Tackifier",
        "unit": "g/L",
        "amount": 6.0,
        "cost_pkr_per_unit": 0.6,
        "function": "Low-cost local agricultural tackifier holding fragments on vertical surface."
    },
    {
        "id": "bulk_cultured_moss_fragments",
        "name": "Ground local nursery moss (Barbula & Funaria)",
        "category": "Biological Propagules",
        "unit": "g/L",
        "amount": 25.0,
        "cost_pkr_per_unit": 5.0,
        "function": "Economical propagule density yielding 37.5 g/m2."
    },
    {
        "id": "wild_collected_biocrust_powder",
        "name": "Dry-ground soil biocrust powder",
        "category": "Pioneer Inoculant",
        "unit": "g dry/L",
        "amount": 3.0,
        "cost_pkr_per_unit": 2.0,
        "function": "Low-cost native soil algae and cyanobacteria crust collected from arid soils."
    },
    {
        "id": "urea_dap_micro_fertilizer",
        "name": "Dilute urea + Diammonium phosphate (DAP)",
        "category": "Agricultural Fertilizer Micronutrients",
        "unit": "g/L",
        "amount": 0.08,
        "cost_pkr_per_unit": 0.1,
        "function": "Readily accessible commercial agricultural fertilizer at micro-dosages."
    },
    {
        "id": "commercial_vinegar_citrate_buffer",
        "name": "Acetic/citric acid buffer solution (to pH 6.0)",
        "category": "Buffer",
        "unit": "g/L",
        "amount": 1.0,
        "cost_pkr_per_unit": 0.3,
        "function": "Maintains fluid spray stability."
    }
]

# FORMULA E: SABZAAR ULTRA-LOW-COST DESI ECO-MATRIX (Target: PKR 24.62 / m² ~ PKR 25 / m²)
# Designed specifically for existing concrete walls using zero expensive chemicals and 100% regional Pakistani recycled materials
FORMULA_E_LAYER_1: List[Dict[str, Any]] = [
    {
        "id": "graded_ravi_river_sand",
        "name": "Graded Ravi / Chenab River Sand (0.2–1.2 mm)",
        "category": "Local Inert Skeleton",
        "color": "#D1D5DB",
        "percentage": 38.0,
        "function": "Inert fine aggregate providing volume stability and shrinkage prevention.",
        "cost_pkr_kg": 1.80,
        "notes": "Locally quarried river sand across Punjab/Sindh."
    },
    {
        "id": "recycled_crushed_surkhi",
        "name": "Recycled Brick Surkhi / Kiln Reject Dust (0.2–2 mm)",
        "category": "Construction Waste Pozzolan",
        "color": "#B45309",
        "percentage": 30.0,
        "function": "Porous ceramic water reservoir and micro-rough anchor for moss rhizoids.",
        "cost_pkr_kg": 1.20,
        "porosity_pct": 32.0,
        "notes": "Abundant demolition rubble and kiln rejects across Pakistan."
    },
    {
        "id": "recycled_marble_slurry_e",
        "name": "Waste Marble Sawing Slurry Powder (<63 µm)",
        "category": "Industrial Waste Micro-filler",
        "color": "#E5E7EB",
        "percentage": 16.0,
        "function": "Fine calcium carbonate filler improving spray slurry plasticity and adhesion to old concrete.",
        "cost_pkr_kg": 0.50,
        "notes": "Industrial waste slurry from Rawalpindi/KPK marble cutting mills."
    },
    {
        "id": "calcined_rice_husk_wood_ash",
        "name": "Calcined Rice Husk & Tandoor Wood Ash",
        "category": "Agricultural/Combustion Ash Pozzolan",
        "color": "#4B5563",
        "percentage": 10.0,
        "function": "Reactive amorphous bio-silica & potassium donor; consumes free lime.",
        "cost_pkr_kg": 0.30,
        "notes": "Village tandoor and rice mill husk ash."
    },
    {
        "id": "opc_activator_minimal",
        "name": "Portland Cement (OPC 42.5 activator)",
        "category": "Hydraulic Activator",
        "color": "#9CA3AF",
        "percentage": 4.0,
        "function": "Optimized 4% binder achieving permanent adhesion to existing concrete walls when activated by RHA.",
        "cost_pkr_kg": 28.0,
        "notes": "Kept strictly minimal to prevent surface alkalinity and lower cost."
    },
    {
        "id": "chopped_boosa_straw",
        "name": "Chopped Wheat / Rice Agricultural Straw (Boosa, 5–10 mm)",
        "category": "Agricultural Fiber Reinforcement",
        "color": "#F59E0B",
        "percentage": 1.0,
        "function": "Natural agricultural fiber preventing shrinkage cracking and creating capillary moisture veins.",
        "cost_pkr_kg": 10.0,
        "notes": "Widely available across Pakistani villages and cattle markets."
    },
    {
        "id": "cooked_starch_powder",
        "name": "Cooked Starch Binder Powder",
        "category": "Natural Bio-Polymer Binder",
        "color": "#FDE68A",
        "percentage": 1.0,
        "function": "Natural polysaccharide anti-sag binder replacing expensive synthetic HPMC.",
        "cost_pkr_kg": 25.0,
        "notes": "Boiled dried rice/corn starch flour."
    }
]

FORMULA_E_LAYER_2: List[Dict[str, Any]] = [
    {
        "id": "fermented_rice_starch_water",
        "name": "Fermented Leftover Rice/Potato Starch Water",
        "category": "Carrier Medium",
        "unit": "L",
        "amount": 0.82,
        "cost_pkr_per_unit": 0.0,
        "function": "Zero-cost natural starchy liquid carrier from boiling rice/potatoes."
    },
    {
        "id": "khatta_dahi_whey",
        "name": "Strained Sour Curd Whey (Khatta Dahi Paani)",
        "category": "Natural Lactic Acid Buffer & Tackifier",
        "unit": "L",
        "amount": 0.18,
        "cost_pkr_per_unit": 10.0,
        "function": "Natural lactic acid bacteria dropping surface pH to 5.5 and milk casein adhering moss."
    },
    {
        "id": "salvaged_urban_brick_moss_e",
        "name": "Salvaged Local Urban Wall Moss (Funaria, Barbula)",
        "category": "Biological Propagules",
        "unit": "g/L",
        "amount": 20.0,
        "cost_pkr_per_unit": 0.20,
        "function": "Wild heat-hardened bryophyte propagules scraped from local brick walls."
    },
    {
        "id": "natural_starch_thickener",
        "name": "Boiled Rice/Maize Starch Slurry Gel",
        "category": "Natural Bio-Gel Tackifier",
        "unit": "g/L",
        "amount": 5.0,
        "cost_pkr_per_unit": 0.08,
        "function": "Replaces sodium alginate with cooked starch viscosity."
    },
    {
        "id": "sifted_wood_ash_micronutrient",
        "name": "Sifted Wood Ash / Charcoal Leachate",
        "category": "Natural Trace Micronutrients",
        "unit": "g/L",
        "amount": 2.0,
        "cost_pkr_per_unit": 0.025,
        "function": "Natural potassium, calcium, and phosphorus trace nutrients."
    }
]

# FORMULA F: MIXED FOOD-WASTE BIOMASS FERMENT MATRIX (Target: PKR 50 / m²)
# Explores utilization of domestic/restaurant kitchen food residues (calcined ash in Layer 1 + fermented starchy wash in Layer 2)
FORMULA_F_LAYER_1: List[Dict[str, Any]] = [
    {
        "id": "graded_river_sand_f",
        "name": "Graded River Sand (0.2–1.2 mm)",
        "category": "Local Inert Skeleton",
        "color": "#D1D5DB",
        "percentage": 36.0,
        "function": "Inert framework preventing shrinkage.",
        "cost_pkr_kg": 2.0,
        "notes": "Local river sand."
    },
    {
        "id": "recycled_crushed_surkhi_f",
        "name": "Recycled Crushed Brick Surkhi (0.2–2 mm)",
        "category": "Demolition Waste Pozzolan",
        "color": "#B45309",
        "percentage": 26.0,
        "function": "Ceramic capillary water storage matrix.",
        "cost_pkr_kg": 3.5,
        "porosity_pct": 32.0,
        "notes": "Crushed brick rejects."
    },
    {
        "id": "recycled_marble_slurry_f",
        "name": "Recycled Marble Cutting Slurry (<63 µm)",
        "category": "Industrial Waste Micro-filler",
        "color": "#E5E7EB",
        "percentage": 18.0,
        "function": "Calcium carbonate fine filler.",
        "cost_pkr_kg": 1.5,
        "notes": "Marble sawing dust."
    },
    {
        "id": "calcined_food_waste_ash",
        "name": "Calcined Mixed Food-Waste Ash (Bone, Eggshell, Peel Char)",
        "category": "Recycled Food-Waste Bio-Mineral Pozzolan",
        "color": "#374151",
        "percentage": 10.0,
        "function": "Thermally converted mixed food waste: bio-calcite, phosphate, and bio-silica.",
        "cost_pkr_kg": 1.0,
        "notes": "Sun-dried and tandoor-calcined household kitchen scraps (zero chemical toxicity)."
    },
    {
        "id": "opc_activator_f",
        "name": "Portland Cement (OPC 42.5 activator)",
        "category": "Hydraulic Activator",
        "color": "#9CA3AF",
        "percentage": 6.0,
        "function": "Minimum chemical activator ensuring shear bond to existing concrete wall.",
        "cost_pkr_kg": 31.0,
        "notes": "Minimal 6% activator."
    },
    {
        "id": "spent_tea_coffee_grounds",
        "name": "Washed & Dried Spent Tea / Coffee Grounds",
        "category": "Organic Food-Waste Micro-Fibre",
        "color": "#78350F",
        "percentage": 2.5,
        "function": "Organic capillary drainage channels and mild lignin fiber reinforcement.",
        "cost_pkr_kg": 1.0,
        "notes": "Collected from tea stalls/cafes, rinsed and sun-dried."
    },
    {
        "id": "cooked_starch_thickener_f",
        "name": "Cooked Waste Starch Powder",
        "category": "Natural Bio-Binder",
        "color": "#FDE68A",
        "percentage": 1.5,
        "function": "Plasticity enhancer and anti-sag agent.",
        "cost_pkr_kg": 45.0,
        "notes": "Leftover dried boiled rice starch."
    }
]

FORMULA_F_LAYER_2: List[Dict[str, Any]] = [
    {
        "id": "fermented_kitchen_starch_leachate",
        "name": "Strained Boiled Kitchen Scrap Leachate (Potato/Rice/Lentil Water)",
        "category": "Carrier Medium",
        "unit": "L",
        "amount": 0.8,
        "cost_pkr_per_unit": 0.0,
        "function": "Strained liquid from boiling leftover starchy food waste."
    },
    {
        "id": "sour_milk_curd_whey_f",
        "name": "Sour Milk / Curd Whey Ferment (Lactic Wash)",
        "category": "Natural Lactic Acid Buffer & Bio-Gel Tackifier",
        "unit": "L",
        "amount": 0.2,
        "cost_pkr_per_unit": 8.0,
        "function": "Lactic acid drops surface concrete alkalinity and milk proteins adhere moss."
    },
    {
        "id": "salvaged_urban_brick_moss_f",
        "name": "Salvaged Wild Brick Moss (Funaria hygrometrica)",
        "category": "Biological Propagules",
        "unit": "g/L",
        "amount": 25.0,
        "cost_pkr_per_unit": 0.44,
        "function": "Local heat-adapted bryophyte propagules."
    },
    {
        "id": "micro_milled_eggshell_powder_f",
        "name": "Micro-milled Eggshell Powder",
        "category": "Recycled Bio-Calcite Inoculant Matrix",
        "unit": "g/L",
        "amount": 5.0,
        "cost_pkr_per_unit": 0.10,
        "function": "Bio-calcite nucleus promoting microbial crust formation."
    },
    {
        "id": "vegetable_scrap_compost_tea",
        "name": "Aerated Kitchen Peelings Compost Tea",
        "category": "Natural Micronutrients",
        "unit": "g/L",
        "amount": 2.0,
        "cost_pkr_per_unit": 0.25,
        "function": "Mild organic trace minerals from vegetable scrap steep."
    }
]

# FORMULA G: CANDIDATE 1 (RAWALPINDI WATER-ONLY DIRECT-TO-CONCRETE)
FORMULA_G_LAYER_1: List[Dict[str, Any]] = [
    {
        "id": "existing_weathered_concrete_g",
        "name": "Existing Weathered Concrete Substrate (M20/M25 Sound Surface)",
        "category": "In-situ Concrete Matrix",
        "color": "#94A3B8",
        "percentage": 100.0,
        "function": "Existing rough carbonated concrete wall (pH 8.2–8.7); eliminates new mineral render coat entirely.",
        "cost_pkr_kg": 0.0,
        "porosity_pct": 8.0,
        "ph_initial": 8.5,
        "notes": "Direct-to-concrete system: zero new cementitious plaster applied."
    }
]

FORMULA_G_LAYER_2: List[Dict[str, Any]] = [
    {
        "id": "water_carrier_only",
        "name": "Clean Tap/Rain Water (Carrier)",
        "category": "Liquid Carrier",
        "unit": "L",
        "amount": 1.0,
        "cost_pkr_per_unit": 0.05,
        "function": "Hydraulic dispersant for moss fragments."
    },
    {
        "id": "traceable_local_moss_g",
        "name": "Fresh Traceable Local Wall Moss (Blotted Fresh Weight)",
        "category": "Living Bryophyte Tissue",
        "unit": "g/L",
        "amount": 20.0,
        "cost_pkr_per_unit": 2.25,
        "function": "Local acclimatized vegetative propagules."
    }
]

# FORMULA H: CANDIDATE 2 (RAWALPINDI SINGLE-STARCH DIRECT-TO-CONCRETE)
FORMULA_H_LAYER_1: List[Dict[str, Any]] = [
    {
        "id": "existing_weathered_concrete_h",
        "name": "Existing Weathered Concrete Substrate (M20/M25 Sound Surface)",
        "category": "In-situ Concrete Matrix",
        "color": "#94A3B8",
        "percentage": 100.0,
        "function": "Existing rough carbonated concrete wall (pH 8.2–8.7); eliminates new mineral render coat entirely.",
        "cost_pkr_kg": 0.0,
        "porosity_pct": 8.0,
        "ph_initial": 8.5,
        "notes": "Direct-to-concrete system: zero new cementitious plaster applied."
    }
]

FORMULA_H_LAYER_2: List[Dict[str, Any]] = [
    {
        "id": "water_carrier_h",
        "name": "Clean Water (Cooked Gel Carrier)",
        "category": "Liquid Carrier",
        "unit": "L",
        "amount": 1.0,
        "cost_pkr_per_unit": 0.05,
        "function": "Hydraulic carrier with cooked starch."
    },
    {
        "id": "plain_rice_starch_tackifier",
        "name": "Cooked Plain Rice Starch (Dry-mass basis)",
        "category": "Temporary Vertical Tackifier",
        "unit": "g/L",
        "amount": 5.0,
        "cost_pkr_per_unit": 0.16,
        "function": "Temporary amylose/amylopectin adhesion gel for vertical retention until rhizoid attachment."
    },
    {
        "id": "traceable_local_moss_h",
        "name": "Fresh Traceable Local Wall Moss (Blotted Fresh Weight)",
        "category": "Living Bryophyte Tissue",
        "unit": "g/L",
        "amount": 20.0,
        "cost_pkr_per_unit": 2.25,
        "function": "Local acclimatized vegetative propagules."
    }
]

ALL_FORMULA_CATEGORIES: Dict[str, Dict[str, Any]] = {
    "FORMULA_A": FORMULA_A_DOCUMENTATION,
    "FORMULA_B": {
        "code": "FORMULA-B",
        "name": "Ideal Performance Formula (MPC Low-Alkali & Expanded Glass)",
        "status": "DISCOVERY_CANDIDATE",
        "category": "Ideal Technical Performance",
        "description": "Neutral pH Magnesium Phosphate Cement matrix with high porosity expanded glass and osmoprotectant bio-gel. Eliminates the 21-day wait.",
        "layer_1": {
            "name": "MPC Neutral Porous Coat",
            "ingredients": FORMULA_B_LAYER_1,
            "mass_balance_sum_pct": sum(item["percentage"] for item in FORMULA_B_LAYER_1),
            "estimated_initial_ph": 8.0,
            "wait_days_to_spray": 3
        },
        "layer_2": {
            "name": "Osmoprotected High-M/G Bio-Gel",
            "ingredients": FORMULA_B_LAYER_2,
            "spray_rate_l_m2": 1.5,
            "moss_density_g_m2": 52.5
        }
    },
    "FORMULA_C": {
        "code": "FORMULA-C",
        "name": "Recyclable-Material Formula (Circular Slag, Ash & Demolition Waste)",
        "status": "DISCOVERY_CANDIDATE",
        "category": "Recycled & Circular Economy",
        "description": "Utilizes blast-furnace slag (GGBS), rice husk ash (RHA), crushed brick demolition rubble, and pectin waste, reducing embodied carbon by 72%.",
        "layer_1": {
            "name": "Circular Pozzolanic Receptor Coat",
            "ingredients": FORMULA_C_LAYER_1,
            "mass_balance_sum_pct": sum(item["percentage"] for item in FORMULA_C_LAYER_1),
            "estimated_initial_ph": 11.2,
            "wait_days_to_spray": 14
        },
        "layer_2": {
            "name": "Citrus Pectin & Salvaged Biocrust Gel",
            "ingredients": FORMULA_C_LAYER_2,
            "spray_rate_l_m2": 1.5,
            "moss_density_g_m2": 45.0
        }
    },
    "FORMULA_D": {
        "code": "FORMULA-D",
        "name": "Mineral-Based / Cost-Optimized Formula (Lime-Surkhi Heritage System)",
        "status": "DISCOVERY_CANDIDATE",
        "category": "Mineral-Based & Cost-Optimized",
        "description": "Traditional subcontinental lime-surkhi-gypsum hydraulic matrix with bentonite clay, reducing material cost by >55%.",
        "layer_1": {
            "name": "Lime-Surkhi Mineral Receptor Coat",
            "ingredients": FORMULA_D_LAYER_1,
            "mass_balance_sum_pct": sum(item["percentage"] for item in FORMULA_D_LAYER_1),
            "estimated_initial_ph": 11.8,
            "wait_days_to_spray": 18
        },
        "layer_2": {
            "name": "Starch-Alginate Economical Gel",
            "ingredients": FORMULA_D_LAYER_2,
            "spray_rate_l_m2": 1.5,
            "moss_density_g_m2": 37.5
        }
    },
    "FORMULA_E": {
        "code": "FORMULA-E",
        "name": "Sabzaar Desi Eco-Matrix (Target: PKR 25 / m² — 100% Dual Spray Form)",
        "status": "DISCOVERY_CANDIDATE",
        "category": "Ultra-Low-Cost Recycled Desi Matrix (Dual Spray)",
        "description": "Engineered specifically for existing concrete walls using 100% regional Pakistani recycled materials applied entirely in SPRAY FORM (Layer 1 Pneumatic Mineral Spray Slurry + Layer 2 Living Bio-Gel Liquid Spray). Zero dry powder application, zero manual troweling.",
        "layer_1": {
            "name": "Pneumatic Bioreceptive Mineral Spray Slurry (Wet Slurry Form)",
            "form": "Pneumatic Wet Spray Slurry",
            "application_method": "4-hole pneumatic mortar hopper spray gun (4–6 bar)",
            "nominal_thickness_mm": 5.5,
            "wet_spray_slurry_rate_l_m2": 8.7,
            "ingredients": FORMULA_E_LAYER_1,
            "mass_balance_sum_pct": sum(item["percentage"] for item in FORMULA_E_LAYER_1),
            "estimated_initial_ph": 11.0,
            "wait_days_to_spray": 7
        },
        "layer_2": {
            "name": "Fermented Starch-Whey Living Moss Bio-Gel Spray (Liquid Form)",
            "form": "Living Bio-Gel Liquid Spray",
            "application_method": "Wide-orifice pressure compression spray gun (4–6 mm tip)",
            "ingredients": FORMULA_E_LAYER_2,
            "spray_rate_l_m2": 1.0,
            "moss_density_g_m2": 20.0
        }
    },
    "FORMULA_F": {
        "code": "FORMULA-F",
        "name": "Mixed Food-Waste Biomass Ferment Matrix",
        "status": "DISCOVERY_CANDIDATE",
        "category": "Food Waste Circular Bio-System",
        "description": "Utilizes calcined mixed kitchen food-waste ash (bone, eggshell, peel char) and dried spent tea grounds in Layer 1, paired with fermented starchy leachate and sour milk whey in Layer 2. Cost: ~PKR 50 / m².",
        "layer_1": {
            "name": "Food-Waste Ash Bioreceptive Coat",
            "ingredients": FORMULA_F_LAYER_1,
            "mass_balance_sum_pct": sum(item["percentage"] for item in FORMULA_F_LAYER_1),
            "estimated_initial_ph": 10.8,
            "wait_days_to_spray": 8
        },
        "layer_2": {
            "name": "Fermented Kitchen Scrap Bio-Broth Spray",
            "ingredients": FORMULA_F_LAYER_2,
            "spray_rate_l_m2": 1.2,
            "moss_density_g_m2": 30.0
        }
    },
    "FORMULA_G": {
        "code": "FORMULA-G",
        "name": "Candidate 1: Water-Only Direct-to-Concrete (Rawalpindi Brief)",
        "status": "DISCOVERY_CANDIDATE",
        "category": "Direct-to-Concrete Minimal Coating",
        "description": "Zero new mineral render. 100 mL clean water + 2 g fresh traceable local moss per 0.10 m² (1.0 L/m² + 20.0 g/m²). Direct onto sound weathered concrete.",
        "layer_1": {
            "name": "Existing Weathered Concrete Substrate (M20/M25)",
            "form": "Weathered Concrete Wall (Unrendered)",
            "application_method": "Pre-wetting only (Zero mortar application)",
            "nominal_thickness_mm": 0.0,
            "wet_spray_slurry_rate_l_m2": 0.0,
            "ingredients": FORMULA_G_LAYER_1,
            "mass_balance_sum_pct": sum(item["percentage"] for item in FORMULA_G_LAYER_1),
            "estimated_initial_ph": 8.5,
            "wait_days_to_spray": 0
        },
        "layer_2": {
            "name": "Water-Only Moss Fragment Suspension",
            "form": "Aqueous Suspension Spray",
            "application_method": "Single-pass low-pressure spray / manual wash",
            "ingredients": FORMULA_G_LAYER_2,
            "spray_rate_l_m2": 1.0,
            "moss_density_g_m2": 20.0
        }
    },
    "FORMULA_H": {
        "code": "FORMULA-H",
        "name": "Candidate 2: Single-Starch Direct-to-Concrete (Rawalpindi Brief)",
        "status": "DISCOVERY_CANDIDATE",
        "category": "Direct-to-Concrete Minimal Coating",
        "description": "Zero new mineral render. 100 mL water + 0.5 g cooked rice starch + 2 g fresh moss per 0.10 m² (1.0 L/m² + 5.0 g/m² starch + 20.0 g/m² moss). Starch serves solely for initial vertical face retention.",
        "layer_1": {
            "name": "Existing Weathered Concrete Substrate (M20/M25)",
            "form": "Weathered Concrete Wall (Unrendered)",
            "application_method": "Pre-wetting only (Zero mortar application)",
            "nominal_thickness_mm": 0.0,
            "wet_spray_slurry_rate_l_m2": 0.0,
            "ingredients": FORMULA_H_LAYER_1,
            "mass_balance_sum_pct": sum(item["percentage"] for item in FORMULA_H_LAYER_1),
            "estimated_initial_ph": 8.5,
            "wait_days_to_spray": 0
        },
        "layer_2": {
            "name": "Single-Starch Moss Carrier Spray",
            "form": "Cooked Starch Moss Slurry Spray",
            "application_method": "Wide-orifice spray (4–6 mm tip) or manual brush coat",
            "ingredients": FORMULA_H_LAYER_2,
            "spray_rate_l_m2": 1.0,
            "moss_density_g_m2": 20.0
        }
    }
}

