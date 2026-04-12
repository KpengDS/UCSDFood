#!/usr/bin/env python3
"""
Ingests food resource listings from 211 Maryland search
and appends them to food_resources.csv.

Source: https://search.211md.org/search?query=food+pantry&query_label=food+pantry&query_type=text
Total:  ~505 results across ~21 pages (25 per page)
"""

import csv
import re
import time
import warnings
from datetime import date

import requests
from bs4 import BeautifulSoup

warnings.filterwarnings("ignore", message="Unverified HTTPS")

SOURCE_BASE = "https://search.211md.org/search"
SOURCE_PARAMS = "query=food+pantry&query_label=food+pantry&query_type=text"
SOURCE_URL  = f"{SOURCE_BASE}?{SOURCE_PARAMS}"
SOURCE_NAME = "211 Maryland – Food Pantry Search"
TODAY       = date.today().isoformat()
CSV_FILE    = "food_resources.csv"

SCHEMA = [
    "resource_name", "organization", "resource_type", "address", "city",
    "state", "zip_code", "county", "phone", "email", "website",
    "source_name", "source_url", "hours", "eligibility", "languages",
    "accessibility", "food_types", "notes", "last_updated",
]

SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "Mozilla/5.0 (food-resource-scraper/1.0)"})

# ── address parsing ───────────────────────────────────────────────────────────
# Format: "123 Main St, City, MD 21201" or "No Physical Location, City, MD 20827"
ADDR_RE = re.compile(
    r"^(.+?),\s*([A-Za-z][A-Za-z .'-]+?),\s*(MD|DC|VA|PA|WV)\s+(\d{5})(?:-\d{4})?$",
    re.IGNORECASE,
)

def parse_address(raw: str):
    raw = raw.strip()
    m = ADDR_RE.match(raw)
    if m:
        street = m.group(1).strip()
        city   = m.group(2).strip()
        state  = m.group(3).upper()
        zip_   = m.group(4)
        # Skip non-physical locations
        if "no physical" in street.lower():
            street = ""
        return street, city, state, zip_
    zm = re.search(r"\b(\d{5})\b", raw)
    return raw, "", "MD", (zm.group(1) if zm else "")

