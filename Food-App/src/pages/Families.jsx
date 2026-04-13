import { useState, useRef, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import SectionLabel from "../components/SectionLabel";
import RevealSection from "../components/RevealSection";
import EventCard from "../components/EventCard";
import { foodEvents } from "@/data/foodData";

// Image from Unsplash (unsplash.com) — free under Unsplash License
const FAMILIES_IMG =
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80"; // Brooke Lark

// Build unique searchable locations from the data
function getSearchOptions(events) {
  const opts = new Map();
  events.forEach((e) => {
    if (e.zip_code) opts.set(e.zip_code, `${e.zip_code} — ${e.city}, ${e.state}`);
    if (e.city) opts.set(e.city.toLowerCase(), `${e.city}, ${e.state}`);
  });
  return Array.from(opts.entries()).map(([key, label]) => ({ key, label }));
}

export default function Families() {
  const events = foodEvents;
  const searchOptions = getSearchOptions(events);
  const [query, setQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions = query.length > 0
    ? searchOptions.filter((o) => o.key.includes(query.toLowerCase()) || o.label.toLowerCase().includes(query.toLowerCase()))
    : searchOptions;

  const filtered = events.filter((e) => {
    if (!activeSearch) return true;
    const s = activeSearch.toLowerCase();
    return (
      e.zip_code?.includes(s) ||
      e.city?.toLowerCase().includes(s) ||
      e.state?.toLowerCase().includes(s) ||
      e.address?.toLowerCase().includes(s)
    );
  });

  const handleSelect = (key) => {
    setQuery(key);
    setActiveSearch(key);
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setActiveSearch(e.target.value);
    setShowDropdown(true);
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <section className="px-[8vw] pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
          <div className="md:col-span-6">
            <RevealSection>
              <SectionLabel label="For Families" number={1} />
              <h1 className="font-heading text-3xl md:text-5xl leading-tight text-foreground">Find Food Near You</h1>
              <p className="font-body text-base text-muted-foreground mt-6 leading-relaxed max-w-lg">Search for verified food distribution sites by ZIP code or city. Data sourced from the Maryland Food Bank, Capital Area Food Bank, PG County Social Services, and other public directories.</p>
            </RevealSection>
            <RevealSection delay={0.2}>
              <div className="relative mt-10 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a ZIP code or city..."
                  value={query}
                  onChange={handleInputChange}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground font-body text-base focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
                {showDropdown && suggestions.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg max-h-64 overflow-y-auto z-50"
                  >
                    {suggestions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => handleSelect(opt.key)}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-accent/10 transition-colors border-b border-border/50 last:border-b-0"
                      >
                        <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="font-body text-sm text-foreground">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {activeSearch && (
                <button
                  onClick={() => { setQuery(""); setActiveSearch(""); }}
                  className="mt-3 font-body text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  ✕ Clear search
                </button>
              )}
            </RevealSection>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <RevealSection delay={0.3}>
              <div className="overflow-hidden rounded-md" style={{ height: "400px" }}>
                <img src={FAMILIES_IMG} alt="Fresh produce — photo by Brooke Lark on Unsplash" className="w-full h-full object-cover" />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      <section className="px-[8vw] py-16 md:py-24 border-t border-border">
        <RevealSection>
          <div className="flex items-end justify-between mb-8">
            <SectionLabel label="Results" number={2} />
            <span className="font-body text-sm text-muted-foreground">{filtered.length} location{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </RevealSection>
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-heading text-lg text-muted-foreground">{activeSearch ? `No events found for "${activeSearch}"` : "Start typing to search"}</p>
            <p className="font-body text-sm text-muted-foreground mt-2">Try a different ZIP code or city name</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <div key={event.id} className="w-full">
                <EventCard event={event} index={i} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
