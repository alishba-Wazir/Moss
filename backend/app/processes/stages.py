"""
Session 2: Comprehensive 14-Stage Manufacturing and Application Process System
Covers all 14 stages across 3 Alternative Workflows:
1. Workflow A: In-Situ Pneumatic Shotcrete (High speed, machine-driven, standard baseline)
2. Workflow B: Artisan Low-Tech Manual Trowel & Texturing (Low capex, accessible equipment)
3. Workflow C: Factory Precast Bioreceptive Panel System (Highest quality control, accelerated curing)
"""

from typing import Dict, Any, List

PROCESS_STAGES_METADATA = [
    {
        "stage_id": 1,
        "name": "Raw Material Sourcing",
        "description": "Procurement of binders (OPC, MPC, lime, slag), porous aggregates (brick, pumice, glass), fibres, and biological strains.",
        "key_concerns": ["Quality consistency", "Moisture in raw sand", "Heavy metal contamination in fly ash/slag", "Moss nursery permits"]
    },
    {
        "stage_id": 2,
        "name": "Material Cleaning and Preparation",
        "description": "Washing aggregates to eliminate silt and organic impurities; drying aggregates to <0.5% moisture.",
        "key_concerns": ["Washing water recycling", "Silt content <1%", "Effluent salinity"]
    },
    {
        "stage_id": 3,
        "name": "Crushing, Grinding and Particle Sizing",
        "description": "Jaw crushing and hammer milling of burnt brick, pumice, and glass into 0.1–2.0 mm target fractions.",
        "key_concerns": ["Crystalline silica dust (PPE requirement)", "Sieve grading curve", "Energy consumption"]
    },
    {
        "stage_id": 4,
        "name": "Layer 1 Dry Premixing",
        "description": "Homogeneous blending of mineral binders, fillers, aggregates, and dry powder additives (fibres, SAP, HPMC).",
        "key_concerns": ["Fibre clumping/balling", "Batch coefficient of variation <5%", "Moisture protection"]
    },
    {
        "stage_id": 5,
        "name": "Layer 1 Packaging & Logistics",
        "description": "Automated valve bagging into 25 kg moisture-barrier multi-wall craft paper bags.",
        "key_concerns": ["Shelf life in monsoon humidity", "Palletization", "Transport shock"]
    },
    {
        "stage_id": 6,
        "name": "Wall Surface Preparation",
        "description": "High-pressure water jet washing (150–200 bar), stripping paint, grease, and friable laitance; repair of cracks.",
        "key_concerns": ["Substrate tensile strength >=0.8 MPa", "Saturated surface dry (SSD) condition", "Wastewater runoff"]
    },
    {
        "stage_id": 7,
        "name": "Layer 1 Application",
        "description": "Spraying or applying the mineral slurry to 8 mm nominal thickness in 2 passes.",
        "key_concerns": ["Rebound waste (10-20%)", "Nozzle distance and angle", "Nozzle clogging", "Sagging"]
    },
    {
        "stage_id": 8,
        "name": "Curing and Conditioning",
        "description": "Moisture curing (days 1-3) followed by natural or accelerated carbonation to reduce surface pH from 12.5 to <9.0.",
        "key_concerns": ["Plastic shrinkage cracking", "Alkaline leaching", "Curing duration (21 days for OPC vs 3 days for MPC)"]
    },
    {
        "stage_id": 9,
        "name": "Moss Fragment Preparation",
        "description": "Harvesting outdoor acclimatized moss, drying at <35°C, and knife-milling to 0.5–2.0 mm propagule fractions.",
        "key_concerns": ["Thermal cell mortality (>40°C)", "Apical stem viability", "Particle size control"]
    },
    {
        "stage_id": 10,
        "name": "Biological Carrier Preparation",
        "description": "Dissolving sodium alginate and psyllium husk in soft/demineralized water with citrate buffer (pH 6.0).",
        "key_concerns": ["Lump formation (fish eyes)", "Water hardness (<50 ppm TDS)", "Viscosity stability"]
    },
    {
        "stage_id": 11,
        "name": "Layer 2 Low-Shear Inoculum Mixing",
        "description": "Gently suspending moss fragments and cyanobacteria culture into the prepared bio-gel without damaging cells.",
        "key_concerns": ["High-shear cell lysis", "Suspension settling time", "Maximum tank dwell time (<4 hours)"]
    },
    {
        "stage_id": 12,
        "name": "Layer 2 Spraying / Inoculation",
        "description": "Aerosolized low-pressure spraying (1.5 L/m2) using peristaltic or diaphragm pump with wide orifice nozzle.",
        "key_concerns": ["Propagule shear damage in pump", "Overspray drift", "Even distribution of 45 g/m2 moss"]
    },
    {
        "stage_id": 13,
        "name": "Layer Interface Contact Crosslinking",
        "description": "Diffusion of Ca2+ from mineral substrate into alginate layer, crosslinking into calcium alginate hydrogel in 2–5 min.",
        "key_concerns": ["Substrate free calcium availability", "Washout from premature rainfall", "Interfacial shear bond"]
    },
    {
        "stage_id": 14,
        "name": "Quality Control & 12-Week Maintenance",
        "description": "Installation of 60% shade netting, automated daily misting (approx 80 L/m2 total), and monthly biological cover monitoring.",
        "key_concerns": ["Water supply reliability", "Mould/algal bloom control", "Wind desiccation during heat waves"]
    }
]

