#!/usr/bin/env python3
"""
Scrapes all 286 food resource partner locations from the Maryland Food Bank
"Find Food" directory via its internal AJAX API and writes food_resources.csv.

Source: https://mdfoodbank.org/find-food/
"""

import csv
import html
import re
import time
import warnings
from datetime import date

import requests
from bs4 import BeautifulSoup

warnings.filterwarnings("ignore", message="Unverified HTTPS")

SOURCE_URL  = "https://mdfoodbank.org/find-food/"
SOURCE_NAME = "Maryland Food Bank – Find Food"
AJAX_URL    = "https://mdfoodbank.org/wp-admin/admin-ajax.php"
TODAY       = date.today().isoformat()
OUTPUT_FILE = "food_resources.csv"
PER_PAGE    = 50   # max the API supports cleanly

SCHEMA = [
    "resource_name", "organization", "resource_type", "address", "city",
    "state", "zip_code", "county", "phone", "email", "website",
    "source_name", "source_url", "hours", "eligibility", "languages",
    "accessibility", "food_types", "notes", "last_updated",
]

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (food-resource-scraper/1.0)",
    "Referer": SOURCE_URL,
    "X-Requested-With": "XMLHttpRequest",
})

# ── address parsing ──────────────────────────────────────────────────────────
# Address format from Google Maps links: "123 Main St  City MD 12345-1234 USA"
ADDR_FULL_RE = re.compile(
    r"^(.+?)\s{2,}([A-Za-z ]+?)\s+(MD|DC|VA)\s+(\d{5})(?:-\d{4})?\s+USA$"
)

def parse_address(raw: str):
    """Parse 'street  city STATE zip USA' into components."""
    raw = raw.strip()
    m = ADDR_FULL_RE.match(raw)
    if m:
        return m.group(1).strip(), m.group(2).strip(), m.group(3).upper(), m.group(4)
    return raw, "", "MD", ""


# ── resource_type classifier ─────────────────────────────────────────────────
MEAL_KEYWORDS   = re.compile(r"\b(meal|soup kitchen|hot food|breakfast|lunch|dinner|dining)\b", re.I)
BANK_KEYWORDS   = re.compile(r"\bfood bank\b", re.I)
DISTRIB_KEYWORDS = re.compile(r"\b(distribution|mobile pantry|pop.?up|drive.?through|drive.?thru)\b", re.I)

def classify_type(name: str, hours_text: str) -> str:
    combined = f"{name} {hours_text}"
    if BANK_KEYWORDS.search(combined):
        return "food bank"
    if MEAL_KEYWORDS.search(combined):
        return "meal program"
    if DISTRIB_KEYWORDS.search(combined):
        return "distribution site"
    return "food pantry"


