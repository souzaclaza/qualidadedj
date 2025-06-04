import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertCircle } from 'lucide-react';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-secondary-900 p-4">
      <div className="card max-w-lg w-full text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
          Algo deu errado
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-4">
          {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

export function ErrorBoundaryProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}