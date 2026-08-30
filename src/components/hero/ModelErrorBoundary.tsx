"use client";

import { Component, type ReactNode } from "react";

type Props = { fallback: ReactNode; children: ReactNode };
type State = { hasError: boolean };

/**
 * useGLTF throws (via suspense) when public/models/emblem.glb is missing.
 * This lets the scene keep working with a procedural placeholder until
 * the real asset is dropped in.
 */
export class ModelErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
