import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, Clock } from "lucide-react";
import moment from "moment";
import SectionLabel from "../components/SectionLabel";
import RevealSection from "../components/RevealSection";
import { volunteerOpportunities } from "@/data/foodData";

// Image from Unsplash (unsplash.com) — free under Unsplash License
const VOLUNTEERS_IMG =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"; // Joel Muniz

export default function Volunteers() {
  const opportunities = volunteerOpportunities;

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      {/* Hero */}
      <section className="px-[8vw] pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
          <div className="md:col-span-6">
            <RevealSection>
              <SectionLabel label="For Volunteers" number={1} />
              <h1 className="font-heading text-[10vw] md:text-[4vw] uppercase leading-[0.85] tracking-tighter text-foreground">
                Lend a Hand
              </h1>
              <p className="font-body text-base text-muted-foreground mt-6 leading-relaxed max-w-lg">
                Volunteer opportunities across Maryland and the DC metro area. Help sort, pack, and
                distribute food to families in need. Every hour you give makes a difference.
              </p>
            </RevealSection>
            <RevealSection delay={0.2}>
              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="border border-border p-6">
                  <Users className="w-5 h-5 text-accent mb-3" />
                  <h3 className="font-heading text-xs uppercase tracking-widest text-foreground">
                    Team Events
                  </h3>
                  <p className="font-body text-xs text-muted-foreground mt-2">
                    Bring your group for a meaningful day of service
                  </p>
                </div>
                <div className="border border-border p-6">
                  <Clock className="w-5 h-5 text-accent mb-3" />
                  <h3 className="font-heading text-xs uppercase tracking-widest text-foreground">
                    Flexible Hours
                  </h3>
                  <p className="font-body text-xs text-muted-foreground mt-2">
                    Find shifts that fit your schedule
                  </p>
                </div>
              </div>
            </RevealSection>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <RevealSection delay={0.3}>
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={VOLUNTEERS_IMG}
                  alt="Volunteers packing food boxes"
                  className="w-full h-full object-cover mono-to-color"
                />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Opportunities List */}
      <section className="px-[8vw] py-16 md:py-24 border-t border-border">
        <RevealSection>
          <SectionLabel label="Opportunities" number={2} />
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-foreground mb-12">
            Open Positions
          </h2>
        </RevealSection>

        {opportunities.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-heading text-sm uppercase tracking-widest text-muted-foreground">
              No volunteer opportunities right now
            </p>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Check back soon — new opportunities are added regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((opp, i) => (
              <RevealSection key={opp.id} delay={i * 0.05}>
                <div className="group border border-border hover:border-accent transition-colors p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-base uppercase tracking-tight text-foreground group-hover:text-accent transition-colors">
                        {opp.title}
                      </h3>
                      <span className="font-heading text-[10px] uppercase tracking-widest text-accent mt-1 block">
                        {opp.organization_name}
                      </span>
                    </div>
                  </div>

                  {opp.description && (
                    <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed">
                      {opp.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-4">
                    {opp.date && (
                      <span className="font-body text-xs text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {moment(opp.date).format("MMM D, YYYY")}
                      </span>
                    )}
                    {(opp.location || opp.city) && (
                      <span className="font-body text-xs text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        {opp.location || opp.city}
                      </span>
                    )}
                    {opp.slots_available != null && (
                      <span className="font-body text-xs text-muted-foreground flex items-center gap-1.5">
                        <Users className="w-3 h-3" />
                        {opp.slots_available} slots available
                      </span>
                    )}
                  </div>

                  {opp.skills_needed && (
                    <p className="font-body text-xs text-muted-foreground mt-3">
                      Skills: {opp.skills_needed}
                    </p>
                  )}

                  {opp.contact_email && (
                    <a
                      href={`mailto:${opp.contact_email}`}
                      className="inline-block mt-4 font-heading text-[10px] uppercase tracking-widest text-accent hover:text-foreground transition-colors"
                    >
                      Contact → {opp.contact_email}
                    </a>
                  )}
                </div>
              </RevealSection>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="px-[8vw] py-16 md:py-24 border-t border-border">
        <RevealSection>
          <div className="max-w-xl">
            <h2 className="font-heading text-2xl uppercase tracking-tight text-foreground">
              Want to List an Opportunity?
            </h2>
            <p className="font-body text-base text-muted-foreground mt-4 leading-relaxed">
              If your organization needs volunteers for food distribution, reach out and we'll add
              your opportunity to the board.
            </p>
            <Link
              to="/inquiry"
              className="inline-block mt-6 font-heading text-xs uppercase tracking-widest px-6 py-3.5 bg-accent text-accent-foreground hover:bg-accent/80 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
