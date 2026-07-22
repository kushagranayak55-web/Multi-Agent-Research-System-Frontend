import * as React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // In production this is the seam where an error-tracking call
    // (Sentry, etc.) would go — kept as a plain console.error for now
    // so adding one later doesn't require restructuring the boundary.
    console.error("[MARS] Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="font-display text-lg text-foreground">
              Something went wrong rendering this section.
            </p>
            <p className="text-sm text-muted-foreground">
              Try refreshing the page. If the problem persists, the issue has
              been logged.
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
