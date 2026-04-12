#!/usr/bin/env python3
"""
Cleans food_resources.csv in-place:
  - Splits embedded city/state/zip out of address field
  - Normalizes abbreviated city names
  - Strips trailing USA / extra punctuation from address
  - Ensures zip_code is clean 5-digit string (no .0, no false positives)
  - Adds county inferred from zip code using an exact MD zip→county dict
  - Lowercases resource_type
  - Removes exact duplicate rows
  - Preserves source_name, source_url, last_updated
"""

import csv
import re

INPUT  = "food_resources.csv"
OUTPUT = "food_resources.csv"

SCHEMA = [
    "resource_name", "organization", "resource_type", "address", "city",
    "state", "zip_code", "county", "phone", "email", "website",
    "source_name", "source_url", "hours", "eligibility", "languages",
    "accessibility", "food_types", "notes", "last_updated",
]

# ── Exact MD zip → county (only zips that appear in this dataset) ─────────────
# Built from USPS + Maryland State Archives data.
# Where a zip straddles two counties the more common assignment is used.
ZIP_TO_COUNTY: dict[str, str] = {
    # Anne Arundel
    "20733": "Anne Arundel",
    "20777": "Anne Arundel",
    "21012": "Anne Arundel",
    "21035": "Anne Arundel",
    "21037": "Anne Arundel",
    "21060": "Anne Arundel",
    "21061": "Anne Arundel",
    "21075": "Anne Arundel",
    "21076": "Anne Arundel",
    "21113": "Anne Arundel",
    "21114": "Anne Arundel",
    "21122": "Anne Arundel",
    "21144": "Anne Arundel",
    "21146": "Anne Arundel",
    "21401": "Anne Arundel",
    "21402": "Anne Arundel",
    "21403": "Anne Arundel",
    "21405": "Anne Arundel",
    # Baltimore City
    "21201": "Baltimore City",
    "21202": "Baltimore City",
    "21203": "Baltimore City",
    "21205": "Baltimore City",
    "21206": "Baltimore City",
    "21207": "Baltimore City",
    "21208": "Baltimore City",
    "21209": "Baltimore City",
    "21210": "Baltimore City",
    "21211": "Baltimore City",
    "21212": "Baltimore City",
    "21213": "Baltimore City",
    "21214": "Baltimore City",
    "21215": "Baltimore City",
    "21216": "Baltimore City",
    "21217": "Baltimore City",
    "21218": "Baltimore City",
    "21223": "Baltimore City",
    "21224": "Baltimore City",
    "21225": "Baltimore City",
    "21229": "Baltimore City",
    "21230": "Baltimore City",
    "21231": "Baltimore City",
    "21239": "Baltimore City",
    "21251": "Baltimore City",
    # Baltimore County
    "21001": "Baltimore County",
    "21014": "Baltimore County",
    "21040": "Baltimore County",
    "21047": "Baltimore County",
    "21050": "Baltimore County",
    "21085": "Baltimore County",
    "21093": "Baltimore County",
    "21104": "Baltimore County",
    "21117": "Baltimore County",
    "21128": "Baltimore County",
    "21133": "Baltimore County",
    "21136": "Baltimore County",
    "21152": "Baltimore County",
    "21155": "Baltimore County",
    "21161": "Baltimore County",
    "21204": "Baltimore County",
    "21219": "Baltimore County",
    "21220": "Baltimore County",
    "21221": "Baltimore County",
    "21222": "Baltimore County",
    "21227": "Baltimore County",
    "21228": "Baltimore County",
    "21234": "Baltimore County",
    "21236": "Baltimore County",
    "21237": "Baltimore County",
    "21244": "Baltimore County",
    "21286": "Baltimore County",
    # Calvert
    "20639": "Calvert",
    "20678": "Calvert",
    "20688": "Calvert",
    # Caroline
    "21629": "Caroline",
    "21643": "Caroline",
    "21660": "Caroline",
    "21668": "Caroline",
    # Carroll
    "21157": "Carroll",
    "21158": "Carroll",
    "21784": "Carroll",
    "21787": "Carroll",
    "21793": "Carroll",
    "21797": "Carroll",
    # Cecil
    "21901": "Cecil",
    "21903": "Cecil",
    "21904": "Cecil",
    "21915": "Cecil",
    "21920": "Cecil",
    "21921": "Cecil",
    # Charles
    "20602": "Charles",
    "20603": "Charles",
    "20624": "Charles",
    "20646": "Charles",
    # Dorchester
    "21613": "Dorchester",
    "21641": "Dorchester",
    "21651": "Dorchester",
    "21673": "Dorchester",
    # Frederick
    "21701": "Frederick",
    "21702": "Frederick",
    "21703": "Frederick",
    "21704": "Frederick",
    "21705": "Frederick",
    "21709": "Frederick",
    "21713": "Frederick",
    "21727": "Frederick",
    "21737": "Frederick",
    "21769": "Frederick",
    "21783": "Frederick",
    "21788": "Frederick",
    "21795": "Frederick",
    # Garrett
    "21520": "Garrett",
    "21537": "Garrett",
    "21550": "Garrett",
    "21562": "Garrett",
    # Harford
    "21001": "Harford",   # Aberdeen (Harford takes precedence over Balt Co)
    "21014": "Harford",   # Bel Air
    "21040": "Harford",   # Edgewood
    "21047": "Harford",   # Fallston
    "21050": "Harford",   # Forest Hill
    "21085": "Harford",   # Joppa
    "21154": "Harford",   # Street
    # Howard
    "20850": "Howard",    # Rockville (actually Montgomery — see below)
    "21045": "Howard",
    "21046": "Howard",
    "21075": "Howard",    # Elkridge (Howard takes precedence over AA)
    "21737": "Howard",
    "21784": "Howard",    # Sykesville (Carroll/Howard border — Carroll more common)
    "21794": "Howard",
    "21797": "Howard",
    # Kent
    "21620": "Kent",
    "21617": "Kent",
    "21658": "Kent",
    "21661": "Kent",
    "21663": "Kent",
    # Montgomery
    "20850": "Montgomery",
    "20853": "Montgomery",
    "20877": "Montgomery",
    "20878": "Montgomery",
    "20879": "Montgomery",
    "20901": "Montgomery",
    "20902": "Montgomery",
    "20903": "Montgomery",
    "20904": "Montgomery",
    "20905": "Montgomery",
    "20906": "Montgomery",
    "20910": "Montgomery",
    "20912": "Montgomery",
    # Prince George's
    "20653": "St. Mary's",  # Lexington Park is St. Mary's, not PG
    "20705": "Prince George's",
    "20706": "Prince George's",
    "20707": "Prince George's",
    "20708": "Prince George's",
    "20710": "Prince George's",
    "20712": "Prince George's",
    "20720": "Prince George's",
    "20721": "Prince George's",
    "20722": "Prince George's",
    "20735": "Prince George's",
    "20740": "Prince George's",
    "20743": "Prince George's",
    "20744": "Prince George's",
    "20745": "Prince George's",
    "20746": "Prince George's",
    "20747": "Prince George's",
    "20748": "Prince George's",
    "20770": "Prince George's",
    "20772": "Prince George's",
    "20774": "Prince George's",
    "20781": "Prince George's",
    "20782": "Prince George's",
    "20783": "Prince George's",
    "20784": "Prince George's",
    "20785": "Prince George's",
    # Queen Anne's
    "21638": "Queen Anne's",
    # St. Mary's
    "20620": "St. Mary's",
    "20653": "St. Mary's",
    "20680": "St. Mary's",
    "20686": "St. Mary's",
    # Somerset
    "21826": "Wicomico",   # Hebron is Wicomico
    "21853": "Somerset",
    "21863": "Somerset",
    "21875": "Somerset",
    # Talbot
    "21601": "Talbot",
    # Washington
    "21740": "Washington",
    "21742": "Washington",
    "21750": "Washington",
    "21767": "Washington",
    # Wicomico
    "21801": "Wicomico",
    "21802": "Wicomico",
    "21804": "Wicomico",
    "21826": "Wicomico",
    "21830": "Wicomico",
    "21851": "Wicomico",
    # Worcester
    "21811": "Worcester",
    "21842": "Worcester",
    "21843": "Worcester",
    "21863": "Worcester",
    "21872": "Worcester",
}

