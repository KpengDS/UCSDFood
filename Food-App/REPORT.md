# Sustainable Food Hub — Project Report

## Introduction

Sustainable Food Hub is a web-based platform designed to centralize food assistance information across the DC, Maryland, and Virginia (DMV) region. The tool aggregates publicly available data from government portals, nonprofit organizations, and community directories into a single searchable interface. It addresses a core problem in food access: information about pantries, distribution events, and volunteer opportunities is scattered across dozens of disconnected websites, making it difficult for people in need to find help quickly.

The platform was built using React with Vite, styled with Tailwind CSS and shadcn/ui components, and uses local structured data sourced from verified public datasets.

## Intended Users

The platform serves three primary user groups:

**Families and individuals seeking food assistance.** These users need to quickly locate nearby food pantries, distribution events, and meal programs. Many face barriers including limited internet access, language differences, and transportation constraints. The tool provides ZIP code and city-based search so users can find resources in their immediate area without navigating multiple websites. Each listing includes address, hours, eligibility requirements, contact information, and transportation notes.

**Donors looking to contribute food or funds.** Donors often lack clarity on which organizations are actively accepting contributions and what types of support are most needed. The Donors page surfaces organizations filtered by whether they accept food donations, monetary donations, or both, along with their service areas and direct contact information. This removes the guesswork from charitable giving.

**Volunteers seeking opportunities.** The Volunteers page lists open positions at food banks and distribution sites across the DMV, including role descriptions, dates, locations, slot availability, and skills needed. Users can browse opportunities and contact organizations directly.

## User Interface Overview

The application uses a dark-themed, typography-driven design with a full-screen navigation overlay, scroll-based reveal animations, and a consistent visual language across all pages.

**Homepage.** The landing page features a parallax hero section with the platform name and a clear call to action. Below it, a mission section explains the platform's purpose, followed by three stakeholder pathway cards (Families, Donors, Volunteers) that link to their respective pages. A horizontal-scroll events gallery shows upcoming distribution events. A data section presents key statistics from Feeding America and the Capital Area Food Bank with inline source citations. A final call-to-action section provides direct links to all major pathways.

**Families page.** A search interface where users enter a ZIP code or city name. Results filter in real time, showing matching food distribution events as cards with location, date, food types, and eligibility information. Each card links to a detail page.

**Events page.** A browsable archive of all food distribution events with text search across event names, cities, and organizers.

**Event Detail page.** A two-column layout with sticky event specifications on the left (date, time, location, organizer, food types, contact info) and scrollable content on the right (description, eligibility, transportation notes, recurrence info).

**Donors page.** Lists organizations accepting donations, filtered to show only those with active food or monetary donation programs. Each card shows organization type, description, service area, and direct links.

**Volunteers page.** Displays open volunteer opportunities with date, location, slots available, skills needed, and contact email.

**Resources page.** A searchable, filterable directory of 40+ data sources organized by category (Data and Maps, Demographics, Directories, Food Pantries, Government). Each entry links to the original source with a description of what data it provides.

**Inquiry page.** A contact form where users select their role (family, donor, volunteer, organization, other), enter their information, and submit a message.

## Core Features and User Flow

1. A user arrives at the homepage and sees the platform overview with key hunger statistics.
2. They select a pathway: Find Food, Donate, or Volunteer.
3. On the Families page, they enter their ZIP code (e.g., 20020 for Anacostia). The interface filters to show only events in that area.
4. They click an event card to see full details including address, hours, eligibility, food types, and transportation options.
5. Alternatively, a donor navigates to the Donors page, sees organizations accepting contributions, and contacts them directly.
6. A volunteer browses open positions, finds one matching their schedule and location, and reaches out via the listed contact email.
7. The Resources page serves as a reference for anyone wanting to explore the underlying data sources.

## Backend Data Ingestion and Architecture

The application uses a local structured data layer rather than a remote API. Data is stored in a JavaScript module (`src/data/foodData.js`) that exports arrays of food events, organizations, volunteer opportunities, and inquiries.

**Data model.** Four entity schemas define the structure:

- **FoodEvent**: title, description, organizer, event_date, end_date, location_name, address, city, state, zip_code, eligibility, food_types (array), is_recurring, recurrence_pattern, needs_volunteers, accepts_donations, contact_email, contact_phone, website_url, status, transportation_notes
- **Organization**: name, type (nonprofit/government/community), description, address, city, state, zip_code, contact info, accepts_food_donations, accepts_monetary_donations, needs_volunteers, service_area
- **VolunteerOpportunity**: title, organization_name, description, date, location, city, slots_available, skills_needed, contact_email, status
- **Inquiry**: name, email, role, message, zip_code, status

The project also includes Python scraping scripts (`scrape_food_resources.py`, `ingest_211md.py`, `ingest_mocofoodcouncil.py`, `ingest_pgcfec.py`) and a CSV file (`food_resources.csv`) containing 286+ food pantry records scraped from the Maryland Food Bank partner network. These scripts form the data ingestion pipeline that populates the structured data used by the frontend.

**Architecture.** The frontend is a single-page React application built with Vite. Routing is handled by React Router with a shared Layout component (navigation + footer) wrapping all pages. State management uses React hooks. The `@` path alias maps to `src/` for clean imports. Tailwind CSS with custom CSS variables handles theming.