# ── county lookup (MD zips only) ──────────────────────────────────────────────
# Exact zip → county for zips that appear in MD food resource data
ZIP_COUNTY: dict[str, str] = {
    # Allegany
    **{z: "Allegany" for z in [
        "21501","21502","21503","21504","21505","21520","21521","21522",
        "21523","21524","21529","21530","21531","21532","21536","21538",
        "21539","21540","21541","21542","21543","21545","21557","21562",
    ]},
    # Anne Arundel
    **{z: "Anne Arundel" for z in [
        "20701","20711","20714","20715","20716","20720","20721","20732",
        "20733","20736","20751","20754","20758","20764","20765","20776",
        "20779","21012","21032","21035","21037","21054","21060","21061",
        "21076","21090","21108","21113","21114","21122","21140","21144",
        "21146","21401","21402","21403","21405","21409",
    ]},
    # Baltimore City
    **{z: "Baltimore City" for z in [
        "21201","21202","21203","21205","21206","21207","21208","21209",
        "21210","21211","21212","21213","21214","21215","21216","21217",
        "21218","21223","21224","21225","21229","21230","21231","21239",
        "21251","21263","21264","21270","21273","21275","21278","21281",
        "21287","21288","21290","21297","21298",
    ]},
    # Baltimore County
    **{z: "Baltimore County" for z in [
        "21001","21009","21013","21017","21022","21027","21030","21031",
        "21034","21040","21047","21051","21052","21053","21057","21071",
        "21082","21085","21087","21092","21093","21094","21111","21117",
        "21120","21128","21131","21133","21136","21152","21155","21160",
        "21161","21162","21163","21204","21206","21219","21220","21221",
        "21222","21227","21228","21234","21236","21237","21244","21286",
    ]},
    # Calvert
    **{z: "Calvert" for z in [
        "20620","20629","20632","20639","20657","20659","20678","20688","20689",
    ]},
    # Caroline
    **{z: "Caroline" for z in [
        "21620","21623","21625","21629","21632","21636","21638","21640",
        "21641","21649","21651","21655","21660","21668","21673","21677",
    ]},
    # Carroll
    **{z: "Carroll" for z in [
        "21048","21074","21102","21104","21157","21158","21784","21787",
        "21791","21793",
    ]},
    # Cecil
    **{z: "Cecil" for z in [
        "21901","21902","21903","21904","21911","21912","21913","21914",
        "21915","21916","21917","21918","21919","21920","21921","21922",
    ]},
    # Charles
    **{z: "Charles" for z in [
        "20601","20602","20603","20604","20606","20607","20608","20609",
        "20610","20611","20612","20613","20615","20616","20617","20618",
        "20624","20626","20637","20645","20646","20658","20662","20664",
        "20675","20677","20693","20695",
    ]},
    # Dorchester
    **{z: "Dorchester" for z in [
        "21613","21627","21631","21634","21643","21648","21650","21659",
        "21664","21667","21671","21672","21676",
    ]},
    # Frederick
    **{z: "Frederick" for z in [
        "20842","20871","20872","20876","21701","21702","21703","21704",
        "21705","21709","21710","21711","21714","21716","21718","21722",
        "21727","21737","21754","21757","21758","21762","21769","21771",
        "21774","21775","21777","21780","21788","21790","21793","21795",
    ]},
    # Garrett
    **{z: "Garrett" for z in [
        "21520","21521","21522","21523","21524","21529","21530","21531",
        "21532","21536","21538","21539","21540","21541","21542","21543",
        "21545","21550","21555","21557","21560","21561","21562",
    ]},
    # Harford
    **{z: "Harford" for z in [
        "21001","21005","21009","21014","21015","21017","21028","21034",
        "21040","21047","21050","21078","21082","21084","21085","21087",
        "21130","21154","21160",
    ]},
    # Howard
    **{z: "Howard" for z in [
        "20723","20759","20763","20777","20794","21029","21036","21042",
        "21043","21044","21045","21046","21075","21163","21723","21737",
        "21738","21765","21794","21797",
    ]},
    # Kent
    **{z: "Kent" for z in [
        "21619","21622","21628","21639","21644","21645","21647","21650",
        "21651","21657","21661","21662","21663","21666","21678",
    ]},
    # Montgomery
    **{z: "Montgomery" for z in [
        "20810","20811","20812","20813","20814","20815","20816","20817",
        "20818","20824","20825","20827","20830","20832","20833","20837",
        "20838","20839","20841","20842","20850","20851","20852","20853",
        "20854","20855","20860","20861","20862","20866","20868","20871",
        "20872","20874","20876","20877","20878","20879","20882","20883",
        "20884","20885","20886","20889","20891","20892","20894","20895",
        "20896","20897","20898","20899","20901","20902","20903","20904",
        "20905","20906","20910","20912","20916",
    ]},
    # Prince George's
    **{z: "Prince George's" for z in [
        "20601","20607","20608","20613","20623","20705","20706","20707",
        "20708","20710","20712","20720","20721","20722","20735","20737",
        "20740","20741","20742","20743","20744","20745","20746","20747",
        "20748","20770","20772","20774","20781","20782","20783","20784",
        "20785",
    ]},
    # Queen Anne's
    **{z: "Queen Anne's" for z in [
        "21619","21622","21628","21638","21644","21645","21657","21658",
        "21661","21662","21666",
    ]},
    # St. Mary's
    **{z: "St. Mary's" for z in [
        "20619","20620","20621","20622","20625","20628","20630","20634",
        "20636","20643","20645","20650","20653","20656","20657","20659",
        "20660","20667","20670","20674","20680","20684","20686","20687",
        "20690","20692",
    ]},
    # Somerset
    **{z: "Somerset" for z in [
        "21811","21813","21817","21821","21824","21826","21829","21835",
        "21837","21838","21840","21841","21842","21849","21850","21851",
        "21853","21856","21861","21863","21864","21865","21866","21867",
        "21869","21871","21872","21874",
    ]},
    # Talbot
    **{z: "Talbot" for z in [
        "21601","21607","21610","21612","21617","21626","21629","21631",
        "21635","21636","21639","21641","21643","21644","21645","21647",
        "21648","21649","21650","21651","21652","21653","21654","21655",
        "21656","21657","21658","21659","21660","21661","21662","21663",
        "21664","21665","21666","21667","21668","21669","21670","21671",
        "21672","21673","21674","21675","21676","21677","21678","21679",
    ]},
    # Washington
    **{z: "Washington" for z in [
        "21711","21713","21715","21716","21717","21718","21719","21720",
        "21721","21722","21733","21734","21740","21742","21746","21749",
        "21750","21756","21758","21766","21767","21769","21770","21771",
        "21773","21776","21779","21780","21781","21782","21783",
    ]},
    # Wicomico
    **{z: "Wicomico" for z in [
        "21801","21802","21803","21804","21810","21811","21813","21814",
        "21822","21826","21830","21835","21837","21838","21840","21849",
        "21850","21851","21852","21853","21856","21861","21862","21863",
        "21864","21865","21866","21867","21869","21871","21872","21874",
    ]},
    # Worcester
    **{z: "Worcester" for z in [
        "21811","21812","21813","21814","21817","21822","21824","21826",
        "21829","21835","21837","21838","21840","21841","21842","21849",
        "21850","21851","21853","21856","21861","21863","21864","21865",
        "21866","21867","21869","21871","21872","21874",
    ]},
}

