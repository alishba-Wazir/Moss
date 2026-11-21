"""
Scientific Provenance & Integrity Framework for Sabzaar Living Walls
Classifies every input, intermediate calculation, and output parameter strictly into:
- MEASURED: Directly observed in physical laboratory test (requires lab metadata)
- LITERATURE_DERIVED: Sourced from peer-reviewed journals, patents, or building codes with citations
- ESTIMATED: Derived from established physical laws and constitutive equations
- ASSUMED: Working engineering assumption requiring sensitivity analysis
- UNKNOWN: Parameter not yet established or lacking empirical basis

Zero fabrication policy: Never presents estimates as measured laboratory facts.
"""

from enum import Enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class ProvenanceType(str, Enum):
    MEASURED = "MEASURED"
    LITERATURE_DERIVED = "LITERATURE_DERIVED"
    ESTIMATED = "ESTIMATED"
    ASSUMED = "ASSUMED"
    UNKNOWN = "UNKNOWN"

class ProvenancedValue(BaseModel):
    name: str
    value: Any
    unit: str
    provenance: ProvenanceType
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence score 0.0 to 1.0")
    source_citation: Optional[str] = None
    calculation_method: Optional[str] = None
    limitations: Optional[str] = None
    sensitivity_impact: Optional[str] = None

def make_provenanced(
    name: str,
    value: Any,
    unit: str,
    provenance: ProvenanceType,
    confidence: float,
    source_citation: Optional[str] = None,
    calculation_method: Optional[str] = None,
    limitations: Optional[str] = None,
    sensitivity_impact: Optional[str] = None
) -> Dict[str, Any]:
    """Helper to generate standardized dictionary representation of a provenanced parameter."""
    return {
        "name": name,
        "value": value,
        "unit": unit,
        "provenance": provenance.value if isinstance(provenance, ProvenanceType) else provenance,
        "confidence": round(confidence, 3),
        "source_citation": source_citation or "Internal physical formulation",
        "calculation_method": calculation_method or "Direct constitutive formulation",
        "limitations": limitations or "Subject to raw material batch variation",
        "sensitivity_impact": sensitivity_impact or "Moderate impact on system outcome"
    }
