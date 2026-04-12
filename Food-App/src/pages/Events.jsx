import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SectionLabel from "../components/SectionLabel";
import RevealSection from "../components/RevealSection";
import EventCard from "../components/EventCard";
import { foodEvents } from "@/data/mock";

export default function Events() {
  const [search, setSearch] = useState("");
  const events = foodEvents;

  const filtered = events.filter(
    (e) =>
      !search ||
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.city?.toLowerCase().includes(search.toLowerCase()) ||
      e.organizer?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <section className="px-[8vw] pb-16 md:pb-24">
        <RevealSection>
          <SectionLabel label="Distribution Events" number={1} />
          <h1 className="font-heading text-[10vw] md:text-[5vw] uppercase leading-[0.85] tracking-tighter text-foreground">Event Archive</h1>
          <p className="font-body text-base text-muted-foreground mt-4 max-w-xl leading-relaxed">Browse upcoming food distribution events across Maryland and the Washington DC metro area.</p>
        </RevealSection>
        <RevealSection delay={0.2}>
          <div className="relative mt-12 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, city, or organizer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground font-body h-12" />
          </div>
        </RevealSection>
      </section>
      <section className="px-[8vw] pb-24 md:pb-40">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-heading text-sm uppercase tracking-widest text-muted-foreground">{search ? "No events match your search" : "No events yet"}</p>
            <p className="font-body text-sm text-muted-foreground mt-2">Check back soon for upcoming food distribution events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((event, i) => (<div key={event.id} className="w-full"><EventCard event={event} index={i} /></div>))}
          </div>
        )}
      </section>
    </div>
  );
}