# Harford takes precedence over Baltimore County for shared zips
for z in ["21001","21014","21040","21047","21050","21085","21154"]:
    ZIP_COUNTY[z] = "Harford"
# Howard takes precedence for Elkridge/Columbia area
for z in ["21042","21043","21044","21045","21046","21075","21794"]:
    ZIP_COUNTY[z] = "Howard"
# St. Mary's for Lexington Park
ZIP_COUNTY["20653"] = "St. Mary's"


def infer_county(zip_code: str, state: str) -> str:
    if state != "MD":
        return ""
    return ZIP_COUNTY.get(zip_code, "")


# ── resource type classifier ──────────────────────────────────────────────────
MEAL_KW    = re.compile(r"\b(meal|soup kitchen|hot food|breakfast|lunch|dinner|prepared meal|home.?delivered)\b", re.I)
BANK_KW    = re.compile(r"\bfood bank\b", re.I)
DISTRIB_KW = re.compile(r"\b(distribution|drive.?thru|drive.?through|mobile pantry|pop.?up)\b", re.I)

def classify_type(name: str, categories: str, description: str) -> str:
    combined = f"{name} {categories} {description}"
    if BANK_KW.search(combined):
        return "food bank"
    if MEAL_KW.search(combined):
        return "meal program"
    if DISTRIB_KW.search(combined):
        return "distribution site"
    return "food pantry"


# ── skip filter ───────────────────────────────────────────────────────────────
# Exclude national/non-MD orgs and pure information services
SKIP_NAMES = re.compile(
    r"\b(feeding america|food finder|snap|usda|211|helpline|information|"
    r"search tool|locator|national|federal|government program)\b",
    re.I,
)
SKIP_STATES = {"IL", "TX", "CA", "NY", "FL", "OH", "PA", "VA", "DC", "WV"}
# Keep DC and VA if they appear — they may serve MD residents
SKIP_STATES_STRICT = {"IL", "TX", "CA", "NY", "FL", "OH"}


