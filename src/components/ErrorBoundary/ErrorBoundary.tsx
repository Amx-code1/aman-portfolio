
import React from 'react';
import { CharacterSilhouette } from '../CharacterSilhouette/CharacterSilhouette';
import './ErrorBoundary.css';

interface Props {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * App-level error boundary. Catches render/runtime errors anywhere in the
 * tree and shows an on-brand "500" recovery screen instead of a white screen.
 * Also dispatches an `app:error` event consumed by monitoring/analytics.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('app:error', {
          detail: { message: error.message, stack: info.componentStack },
        })
      );
    }
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback(this.state.error!, this.reset);
      return (
        <div className="err5" role="alert">
          <div className="err5__bg" aria-hidden="true">
            <CharacterSilhouette className="err5__char" />
          </div>
          <div className="err5__inner">
            <span className="err5__code">500</span>
            <h1 className="err5__title">The frame slipped.</h1>
            <p className="err5__msg">
              An unexpected anomaly broke the animation loop. Don’t worry — the wind will carry us
              forward.
            </p>
            <div className="err5__actions">
              <button className="err5__btn" onClick={this.reset} data-cursor="hover">
                ↻ Retry
              </button>
              <a className="err5__btn err5__btn--ghost" href="/" data-cursor="hover">
                Return Home
              </a>
            </div>
            {this.state.error && (
              <pre className="err5__detail" aria-hidden="true">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
