import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Search, Heart, Users } from "lucide-react";
import { foodEvents } from "@/data/foodData";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/data/translations";
import RevealSection from "../components/RevealSection";
import SectionLabel from "../components/SectionLabel";
import EventCard from "../components/EventCard";

// Images from Unsplash (unsplash.com) — free under Unsplash License
const HERO_IMG =
  "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1200&q=80"; // Ella Olsson — warm food spread

export default function Home() {
  const events = foodEvents.slice(0, 6);
  const { lang } = useLanguage();

  const scrollToContent = () => {
    const el = document.getElementById("mission");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero — clean, no parallax */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40 z-10" />
          <img
            src={HERO_IMG}
            alt="Fresh food spread — photo by Ella Olsson on Unsplash"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 px-[8vw] max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-body text-sm tracking-wide text-accent block mb-4">
              {t(lang, "tagline")}
            </span>
            <h1 className="font-heading text-5xl md:text-7xl leading-tight text-foreground">
              {t(lang, "siteName")}
            </h1>
            <p className="font-body text-base md:text-lg text-muted-foreground mt-6 leading-relaxed max-w-lg">
              {t(lang, "heroDesc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-row flex-wrap gap-4"
          >
            <Link
              to="/families"
              className="inline-flex items-center justify-center gap-2 font-heading text-sm px-6 py-3 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-all whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              {t(lang, "findFood")}
            </Link>
            <Link
              to="/donors"
              className="inline-flex items-center justify-center gap-2 font-heading text-sm px-6 py-3 border border-border text-foreground rounded-md hover:border-accent hover:text-accent transition-all whitespace-nowrap"
            >
              <Heart className="w-4 h-4" />
              {t(lang, "donate")}
            </Link>
            <Link
              to="/volunteers"
              className="inline-flex items-center justify-center gap-2 font-heading text-sm px-6 py-3 border border-border text-foreground rounded-md hover:border-accent hover:text-accent transition-all whitespace-nowrap"
            >
              <Users className="w-4 h-4" />
              {t(lang, "volunteer")}
            </Link>
          </motion.div>
        </div>

        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-muted-foreground hover:text-accent transition-colors"
          aria-label="Scroll to content"
        >
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.button>
      </section>

      {/* Key stats bar */}
      <section className="bg-card border-y border-border">
        <div className="px-[8vw] py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="font-heading text-2xl md:text-3xl text-accent">1.5M</span>
            <p className="font-body text-xs text-muted-foreground mt-1">{t(lang, "stat1Label")}</p>
            <p className="font-body text-[10px] text-muted-foreground/60">Source: Capital Area Food Bank 2024</p>
          </div>
          <div>
            <span className="font-heading text-2xl md:text-3xl text-accent">286+</span>
            <p className="font-body text-xs text-muted-foreground mt-1">{t(lang, "stat2Label")}</p>
            <p className="font-body text-[10px] text-muted-foreground/60">Source: mdfoodbank.org</p>
          </div>
          <div>
            <span className="font-heading text-2xl md:text-3xl text-accent">854K</span>
            <p className="font-body text-xs text-muted-foreground mt-1">{t(lang, "stat3Label")}</p>
            <p className="font-body text-[10px] text-muted-foreground/60">Source: VA Federation of Food Banks</p>
          </div>
          <div>
            <span className="font-heading text-2xl md:text-3xl text-accent">20+</span>
            <p className="font-body text-xs text-muted-foreground mt-1">{t(lang, "stat4Label")}</p>
            <p className="font-body text-[10px] text-muted-foreground/60">See Resources page</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="px-[8vw] py-20 md:py-32">
        <RevealSection>
          <SectionLabel label="Why This Exists" number={1} />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7">
              <h2 className="font-heading text-3xl md:text-5xl leading-tight text-foreground">
                Food assistance data is scattered — we centralize it
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9 flex items-end">
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Information about food pantries, distribution events, and assistance programs is spread across dozens of government portals, nonprofit sites, and community boards. Sustainable Food Hub aggregates verified public data from sources like the Maryland Food Bank, Capital Area Food Bank, USDA, and county social services into one searchable interface.
              </p>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Stakeholder Pathways — replaced with credible content */}
      <section className="px-[8vw] py-16 md:py-24 border-t border-border">
        <RevealSection>
          <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">
            The Reality of Hunger in the DMV
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-3xl leading-relaxed">
            Despite being one of the wealthiest regions in the country, the DC-Maryland-Virginia area faces significant food insecurity. According to a <a href="https://health.georgetown.edu/news-story/new-report-from-capital-area-food-bank-identifies-troubling-trends-in-food-insecurity/" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">2025 Capital Area Food Bank report</a>, 22% of adults in the region are experiencing very low food security — meaning they regularly skip meals or eat smaller portions. That's roughly 820,000 adults.
          </p>
        </RevealSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <RevealSection delay={0.1}>
            <div className="border border-border rounded-md p-6">
              <h3 className="font-heading text-lg text-foreground">Maryland</h3>
              <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed">
                The <a href="https://mdfoodbank.org/hunger-in-maryland/" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">Maryland Food Bank</a> reports that 1 in 3 Marylanders face hunger. In Baltimore City, 55.8% of families struggle to afford basic needs. The state's cost of living outpaces wage growth — 3.1% vs 2.7%.
              </p>
            </div>
          </RevealSection>
          <RevealSection delay={0.2}>
            <div className="border border-border rounded-md p-6">
              <h3 className="font-heading text-lg text-foreground">Washington DC</h3>
              <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed">
                DC has an 11% concentrated food desert rate. Wards 7 and 8 are hardest hit — 51% and 31% food desert rates respectively. <a href="https://breadforthecity.org/food/" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">Bread for the City</a> alone serves 8,400+ neighbors monthly from two pantry locations.
              </p>
            </div>
          </RevealSection>
          <RevealSection delay={0.3}>
            <div className="border border-border rounded-md p-6">
              <h3 className="font-heading text-lg text-foreground">Virginia</h3>
              <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed">
                The <a href="https://vafoodbanks.org/virginians-facing-hunger-insights-from-feeding-americas-map-the-meal-gap-report/" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">Virginia Federation of Food Banks</a> reports an 11.1% hunger rate — 1 in 9 residents. Over 854,000 Virginians rely on SNAP, and 252,480 children experience food insecurity.
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Events — GRID layout, not horizontal scroll */}
      <section className="px-[8vw] py-16 md:py-24 border-t border-border">
        <RevealSection>
          <SectionLabel label="Upcoming Events" number={3} />
          <div className="flex items-end justify-between gap-4 mb-10">
            <h2 className="font-heading text-2xl md:text-3xl text-foreground">
              Distribution Events
            </h2>
            <Link
              to="/events"
              className="font-heading text-sm text-muted-foreground hover:text-accent transition-colors flex-shrink-0"
            >
              View All →
            </Link>
          </div>
        </RevealSection>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-sm text-muted-foreground">No events available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <div key={event.id} className="w-full">
                <EventCard event={event} index={i} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="px-[8vw] py-28 md:py-40 border-t border-border bg-card">
        <RevealSection>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-heading text-5xl md:text-7xl leading-tight text-foreground">
              {t(lang, "ctaTitle")}
            </h2>
            <p className="font-body text-lg md:text-xl text-muted-foreground mt-8 leading-relaxed">
              {t(lang, "ctaDesc")}
            </p>
            <div className="mt-12 flex flex-row flex-wrap items-center justify-center gap-4">
              <Link to="/families" className="font-heading text-base px-10 py-4 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-all whitespace-nowrap">
                {t(lang, "findFood")}
              </Link>
              <Link to="/donors" className="font-heading text-base px-10 py-4 border-2 border-foreground text-foreground rounded-md hover:bg-foreground hover:text-background transition-all whitespace-nowrap">
                {t(lang, "donate")}
              </Link>
              <Link to="/volunteers" className="font-heading text-base px-10 py-4 border-2 border-foreground text-foreground rounded-md hover:bg-foreground hover:text-background transition-all whitespace-nowrap">
                {t(lang, "volunteer")}
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
