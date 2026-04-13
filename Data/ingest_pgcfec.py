#!/usr/bin/env python3
"""
Ingests food resource listings from the PG County Food Equity Council
Google Doc (linked from pgcfec.org) and appends them to food_resources.csv.

Source page : https://pgcfec.org/resources/find-food-food-pantry-listings/
Data source : Google Doc exported as HTML
"""

import csv
import re
import warnings
from datetime import date

import requests
from bs4 import BeautifulSoup

warnings.filterwarnings("ignore", message="Unverified HTTPS")

SOURCE_PAGE = "https://pgcfec.org/resources/find-food-food-pantry-listings/"
DOC_ID      = "1SIKk4gr_FvWNWx5FXGVt1l0b-eYlq825z_n0gS7clrE"
DOC_URL     = f"https://docs.google.com/document/d/{DOC_ID}/export?format=html"
SOURCE_NAME = "PG County Food Equity Council – Community Food Programs"
TODAY       = date.today().isoformat()
CSV_FILE    = "food_resources.csv"

SCHEMA = [
    "resource_name", "organization", "resource_type", "address", "city",
    "state", "zip_code", "county", "phone", "email", "website",
    "source_name", "source_url", "hours", "eligibility", "languages",
    "accessibility", "food_types", "notes", "last_updated",
]

# ── regex helpers ─────────────────────────────────────────────────────────────
PHONE_RE = re.compile(r"\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4}")
EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
URL_RE   = re.compile(r"https?://[^\s,)\"'<>]+")
ZIP_RE   = re.compile(r"\b(2[01]\d{3})\b")   # MD/DC/VA zips only

# Pattern 1: "123 Main St, City, MD 20707" (comma-separated)
ADDR_COMMA_RE = re.compile(
    r"^(.+?),\s*([A-Za-z][A-Za-z .'-]+?),?\s*(MD|DC|VA)(?:\s+(2[01]\d{3}))?",
    re.IGNORECASE,
)

# Known city names in PG County and surroundings for anchor-based parsing
PG_CITIES = [
    "Bowie", "Mitchellville", "Hyattsville", "Landover", "Laurel",
    "Upper Marlboro", "Oxon Hill", "Temple Hills", "Camp Springs",
    "Clinton", "Forestville", "Suitland", "Capitol Heights",
    "Riverdale Park", "Riverdale", "Bladensburg", "Beltsville",
    "Lanham", "New Carrollton", "Greenbelt", "College Park",
    "Cheverly", "Seat Pleasant", "District Heights", "Largo",
    "Fort Washington", "Accokeek", "Brandywine", "Waldorf",
    "Silver Spring", "Takoma Park", "Adelphi", "Berwyn Heights",
]
# Sort longest first so "Upper Marlboro" matches before "Marlboro"
PG_CITIES.sort(key=len, reverse=True)
# Rows to skip — section headers, column headers, notes, blank
SKIP_PATTERNS = re.compile(
    r"^(organization|date\s*&|bowie|laurel|hyattsville|oxon hill|suitland|"
    r"riverdale|upper marlboro|outside of|please email|por favor|update:|"
    r"actualización|for more information|\*\*\*\*|$)",
    re.IGNORECASE,
)

MEAL_KW   = re.compile(r"\b(meal|soup kitchen|hot food|breakfast|lunch|dinner|dining|kitchen)\b", re.I)
BANK_KW   = re.compile(r"\bfood bank\b", re.I)
DISTRIB_KW = re.compile(r"\b(distribution|drive.?thru|drive.?through|mobile pantry|pop.?up)\b", re.I)

# Known PG County zip → county (all are Prince George's)
PG_ZIPS = {
    "20705", "20706", "20707", "20708", "20710", "20712",
    "20720", "20721", "20722", "20735", "20737", "20740",
    "20743", "20744", "20745", "20746", "20747", "20748",
    "20770", "20772", "20774", "20781", "20782", "20783",
    "20784", "20785", "20904",
}


