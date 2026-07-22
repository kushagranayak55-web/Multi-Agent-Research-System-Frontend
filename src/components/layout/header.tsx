import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ROUTES, SITE } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to={ROUTES.landing}
          className="flex items-center gap-2 font-display text-base font-semibold tracking-tight"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-primary shadow-glow" />
          {SITE.name}
        </Link>

        <Button asChild size="sm">
          <Link to={ROUTES.workspace}>Start Research</Link>
        </Button>
      </div>
    </header>
  );
}
