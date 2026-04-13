import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Events", path: "/events" },
  { label: "Families", path: "/families" },
  { label: "Donors", path: "/donors" },
  { label: "Volunteers", path: "/volunteers" },
  { label: "Resources", path: "/resources" },
  { label: "Contact", path: "/inquiry" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Fixed top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[8vw] py-6 mix-blend-difference">
        <Link
          to="/"
          className="font-heading text-xs uppercase tracking-[0.3em] text-foreground focus:outline-2 focus:outline-foreground"
        >
          Sustainable Food Hub
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="font-heading text-xs uppercase tracking-[0.3em] text-foreground hover:text-accent transition-colors focus:outline-2 focus:outline-foreground"
          aria-label="Open navigation menu"
        >
          Index
        </button>
      </header>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-background flex flex-col"
          >
            <div className="flex items-center justify-between px-[8vw] py-6">
              <Link
                to="/"
                className="font-heading text-xs uppercase tracking-[0.3em] text-foreground focus:outline-2 focus:outline-foreground"
              >
                Sustainable Food Hub
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="font-heading text-xs uppercase tracking-[0.3em] text-foreground hover:text-accent transition-colors focus:outline-2 focus:outline-foreground"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-[8vw]">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1 + i * 0.08,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    to={item.path}
                    className="block font-heading text-[8vw] md:text-[6vw] uppercase leading-none tracking-tight text-foreground hover:text-accent transition-colors py-3 md:py-4 border-b border-border focus:outline-2 focus:outline-foreground"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-[8vw] py-8">
              <p className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
                Maryland · Washington DC · Surrounding Areas
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
