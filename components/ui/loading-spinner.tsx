import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps = {}) {
  return (
    <div className={`flex items-center justify-center w-full h-full min-h-[200px] ${className || ''}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default LoadingSpinner; 