# ── page parser ───────────────────────────────────────────────────────────────
def parse_page(soup: BeautifulSoup) -> list[dict]:
    rows = []
    resource_links = soup.find_all("a", attrs={"data-testid": "resource-link"})

    for link in resource_links:
        card = link.find_parent("div", class_=lambda c: c and "flex-col" in c and "gap-2" in c)
        if not card:
            continue

        name_raw = link.get_text(strip=True)
        detail_href = link.get("href", "")

        # All text nodes in card order
        texts = [t.strip() for t in card.stripped_strings if t.strip()]

        # ── extract fields by position/pattern ──
        address_raw = phone = website = description = ""
        categories: list[str] = []
        notes_parts: list[str] = []
        in_whats_here = False
        in_more_info  = False

        for i, t in enumerate(texts):
            if t == name_raw:
                continue
            if t in ("Call", "Website", "Directions", "See more", "Favorite",
                     "What's Here", "More information:"):
                if t == "What's Here":
                    in_whats_here = True
                    in_more_info  = False
                elif t == "More information:":
                    in_more_info  = True
                    in_whats_here = False
                continue

            if in_whats_here:
                categories.append(t)
                continue

            if in_more_info:
                notes_parts.append(t.lstrip("- ").strip())
                continue

            # Address: contains a zip code
            if not address_raw and re.search(r"\b\d{5}\b", t):
                address_raw = t
                continue

            # Phone
            if not phone and re.match(r"^\d{3}[-.\s]\d{3}[-.\s]\d{4}", t):
                phone = t
                continue

            # Website
            if not website and t.startswith("http"):
                website = t
                continue

            # Description: first substantial text after address/phone/website
            if not description and len(t) > 20 and not t.startswith("http"):
                description = t
                continue

        # Parse address
        street, city, state, zip_code = parse_address(address_raw)

        # Skip non-MD/DC/VA locations (national orgs with IL/TX/etc addresses)
        if state in SKIP_STATES_STRICT:
            continue

        # Skip pure information services / national search tools
        if SKIP_NAMES.search(name_raw) and not re.search(r"\bmaryland\b|\bmd\b", name_raw, re.I):
            if state not in ("MD", "DC", "VA", ""):
                continue

        # Skip "No Physical Location" entries that have no useful address
        if "no physical" in street.lower():
            street = ""

        county = infer_county(zip_code, state)
        categories_str = ", ".join(categories)
        notes = "; ".join(notes_parts)[:300]
        resource_type = classify_type(name_raw, categories_str, description)

        # Clean name: strip leading "Food Pantry | " prefix if present
        name = re.sub(r"^(?:Food Pantry|Food Bank|Food Assistance|Meal Program)\s*\|\s*", "", name_raw).strip()
        if not name:
            name = name_raw

        rows.append({
            "resource_name": name,
            "organization":  name,
            "resource_type": resource_type,
            "address":       street,
            "city":          city,
            "state":         state if state else "MD",
            "zip_code":      zip_code,
            "county":        county,
            "phone":         phone,
            "email":         "",
            "website":       website,
            "source_name":   SOURCE_NAME,
            "source_url":    SOURCE_URL,
            "hours":         "",
            "eligibility":   "",
            "languages":     "",
            "accessibility": "",
            "food_types":    categories_str,
            "notes":         (description + ("; " + notes if notes else ""))[:300],
            "last_updated":  TODAY,
        })

    return rows


# ── paginated fetch ───────────────────────────────────────────────────────────
def fetch_all(max_pages: int = 25) -> list[dict]:
    all_rows: list[dict] = []

    for page in range(1, max_pages + 1):
        url = f"{SOURCE_BASE}?{SOURCE_PARAMS}&page={page}"
        try:
            r = SESSION.get(url, timeout=20, verify=False)
            r.raise_for_status()
        except Exception as e:
            print(f"  Page {page}: ERROR {e}")
            break

        soup = BeautifulSoup(r.text, "html.parser")
        rows = parse_page(soup)

        if not rows:
            print(f"  Page {page}: no results — stopping")
            break

        all_rows.extend(rows)
        print(f"  Page {page:2d}: {len(rows):3d} listings  (running total: {len(all_rows)})")
        time.sleep(0.5)

    return all_rows


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

    return added, skipped, len(existing)


# ── main ──────────────────────────────────────────────────────────────────────
def main():
    print(f"Fetching 211 Maryland food pantry search (up to 21 pages) …\n")
    new_rows = fetch_all(max_pages=21)
    print(f"\nTotal parsed: {len(new_rows)}\n")

    print("Loading existing CSV …")
    existing = load_existing(CSV_FILE)
    print(f"  Existing rows: {len(existing)}\n")

    print("Merging …")
    added, skipped, total = merge_and_save(existing, new_rows, CSV_FILE)
    print(f"  New rows added  : {added}")
    print(f"  Duplicates skip : {skipped}")
    print(f"  Total rows      : {total}")
    print(f"  Saved → {CSV_FILE}")

    # Quality summary
    from collections import Counter
    md_rows = [r for r in new_rows if r["state"] == "MD"]
    print(f"\nQuality summary (new rows, MD only: {len(md_rows)}/{len(new_rows)}):")
    for field in ["address", "city", "zip_code", "county", "phone", "website"]:
        filled = sum(1 for r in md_rows if r[field])
        pct = filled * 100 // len(md_rows) if md_rows else 0
        print(f"  {field:12}: {filled}/{len(md_rows)} ({pct}%)")
    print("\nresource_type:")
    for t, n in Counter(r["resource_type"] for r in new_rows).items():
        print(f"  {t}: {n}")
    print("\nTop states:")
    for s, n in Counter(r["state"] for r in new_rows).most_common(8):
        print(f"  {s or '(blank)'}: {n}")


if __name__ == "__main__":
    main()
