import { Link } from "react-router-dom";
import { Heart, Building2, ArrowUpRight } from "lucide-react";
import SectionLabel from "../components/SectionLabel";
import RevealSection from "../components/RevealSection";
import { organizations } from "@/data/foodData";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/data/translations";

// Image from Unsplash (unsplash.com) — free under Unsplash License
const DONORS_IMG =
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80"; // Joel Muniz

export default function Donors() {
  const { lang } = useLanguage();
  const orgs = organizations.filter((o) => o.accepts_food_donations || o.accepts_monetary_donations);

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <section className="px-[8vw] pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
          <div className="md:col-span-6">
            <RevealSection>
              <SectionLabel label={t(lang, "forDonors")} number={1} />
              <h1 className="font-heading text-[10vw] md:text-[4vw] uppercase leading-[0.85] tracking-tighter text-foreground">
                {t(lang, "giveWithPurpose")}
              </h1>
              <p className="font-body text-base text-muted-foreground mt-6 leading-relaxed max-w-lg">
                {t(lang, "donorsDesc")}
              </p>
            </RevealSection>
            <RevealSection delay={0.2}>
              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="border border-border p-6">
                  <Heart className="w-5 h-5 text-accent mb-3" />
                  <h3 className="font-heading text-xs uppercase tracking-widest text-foreground">{t(lang, "foodDonations")}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-2">{t(lang, "foodDonationsDesc")}</p>
                </div>
                <div className="border border-border p-6">
                  <Building2 className="w-5 h-5 text-accent mb-3" />
                  <h3 className="font-heading text-xs uppercase tracking-widest text-foreground">{t(lang, "monetarySupport")}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-2">{t(lang, "monetarySupportDesc")}</p>
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
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-foreground mb-12">{t(lang, "whereToDonate")}</h2>
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
                <div className="group border border-border hover:border-accent rounded-md transition-colors p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-base text-foreground">{org.name}</h3>
                      <span className="font-heading text-[10px] uppercase tracking-widest text-accent mt-1 block">{org.type?.replace("_", " ")}</span>
                    </div>
                  </div>
                  {org.description && <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed">{org.description}</p>}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {org.accepts_food_donations && <span className="font-body text-[11px] text-accent px-3 py-1 border border-accent/40 rounded-full">{t(lang, "acceptsFood")}</span>}
                    {org.accepts_monetary_donations && <span className="font-body text-[11px] text-accent px-3 py-1 border border-accent/40 rounded-full">{t(lang, "acceptsMoney")}</span>}
                  </div>
                  {org.service_area && <p className="font-body text-xs text-muted-foreground mt-3">{t(lang, "serves")}: {org.service_area}</p>}
                  {org.contact_phone && <p className="font-body text-xs text-muted-foreground mt-1">{t(lang, "phone")}: {org.contact_phone}</p>}
                  <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-border/50">
                    {org.website_url && (
                      <a href={org.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-heading text-xs px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-all">
                        <ArrowUpRight className="w-3 h-3" />
                        {t(lang, "donateVisit")}
                      </a>
                    )}
                    {org.contact_phone && (
                      <a href={`tel:${org.contact_phone}`} className="inline-flex items-center gap-1.5 font-heading text-xs px-4 py-2 border border-border text-foreground rounded-md hover:border-accent hover:text-accent transition-all">
                        {t(lang, "call")}
                      </a>
                    )}
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        )}
      </section>

      <section className="px-[8vw] py-16 md:py-24 border-t border-border">
        <RevealSection>
          <div className="max-w-xl">
            <h2 className="font-heading text-2xl uppercase tracking-tight text-foreground">{t(lang, "areYouOrg")}</h2>
            <p className="font-body text-base text-muted-foreground mt-4 leading-relaxed">{t(lang, "areYouOrgDesc")}</p>
            <Link to="/inquiry" className="inline-block mt-6 font-heading text-xs uppercase tracking-widest px-6 py-3.5 bg-accent text-accent-foreground hover:bg-accent/80 transition-all">{t(lang, "getListed")}</Link>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
