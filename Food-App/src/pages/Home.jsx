import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { foodEvents } from "@/data/foodData";
import RevealSection from "../components/RevealSection";
import SectionLabel from "../components/SectionLabel";
import EventCard from "../components/EventCard";
import StakeholderCard from "../components/StakeholderCard";

const HERO_IMG =
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80";
const FAMILIES_IMG =
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80";
const DONORS_IMG =
  "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=800&q=80";
const VOLUNTEERS_IMG =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80";
const ABOUT_IMG =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80";

export default function Home() {
  const events = foodEvents.slice(0, 8);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      return () => hero.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  const scrollToContent = () => {
    const el = document.getElementById("mission");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const stakeholders = [
    {
      title: "Families",
      description: "Find free food distribution events near you by ZIP code or city.",
      linkTo: "/families",
      image: FAMILIES_IMG,
    },
    {
      title: "Donors",
      description: "Discover organizations accepting food and monetary donations.",
      linkTo: "/donors",
      image: DONORS_IMG,
    },
    {
      title: "Volunteers",
      description: "Browse volunteer opportunities at food banks and distribution sites.",
      linkTo: "/volunteers",
      image: VOLUNTEERS_IMG,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero with parallax */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <motion.div
          className="absolute inset-0"
          style={{
            x: mousePos.x * -20,
            y: mousePos.y * -20,
          }}
        >
          <div className="absolute inset-0 bg-background/70 z-10" />
          <img
            src={HERO_IMG}
            alt="Community food distribution"
            className="w-full h-full object-cover scale-110 mono-to-color"
          />
        </motion.div>

        <div className="relative z-20 text-center px-[8vw]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-heading text-xs uppercase tracking-[0.4em] text-accent block mb-6">
              DC · Maryland · Virginia
            </span>
            <h1 className="font-heading text-[12vw] md:text-[7vw] uppercase leading-[0.85] tracking-tighter text-foreground">
              Sustainable
              <br />
              Food Hub
            </h1>
            <p className="font-body text-base md:text-lg text-muted-foreground mt-6 max-w-xl mx-auto leading-relaxed">
              Real-time food assistance data aggregated from public sources — helping families find meals, donors target impact, and volunteers show up where it matters.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/families"
              className="font-heading text-xs uppercase tracking-widest px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/80 transition-all"
            >
              Find Food Near You
            </Link>
            <Link
              to="/events"
              className="font-heading text-xs uppercase tracking-widest px-8 py-4 border border-border text-foreground hover:border-accent hover:text-accent transition-all"
            >
              Browse Events
            </Link>
          </motion.div>
        </div>

        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-muted-foreground hover:text-accent transition-colors"
          aria-label="Scroll to content"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.button>
      </section>

      {/* Mission */}
      <section id="mission" className="px-[8vw] py-24 md:py-40">
        <RevealSection>
          <SectionLabel label="Why This Exists" number={1} />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7">
              <h2 className="font-heading text-[8vw] md:text-[3.5vw] uppercase leading-[0.85] tracking-tighter text-foreground">
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

      {/* Stakeholder Pathways */}
      <section className="px-[8vw] py-16 md:py-24 border-t border-border">
        <RevealSection>
          <SectionLabel label="Get Involved" number={2} />
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-foreground mb-12">
            Choose Your Path
          </h2>
        </RevealSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stakeholders.map((s, i) => (
            <StakeholderCard key={s.title} {...s} index={i} />
          ))}
        </div>
      </section>

      {/* Events Gallery — horizontal scroll */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="px-[8vw]">
          <RevealSection>
            <SectionLabel label="Upcoming Events" number={3} />
            <div className="flex items-end justify-between gap-4 mb-12">
              <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-foreground">
                Distribution Events
              </h2>
              <Link
                to="/events"
                className="font-heading text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors flex-shrink-0"
              >
                View All →
              </Link>
            </div>
          </RevealSection>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-[8vw] pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {events.length === 0 ? (
            <div className="w-full text-center py-16">
              <p className="font-heading text-sm uppercase tracking-widest text-muted-foreground">
                Events loading...
              </p>
            </div>
          ) : (
            events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))
          )}
        </div>
      </section>

      {/* About / Challenge */}
      <section className="px-[8vw] py-24 md:py-40 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-5">
            <RevealSection>
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={ABOUT_IMG}
                  alt="Food insecurity in the community"
                  className="w-full h-full object-cover mono-to-color"
                />
              </div>
            </RevealSection>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
            <RevealSection delay={0.1}>
              <SectionLabel label="The Data" number={4} />
              <h2 className="font-heading text-2xl md:text-4xl uppercase leading-[0.85] tracking-tighter text-foreground">
                The scale of food insecurity in the DMV
              </h2>
              <p className="font-body text-base text-muted-foreground mt-6 leading-relaxed">
                Feeding America's <a href="https://feedingamerica.org/about-us/press-room/Map-the-Meal-Gap-2025" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground underline underline-offset-2">Map the Meal Gap 2025</a> estimates that 47 million people experienced food insecurity nationally in 2023. In the DMV specifically, a <a href="https://health.georgetown.edu/news-story/new-report-from-capital-area-food-bank-identifies-troubling-trends-in-food-insecurity/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground underline underline-offset-2">Capital Area Food Bank report</a> found 37% of households — roughly 1.5 million people — faced food insecurity in 2024.
              </p>
              <p className="font-body text-base text-muted-foreground mt-4 leading-relaxed">
                The <a href="https://mdfoodbank.org/hunger-in-maryland/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground underline underline-offset-2">Maryland Food Bank</a> reports that 1 in 3 Marylanders face hunger, while the <a href="https://vafoodbanks.org/virginians-facing-hunger-insights-from-feeding-americas-map-the-meal-gap-report/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground underline underline-offset-2">Virginia Federation of Food Banks</a> reports an 11.1% hunger rate with over 252,000 children affected. Sustainable Food Hub pulls from these sources and 15+ public datasets to surface actionable information.
              </p>
            </RevealSection>
            <RevealSection delay={0.2}>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="border-t border-border pt-4">
                  <span className="font-heading text-2xl md:text-3xl text-accent">1.5M</span>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    DMV residents food-insecure (CAFB 2024)
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <span className="font-heading text-2xl md:text-3xl text-accent">286+</span>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    MD Food Bank partner sites
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <span className="font-heading text-2xl md:text-3xl text-accent">854K</span>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    Virginia SNAP recipients (VA Food Banks)
                  </p>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-[8vw] py-24 md:py-40 border-t border-border">
        <RevealSection>
          <div className="text-center max-w-2xl mx-auto">
            <SectionLabel label="Take Action" number={5} />
            <h2 className="font-heading text-[8vw] md:text-[3.5vw] uppercase leading-[0.85] tracking-tighter text-foreground">
              Ready to make a difference?
            </h2>
            <p className="font-body text-base text-muted-foreground mt-6 leading-relaxed">
              Whether you need food assistance, want to donate, or can volunteer your time — there's
              a place for you here.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/families"
                className="font-heading text-xs uppercase tracking-widest px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/80 transition-all"
              >
                Find Food
              </Link>
              <Link
                to="/donors"
                className="font-heading text-xs uppercase tracking-widest px-8 py-4 border border-border text-foreground hover:border-accent hover:text-accent transition-all"
              >
                Donate
              </Link>
              <Link
                to="/volunteers"
                className="font-heading text-xs uppercase tracking-widest px-8 py-4 border border-border text-foreground hover:border-accent hover:text-accent transition-all"
              >
                Volunteer
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
