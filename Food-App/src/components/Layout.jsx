import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import StructuralLines from "./StructuralLines";

export default function Layout() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <StructuralLines />
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-border px-[8vw] py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
        <div className="md:col-span-5">
          <h4 className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Nourish DC/MD
          </h4>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm">
            Connecting families in Maryland and metropolitan Washington, DC with
            food resources, distribution events, and community support.
          </p>
        </div>
        <div className="md:col-span-3 md:col-start-7">
          <h4 className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Index
          </h4>
          <div className="flex flex-col gap-2">
            {["Events", "Families", "Donors", "Volunteers"].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="font-body text-sm text-foreground hover:text-accent transition-colors focus:outline-2 focus:outline-foreground"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        <div className="md:col-span-3">
          <h4 className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Contact
          </h4>
          <a
            href="/inquiry"
            className="font-body text-sm text-foreground hover:text-accent transition-colors focus:outline-2 focus:outline-foreground"
          >
            Submit an Inquiry →
          </a>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-border">
        <p className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} Nourish — Food Resource Network
        </p>
      </div>
    </footer>
  );
}
