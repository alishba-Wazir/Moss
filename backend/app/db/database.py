"""
SQLite Database Layer for Sabzaar Moss Wall Research Laboratory
Provides persistent storage for formulas, versions, simulations, agent logs, and processes.
"""

import sqlite3
import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from ..config import settings
from ..formulas.discovery import ALL_FORMULA_CATEGORIES

DB_FILE = settings.DATABASE_PATH

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes schema and seeds baseline formula if not present."""
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    conn = get_connection()
    c = conn.cursor()
    
    # 1. Formulas table
    c.execute("""
    CREATE TABLE IF NOT EXISTS formulas (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        is_baseline_locked BOOLEAN NOT NULL DEFAULT 0,
        version INTEGER NOT NULL DEFAULT 1,
        parent_id TEXT,
        data_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # 2. Formula Versions History
    c.execute("""
    CREATE TABLE IF NOT EXISTS formula_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        formula_id TEXT NOT NULL,
        version INTEGER NOT NULL,
        notes TEXT,
        data_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(formula_id) REFERENCES formulas(id)
    )
    """)
    
    # 3. Simulations Table
    c.execute("""
    CREATE TABLE IF NOT EXISTS simulations (
        id TEXT PRIMARY KEY,
        formula_id TEXT NOT NULL,
        scenario_id TEXT NOT NULL,
        duration_hours INTEGER NOT NULL,
        results_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(formula_id) REFERENCES formulas(id)
    )
    """)
    
    # 4. Agent Reports & Cycles Table
    c.execute("""
    CREATE TABLE IF NOT EXISTS agent_cycles (
        id TEXT PRIMARY KEY,
        formula_category TEXT NOT NULL,
        consensus_score REAL,
        summary_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # 5. Process Evaluations Table
    c.execute("""
    CREATE TABLE IF NOT EXISTS process_evaluations (
        id TEXT PRIMARY KEY,
        workflow_id TEXT NOT NULL,
        formula_category TEXT NOT NULL,
        results_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    conn.commit()
    
    # Seed or synchronize all formula categories
    for code, fdata in ALL_FORMULA_CATEGORIES.items():
        is_baseline = (code == "FORMULA_A")
        c.execute("SELECT id FROM formulas WHERE id = ? OR code = ?", (code.lower(), code))
        if not c.fetchone():
            c.execute("""
            INSERT INTO formulas (id, code, name, category, status, is_baseline_locked, version, data_json)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?)
            """, (
                code.lower(),
                code,
                fdata["name"],
                fdata.get("category", "Uncategorized"),
                fdata.get("status", "ACTIVE"),
                1 if is_baseline else 0,
                json.dumps(fdata)
            ))
            # Also record version 1
            c.execute("""
            INSERT INTO formula_versions (formula_id, version, notes, data_json)
            VALUES (?, 1, 'Initial seeded formulation', ?)
            """, (code.lower(), json.dumps(fdata)))
        elif not is_baseline:
            c.execute("""
            UPDATE formulas 
            SET name = ?, category = ?, status = ?, data_json = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ? OR code = ?
            """, (fdata["name"], fdata.get("category", "Uncategorized"), fdata.get("status", "ACTIVE"), json.dumps(fdata), code.lower(), code))
        
    conn.commit()
    conn.close()

# Database helper functions
def get_all_formulas() -> List[Dict[str, Any]]:
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT id, code, name, category, status, is_baseline_locked, version, updated_at FROM formulas ORDER BY code ASC")
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return rows

def get_formula_by_id(formula_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM formulas WHERE id = ? OR code = ?", (formula_id, formula_id))
    row = c.fetchone()
    conn.close()
    if not row:
        return None
    res = dict(row)
    res["data"] = json.loads(res["data_json"])
    return res

def save_formula_version(formula_id: str, updated_data: Dict[str, Any], notes: str = "") -> Dict[str, Any]:
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM formulas WHERE id = ?", (formula_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        raise ValueError(f"Formula '{formula_id}' not found.")
    
    if row["is_baseline_locked"]:
        conn.close()
        raise ValueError("Cannot edit immutable baseline Formula A! Please clone it into a custom formula to make edits.")
        
    new_version = row["version"] + 1
    c.execute("""
    UPDATE formulas 
    SET version = ?, data_json = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    """, (new_version, json.dumps(updated_data), formula_id))
    
    c.execute("""
    INSERT INTO formula_versions (formula_id, version, notes, data_json)
    VALUES (?, ?, ?, ?)
    """, (formula_id, new_version, notes or f"Updated to version {new_version}", json.dumps(updated_data)))
    
    conn.commit()
    conn.close()
    return {"status": "SUCCESS", "formula_id": formula_id, "new_version": new_version}

def get_formula_history(formula_id: str) -> List[Dict[str, Any]]:
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT version, notes, created_at FROM formula_versions WHERE formula_id = ? ORDER BY version DESC", (formula_id,))
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return rows

def save_simulation_run(sim_id: str, formula_id: str, scenario_id: str, duration: int, results: Dict[str, Any]):
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
    INSERT OR REPLACE INTO simulations (id, formula_id, scenario_id, duration_hours, results_json)
    VALUES (?, ?, ?, ?, ?)
    """, (sim_id, formula_id, scenario_id, duration, json.dumps(results)))
    conn.commit()
    conn.close()

def get_simulations_history(limit: int = 20) -> List[Dict[str, Any]]:
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT id, formula_id, scenario_id, duration_hours, created_at FROM simulations ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return rows

def get_simulation_detail(sim_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM simulations WHERE id = ?", (sim_id,))
    row = c.fetchone()
    conn.close()
    if not row:
        return None
    res = dict(row)
    res["results"] = json.loads(res["results_json"])
    return res