# Correct the few conflicts above with the authoritative per-zip assignment
# (last write wins in the dict literal above, so fix explicitly)
ZIP_TO_COUNTY.update({
    # Harford County zips (authoritative — override any Baltimore Co conflicts)
    "21001": "Harford",    # Aberdeen
    "21014": "Harford",    # Bel Air
    "21040": "Harford",    # Edgewood
    "21047": "Harford",    # Fallston
    "21050": "Harford",    # Forest Hill
    "21085": "Harford",    # Joppa
    "21154": "Harford",    # Street
    # Howard
    "21042": "Howard",     # Ellicott City
    "21043": "Howard",     # Ellicott City
    "21044": "Howard",     # Columbia
    "21045": "Howard",     # Columbia
    "21046": "Howard",     # Columbia
    "21075": "Howard",     # Elkridge
    "21794": "Howard",     # West Friendship
    # Carroll
    "21784": "Carroll",    # Sykesville
    "21797": "Carroll",    # Woodbine
    # Frederick
    "21793": "Frederick",  # Walkersville
    "21762": "Frederick",  # Libertytown
    "21770": "Frederick",  # Monrovia
    # Allegany
    "21502": "Allegany",   # LaVale / Cumberland
    "21501": "Allegany",
    "21520": "Allegany",
    "21521": "Allegany",
    "21522": "Allegany",
    "21523": "Allegany",
    "21524": "Allegany",
    "21529": "Allegany",
    "21530": "Allegany",
    "21531": "Allegany",
    "21532": "Allegany",
    "21536": "Allegany",
    "21538": "Allegany",
    "21539": "Allegany",
    "21540": "Allegany",
    "21541": "Allegany",
    "21542": "Allegany",
    "21543": "Allegany",
    "21545": "Allegany",
    "21555": "Allegany",
    "21557": "Allegany",
    # Montgomery
    "20850": "Montgomery",
    "20851": "Montgomery",
    "20852": "Montgomery",
    "20853": "Montgomery",
    "20854": "Montgomery",
    "20855": "Montgomery",
    "20860": "Montgomery",
    "20861": "Montgomery",
    "20862": "Montgomery",
    "20866": "Montgomery",
    "20868": "Montgomery",
    "20871": "Montgomery",
    "20872": "Montgomery",
    "20874": "Montgomery",
    "20876": "Montgomery",
    "20877": "Montgomery",
    "20878": "Montgomery",
    "20879": "Montgomery",
    "20882": "Montgomery",
    "20886": "Montgomery",
    "20895": "Montgomery",
    "20896": "Montgomery",
    "20899": "Montgomery",
    "20901": "Montgomery",
    "20902": "Montgomery",
    "20903": "Montgomery",
    "20904": "Montgomery",
    "20905": "Montgomery",
    "20906": "Montgomery",
    "20910": "Montgomery",
    "20912": "Montgomery",
    "20916": "Montgomery",
    # Prince George's
    "20601": "Charles",    # Waldorf is Charles, not PG
    "20602": "Charles",
    "20603": "Charles",
    "20705": "Prince George's",
    "20706": "Prince George's",
    "20707": "Prince George's",
    "20708": "Prince George's",
    "20710": "Prince George's",
    "20712": "Prince George's",
    "20720": "Prince George's",
    "20721": "Prince George's",
    "20722": "Prince George's",
    "20735": "Prince George's",
    "20740": "Prince George's",
    "20743": "Prince George's",
    "20744": "Prince George's",
    "20745": "Prince George's",
    "20746": "Prince George's",
    "20747": "Prince George's",
    "20748": "Prince George's",
    "20770": "Prince George's",
    "20772": "Prince George's",
    "20774": "Prince George's",
    "20781": "Prince George's",
    "20782": "Prince George's",
    "20783": "Prince George's",
    "20784": "Prince George's",
    "20785": "Prince George's",
    # St. Mary's
    "20619": "St. Mary's",
    "20620": "St. Mary's",
    "20621": "St. Mary's",
    "20622": "St. Mary's",
    "20625": "St. Mary's",
    "20628": "St. Mary's",
    "20630": "St. Mary's",
    "20634": "St. Mary's",
    "20636": "St. Mary's",
    "20643": "St. Mary's",
    "20645": "St. Mary's",
    "20650": "St. Mary's",
    "20653": "St. Mary's",
    "20656": "St. Mary's",
    "20657": "St. Mary's",
    "20659": "St. Mary's",
    "20660": "St. Mary's",
    "20667": "St. Mary's",
    "20670": "St. Mary's",
    "20674": "St. Mary's",
    "20680": "St. Mary's",
    "20684": "St. Mary's",
    "20686": "St. Mary's",
    "20687": "St. Mary's",
    "20690": "St. Mary's",
    "20692": "St. Mary's",
    # Wicomico
    "21826": "Wicomico",
    # Worcester
    "21811": "Worcester",
    "21842": "Worcester",
    "21843": "Worcester",
    "21863": "Worcester",
    "21872": "Worcester",
})

