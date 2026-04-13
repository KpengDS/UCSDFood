import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ArrowLeft, Menu } from "lucide-react";

const NAV_ITEMS = [
  { label: "Find Food", path: "/families", desc: "Search by ZIP code" },
  { label: "Events", path: "/events", desc: "Distribution calendar" },
  { label: "Donors", path: "/donors", desc: "Give food or funds" },
  { label: "Volunteers", path: "/volunteers", desc: "Lend a hand" },
  { label: "Resources", path: "/resources", desc: "Data sources" },
  { label: "Contact", path: "/inquiry", desc: "Get in touch" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
    };
  }, [isOpen]);

  // Smart back navigation — always stays within the app
  const getParentPath = () => {
    const path = location.pathname;
    // /events/123 → /events
    if (path.match(/^\/events\/.+/)) return "/events";
    // Any top-level page → home
    return "/";
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[8vw] py-5 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-4">
          {!isHome && (
            <Link
              to={getParentPath()}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <Link to="/" className="font-heading text-lg md:text-xl text-foreground hover:text-accent transition-colors">
            Sustainable Food Hub
          </Link>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open navigation menu"
        >
          <span className="hidden sm:inline">Menu</span>
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Full-screen menu overlay — grid layout */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-background flex flex-col">
          <div className="flex items-center justify-between px-[8vw] py-5 border-b border-border/50">
            <Link
              to="/"
              className="font-heading text-lg md:text-xl text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Sustainable Food Hub
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 flex items-center px-[8vw]">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`group block p-6 rounded-md border transition-all duration-200 ${
                      isActive
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent hover:bg-accent/5"
                    }`}
                  >
                    <h3 className={`font-heading text-xl md:text-2xl ${
                      isActive ? "text-accent" : "text-foreground group-hover:text-accent"
                    } transition-colors`}>
                      {item.label}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      {item.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="px-[8vw] py-6 border-t border-border/50">
            <p className="font-body text-xs text-muted-foreground">
              DC · Maryland · Virginia — Data from 20+ public sources
            </p>
          </div>
        </div>
      )}
    </>
  );
}