# ── HTML result parser ───────────────────────────────────────────────────────
def parse_html_results(html_str: str) -> list[dict]:
    soup = BeautifulSoup(html_str, "html.parser")
    rows = []

    for item in soup.select("div.gmw-single-item"):
        # Name
        title_tag = item.select_one("h3.gmw-item-title")
        if not title_tag:
            continue
        name = title_tag.get_text(strip=True)
        if not name:
            continue

        # Address — from the Google Maps href which has clean structured data
        address_str = city = state = zip_code = ""
        addr_tag = item.select_one("div.gmw-item-address a")
        if addr_tag:
            href = addr_tag.get("href", "")
            # href = "https://maps.google.com/?q=123 Main St  City MD 21201-1234 USA"
            m = re.search(r"\?q=(.+)$", href)
            if m:
                raw_addr = requests.utils.unquote(m.group(1)).replace("+", " ")
                address_str, city, state, zip_code = parse_address(raw_addr)

        # Phone and website from meta list
        phone = website = email = ""
        for li in item.select("ul.gmw-location-meta li"):
            label = li.select_one(".label")
            info  = li.select_one(".info")
            if not label or not info:
                continue
            lbl = label.get_text(strip=True).lower().rstrip(":")
            val = info.get_text(strip=True)
            href = info.select_one("a")
            href_val = href.get("href", "") if href else ""

            if lbl == "phone":
                phone = val
            elif lbl == "website":
                # Sometimes email is stored in website field
                if "@" in val or "mailto:" in href_val:
                    email = val.replace("mailto:", "")
                else:
                    website = href_val if href_val.startswith("http") else f"http://{val}"
            elif lbl == "email":
                email = val

        # Hours — from the excerpt div
        hours = ""
        excerpt = item.select_one("div.gmw-excerpt")
        if excerpt:
            raw = excerpt.get_text(strip=True)
            # Strip "Hours open:" prefix
            hours = re.sub(r"^Hours\s+open\s*:\s*", "", raw, flags=re.I).strip()

        resource_type = classify_type(name, hours)

        rows.append({
            "resource_name": name,
            "organization":  name,
            "resource_type": resource_type,
            "address":       address_str,
            "city":          city,
            "state":         state if state else "MD",
            "zip_code":      zip_code,
            "county":        "",   # not provided by this source
            "phone":         phone,
            "email":         email,
            "website":       website,
            "source_name":   SOURCE_NAME,
            "source_url":    SOURCE_URL,
            "hours":         hours,
            "eligibility":   "",
            "languages":     "",
            "accessibility": "",
            "food_types":    "",
            "notes":         "",
            "last_updated":  TODAY,
        })

    return rows


# ── paginated fetch ──────────────────────────────────────────────────────────
def fetch_all_locations() -> list[dict]:
    all_rows = []
    page = 1

    while True:
        payload = {
            "action":            "gmw_form_ajax_submission",
            "form_submitted":    "",
            "form_values":       "",
            "filters":           "",
            "page":              str(page),
            "form_id":           "2",
            "per_page_triggered": "0",
        }

        resp = SESSION.post(AJAX_URL, data=payload, timeout=30, verify=False)
        resp.raise_for_status()
        data = resp.json()

        if not data.get("results_enabled") or not data.get("found_results"):
            break

        html_str = data.get("html_results", "")
        rows = parse_html_results(html_str)
        all_rows.extend(rows)

        max_pages = int(data.get("max_pages", 1))
        print(f"  Page {page}/{max_pages} — {len(rows)} locations parsed "
              f"(total so far: {len(all_rows)})")

        if page >= max_pages:
            break

        page += 1
        time.sleep(0.4)   # be polite

    return all_rows


# ── CSV writer ───────────────────────────────────────────────────────────────
def write_csv(rows: list[dict], path: str):
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=SCHEMA)
        writer.writeheader()
        writer.writerows(rows)
    print(f"\nWrote {len(rows)} rows → {path}")


# ── main ─────────────────────────────────────────────────────────────────────
def main():
    print(f"Fetching all locations from {SOURCE_URL} …\n")
    rows = fetch_all_locations()

    if not rows:
        raise SystemExit("ERROR: No locations parsed.")

    write_csv(rows, OUTPUT_FILE)

    # Quick quality summary
    with_addr  = sum(1 for r in rows if r["address"])
    with_phone = sum(1 for r in rows if r["phone"])
    with_hours = sum(1 for r in rows if r["hours"])
    with_web   = sum(1 for r in rows if r["website"])
    types      = {}
    for r in rows:
        types[r["resource_type"]] = types.get(r["resource_type"], 0) + 1

    print(f"\nQuality summary ({len(rows)} rows):")
    print(f"  address:  {with_addr} ({with_addr*100//len(rows)}%)")
    print(f"  phone:    {with_phone} ({with_phone*100//len(rows)}%)")
    print(f"  hours:    {with_hours} ({with_hours*100//len(rows)}%)")
    print(f"  website:  {with_web} ({with_web*100//len(rows)}%)")
    print(f"  types:    {types}")


if __name__ == "__main__":
    main()