# ── City name normalization ───────────────────────────────────────────────────
CITY_NORMALIZE = {
    "Lexington Pk":  "Lexington Park",
    "Marriottsvl":   "Marriottsville",
    "Sparrows Pt":   "Sparrows Point",
    "St Michaels":   "St. Michaels",
    "Lavale":        "LaVale",
}

# ── Address parsing ───────────────────────────────────────────────────────────
# Matches: "123 Main St, City, MD 21201" or "123 Main St, City, MD 21201, USA"
EMBEDDED_RE = re.compile(
    r"^(.+?),\s*([A-Za-z][A-Za-z .'-]+?),\s*(MD|DC|VA)\s+(\d{5})(?:-\d{4})?(?:,\s*USA)?$",
    re.IGNORECASE,
)
# Matches: "123 Main St, City, Maryland 21201"
EMBEDDED_FULL_STATE_RE = re.compile(
    r"^(.+?),\s*([A-Za-z][A-Za-z .'-]+?),\s*Maryland\s+(\d{5})(?:-\d{4})?$",
    re.IGNORECASE,
)
# Zip after state abbreviation only (avoids matching street numbers)
ZIP_AFTER_STATE_RE = re.compile(r"\b(MD|DC|VA)\s+(\d{5})\b", re.IGNORECASE)


