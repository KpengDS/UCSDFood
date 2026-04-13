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
        className="group block border border-border hover:border-accent transition-colors duration-500 focus:outline-2 focus:outline-foreground"
      >
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover mono-to-color scale-105 group-hover:scale-100 transition-transform duration-700"
          />
        </div>
        <div className="p-6 md:p-8 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg md:text-xl uppercase tracking-tight text-foreground group-hover:text-accent transition-colors">
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