ALTERNATIVE_WORKFLOWS: Dict[str, Dict[str, Any]] = {
    "workflow_1_shotcrete": {
        "id": "workflow_1_shotcrete",
        "name": "Workflow 1: Continuous Pneumatic Shotcrete & Diaphragm Spray",
        "type": "Mechanized In-Situ",
        "applicability": "Large-scale infrastructure (metro viaducts, civil acoustic retaining walls, bridges)",
        "machinery_and_tools": [
            "Worm-pump continuous mortar sprayer (e.g. Putzmeister MP25 / PFT G4, 400V / 5.5 kW)",
            "Screw air compressor (350 L/min at 6 bar)",
            "High-pressure pressure washer (200 bar, Honda GX390)",
            "Double-diaphragm air pump (ARO 1-inch) with wide texture spray gun for Layer 2",
            "Continuous horizontal ribbon dry-batch mixer"
        ],
        "labour_requirement": "Crew of 4 (1 master sprayer, 1 mixer operator, 2 helper/scaffolding)",
        "processing_time": "100–120 m² per 8-hour shift for Layer 1; 200 m² per shift for Layer 2",
        "water_consumption_per_m2_liters": 42.0, # surface wash + mixing + Layer 2
        "energy_kwh_per_m2": 2.4,
        "estimated_cost_pkr_m2": 450.0, # labor and machine amortization only
        "safety_requirements": [
            "Full face shield & N95/FFP2 dust mask for alkaline cement dust",
            "High-pressure hose safety whips",
            "Double lanyard harnesses for elevated viaduct platforms"
        ],
        "advantages": [
            "High daily productivity (>100 m2/day)",
            "Excellent dynamic compaction and substrate mechanical bond (pull-off >=1.0 MPa)",
            "Uniform layer thickness control without mechanical troweling that closes pores"
        ],
        "disadvantages": [
            "Requires 3-phase electric power or high-capacity diesel generator",
            "Rebound waste (12–18%) requires ground cleanup and disposal",
            "Nozzle operator skill critical to prevent uneven surface ripples"
        ],
        "failure_modes_and_mitigation": [
            {"failure": "Nozzle hose blockage", "cause": "Premature stiffening or aggregate oversize >2.5mm", "mitigation": "Strict sieve control and maximum 20m hose length"},
            {"failure": "Alginate gel blowout/run-down", "cause": "Excess spray pressure atomizing fragments", "mitigation": "Low pressure diaphragm pump (<2.5 bar) with 6mm tip"}
        ]
    },
    "workflow_2_manual": {
        "id": "workflow_2_manual",
        "name": "Workflow 2: Low-Tech Manual Trowel & Texturing with Gravity Hopper Spray",
        "type": "Manual Artisan",
        "applicability": "Residential gardens, school walls, remote sites without 3-phase power",
        "machinery_and_tools": [
            "Standard portable electric/petrol drum concrete mixer (180 L)",
            "Notched and sponge plaster trowels, wire scratchers",
            "Gravity hopper pneumatic plaster spray gun (air-powered, 2 hp portable compressor)",
            "Backpack knapsack sprayer with flood jet nozzle for Layer 2"
        ],
        "labour_requirement": "Crew of 3 (2 skilled masons, 1 labourer)",
        "processing_time": "25–35 m² per 8-hour shift",
        "water_consumption_per_m2_liters": 35.0,
        "energy_kwh_per_m2": 0.8,
        "estimated_cost_pkr_m2": 320.0,
        "safety_requirements": [
            "Nitrile chemical-resistant gloves",
            "Safety goggles",
            "Basic dust masks"
        ],
        "advantages": [
            "Extremely low machinery capital investment (<$600 total gear)",
            "Zero rebound waste (troweled material directly placed on wall)",
            "Can be executed in tight alleyways or indoors"
        ],
        "disadvantages": [
            "Masons naturally tend to smooth/polish the surface, which seals bioreceptive macro-pores",
            "Lower daily output (under 35 m2/day)",
            "Risk of inconsistent thickness (5 mm in dips, 12 mm on crests)"
        ],
        "failure_modes_and_mitigation": [
            {"failure": "Pore sealing from trowel smoothing", "cause": "Mason polishing finish coat", "mitigation": "Mandatory wire-brush scarification 20 minutes after placement to expose aggregates"},
            {"failure": "Weak substrate bond", "cause": "Dry substrate drawing water from thin coat", "mitigation": "Pre-wetting substrate to SSD state and slurry bond coat"}
        ]
    },
    "workflow_3_precast": {
        "id": "workflow_3_precast",
        "name": "Workflow 3: Off-Site Precast Bioreceptive Panel System with Controlled Chamber Curing",
        "type": "Factory Precast",
        "applicability": "Architectural facades, commercial modular developments, retrofits",
        "machinery_and_tools": [
            "Planetary pan mixer with electronic moisture probe",
            "Automated vibration casting tables (600x600 mm or 1000x500 mm steel moulds)",
            "CO2 accelerated carbonation curing chamber (40°C, 65% RH, 5% CO2)",
            "Automated multi-axis CNC bio-gel spray gantry",
            "Climate-controlled nursery greenhouse for initial 4-week pre-greening"
        ],
        "labour_requirement": "Factory technicians (2) + on-site panel installers (2)",
        "processing_time": "Factory: 250 m²/day capacity; Installation: 60 m²/day hanging on rail anchors",
        "water_consumption_per_m2_liters": 28.0, # closed loop water recycling
        "energy_kwh_per_m2": 4.8,
        "estimated_cost_pkr_m2": 950.0, # including stainless anchor clips and factory overhead
        "safety_requirements": [
            "Factory ISO 45001 safety standard",
            "CO2 sensor monitoring in curing chamber",
            "Overhead crane rigging safety"
        ],
        "advantages": [
            "Highest scientific quality control (exact thickness, zero field weather risks)",
            "Surface pH drops to 8.5 within 48 hours via accelerated CO2 chamber curing",
            "Panels arrive on site already pre-greened with 40% moss cover",
            "Non-destructive mounting on stainless subframe protects structural building facade"
        ],
        "disadvantages": [
            "High initial factory capital expenditure",
            "Transportation logistics and potential panel edge breakage",
            "Subframe rail hardware adds significant structural weight and cost"
        ],
        "failure_modes_and_mitigation": [
            {"failure": "Transport panel cracking", "cause": "Flexural tensile stress during transit", "mitigation": "Alkali-resistant glass fibre mesh embedded in back face"},
            {"failure": "Transplant shock on site", "cause": "Abrupt transition from greenhouse to harsh urban sun", "mitigation": "2-week nursery hardening protocol before delivery"}
        ]
    }
}
