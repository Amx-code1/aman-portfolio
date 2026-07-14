
import React from 'react';
import './SectionSkeleton.css';

interface SectionSkeletonProps {
  label?: string;
  height?: string;
}

/**
 * Lightweight, GPU-friendly Suspense fallback that reserves vertical space
 * to prevent layout shift while below-the-fold sections stream in.
 */
export function SectionSkeleton({ label = 'Loading section', height }: SectionSkeletonProps) {
  return (
    <div
      className="skeleton"
      role="status"
      aria-busy="true"
      aria-label={label}
      style={height ? { minHeight: height } : undefined}
    >
      <div className="skeleton__shimmer" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
