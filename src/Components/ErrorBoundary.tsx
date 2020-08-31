import React, { Component } from 'react';

export default class ErrorBoundary extends Component<
  { children: React.ReactNode },
  {
    error?: Error;
  }
> {
  constructor(props: Readonly<{ children: React.ReactNode }>) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return error;
  }

  render() {
    if (this.state.error) {
      return (
        <>
          <h1>Something went wrong.</h1>
          <h3>{this.state.error.name}</h3>
          <div>{this.state.error.message}</div>
        </>
      );
    }
    return this.props.children;
  }
}
