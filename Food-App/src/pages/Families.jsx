import { useState, useRef, useEffect } from "react";
import { MapPin, Search, X } from "lucide-react";
import RevealSection from "../components/RevealSection";
import EventCard from "../components/EventCard";
import { foodEvents } from "@/data/foodData";

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

  // Scroll to top when search is made
  useEffect(() => {
    if (activeSearch) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSearch]);

  const suggestions = query.length > 0
    ? searchOptions.filter((o) => o.key.includes(query.toLowerCase()) || o.label.toLowerCase().includes(query.toLowerCase()))
    : searchOptions;

  const filtered = events.filter((e) => {
    if (!activeSearch) return true;
    const s = activeSearch.toLowerCase();
    return e.zip_code?.includes(s) || e.city?.toLowerCase().includes(s) || e.state?.toLowerCase().includes(s) || e.address?.toLowerCase().includes(s);
  });

  const handleSelect = (key) => { setQuery(key); setActiveSearch(key); setShowDropdown(false); };
  const handleClear = () => { setQuery(""); setActiveSearch(""); };

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <section className="px-[8vw] pb-8">
        <h1 className="font-heading text-3xl md:text-5xl leading-tight text-foreground">Find Food Near You</h1>
        <p className="font-body text-base text-muted-foreground mt-3 max-w-xl leading-relaxed">Search verified food distribution sites across DC, Maryland, and Virginia.</p>

        {/* Search bar — right under the title */}
        <div className="relative mt-6 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a ZIP code or city..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveSearch(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground font-body text-base focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          />
          {showDropdown && suggestions.length > 0 && (
            <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
              {suggestions.map((opt) => (
                <button key={opt.key} onClick={() => handleSelect(opt.key)} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-accent/10 transition-colors border-b border-border/50 last:border-b-0">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="font-body text-sm text-foreground">{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {activeSearch && (
          <button onClick={handleClear} className="mt-3 flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-accent transition-colors">
            <X className="w-3 h-3" /> Clear search
          </button>
        )}
      </section>

      {/* Results header */}
      {activeSearch && (
        <div className="px-[8vw] py-4 border-y border-border/50 bg-card/50">
          <span className="font-body text-sm text-foreground">{filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{activeSearch}"</span>
        </div>
      )}

      {/* Results */}
      <section className="px-[8vw] py-8 pb-24">
        {activeSearch && filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-heading text-xl text-muted-foreground">No events found for "{activeSearch}"</p>
            <p className="font-body text-sm text-muted-foreground mt-2">Try a different ZIP code or city name</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeSearch ? filtered : events).map((event, i) => (
              <div key={event.id} className="w-full"><EventCard event={event} index={i} /></div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
