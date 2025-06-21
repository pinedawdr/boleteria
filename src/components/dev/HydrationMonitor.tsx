'use client';

import { useEffect, useState, useCallback } from 'react';

interface HydrationError {
  id: string;
  timestamp: number;
  message: string;
  attribute?: string;
  element?: string;
  suppressed: boolean;
}

export default function HydrationMonitor() {
  const [errors, setErrors] = useState<HydrationError[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const addError = useCallback((error: Omit<HydrationError, 'id' | 'timestamp'>) => {
    const newError: HydrationError = {
      ...error,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    
    setErrors(prev => [...prev.slice(-9), newError]); // Keep only last 10 errors
  }, []);

  useEffect(() => {
    // Solo mostrar en desarrollo
    if (process.env.NODE_ENV !== 'development') return;

    let originalConsoleError: typeof console.error;
    let originalConsoleWarn: typeof console.warn;

    const interceptConsole = () => {
      originalConsoleError = console.error;
      originalConsoleWarn = console.warn;

      console.error = (...args) => {
        const message = args[0]?.toString() || '';
        
        if (message.includes('Hydration failed') || 
            message.includes('Text content did not match') ||
            message.includes('Extra attributes from the server') ||
            message.includes('cz-shortcut-listen')) {
          
          addError({
            message,
            suppressed: true,
            attribute: message.includes('cz-shortcut-listen') ? 'cz-shortcut-listen' : undefined,
            element: 'body'
          });
          
          // Log debug info instead of error
          console.debug('[HydrationMonitor] Intercepted hydration error:', message);
          return;
        }
        
        originalConsoleError.call(console, ...args);
      };

      console.warn = (...args) => {
        const message = args[0]?.toString() || '';
        
        if (message.includes('Warning: Extra attributes from the server') ||
            message.includes('cz-shortcut-listen')) {
          
          addError({
            message,
            suppressed: true,
            attribute: message.includes('cz-shortcut-listen') ? 'cz-shortcut-listen' : undefined,
            element: 'body'
          });
          
          console.debug('[HydrationMonitor] Intercepted hydration warning:', message);
          return;
        }
        
        originalConsoleWarn.call(console, ...args);
      };
    };

    // Interceptar errores globales también
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message?.includes('Hydration') || 
          event.message?.includes('cz-shortcut-listen')) {
        
        addError({
          message: event.message,
          suppressed: true
        });
        
        event.preventDefault();
        console.debug('[HydrationMonitor] Intercepted global hydration error:', event.message);
      }
    };

    interceptConsole();
    window.addEventListener('error', handleGlobalError);

    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.removeEventListener('error', handleGlobalError);
    };
  }, [addError]);

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'H') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        style={{ fontSize: '12px' }}
        title="Toggle Hydration Monitor (Ctrl+Shift+H)"
      >
        H{errors.length > 0 && <span className="ml-1 bg-red-500 text-white px-1 rounded-full text-xs">{errors.length}</span>}
      </button>

      {/* Monitor panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-2xl max-w-md w-96 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold">🔧 Hydration Monitor</h3>
            <button
              onClick={() => setErrors([])}
              className="text-xs bg-red-600 px-2 py-1 rounded hover:bg-red-700"
            >
              Clear
            </button>
          </div>
          
          <div className="text-xs space-y-2">
            <div className="border-b border-gray-700 pb-2">
              <p><strong>Status:</strong> {errors.length === 0 ? '✅ No issues' : `⚠️ ${errors.length} issues found`}</p>
              <p><strong>Monitoring:</strong> Hydration errors, extension conflicts</p>
            </div>

            {errors.length === 0 ? (
              <p className="text-green-400">No hydration errors detected! 🎉</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {errors.reverse().map((error) => (
                  <div key={error.id} className="bg-gray-800 p-2 rounded text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <span className={error.suppressed ? 'text-yellow-400' : 'text-red-400'}>
                        {error.suppressed ? '🟡 Suppressed' : '🔴 Error'}
                      </span>
                      <span className="text-gray-400">
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300 break-words">
                      {error.message.length > 100 
                        ? `${error.message.substring(0, 100)}...` 
                        : error.message
                      }
                    </p>
                    {error.attribute && (
                      <p className="text-blue-400 mt-1">
                        Attribute: {error.attribute}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-700 pt-2 text-gray-400">
              <p><strong>Tip:</strong> Press Ctrl+Shift+H to toggle this monitor</p>
              <p><strong>Extensions:</strong> ColorZilla, Grammarly, etc. are automatically handled</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
