import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import StructuralLines from "./StructuralLines";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/data/translations";

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
  const { lang } = useLanguage();
  return (
    <footer className="relative border-t border-border px-[8vw] py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
        <div className="md:col-span-5">
          <h4 className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-4">
            {t(lang, "siteName")}
          </h4>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm">
            {t(lang, "footerDesc")}
          </p>
        </div>
        <div className="md:col-span-3 md:col-start-7">
          <h4 className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-4">
            {t(lang, "index")}
          </h4>
          <div className="flex flex-col gap-2">
            {[
              { label: t(lang, "navEvents"), path: "/events" },
              { label: t(lang, "navFindFood"), path: "/families" },
              { label: t(lang, "navDonors"), path: "/donors" },
              { label: t(lang, "navVolunteers"), path: "/volunteers" },
            ].map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="font-body text-sm text-foreground hover:text-accent transition-colors focus:outline-2 focus:outline-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="md:col-span-3">
          <h4 className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-4">
            {t(lang, "contact")}
          </h4>
          <a
            href="/inquiry"
            className="font-body text-sm text-foreground hover:text-accent transition-colors focus:outline-2 focus:outline-foreground"
          >
            {t(lang, "submitInquiry")}
          </a>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-border">
        <p className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} {t(lang, "siteName")}
        </p>
        <p className="font-body text-[10px] text-muted-foreground mt-3 leading-relaxed">
          Images sourced from <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Unsplash</a> under the Unsplash License (free for commercial and noncommercial use). Data sources cited on the <a href="/resources" className="underline hover:text-foreground">Resources</a> page.
        </p>
      </div>
    </footer>
  );
}
