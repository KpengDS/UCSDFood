import { useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import SectionLabel from "../components/SectionLabel";
import RevealSection from "../components/RevealSection";
import EventCard from "../components/EventCard";
import { foodEvents } from "@/data/mock";

const FAMILIES_IMG =
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80";

export default function Families() {
  const events = foodEvents;
  const [zip, setZip] = useState("");

  const filtered = events.filter(
    (e) => !zip || e.zip_code?.includes(zip) || e.city?.toLowerCase().includes(zip.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <section className="px-[8vw] pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
          <div className="md:col-span-6">
            <RevealSection>
              <SectionLabel label="For Families" number={1} />
              <h1 className="font-heading text-[10vw] md:text-[4vw] uppercase leading-[0.85] tracking-tighter text-foreground">Find Food Near You</h1>
              <p className="font-body text-base text-muted-foreground mt-6 leading-relaxed max-w-lg">Search for food distribution events by ZIP code or city. We connect you with free food resources in Maryland and Washington DC.</p>
            </RevealSection>
            <RevealSection delay={0.2}>
              <div className="relative mt-10 max-w-sm">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Enter ZIP code or city..." value={zip} onChange={(e) => setZip(e.target.value)} className="pl-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground font-body h-12" />
              </div>
            </RevealSection>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <RevealSection delay={0.3}>
              <div className="aspect-[3/4] overflow-hidden">
                <img src={FAMILIES_IMG} alt="Family receiving food" className="w-full h-full object-cover mono-to-color" />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>
      <section className="px-[8vw] py-16 md:py-24 border-t border-border">
        <RevealSection><SectionLabel label="Nearby Events" number={2} /></RevealSection>
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-heading text-sm uppercase tracking-widest text-muted-foreground">{zip ? "No events found for that area" : "No events yet"}</p>
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
