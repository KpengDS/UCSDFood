import { useLocation, Link } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="font-heading text-[15vw] md:text-[8vw] uppercase leading-none tracking-tighter text-muted-foreground/30">
          404
        </h1>
        <h2 className="font-heading text-xl uppercase tracking-tight text-foreground">
          Page Not Found
        </h2>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          The page <span className="text-foreground">"{pageName}"</span> doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block font-heading text-xs uppercase tracking-widest px-6 py-3.5 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
