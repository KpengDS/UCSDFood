#!/usr/bin/env python3
"""
Ingests food resource listings from the Montgomery County Food Council map
and appends them to food_resources.csv.

Source: https://mocofoodcouncil.org/map/
Data:   HTML rendered by the Directories plugin on the map page (105 listings)
"""

import csv
import re
import time
import warnings
from datetime import date

import requests
from bs4 import BeautifulSoup

warnings.filterwarnings("ignore", message="Unverified HTTPS")

SOURCE_URL  = "https://mocofoodcouncil.org/map/"
SOURCE_NAME = "Montgomery County Food Council – Food Assistance Resource Map"
TODAY       = date.today().isoformat()
CSV_FILE    = "food_resources.csv"

SCHEMA = [
    "resource_name", "organization", "resource_type", "address", "city",
    "state", "zip_code", "county", "phone", "email", "website",
    "source_name", "source_url", "hours", "eligibility", "languages",
    "accessibility", "food_types", "notes", "last_updated",
]

# ── icon → field mapping ──────────────────────────────────────────────────────
# Directories plugin uses Font Awesome icons as field labels
ICON_FIELD = {
    "fa-map-marker-alt": "address",
    "fa-phone":          "phone",
    "fa-link":           "website",
    "fa-envelope":       "email",
    "fa-clock":          "hours",
    "fa-sticky-note":    "notes",
}

# Fields with no icon use their position in the fieldlist
# Order: food_type, eligibility, languages, accessibility (based on observed HTML)
ICONLESS_ORDER = ["food_types", "eligibility", "languages", "accessibility"]

# ── address parsing ───────────────────────────────────────────────────────────
# MoCo format: "123 Main St, City, 20850" or "123 Main St, City, MD 20850"
ADDR_RE = re.compile(
    r"^(.+?),\s*([A-Za-z][A-Za-z .'-]+?),?\s*(?:(MD|DC|VA)\s+)?(2[01]\d{3})\s*$",
    re.IGNORECASE,
)

def parse_address(raw: str):
    raw = raw.strip().rstrip(",")
    m = ADDR_RE.match(raw)
    if m:
        street = m.group(1).strip()
        city   = m.group(2).strip()
        state  = (m.group(3) or "MD").upper()
        zip_   = m.group(4)
        return street, city, state, zip_
    # Fallback: grab zip if present
    zm = re.search(r"\b(2[01]\d{3})\b", raw)
    return raw, "", "MD", (zm.group(1) if zm else "")

# ── phone normalisation ───────────────────────────────────────────────────────
def fmt_phone(raw: str) -> str:
    """Turn '3015551234' → '301-555-1234', leave formatted strings alone."""
    digits = re.sub(r"\D", "", raw)
    if len(digits) == 10:
        return f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"
    if len(digits) == 11 and digits[0] == "1":
        return f"{digits[1:4]}-{digits[4:7]}-{digits[7:]}"
    return raw.strip()

# ── resource_type classifier ──────────────────────────────────────────────────
MEAL_KW    = re.compile(r"\b(meal|soup kitchen|hot food|breakfast|lunch|dinner|prepared meal)\b", re.I)
BANK_KW    = re.compile(r"\bfood bank\b", re.I)
DISTRIB_KW = re.compile(r"\b(distribution|drive.?thru|drive.?through|mobile pantry|pop.?up)\b", re.I)

def classify_type(name: str, food_types: str, notes: str) -> str:
    combined = f"{name} {food_types} {notes}"
    if BANK_KW.search(combined):
        return "food bank"
    if MEAL_KW.search(combined):
        return "meal program"
    if DISTRIB_KW.search(combined):
        return "distribution site"
    return "food pantry"

# ── zip → county ──────────────────────────────────────────────────────────────
MOCO_ZIPS = {
    "20810","20811","20812","20813","20814","20815","20816","20817","20818",
    "20824","20825","20827","20830","20832","20833","20837","20838","20839",
    "20841","20842","20850","20851","20852","20853","20854","20855","20860",
    "20861","20862","20866","20868","20871","20872","20874","20876","20877",
    "20878","20879","20882","20883","20884","20885","20886","20889","20891",
    "20892","20894","20895","20896","20897","20898","20899","20901","20902",
    "20903","20904","20905","20906","20910","20912","20916",
}

def infer_county(zip_code: str) -> str:
    if zip_code in MOCO_ZIPS:
        return "Montgomery"
    return ""