def classify_type(name: str, notes: str) -> str:
    combined = f"{name} {notes}"
    if BANK_KW.search(combined):
        return "food bank"
    if MEAL_KW.search(combined):
        return "meal program"
    if DISTRIB_KW.search(combined):
        return "distribution site"
    return "food pantry"


def clean_text(s: str) -> str:
    """Collapse whitespace, strip bilingual Spanish portions after a blank line."""
    s = re.sub(r"\s+", " ", s).strip()
    # Remove Spanish translation lines (heuristic: after first blank-line break)
    # Keep only the English portion
    parts = re.split(r"\n\s*\n", s)
    return parts[0].strip() if parts else s


def parse_address(raw: str):
    """Return (street, city, state, zip) from a raw address string."""
    raw = raw.strip()

    # If raw starts with a non-numeric org name before the actual address,
    # find the first line/segment that starts with a digit
    raw_clean = raw
    if not re.match(r"^\d", raw_clean):
        for line in re.split(r"[\n,]", raw):
            if re.match(r"^\d", line.strip()):
                # Use this line but keep the rest for zip extraction
                raw_clean = line.strip()
                break

    # Pattern 1: comma-separated "123 St, City, MD zip"
    m = ADDR_COMMA_RE.match(raw_clean)
    if m:
        street = m.group(1).strip().rstrip(",")
        city   = m.group(2).strip().rstrip(",")
        state  = m.group(3).upper()
        zip_   = m.group(4) or ""
        if not zip_:
            zm = ZIP_RE.search(raw)   # search full raw, not just raw_clean
            zip_ = zm.group(1) if zm else ""
        if city.upper() in ("MD", "DC", "VA"):
            city = ""
        return street, city, state, zip_

    # Pattern 2: city-anchor — find known city name in the string
    for city_name in PG_CITIES:
        pat = re.compile(
            r"^(.+?)\s+" + re.escape(city_name) + r"[,\s]*(MD|DC|VA)?\s*(2[01]\d{3})?",
            re.IGNORECASE,
        )
        m2 = pat.match(raw_clean)
        if m2:
            street = m2.group(1).strip().rstrip(",")
            state  = (m2.group(2) or "MD").upper()
            zip_   = m2.group(3) or ""
            if not zip_:
                zm = ZIP_RE.search(raw)   # search full raw
                zip_ = zm.group(1) if zm else ""
            return street, city_name, state, zip_

    # Fallback: just grab zip if present
    zm = ZIP_RE.search(raw)
    zip_ = zm.group(1) if zm else ""
    return raw_clean.strip(), "", "MD", zip_


def fetch_doc_soup() -> BeautifulSoup:
    r = requests.get(DOC_URL,
        headers={"User-Agent": "Mozilla/5.0"}, timeout=20, verify=False)
    r.raise_for_status()
    return BeautifulSoup(r.text, "html.parser")


