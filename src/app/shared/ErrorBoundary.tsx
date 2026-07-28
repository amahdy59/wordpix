import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary component.
 * Catches rendering errors in child components and displays a accessible fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error caught by WordPix ErrorBoundary:", error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-svh bg-background flex items-center justify-center p-6 text-center"
        >
          <div className="bg-wp-card border border-border rounded-2xl p-8 max-w-md w-full shadow-wp-md flex flex-col items-center gap-4">
            <div className="size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center" aria-hidden>
              <AlertTriangle className="size-7" />
            </div>

            <div>
              <h2 className="font-sans font-bold text-foreground text-xl">Something went wrong</h2>
              <p className="font-arabic font-medium text-primary text-sm mt-1" dir="auto" lang="ar">
                حدث خطأ غير متوقع
              </p>
            </div>

            <p className="font-sans text-muted-foreground text-xs leading-relaxed">
              An unexpected error occurred while loading this view. Please try reloading the application.
            </p>

            <button
              type="button"
              onClick={this.handleReset}
              className="bg-primary text-primary-foreground font-sans font-semibold rounded-xl px-6 py-3 min-h-[44px]
                flex items-center justify-center gap-2 w-full motion-safe:transition-opacity hover:opacity-90
                focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <RefreshCw className="size-4" aria-hidden />
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
