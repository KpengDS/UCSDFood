import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import RevealSection from "./RevealSection";

export default function StakeholderCard({
  title,
  description,
  linkTo,
  image,
  index,
}) {
  return (
    <RevealSection delay={index * 0.1}>
      <Link
        to={linkTo}
        className="group block h-full border border-border hover:border-accent rounded-md overflow-hidden transition-colors duration-300"
      >
        <div className="relative overflow-hidden" style={{ height: "240px" }}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-base md:text-lg text-foreground group-hover:text-accent transition-colors">
              {title}
            </h3>
            <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed">
              {description}
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
        </div>
      </Link>
    </RevealSection>
  );
}
