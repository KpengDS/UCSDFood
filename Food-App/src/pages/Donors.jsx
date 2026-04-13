import { Link } from "react-router-dom";
import { Heart, Building2, ArrowUpRight } from "lucide-react";
import SectionLabel from "../components/SectionLabel";
import RevealSection from "../components/RevealSection";
import { organizations } from "@/data/foodData";

const DONORS_IMG =
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80";

export default function Donors() {
  const orgs = organizations.filter((o) => o.accepts_food_donations || o.accepts_monetary_donations);

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <section className="px-[8vw] pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
          <div className="md:col-span-6">
            <RevealSection>
              <SectionLabel label="For Donors" number={1} />
              <h1 className="font-heading text-[10vw] md:text-[4vw] uppercase leading-[0.85] tracking-tighter text-foreground">
                Give With Purpose
              </h1>
              <p className="font-body text-base text-muted-foreground mt-6 leading-relaxed max-w-lg">
                Find organizations actively accepting food and monetary donations. Know exactly where
                your contribution goes and the communities it serves.
              </p>
            </RevealSection>
            <RevealSection delay={0.2}>
              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="border border-border p-6">
                  <Heart className="w-5 h-5 text-accent mb-3" />
                  <h3 className="font-heading text-xs uppercase tracking-widest text-foreground">Food Donations</h3>
                  <p className="font-body text-xs text-muted-foreground mt-2">Donate produce, canned goods, and prepared meals</p>
                </div>
                <div className="border border-border p-6">
                  <Building2 className="w-5 h-5 text-accent mb-3" />
                  <h3 className="font-heading text-xs uppercase tracking-widest text-foreground">Monetary Support</h3>
                  <p className="font-body text-xs text-muted-foreground mt-2">Fund operations, transportation, and logistics</p>
                </div>
              </div>
            </RevealSection>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <RevealSection delay={0.3}>
              <div className="aspect-[4/3] overflow-hidden">
                <img src={DONORS_IMG} alt="Boxes ready for food packing" className="w-full h-full object-cover mono-to-color" />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      <section className="px-[8vw] py-16 md:py-24 border-t border-border">
        <RevealSection>
          <SectionLabel label="Organizations" number={2} />
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-foreground mb-12">Where to Donate</h2>
        </RevealSection>
        {orgs.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-heading text-sm uppercase tracking-widest text-muted-foreground">Organizations coming soon</p>
            <p className="font-body text-sm text-muted-foreground mt-2">We're building our directory of organizations that accept donations.</p>
            <Link to="/inquiry" className="inline-block mt-6 font-heading text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors">Register Your Organization →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orgs.map((org, i) => (
              <RevealSection key={org.id} delay={i * 0.05}>
                <div className="group border border-border hover:border-accent transition-colors p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-base uppercase tracking-tight text-foreground">{org.name}</h3>
                      <span className="font-heading text-[10px] uppercase tracking-widest text-accent mt-1 block">{org.type?.replace("_", " ")}</span>
                    </div>
                    {org.website_url && (
                      <a href={org.website_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {org.description && <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed">{org.description}</p>}
                  <div className="flex gap-3 mt-4">
                    {org.accepts_food_donations && <span className="font-heading text-[10px] uppercase tracking-widest text-accent px-3 py-1 border border-accent">Food</span>}
                    {org.accepts_monetary_donations && <span className="font-heading text-[10px] uppercase tracking-widest text-accent px-3 py-1 border border-accent">Monetary</span>}
                  </div>
                  {org.service_area && <p className="font-body text-xs text-muted-foreground mt-4">Serves: {org.service_area}</p>}
                </div>
              </RevealSection>
            ))}
          </div>
        )}
      </section>

      <section className="px-[8vw] py-16 md:py-24 border-t border-border">
        <RevealSection>
          <div className="max-w-xl">
            <h2 className="font-heading text-2xl uppercase tracking-tight text-foreground">Are You an Organization?</h2>
            <p className="font-body text-base text-muted-foreground mt-4 leading-relaxed">If your organization distributes food and wants to be listed on our platform, reach out to us.</p>
            <Link to="/inquiry" className="inline-block mt-6 font-heading text-xs uppercase tracking-widest px-6 py-3.5 bg-accent text-accent-foreground hover:bg-accent/80 transition-all">Get Listed</Link>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
