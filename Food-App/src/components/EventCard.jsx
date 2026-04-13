import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import RevealSection from "./RevealSection";

export default function EventCard({ event, index = 0 }) {
  if (!event) return null;

  return (
    <RevealSection delay={index * 0.05}>
      <Link
        to={`/events/${event.id}`}
        className="group block w-full border border-border hover:border-accent rounded-md transition-colors duration-300 focus:outline-2 focus:outline-foreground"
      >
        {event.image_url && (
          <div className="relative overflow-hidden aspect-[4/3]">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover mono-to-color scale-105 group-hover:scale-100 transition-transform duration-700"
            />
          </div>
        )}
        <div className="p-5 md:p-6">
          {event.status && (
            <span className="font-heading text-[10px] uppercase tracking-widest text-accent">
              {event.status}
            </span>
          )}
          <h3 className="font-heading text-sm md:text-base uppercase tracking-tight text-foreground mt-2 group-hover:text-accent transition-colors">
            {event.title}
          </h3>
          <div className="flex flex-col gap-1.5 mt-3">
            {event.recurrence_pattern && (
              <span className="font-body text-xs text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {event.recurrence_pattern}
              </span>
            )}
            {(event.city || event.address) && (
              <span className="font-body text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                {event.city}{event.state ? `, ${event.state}` : ""}
              </span>
            )}
          </div>
        </div>
      </Link>
    </RevealSection>
  );
}
