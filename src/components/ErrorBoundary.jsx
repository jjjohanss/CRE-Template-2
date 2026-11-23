import React from "react";

// Catches a crash while drawing a page, so one bad record shows a friendly message
// instead of a blank white site. `resetKey` (the current URL path) clears the error
// when the visitor navigates elsewhere.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Page crashed:", error, info?.componentStack);
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="min-h-[60vh] flex items-center justify-center px-6 py-20 bg-white">
        <div className="max-w-md text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#C8102E] mb-3">Something went wrong</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">This page couldn't be displayed.</h1>
          <p className="text-gray-500 mb-8">
            Please try again. If the problem continues, call us at{" "}
            <a href="tel:949-221-1800" className="text-[#C8102E] font-medium">(949) 221-1800</a>.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#C8102E] text-white text-sm font-semibold rounded-lg hover:bg-[#a00d24] transition-colors"
            >
              Reload page
            </button>
            <a href="/" className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              Go to homepage
            </a>
          </div>
        </div>
      </div>
    );
  }
}
