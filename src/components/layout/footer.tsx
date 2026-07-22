import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="container flex flex-col items-center gap-2 py-10 text-center">
        <div className="flex items-center gap-2 font-display text-sm font-medium text-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          {SITE.name}
        </div>
        <p className="text-xs text-muted-foreground">{SITE.fullName}</p>
        <p className="mt-4 text-xs text-muted-foreground">
          A Product by {SITE.author}
        </p>
      </div>
    </footer>
  );
}
