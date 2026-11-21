import urllib.request
import json

endpoints = [
    ('GET', 'http://127.0.0.1:8000/api/overview', None),
    ('GET', 'http://127.0.0.1:8000/api/master-prompt', None),
    ('GET', 'http://127.0.0.1:8000/api/formulas', None),
    ('GET', 'http://127.0.0.1:8000/api/scenarios', None),
    ('GET', 'http://127.0.0.1:8000/api/processes/stages', None),
    ('GET', 'http://127.0.0.1:8000/api/processes/workflows', None),
    ('GET', 'http://127.0.0.1:8000/api/processes/compare?formula_category=FORMULA_E', None),
    ('GET', 'http://127.0.0.1:8000/api/agents', None),
    ('POST', 'http://127.0.0.1:8000/api/optimization/compare', json.dumps({"weights": None}).encode('utf-8')),
    ('GET', 'http://127.0.0.1:8000/api/reports/final-deliverable', None),
    ('GET', 'http://127.0.0.1:8000/api/weather/locations', None),
    ('GET', 'http://127.0.0.1:8000/api/gemini/status', None)
]

all_passed = True
for method, url, data in endpoints:
    try:
        headers = {'Content-Type': 'application/json'} if data else {}
        req = urllib.request.Request(url, method=method, headers=headers, data=data)
        with urllib.request.urlopen(req) as resp:
            data_resp = json.loads(resp.read().decode())
            summary = list(data_resp.keys()) if isinstance(data_resp, dict) else f"{len(data_resp)} items"
            print(f"[PASS] {resp.status} {method} {url} -> {summary}")
    except Exception as e:
        print(f"[FAIL] {method} {url} -> {e}")
        all_passed = False

if all_passed:
    print("\nALL 12 ENDPOINTS PASSED WITH HTTP 200 OK!")
else:
    print("\nSOME ENDPOINTS FAILED!")
