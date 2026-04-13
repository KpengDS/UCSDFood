import { useParams, Link } from "react-router-dom";
import { foodEvents } from "@/data/foodData";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/data/translations";
import { MapPin, Calendar, Clock, Phone, Mail, Globe, ArrowLeft, Users, Package } from "lucide-react";
import moment from "moment";
import RevealSection from "../components/RevealSection";

function SpecRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-b-0">
      <Icon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
      <div>
        <span className="font-heading text-[10px] uppercase tracking-widest text-muted-foreground block">{label}</span>
        <span className="font-body text-sm text-foreground mt-0.5 block">{value}</span>
      </div>
    </div>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const event = foodEvents.find((e) => e.id === id) || null;

  if (!event) {
    return (
      <div className="min-h-screen pt-24 md:pt-32 px-[8vw]">
        <Link to="/events" className="inline-flex items-center gap-2 font-heading text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {t(lang, "backToEvents")}
        </Link>
        <div className="text-center py-24">
          <p className="font-heading text-sm uppercase tracking-widest text-muted-foreground">{t(lang, "eventNotFound")}</p>
          <Link to="/events" className="inline-block mt-6 font-heading text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors">{t(lang, "browseAllEvents")}</Link>
        </div>
      </div>
    );
  }

  const fullAddress = [event.address, event.city, event.state, event.zip_code].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <section className="px-[8vw] pb-16 md:pb-24">
        <RevealSection>
          <Link to="/events" className="inline-flex items-center gap-2 font-heading text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> {t(lang, "backToEvents")}
          </Link>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <RevealSection>
                {event.status && (
                  <span className="font-heading text-[10px] uppercase tracking-widest text-accent mb-4 block">{event.status}</span>
                )}
                <h1 className="font-heading text-2xl md:text-3xl leading-tight text-foreground">{event.title}</h1>
              </RevealSection>

              <RevealSection delay={0.1}>
                <div className="mt-8 border-t border-border">
                  <SpecRow icon={Calendar} label={t(lang, "date")} value={event.event_date ? moment(event.event_date).format("dddd, MMMM D, YYYY") : null} />
                  <SpecRow icon={Clock} label={t(lang, "time")} value={event.event_date ? moment(event.event_date).format("h:mm A") + (event.end_date ? ` — ${moment(event.end_date).format("h:mm A")}` : "") : null} />
                  {event.recurrence_pattern && <SpecRow icon={Calendar} label={t(lang, "recurring")} value={event.recurrence_pattern} />}
                  <SpecRow icon={MapPin} label={t(lang, "location")} value={event.location_name || fullAddress || null} />
                  {event.location_name && fullAddress && <SpecRow icon={MapPin} label={t(lang, "address")} value={fullAddress} />}
                  <SpecRow icon={Users} label={t(lang, "organizer")} value={event.organizer} />
                  <SpecRow icon={Phone} label={t(lang, "phone")} value={event.contact_phone} />
                  <SpecRow icon={Mail} label={t(lang, "email")} value={event.contact_email} />
                  <SpecRow icon={Globe} label={t(lang, "website")} value={event.website_url ? (
                    <a href={event.website_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-2">{event.website_url}</a>
                  ) : null} />
                  <SpecRow icon={Users} label={t(lang, "eligibility")} value={event.eligibility} />
                  <SpecRow icon={Package} label={t(lang, "foodTypes")} value={event.food_types?.length ? event.food_types.join(", ") : null} />
                </div>
              </RevealSection>

              <RevealSection delay={0.2}>
                <div className="flex flex-wrap gap-2 mt-6">
                  {event.needs_volunteers && (
                    <span className="font-heading text-[10px] uppercase tracking-widest text-accent px-3 py-1 border border-accent">{t(lang, "needsVolunteers")}</span>
                  )}
                  {event.accepts_donations && (
                    <span className="font-heading text-[10px] uppercase tracking-widest text-accent px-3 py-1 border border-accent">{t(lang, "acceptsDonations")}</span>
                  )}
                </div>
              </RevealSection>
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            {event.image_url && (
              <RevealSection>
                <div className="aspect-[16/10] overflow-hidden rounded-md mb-8">
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                </div>
              </RevealSection>
            )}

            <RevealSection delay={0.15}>
              {event.description && (
                <p className="font-body text-base text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
              )}
            </RevealSection>

            {event.transportation_notes && (
              <RevealSection delay={0.25}>
                <div className="mt-8 border border-border rounded-md p-6">
                  <h3 className="font-heading text-xs uppercase tracking-widest text-foreground mb-2">{t(lang, "transportAccess")}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{event.transportation_notes}</p>
                </div>
              </RevealSection>
            )}

            <RevealSection delay={0.3}>
              <div className="mt-12 pt-8 border-t border-border">
                <Link to="/events" className="inline-flex items-center gap-2 font-heading text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">
                  <ArrowLeft className="w-4 h-4" /> {t(lang, "backToAllEvents")}
                </Link>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>
    </div>
  );
}