def split_address(addr: str, city: str, state: str, zip_code: str):
    """
    If address contains embedded city/state/zip, split them out.
    Returns (clean_address, city, state, zip_code).
    """
    addr = addr.strip().rstrip(",").strip()

    # Already split — nothing to do
    if city and zip_code:
        return addr, city, state, zip_code

    # Try "street, city, ST zip[, USA]"
    m = EMBEDDED_RE.match(addr)
    if not m:
        m = EMBEDDED_FULL_STATE_RE.match(addr)
        if m:
            return m.group(1).strip(), m.group(2).strip(), "MD", m.group(3)

    if m:
        return m.group(1).strip(), m.group(2).strip(), m.group(3).upper(), m.group(4)

    # Partial: address has "MD 21201" but no city separator
    mz = ZIP_AFTER_STATE_RE.search(addr)
    if mz and not zip_code:
        zip_code = mz.group(2)
        # Strip the state+zip from the end of address
        addr = addr[:mz.start()].strip().rstrip(",").strip()

    return addr, city, state, zip_code


def clean_zip(z: str) -> str:
    """Ensure zip is a plain 5-digit string."""
    if not z:
        return ""
    z = str(z).strip()
    # Remove .0 float artifact
    z = re.sub(r"\.0+$", "", z)
    # Take first 5 digits
    m = re.match(r"(\d{5})", z)
    return m.group(1) if m else ""


