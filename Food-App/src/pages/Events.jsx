import { useState, useRef, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import SectionLabel from "../components/SectionLabel";
import RevealSection from "../components/RevealSection";
import EventCard from "../components/EventCard";
import { foodEvents } from "@/data/foodData";

// Build searchable options from event data
function getSearchOptions(events) {
  const opts = new Map();
  events.forEach((e) => {
    if (e.zip_code) opts.set(e.zip_code, `${e.zip_code} — ${e.city}, ${e.state}`);
    if (e.city) opts.set(e.city.toLowerCase(), `${e.city}, ${e.state}`);
    if (e.organizer) opts.set(e.organizer.toLowerCase(), e.organizer);
  });
  return Array.from(opts.entries()).map(([key, label]) => ({ key, label }));
}

export default function Events() {
  const events = foodEvents;
  const searchOptions = getSearchOptions(events);
  const [query, setQuery] = useState("");
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

  const suggestions = query.length > 0
    ? searchOptions.filter((o) =>
        o.key.includes(query.toLowerCase()) ||
        o.label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filtered = events.filter((e) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      e.title?.toLowerCase().includes(q) ||
      e.city?.toLowerCase().includes(q) ||
      e.organizer?.toLowerCase().includes(q) ||
      e.zip_code?.includes(q) ||
      e.address?.toLowerCase().includes(q)
    );
  });

  const handleSelect = (key) => {
    setQuery(key);
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <section className="px-[8vw] pb-16 md:pb-24">
        <RevealSection>
          <SectionLabel label="Distribution Events" number={1} />
          <h1 className="font-heading text-3xl md:text-5xl leading-tight text-foreground">Event Archive</h1>
          <p className="font-body text-base text-muted-foreground mt-4 max-w-xl leading-relaxed">Browse food distribution events across DC, Maryland, and Virginia. Search by ZIP code, city, or organization name.</p>
        </RevealSection>
        <RevealSection delay={0.2}>
          <div className="relative mt-10 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by ZIP, city, or organizer..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => { if (query.length > 0) setShowDropdown(true); }}
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
          {query && (
            <button
              onClick={() => setQuery("")}
              className="mt-3 font-body text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              ✕ Clear search
            </button>
          )}
        </RevealSection>
      </section>

      <section className="px-[8vw] pb-24 md:pb-40">
        <div className="flex items-end justify-between mb-8">
          <span className="font-body text-sm text-muted-foreground">{filtered.length} event{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-heading text-lg text-muted-foreground">{query ? `No events match "${query}"` : "No events yet"}</p>
            <p className="font-body text-sm text-muted-foreground mt-2">Try a different search term</p>
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
