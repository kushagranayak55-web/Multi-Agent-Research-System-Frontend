import { Outlet } from "react-router-dom";

import { ErrorBoundary } from "@/components/common/error-boundary";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/providers/theme-provider";

/**
 * The one layout every route mounts under. Individual pages (landing
 * vs. workspace) can still differ heavily in what they render inside
 * <Outlet /> — this shell only owns what truly must be global:
 * theme context, the error boundary, and the header/footer chrome.
 */
export function RootLayout() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
