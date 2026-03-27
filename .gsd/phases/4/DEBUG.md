---
status: resolved
trigger: "Supabase connection fails with DNS error: could not translate host name"
created: 2026-03-10T20:39:05
updated: 2026-03-10T21:07:00
---

# DEBUG: Supabase Connection Failure

## Symptoms
- **Expected:** Backend connects to Supabase PostgreSQL on startup
- **Actual:** `psycopg2.OperationalError: could not translate host name "db.vbvidlmrsjrmnxdhclsa.supabase.co"`
- **Errors:** DNS resolution failure, server crash on import of `database.py`

## Hypotheses

### H1: Incorrect hostname in `.env` ✗ ELIMINATED
- **Evidence:** `.env` contains `db.vbvidlmrsjrmnxdhclsa.supabase.co` — format looks valid for Supabase.
- **Disproved by:** DNS lookup also failed via `nslookup`, meaning the issue is at the network/DNS level, not a typo.

### H2: Network/DNS blocks Supabase ✓ ROOT CAUSE
- **Evidence:** `nslookup db.vbvidlmrsjrmnxdhclsa.supabase.co` returned `Query refused` from DNS server `202.41.64.251`.
- **Implication:** The user's network (likely a college/corporate network based on the `202.41.x.x` IP range) is blocking external DNS lookups to Supabase's domain.
- **Fix:** Use a different network (mobile hotspot) OR change DNS to Google (8.8.8.8) / Cloudflare (1.1.1.1).

### H3: `database.py` crashes server instead of falling back ✓ FIXED
- **Evidence:** Original code called `Base.metadata.create_all()` at module level with no try/except. Connection test was added to catch this.
- **Fix Applied:** Wrapped connection in try/except with automatic SQLite fallback.

## Resolution
- **Root Cause:** User's network DNS server (202.41.64.251) refuses to resolve Supabase hostnames.
- **Code Fix:** `database.py` now tests the connection before committing, and gracefully falls back to SQLite.
- **User Action Needed:** Switch to a network that allows DNS resolution (e.g., mobile hotspot) or change Windows DNS settings to `8.8.8.8`.