def parse_rows(soup: BeautifulSoup) -> list[dict]:
    results = []

    # The doc has one main data table (82 rows)
    tables = soup.find_all("table")
    main_table = max(tables, key=lambda t: len(t.find_all("tr")))

    for tr in main_table.find_all("tr"):
        cells = [td.get_text(" ", strip=True) for td in tr.find_all(["td", "th"])]
        if len(cells) < 3:
            continue

        # Col layout: Organization | Date&Time | Location | Contact | Phone | Eligibility | Notes
        name_raw  = cells[0].strip()
        hours_raw = cells[1].strip() if len(cells) > 1 else ""
        addr_raw  = cells[2].strip() if len(cells) > 2 else ""
        # contact   = cells[3] — not in schema, skip
        phone_raw = cells[4].strip() if len(cells) > 4 else ""
        elig_raw  = cells[5].strip() if len(cells) > 5 else ""
        notes_raw = cells[6].strip() if len(cells) > 6 else ""

        # Skip headers / section titles / empty rows
        if not name_raw or SKIP_PATTERNS.match(name_raw):
            continue
        # Skip rows where name looks like a section header (all caps or very short)
        if len(name_raw) < 4:
            continue

        # Clean bilingual text — keep English portion
        name  = clean_text(name_raw)
        hours = clean_text(hours_raw)
        addr  = clean_text(addr_raw)
        notes = clean_text(notes_raw)
        elig  = clean_text(elig_raw)

        # Extract structured fields
        street, city, state, zip_code = parse_address(addr)

        # Phone — prefer cell[4], fall back to scanning all cells
        phone = ""
        pm = PHONE_RE.search(phone_raw)
        if pm:
            phone = pm.group(0).strip()
        else:
            for c in cells:
                pm2 = PHONE_RE.search(c)
                if pm2:
                    phone = pm2.group(0).strip()
                    break

        # Email — scan all cells
        email = ""
        for c in cells:
            em = EMAIL_RE.search(c)
            if em:
                email = em.group(0).strip()
                break

        # Website — scan all cells
        website = ""
        for c in cells:
            wm = URL_RE.search(c)
            if wm:
                url = wm.group(0).rstrip(".,)")
                if "google.com" not in url and "facebook.com" not in url:
                    website = url
                    break

        # Languages — from notes column
        languages = ""
        lang_m = re.search(
            r"\b(English|Spanish|Español|French|Arabic|Yoruba|Russian|ASL|"
            r"Amharic|Portuguese|Chinese|Korean|Vietnamese)\b.{0,60}",
            f"{notes_raw} {cells[6] if len(cells) > 6 else ''}",
            re.IGNORECASE,
        )
        if lang_m:
            languages = lang_m.group(0).strip()[:80]

        # County
        county = "Prince George's" if zip_code in PG_ZIPS else (
            "Montgomery" if zip_code.startswith("209") else ""
        )

        resource_type = classify_type(name, notes)

        results.append({
            "resource_name": name,
            "organization":  name,
            "resource_type": resource_type,
            "address":       street,
            "city":          city,
            "state":         state if state else "MD",
            "zip_code":      zip_code,
            "county":        county,
            "phone":         phone,
            "email":         email,
            "website":       website,
            "source_name":   SOURCE_NAME,
            "source_url":    SOURCE_PAGE,
            "hours":         hours,
            "eligibility":   elig,
            "languages":     languages,
            "accessibility": "",
            "food_types":    "",
            "notes":         notes[:300],
            "last_updated":  TODAY,
        })

    return results


def load_existing(path: str) -> list[dict]:
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def dedup_key(row: dict) -> tuple:
    """Normalised key for duplicate detection: name + street address."""
    name = re.sub(r"\s+", " ", row["resource_name"].lower().strip())
    addr = re.sub(r"\s+", " ", row["address"].lower().strip())
    return (name, addr)


def merge_and_save(existing: list[dict], new_rows: list[dict], path: str):
    existing_keys = {dedup_key(r) for r in existing}

    added = 0
    skipped = 0
    for row in new_rows:
        k = dedup_key(row)
        if k in existing_keys:
            skipped += 1
        else:
            existing.append(row)
            existing_keys.add(k)
            added += 1

    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=SCHEMA)
        writer.writeheader()
        writer.writerows(existing)

    print(f"  New rows added  : {added}")
    print(f"  Duplicates skip : {skipped}")
    print(f"  Total rows      : {len(existing)}")
    print(f"  Saved → {path}")


def main():
    print(f"Fetching Google Doc …")
    soup = fetch_doc_soup()

    print("Parsing rows …")
    new_rows = parse_rows(soup)
    print(f"  Parsed {len(new_rows)} candidate rows from source\n")

    print("Loading existing CSV …")
    existing = load_existing(CSV_FILE)
    print(f"  Existing rows: {len(existing)}\n")

    print("Merging …")
    merge_and_save(existing, new_rows, CSV_FILE)


if __name__ == "__main__":
    main()