# ── parser ────────────────────────────────────────────────────────────────────
def parse_entities(soup: BeautifulSoup) -> list[dict]:
    rows = []
    entities = soup.find_all(class_=re.compile(r"drts-view-entity-container"))

    for entity in entities:
        # Name
        title_el = entity.find(class_="directory-listing-title")
        if not title_el:
            continue
        name = title_el.get_text(strip=True)
        if not name:
            continue

        # Listing URL (for website fallback)
        listing_link = entity.find("a", href=re.compile(r"/map/listing/"))
        listing_url  = listing_link["href"] if listing_link else ""

        # Collect fields by icon
        fields: dict[str, str] = {}
        iconless_vals: list[str] = []

        for field_div in entity.find_all(class_="drts-entity-field"):
            icon_el = field_div.find("i")
            value_el = field_div.find(class_="drts-entity-field-value")
            if not value_el:
                continue

            # Remove distance badge from address
            for badge in value_el.find_all(class_="drts-location-distance"):
                badge.decompose()

            val = value_el.get_text(" ", strip=True).strip()
            if not val:
                continue

            if icon_el:
                icon_classes = icon_el.get("class", [])
                matched = False
                for ic, fname in ICON_FIELD.items():
                    if ic in icon_classes:
                        fields[fname] = val
                        matched = True
                        break
                if not matched:
                    iconless_vals.append(val)
            else:
                iconless_vals.append(val)

        # Map iconless values to field names in order
        for i, fname in enumerate(ICONLESS_ORDER):
            if i < len(iconless_vals):
                fields[fname] = iconless_vals[i]

        # Parse address
        raw_addr = fields.get("address", "")
        street, city, state, zip_code = parse_address(raw_addr)

        # Phone
        phone = fmt_phone(fields.get("phone", ""))

        # Website — skip Facebook links
        website = fields.get("website", "")
        if "facebook.com" in website:
            website = ""

        # Email
        email = fields.get("email", "")

        # Hours
        hours = fields.get("hours", "")

        # Notes
        notes = fields.get("notes", "")[:300]

        # Food types, eligibility, languages, accessibility
        food_types    = fields.get("food_types", "")
        eligibility   = fields.get("eligibility", "")
        languages     = fields.get("languages", "")
        accessibility = fields.get("accessibility", "")

        county = infer_county(zip_code)
        resource_type = classify_type(name, food_types, notes)

        rows.append({
            "resource_name": name,
            "organization":  name,
            "resource_type": resource_type,
            "address":       street,
            "city":          city,
            "state":         state,
            "zip_code":      zip_code,
            "county":        county,
            "phone":         phone,
            "email":         email,
            "website":       website,
            "source_name":   SOURCE_NAME,
            "source_url":    SOURCE_URL,
            "hours":         hours,
            "eligibility":   eligibility,
            "languages":     languages,
            "accessibility": accessibility,
            "food_types":    food_types,
            "notes":         notes,
            "last_updated":  TODAY,
        })

    return rows

# ── merge & save ──────────────────────────────────────────────────────────────
def dedup_key(row: dict) -> tuple:
    name = re.sub(r"\s+", " ", row["resource_name"].lower().strip())
    addr = re.sub(r"\s+", " ", row["address"].lower().strip())
    return (name, addr)

def load_existing(path: str) -> list[dict]:
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))

def merge_and_save(existing: list[dict], new_rows: list[dict], path: str):
    existing_keys = {dedup_key(r) for r in existing}
    added = skipped = 0
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

# ── main ──────────────────────────────────────────────────────────────────────
def main():
    print(f"Fetching {SOURCE_URL} …")
    r = requests.get(SOURCE_URL,
        headers={"User-Agent": "Mozilla/5.0"}, timeout=20, verify=False)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")

    print("Parsing entities …")
    new_rows = parse_entities(soup)
    print(f"  Parsed {len(new_rows)} listings\n")

    print("Loading existing CSV …")
    existing = load_existing(CSV_FILE)
    print(f"  Existing rows: {len(existing)}\n")

    print("Merging …")
    merge_and_save(existing, new_rows, CSV_FILE)

    # Quality summary
    print("\nQuality summary (new rows):")
    for field in ["address", "city", "zip_code", "county", "phone", "hours",
                  "food_types", "languages", "eligibility"]:
        filled = sum(1 for r in new_rows if r[field])
        print(f"  {field:14}: {filled}/{len(new_rows)} ({filled*100//len(new_rows)}%)")

    from collections import Counter
    print("\nresource_type breakdown:")
    for t, n in Counter(r["resource_type"] for r in new_rows).items():
        print(f"  {t}: {n}")

if __name__ == "__main__":
    main()