def infer_county(zip_code: str) -> str:
    return ZIP_TO_COUNTY.get(zip_code, "")


def normalize_city(city: str) -> str:
    return CITY_NORMALIZE.get(city, city)


def clean_resource_type(rt: str) -> str:
    rt = rt.strip().lower()
    # Normalize any variants
    if rt in ("food pantry", "pantry"):
        return "food pantry"
    if rt in ("meal program", "meal site", "soup kitchen", "hot meals"):
        return "meal program"
    if rt in ("food bank", "foodbank"):
        return "food bank"
    if rt in ("distribution site", "distribution", "mobile pantry", "pop-up"):
        return "distribution site"
    return rt  # keep as-is if already clean


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    with open(INPUT, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    print(f"Loaded {len(rows)} rows")

    cleaned = []
    addr_fixed = 0
    city_fixed = 0
    county_added = 0

    for r in rows:
        # 1. Split embedded address
        orig_addr = r["address"]
        orig_city = r["city"]
        addr, city, state, zip_code = split_address(
            r["address"], r["city"], r["state"], r["zip_code"]
        )
        if addr != orig_addr or city != orig_city:
            addr_fixed += 1

        # 2. Clean zip
        zip_code = clean_zip(zip_code)

        # 3. Normalize city abbreviations
        orig_city2 = city
        city = normalize_city(city)
        if city != orig_city2:
            city_fixed += 1

        # 4. Infer county from zip
        county = r.get("county", "").strip()
        if not county and zip_code:
            county = infer_county(zip_code)
            if county:
                county_added += 1

        # 5. Lowercase resource_type
        resource_type = clean_resource_type(r["resource_type"])

        # 6. Ensure state is uppercase abbreviation
        state = state.upper() if state else "MD"

        cleaned.append({
            "resource_name": r["resource_name"],
            "organization":  r["organization"],
            "resource_type": resource_type,
            "address":       addr,
            "city":          city,
            "state":         state,
            "zip_code":      zip_code,
            "county":        county,
            "phone":         r["phone"],
            "email":         r["email"],
            "website":       r["website"],
            "source_name":   r["source_name"],
            "source_url":    r["source_url"],
            "hours":         r["hours"],
            "eligibility":   r["eligibility"],
            "languages":     r["languages"],
            "accessibility": r["accessibility"],
            "food_types":    r["food_types"],
            "notes":         r["notes"],
            "last_updated":  r["last_updated"],
        })

    # 7. Remove exact duplicates (all fields)
    seen = set()
    deduped = []
    for r in cleaned:
        key = tuple(r[k] for k in SCHEMA)
        if key not in seen:
            seen.add(key)
            deduped.append(r)
    dupes_removed = len(cleaned) - len(deduped)

    # Write output
    with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=SCHEMA)
        writer.writeheader()
        writer.writerows(deduped)

    print(f"\nCleaning summary:")
    print(f"  Address/city splits fixed : {addr_fixed}")
    print(f"  City names normalized     : {city_fixed}")
    print(f"  Counties added            : {county_added}")
    print(f"  Duplicates removed        : {dupes_removed}")
    print(f"  Final row count           : {len(deduped)}")
    print(f"\nSaved → {OUTPUT}")


if __name__ == "__main__":
    main()