## Additional Data Sources

The following publicly available data sources were used to populate the platform. All data was rephrased and no content was reproduced verbatim beyond 30 consecutive words from any single source.

- Feeding America Map the Meal Gap 2025 (feedingamerica.org) — national and county-level food insecurity estimates
- Maryland Food Bank partner network (mdfoodbank.org/find-food/) — 286+ food pantry locations across Maryland
- Capital Area Food Bank (capitalareafoodbank.org) — DMV food insecurity data and distribution site information
- Bread for the City (breadforthecity.org) — DC food pantry data
- Prince George's County Dept of Social Services (princegeorgescountymd.gov) — county food pantry locations and services
- PG County Food Equity Council (pgcfec.org) — food assistance provider listings and SNAP/WIC resources
- Montgomery County Food Council (mocofoodcouncil.org) — food assistance resource directory with 90+ organizations
- DC Open Data (opendata.dc.gov) — community resource datasets
- Virginia Open Data (data.virginia.gov) — state service datasets
- Virginia Federation of Food Banks (vafoodbanks.org) — statewide hunger statistics
- Arlington County Food Assistance (arlingtonva.us) — food pantry information in 7 languages
- UMD Extension Food Access Resources (extension.umd.edu) — statewide food access compilation
- USDA Food Environment Atlas (ers.usda.gov) — food environment indicators by county
- USDA SNAP Retailer Locator (usda-fns.maps.arcgis.com) — authorized SNAP retailer locations
- EPA Excess Food Opportunities Map (epa.gov) — 960,000+ food generators and 15,000+ recipients
- Maryland Community Business Compass (compass.maryland.gov) — GIS community data
- Maryland Dept of Agriculture (mda.maryland.gov) — agricultural programs and farmers market guides
- 211 Maryland (search.211md.org) — statewide social services directory with 10,000+ listings
- U.S. Census Bureau American Community Survey (data.census.gov) — demographic and poverty data
- Prince George's County Open Data (data.princegeorgescountymd.gov) — local community datasets
- Caroline Better Together (carolinebettertogether.org) — Eastern Shore food pantry directory
- Maryland State Archives food pantry directory (msa.maryland.gov)

## Prompt Engineering Experience

The tool was built iteratively through conversational prompts with Kiro. The development process followed these phases:

1. **Scaffolding.** Initial prompts established the project structure: API client configuration, entity definitions, component stubs, page stubs, and UI component library (shadcn/ui primitives).

2. **Component migration.** UI component code from a previous Base44 prototype was pasted into the chat and Kiro formatted and placed each file correctly. This included 30+ shadcn/ui components (accordion, alert-dialog, button, card, dialog, form, input, select, tabs, toast, tooltip, sidebar, etc.).

3. **Data layer replacement.** A key prompt engineering challenge was migrating from the Base44 SDK (which required external API calls) to a fully local data layer. This required identifying all import references, creating a mock data module, and updating every page component. Multiple iterations were needed to ensure zero external dependencies remained.

4. **Real data integration.** URLs to public data sources were provided one at a time. Kiro fetched and extracted key information from each source, then incorporated it into the structured data file with proper attribution.

5. **Branding and originality.** Prompts directed renaming from the original "Nourish" branding to "Sustainable Food Hub" and ensuring no plagiarized content remained.

6. **Git integration.** Since Node and Git were installed but not in the system PATH, Kiro used full executable paths to run npm install, start the dev server, and push to GitHub directly from the terminal.

## Limitations and Future Improvements

**Current limitations:**
- Data is static — the food events and organization listings are hardcoded in a JavaScript file rather than pulled from a live database or API. Updates require code changes.
- ZIP code search is a simple string match against stored zip codes and city names. It does not perform geographic proximity calculations.
- The inquiry form stores submissions in memory only — they are lost on page refresh.
- No user authentication or saved preferences.
- No map visualization despite having address data for all locations.

**Future improvements:**
- **Live data pipeline.** Connect the Python scraping scripts to a scheduled job that updates a database (e.g., Supabase or Firebase). The frontend would fetch from this database instead of a static file.
- **Geolocation search.** Use the browser's Geolocation API combined with a geocoding service to show results sorted by actual distance from the user.
- **Interactive map.** Add a Leaflet or Mapbox map view to the Families and Events pages showing pantry locations as pins.
- **Backend for inquiries.** Store form submissions in a database and send email notifications to relevant organizations.
- **Multilingual support.** Arlington's AFAC serves in 7 languages — the platform should support at least English and Spanish.
- **Accessibility audit.** Conduct testing with screen readers and keyboard navigation to ensure WCAG 2.1 AA compliance.
- **Machine learning component.** Train a model on food insecurity indicators (Census poverty data, SNAP enrollment, food desert classifications) to predict which communities are most underserved and prioritize resource allocation.

## Conclusion

Sustainable Food Hub demonstrates that publicly available food assistance data can be aggregated into a usable, searchable interface that serves families, donors, and volunteers across the DMV region. The platform draws from 20+ verified public data sources and presents information in a clean, accessible format. While the current implementation uses static data, the architecture supports future expansion to live data feeds, geographic search, and predictive analytics. The project was built entirely through prompt-driven development with Kiro, with iterative refinement of data sources, branding, and user experience.
