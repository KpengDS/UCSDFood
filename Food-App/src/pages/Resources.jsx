import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SectionLabel from "../components/SectionLabel";
import RevealSection from "../components/RevealSection";

const CATEGORIES = ["All", "Data & Maps", "Demographics", "Directories", "Food Pantries", "Government"];

const RESOURCES = [
  {
    name: "USDA Food Access Research Atlas",
    url: "https://www.ers.usda.gov/data-products/food-access-research-atlas/",
    description: "Interactive map of food access indicators by census tract across the United States.",
    category: "Data & Maps",
  },
  {
    name: "Feeding America: Map the Meal Gap",
    url: "https://www.feedingamerica.org/research/map-the-meal-gap",
    description: "County-level data on food insecurity and food costs across every county in America.",
    category: "Data & Maps",
  },
  {
    name: "USDA Food Environment Atlas",
    url: "https://www.ers.usda.gov/data-products/food-environment-atlas/",
    description: "Maps and data on food choices, health and well-being, and community characteristics.",
    category: "Data & Maps",
  },
  {
    name: "Census Bureau Food Security Supplement",
    url: "https://www.census.gov/programs-surveys/cps/about/supplemental.html",
    description: "Annual supplement measuring household food security status and access to food assistance.",
    category: "Demographics",
  },
  {
    name: "USDA Economic Research Service — Food Security",
    url: "https://www.ers.usda.gov/topics/food-nutrition-assistance/food-security-in-the-u-s/",
    description: "National and state-level food security statistics, reports, and publications.",
    category: "Demographics",
  },
  {
    name: "County Health Rankings — Food Environment Index",
    url: "https://www.countyhealthrankings.org/",
    description: "Rankings and data on health factors including food environment for every county.",
    category: "Demographics",
  },
  {
    name: "Maryland Food System Map",
    url: "https://mdfoodsystemmap.org/",
    description: "Interactive map of Maryland's food system including farms, markets, and food access points.",
    category: "Data & Maps",
  },
  {
    name: "DC Food Policy Council",
    url: "https://dcfoodpolicy.org/",
    description: "Policy research and resources for food access and equity in Washington DC.",
    category: "Directories",
  },
  {
    name: "Capital Area Food Bank",
    url: "https://www.capitalareafoodbank.org/find-food/",
    description: "Find food distribution sites across the DC metro area including Maryland and Virginia.",
    category: "Food Pantries",
  },
  {
    name: "Maryland Food Bank",
    url: "https://mdfoodbank.org/find-food/",
    description: "Locate food pantries and distribution programs throughout Maryland.",
    category: "Food Pantries",
  },
  {
    name: "Feeding America: Find Your Local Food Bank",
    url: "https://www.feedingamerica.org/find-your-local-foodbank",
    description: "National directory to locate food banks and pantries by ZIP code.",
    category: "Food Pantries",
  },
  {
    name: "2-1-1 Maryland",
    url: "https://www.211md.org/",
    description: "Dial 2-1-1 or search online for food assistance, shelters, and social services in Maryland.",
    category: "Directories",
  },
  {
    name: "Prince George's County Food Equity Council",
    url: "https://www.pgcfec.org/",
    description: "Advocacy and resources for food equity in Prince George's County, Maryland.",
    category: "Directories",
  },
  {
    name: "Montgomery County Food Council",
    url: "https://mocofoodcouncil.org/",
    description: "Connecting residents to food resources and policy initiatives in Montgomery County.",
    category: "Directories",
  },
  {
    name: "SNAP Retailer Locator",
    url: "https://www.fns.usda.gov/snap/retailer-locator",
    description: "Find stores and farmers markets that accept SNAP/EBT benefits near you.",
    category: "Directories",
  },
  {
    name: "WIC Store Locator",
    url: "https://www.fns.usda.gov/wic",
    description: "Information and resources for the Women, Infants, and Children nutrition program.",
    category: "Directories",
  },
  {
    name: "Bread for the City",
    url: "https://breadforthecity.org/food/",
    description: "Free groceries and social services for DC residents in need.",
    category: "Food Pantries",
  },
  {
    name: "Martha's Table",
    url: "https://marthastable.org/",
    description: "Healthy food access, education, and family support in Washington DC.",
    category: "Food Pantries",
  },
  {
    name: "So Others Might Eat (SOME)",
    url: "https://some.org/",
    description: "Meals, housing, and services for people experiencing poverty and homelessness in DC.",
    category: "Food Pantries",
  },
  {
    name: "Food Research & Action Center (FRAC)",
    url: "https://frac.org/",
    description: "National research and advocacy organization focused on ending hunger and undernutrition.",
    category: "Demographics",
  },
  {
    name: "Healthy Food Access Portal",
    url: "https://www.healthyfoodaccess.org/",
    description: "Tools and resources for communities working to improve access to healthy food.",
    category: "Directories",
  },
  {
    name: "USDA Community Food Systems",
    url: "https://www.nal.usda.gov/legacy/afsic/community-food-systems",
    description: "Resources on local and regional food systems, food hubs, and farm-to-institution programs.",
    category: "Data & Maps",
  },
  {
    name: "No Kid Hungry",
    url: "https://www.nokidhungry.org/find-free-meals",
    description: "Find free meals for children including school meals, summer meals, and after-school programs.",
    category: "Food Pantries",
  },
  {
    name: "DC Central Kitchen",
    url: "https://dccentralkitchen.org/",
    description: "Combating hunger through culinary job training and healthy school meals in DC.",
    category: "Food Pantries",
  },
  {
    name: "Food and Nutrition Service (FNS)",
    url: "https://www.fns.usda.gov/",
    description: "USDA agency administering federal nutrition assistance programs including SNAP, WIC, and school meals.",
    category: "Demographics",
  },
  {
    name: "PG County Food Pantry Services",
    url: "https://www.princegeorgescountymd.gov/departments-offices/food-pantry-services",
    description: "Three permanent county-operated food pantries in Landover, Hyattsville, and Temple Hills. No registration required. Serves ~300 residents daily per location.",
    category: "Food Pantries",
  },
  {
    name: "PG County Food Equity Council — Pantry Listings",
    url: "https://pgcfec.org/resources/find-food-food-pantry-listings/",
    description: "Directory of food assistance providers in Prince George's County. Includes SNAP application help, WIC info, and 30+ community pantries.",
    category: "Directories",
  },
  {
    name: "Montgomery County Food Council — Resource Map",
    url: "https://mocofoodcouncil.org/map/",
    description: "Interactive directory of 90+ food assistance organizations in Montgomery County. Searchable by location, food type, accessibility, and dietary needs.",
    category: "Directories",
  },
  {
    name: "USDA SNAP Retailer Locator Map",
    url: "https://usda-fns.maps.arcgis.com/apps/webappviewer/index.html?id=15e1c457b56c4a729861d015cd626a23",
    description: "Interactive USDA map of authorized SNAP retailers nationwide. Find stores and farmers markets accepting EBT benefits by location.",
    category: "Data & Maps",
  },
  {
    name: "EPA Excess Food Opportunities Map",
    url: "https://www.epa.gov/sustainable-management-food/excess-food-opportunities-map",
    description: "Maps 960,000+ potential food generators and 15,000+ recipients to support diversion of excess food from landfills. Covers industrial, commercial, and institutional sectors.",
    category: "Data & Maps",
  },
  {
    name: "Maryland Community Business Compass",
    url: "https://compass.maryland.gov/map/",
    description: "GIS-based mapping tool providing data on Maryland communities, businesses, and services. Useful for regional food access analysis and infrastructure planning.",
    category: "Data & Maps",
  },
  {
    name: "Maryland Dept of Agriculture",
    url: "https://mda.maryland.gov/Pages/default.aspx",
    description: "State agency overseeing agricultural programs including the Maryland Food and Agricultural Resiliency Mechanism (MFARM) grant and farmers market guides.",
    category: "Government",
  },
  {
    name: "Maryland Hunger Map",
    url: "https://mdfoodbank.org/hunger-in-maryland/maryland-hunger-map/",
    description: "Interactive map from the Maryland Food Bank showing food insecurity levels, distribution sites, and demographic data across all Maryland counties.",
    category: "Data & Maps",
  },
  {
    name: "UMD Extension — Food Access Resources",
    url: "https://extension.umd.edu/resource/food-access-resources",
    description: "Compilation of food access resources for Maryland including SNAP-Ed recipes, pantry gardens, farm-to-food-assistance programs, and county food policy councils.",
    category: "Directories",
  },
  {
    name: "211 Maryland — Food Pantry Search",
    url: "https://search.211md.org/search?query=food+pantry",
    description: "Free statewide social services directory with 10,000+ listings. Search for food pantries, meal programs, WIC, SNAP assistance, and emergency food by location.",
    category: "Directories",
  },
  {
    name: "U.S. Census Bureau — American Community Survey",
    url: "https://data.census.gov/",
    description: "Demographic data including income, poverty rates, and household characteristics. Essential for identifying communities vulnerable to food insecurity.",
    category: "Demographics",
  },
  {
    name: "Maryland Open Data Portal",
    url: "https://opendata.maryland.gov/",
    description: "Statewide open datasets including demographics, community resources, and environmental data supporting food access analysis.",
    category: "Government",
  },
  {
    name: "DC Open Data Portal",
    url: "https://opendata.dc.gov/",
    description: "Washington DC datasets on community resources, food assistance programs, demographics, and public services.",
    category: "Government",
  },
  {
    name: "Virginia Open Data Portal",
    url: "https://data.virginia.gov/",
    description: "Virginia state datasets on community services, public programs, and regional infrastructure. Over 854,000 Virginians are enrolled in SNAP.",
    category: "Government",
  },
  {
    name: "PG County Open Data Portal",
    url: "https://data.princegeorgescountymd.gov/",
    description: "Local datasets including schools, public facilities, community resources, and neighborhood statistics for Prince George's County.",
    category: "Government",
  },
  {
    name: "Caroline Better Together — Food Pantries",
    url: "https://carolinebettertogether.org/food-pantries/",
    description: "Directory of food pantries serving Caroline County on Maryland's Eastern Shore.",
    category: "Food Pantries",
  },
  {
    name: "MD DHS — Emergency Food Assistance Program (TEFAP)",
    url: "https://dhs.maryland.gov/emergency-food-assistance-program/",
    description: "Federal program providing USDA foods to states for distribution through food banks. Allocation based on population, poverty, and unemployment rates.",
    category: "Government",
  },
  {
    name: "Feeding America — Hunger in Maryland",
    url: "https://www.feedingamerica.org/hunger-in-america/maryland",
    description: "State-level food insecurity data for Maryland including county breakdowns, SNAP participation rates, and economic impact of food assistance programs.",
    category: "Demographics",
  },
  {
    name: "PG County Healthy Food Priority Areas Dashboard",
    url: "https://princegeorges.maps.arcgis.com/apps/dashboards/9f9202c51cc345ab9e0e1aa21a23bb76",
    description: "ArcGIS dashboard mapping healthy food access priority areas across Prince George's County, MD.",
    category: "Data & Maps",
  },
];

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = RESOURCES.filter((r) => {
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    const matchesSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <section className="px-[8vw] pb-16 md:pb-24">
        <RevealSection>
          <SectionLabel label="Data Sources" number={1} />
          <h1 className="font-heading text-[10vw] md:text-[5vw] uppercase leading-[0.85] tracking-tighter text-foreground">
            Source Directory
          </h1>
          <p className="font-body text-base text-muted-foreground mt-4 max-w-xl leading-relaxed">
            Every data point on Sustainable Food Hub comes from a publicly available, verifiable source. Below are the datasets, directories, government portals, and nonprofit tools that power this platform.
          </p>
        </RevealSection>

        <RevealSection delay={0.2}>
          <div className="mt-12 flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground font-body h-12"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-heading text-[10px] uppercase tracking-widest px-4 py-2 border transition-colors ${
                    activeCategory === cat
                      ? "border-accent text-accent bg-accent/10"
                      : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      <section className="px-[8vw] pb-24 md:pb-40">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-heading text-sm uppercase tracking-widest text-muted-foreground">
              No resources match your search
            </p>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((resource, i) => (
              <RevealSection key={resource.name} delay={i * 0.03}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block border border-border hover:border-accent transition-colors duration-500 p-6 md:p-8 h-full"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="font-heading text-[10px] uppercase tracking-widest text-accent block mb-2">
                        {resource.category}
                      </span>
                      <h3 className="font-heading text-sm md:text-base uppercase tracking-tight text-foreground group-hover:text-accent transition-colors">
                        {resource.name}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
                  </div>
                </a>
              </RevealSection>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
