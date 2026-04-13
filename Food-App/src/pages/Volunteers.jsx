import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import moment from "moment";
import RevealSection from "../components/RevealSection";
import { volunteerOpportunities } from "@/data/foodData";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/data/translations";

export default function Volunteers() {
  const { lang } = useLanguage();
  const opportunities = volunteerOpportunities;

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      {/* Compact hero — no misleading boxes */}
      <section className="px-[8vw] pb-6">
        <h1 className="font-heading text-3xl md:text-5xl leading-tight text-foreground">
          {t(lang, "lendAHand")}
        </h1>
        <p className="font-body text-base text-muted-foreground mt-3 max-w-xl leading-relaxed">
          {t(lang, "volunteersDesc")}
        </p>
        <button
          onClick={() => document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-6 inline-flex items-center gap-2 font-heading text-sm px-6 py-3 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-all"
        >
          {t(lang, "openPositions")}
          <ChevronDown className="w-4 h-4" />
        </button>
        <span className="ml-4 font-body text-sm text-muted-foreground">
          {opportunities.length} {opportunities.length !== 1 ? t(lang, "results") : t(lang, "result")}
        </span>
      </section>

      {/* Opportunities */}
      <section id="opportunities" className="px-[8vw] py-8 pb-16 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {opportunities.map((opp, i) => (
            <RevealSection key={opp.id} delay={i * 0.05}>
              <div className="group border border-border hover:border-accent rounded-md transition-colors p-6">
                <h3 className="font-heading text-base text-foreground group-hover:text-accent transition-colors">
                  {opp.title}
                </h3>
                <span className="font-body text-xs text-accent mt-1 block">{opp.organization_name}</span>

                {opp.description && (
                  <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed">{opp.description}</p>
                )}

                <div className="flex flex-wrap gap-4 mt-4">
                  {opp.date && (
                    <span className="font-body text-xs text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> {moment(opp.date).format("MMM D, YYYY")}
                    </span>
                  )}
                  {(opp.location || opp.city) && (
                    <span className="font-body text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {opp.location || opp.city}
                    </span>
                  )}
                  {opp.slots_available != null && (
                    <span className="font-body text-xs text-muted-foreground flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> {opp.slots_available} {t(lang, "slotsAvailable")}
                    </span>
                  )}
                </div>

                {opp.skills_needed && (
                  <p className="font-body text-xs text-muted-foreground mt-3">{t(lang, "skills")}: {opp.skills_needed}</p>
                )}

                {opp.contact_email && (
                  <a href={`mailto:${opp.contact_email}`} className="inline-flex items-center gap-1 mt-4 font-heading text-xs px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-all">
                    {t(lang, "email")} →
                  </a>
                )}
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-[8vw] py-12 border-t border-border">
        <RevealSection>
          <div className="max-w-xl">
            <h2 className="font-heading text-xl text-foreground">{t(lang, "listOpportunity")}</h2>
            <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed">
              {t(lang, "listOpportunityDesc")}
            </p>
            <Link to="/inquiry" className="inline-block mt-4 font-heading text-xs px-5 py-2.5 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-all">
              {t(lang, "getInTouch")}
            </Link>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
