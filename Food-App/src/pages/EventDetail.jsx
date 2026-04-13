import { useParams, Link } from "react-router-dom";
import { foodEvents } from "@/data/foodData";
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  Users,
  Package,
} from "lucide-react";
import moment from "moment";
import RevealSection from "../components/RevealSection";

function SpecRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-b-0">
      <Icon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
      <div>
        <span className="font-heading text-[10px] uppercase tracking-widest text-muted-foreground block">
          {label}
        </span>
        <span className="font-body text-sm text-foreground mt-0.5 block">{value}</span>
      </div>
    </div>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const event = foodEvents.find((e) => e.id === id) || null;
  const loading = false;
  const error = event ? null : "Event not found";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-muted-foreground border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pt-24 md:pt-32 px-[8vw]">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 font-heading text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
        <div className="text-center py-24">
          <p className="font-heading text-sm uppercase tracking-widest text-muted-foreground">
            {error || "Event not found"}
          </p>
          <Link
            to="/events"
            className="inline-block mt-6 font-heading text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors"
          >
            Browse All Events →
          </Link>
        </div>
      </div>
    );
  }

  const fullAddress = [event.address, event.city, event.state, event.zip_code]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <section className="px-[8vw] pb-16 md:pb-24">
        <RevealSection>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 font-heading text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Left column — sticky specs */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <RevealSection>
                {event.status && (
                  <span className="font-heading text-[10px] uppercase tracking-widest text-accent mb-4 block">
                    {event.status}
                  </span>
                )}
                <h1 className="font-heading text-2xl md:text-3xl uppercase leading-[0.9] tracking-tighter text-foreground">
                  {event.title}
                </h1>
              </RevealSection>

              <RevealSection delay={0.1}>
                <div className="mt-8 border-t border-border">
                  <SpecRow
                    icon={Calendar}
                    label="Date"
                    value={
                      event.event_date
                        ? moment(event.event_date).format("dddd, MMMM D, YYYY")
                        : null
                    }
                  />
                  <SpecRow
                    icon={Clock}
                    label="Time"
                    value={
                      event.event_date
                        ? moment(event.event_date).format("h:mm A") +
                          (event.end_date
                            ? ` — ${moment(event.end_date).format("h:mm A")}`
                            : "")
                        : null
                    }
                  />
                  <SpecRow
                    icon={MapPin}
                    label="Location"
                    value={event.location_name || fullAddress || null}
                  />
                  {event.location_name && fullAddress && (
                    <SpecRow icon={MapPin} label="Address" value={fullAddress} />
                  )}
                  <SpecRow icon={Users} label="Organizer" value={event.organizer} />
                  <SpecRow icon={Phone} label="Phone" value={event.contact_phone} />
                  <SpecRow icon={Mail} label="Email" value={event.contact_email} />
                  <SpecRow
                    icon={Globe}
                    label="Website"
                    value={
                      event.website_url ? (
                        <a
                          href={event.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-foreground transition-colors underline underline-offset-2"
                        >
                          {event.website_url}
                        </a>
                      ) : null
                    }
                  />
                  <SpecRow icon={Users} label="Eligibility" value={event.eligibility} />
                  <SpecRow
                    icon={Package}
                    label="Food Types"
                    value={
                      event.food_types?.length ? event.food_types.join(", ") : null
                    }
                  />
                </div>
              </RevealSection>

              <RevealSection delay={0.2}>
                <div className="flex flex-wrap gap-2 mt-6">
                  {event.is_recurring && (
                    <span className="font-heading text-[10px] uppercase tracking-widest text-accent px-3 py-1 border border-accent">
                      Recurring{event.recurrence_pattern ? ` · ${event.recurrence_pattern}` : ""}
                    </span>
                  )}
                  {event.needs_volunteers && (
                    <span className="font-heading text-[10px] uppercase tracking-widest text-accent px-3 py-1 border border-accent">
                      Needs Volunteers
                    </span>
                  )}
                  {event.accepts_donations && (
                    <span className="font-heading text-[10px] uppercase tracking-widest text-accent px-3 py-1 border border-accent">
                      Accepts Donations
                    </span>
                  )}
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Right column — scrollable content */}
          <div className="md:col-span-7 md:col-start-6">
            {event.image_url && (
              <RevealSection>
                <div className="aspect-[16/10] overflow-hidden mb-8">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </RevealSection>
            )}

            <RevealSection delay={0.15}>
              {event.description && (
                <div className="prose prose-sm max-w-none">
                  <p className="font-body text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              )}
            </RevealSection>

            {event.transportation_notes && (
              <RevealSection delay={0.25}>
                <div className="mt-8 border border-border p-6">
                  <h3 className="font-heading text-xs uppercase tracking-widest text-foreground mb-2">
                    Transportation & Accessibility
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {event.transportation_notes}
                  </p>
                </div>
              </RevealSection>
            )}

            <RevealSection delay={0.3}>
              <div className="mt-12 pt-8 border-t border-border">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 font-heading text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to All Events
                </Link>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>
    </div>
  );
}
