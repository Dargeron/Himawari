#!/usr/bin/env python3
"""Check the original handoff inventory before making edits."""
from pathlib import Path
import hashlib, json

ROOT = Path(__file__).resolve().parents[1]
inventory = json.loads((ROOT / 'HANDOFF-SHA256.json').read_text())
errors = []
for name, expected in inventory.items():
    path = ROOT / name
    if not path.is_file():
        errors.append('missing: ' + name)
        continue
    data = path.read_bytes()
    if len(data) != expected['bytes'] or hashlib.sha256(data).hexdigest() != expected['sha256']:
        errors.append('modified: ' + name)
if errors:
    raise SystemExit('\n'.join(errors))
print('Verified ' + str(len(inventory)) + ' handoff files. No bytes missing or modified.')
