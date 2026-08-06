import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Top-level error boundary.
 *
 * Without this, an uncaught render error anywhere in the tree (e.g. a null
 * dereference on `profile`) unmounts the *entire* React app, leaving the
 * last-rendered DOM on screen with zero interactivity ("the page goes
 * static"). This boundary catches that instead and shows a recoverable
 * screen scoped to the failure, rather than silently killing the app.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // This project has no @types/react installed, so `Component<P, S>` has
  // no type information to infer `.props`/`.state` from. Declaring them
  // explicitly (ambient — no extra JS emitted) gives TS the shape it
  // needs without changing runtime behavior.
  declare props: ErrorBoundaryProps;
  declare state: ErrorBoundaryState;
  declare setState: (state: Partial<ErrorBoundaryState>) => void;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] caught render error:', error, errorInfo);
  }

  private handleReload = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-sm w-full bg-white rounded-xl shadow p-6 text-center space-y-3">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-lg font-bold text-gray-800">একটি সমস্যা হয়েছে</h2>
            <p className="text-sm text-gray-600">
              অ্যাপটি অপ্রত্যাশিতভাবে বন্ধ হয়ে গেছে। পুনরায় লোড করার চেষ্টা করুন। আপনার সংরক্ষিত তথ্য নিরাপদ আছে।
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="w-full bg-[#15803d] text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
            >
              🔄 পুনরায় লোড করুন
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
