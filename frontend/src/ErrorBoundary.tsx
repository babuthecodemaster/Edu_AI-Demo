import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: "",
  };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : "Unknown runtime error";
    return { hasError: true, message };
  }

  componentDidCatch() {
    // Intentionally no-op: we render a visible fallback UI instead of crashing to blank screen.
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{ padding: 16, fontFamily: "monospace", color: "white", background: "black", minHeight: "100vh" }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>App crashed</div>
        <div style={{ opacity: 0.9, whiteSpace: "pre-wrap" }}>{this.state.message}</div>
      </div>
    );
  }
}

