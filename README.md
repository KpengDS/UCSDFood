# UCSDFood: Sustainable Food Hub
A web application that centralizes food assistance information across the DC/Maryland/Virginia region. Our mission are to connects families in need with free food distribution events, helps donor find organizations/community to support, and allows volunteers to seek out potential opportunities at local food banks.
## Features
- Families - Search for food distribution events by address
    - this can be city and/or ZIP code
- Donors - Browse organization accepting food and monetary donations
- Volunteers - Browse and sign up for volunteer opportunities
- Events - Full archive of food distrubtion events with details
    - Date
    - Time
    - Location
    - Organizer
    - Contact Information
    - Elgibility
    - Food Type
- Inquiry - Contact form for familities, donors, volunteers, and organizations
## Data Sources
All data is sourced from the University of Maryland-led team

- [Feeding America Map the Meal Gap 2025](https://www.feedingamerica.org/research/map-the-meal-gap)
- [Maryland Food Bank](https://www.mdfoodbank.org)
- [Capital Area Food Bank](https://www.capitalareafoodbank.org)
- [USDA Food Environment Atlas](https://www.ers.usda.gov/data-products/food-environment-atlas/)
- [211 Maryland](https://search.211md.org)
- [PG County Food Equity Council](https://www.pgcfec.org)
- [Montgomery County Food Council](https://www.mocofoodcouncil.org)
- [Arlington County Food Assistance](https://www.arlingtonva.us/Government/Programs/Human-Services/Food)
- [U.S. Census Bureau](https://data.census.gov)

## Tech Stack
- React 18 + Vite
- Tailwind CSS + Radix UI
- React Router 6
- TanStack React Query
- React Hoot Form + Zod
- Framer Motion

## Project Structure

```
Food-App/
├── src/
│   ├── pages/          # Route pages (Home, Events, Families, Donors, etc.)
│   ├── components/     # Reusable components + UI library
│   ├── entities/       # Data model schemas (FoodEvent, Organization, etc.)
│   ├── data/           # Static food resource data
│   ├── lib/            # Utilities and context
│   ├── hooks/          # Custom React hooks
│   └── assets/         # Images and icons
├── public/             # Static assets
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Getting Started
You will need to install:
- Node.js(v16+)
- npm (comes with Node)

Installation - clone and installl dependencies:
```bash
git clone <https://github.com/KpengDS/UCSDFood.git> 
cd Food-App
npm install
```

Run the app:
```bash
npm run dev
```
Then open the link in the browser.

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, mission, stakeholder pathways, upcoming events |
| `/events` | Searchable event archive |
| `/events/:id` | Individual event detail |
| `/families` | Find food near you by ZIP code or city |
| `/donors` | Organizations accepting donations |
| `/volunteers` | Browse volunteer opportunities |
| `/resources` | Data sources and external tools |
| `/inquiry` | Contact and inquiry form |

---
