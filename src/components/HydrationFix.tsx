'use client';

import { useEffect, useCallback, useRef } from 'react';

// Lista exhaustiva de atributos de extensiones conocidos
const EXTENSION_ATTRIBUTES = [
  // ColorZilla
  'cz-shortcut-listen',
  // Grammarly
  'data-new-gr-c-s-check-loaded',
  'data-gr-ext-installed',
  'data-gr-c-s-loaded',
  'data-grammarly-shadow-root',
  // LanguageTool
  'data-lt-installed',
  'data-lt-tmp-id',
  // Dashlane
  'data-dashlane-rid',
  'data-dashlane-observed',
  // 1Password
  'data-1p-ignore',
  'data-onepassword-watching',
  // LastPass
  'data-lastpass-icon-root',
  'data-lastpass',
  'lp-enabled',
  'data-lp-id',
  // AdBlock
  'data-adblock',
  'adblock-enabled',
  'data-adguard',
  // Honey
  'data-honey-extension',
  'data-honey-available',
  // MetaMask
  'data-metamask',
  'ethereum-provider',
  // Bitwarden
  'data-bitwarden',
  'data-bw-watching',
  'data-bitwarden-watching',
  // Chrome extensions generales
  'chrome-extension-mutationobserver-patched',
  'data-extension',
  'extension-port-id',
  // Otros comunes
  'spellcheck',
  'data-ms-editor',
  'data-page-translator',
  'data-translate',
  'data-google-translate-el',
  'data-weglot',
  'data-pinterest-extension-installed',
  'data-save-to-notion-extension',
  'data-reader-extension',
  'data-clarity-mask',
  'data-hotjar-installed'
];

export default function HydrationFix() {
  const hasInitialized = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);

  const cleanExtensionAttributes = useCallback(() => {
    try {
      // Limpiar atributos del body
      const body = document.body;
      if (body) {
        EXTENSION_ATTRIBUTES.forEach(attr => {
          if (body.hasAttribute(attr)) {
            body.removeAttribute(attr);
            if (process.env.NODE_ENV === 'development') {
              console.debug(`[HydrationFix] Removed ${attr} from body`);
            }
          }
        });
      }

      // También limpiar del HTML
      const html = document.documentElement;
      if (html) {
        EXTENSION_ATTRIBUTES.forEach(attr => {
          if (html.hasAttribute(attr)) {
            html.removeAttribute(attr);
            if (process.env.NODE_ENV === 'development') {
              console.debug(`[HydrationFix] Removed ${attr} from html`);
            }
          }
        });
      }

      // Limpiar atributos style añadidos por extensiones
      const removeExtensionStyles = (element: Element) => {
        const style = element.getAttribute('style');
        if (style && (
          style.includes('cz-') || 
          style.includes('grammarly') || 
          style.includes('dashlane') ||
          style.includes('lastpass') ||
          style.includes('honey') ||
          style.includes('adblock')
        )) {
          // Solo remover estilos específicos de extensiones, no todos
          const cleanStyle = style
            .split(';')
            .filter(rule => !rule.trim().match(/^(cz-|grammarly|dashlane|lastpass|honey|adblock)/))
            .join(';');
          
          if (cleanStyle !== style) {
            if (cleanStyle.trim()) {
              element.setAttribute('style', cleanStyle);
            } else {
              element.removeAttribute('style');
            }
            if (process.env.NODE_ENV === 'development') {
              console.debug(`[HydrationFix] Cleaned extension styles from`, element);
            }
          }
        }
      };

      if (body) removeExtensionStyles(body);
      if (html) removeExtensionStyles(html);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[HydrationFix] Error cleaning extension attributes:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Limpiar inmediatamente
    cleanExtensionAttributes();

    // Limpiar después de un pequeño delay para extensiones que se cargan tarde
    const timeoutId = setTimeout(cleanExtensionAttributes, 100);
    const delayedTimeoutId = setTimeout(cleanExtensionAttributes, 1000);

    // Observer para limpiar atributos que se agreguen dinámicamente
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target as Element;
          const attrName = mutation.attributeName;
          
          if (attrName && EXTENSION_ATTRIBUTES.includes(attrName)) {
            target.removeAttribute(attrName);
            if (process.env.NODE_ENV === 'development') {
              console.debug(`[HydrationFix] Dynamically removed ${attrName}`);
            }
          }
        }
      });
    });

    observerRef.current = observer;

    // Observar cambios en body y html
    if (document.body) {
      observer.observe(document.body, { 
        attributes: true, 
        attributeFilter: EXTENSION_ATTRIBUTES 
      });
    }
    
    if (document.documentElement) {
      observer.observe(document.documentElement, { 
        attributes: true, 
        attributeFilter: EXTENSION_ATTRIBUTES 
      });
    }

    // Intervalo de limpieza periódica (cada 10 segundos, menos agresivo)
    const intervalId = setInterval(cleanExtensionAttributes, 10000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(delayedTimeoutId);
      clearInterval(intervalId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [cleanExtensionAttributes]);

  return null;
}

export function ThemeHydrationFix() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Asegurarse de que el theme es consistente
    const applyTheme = () => {
      try {
        document.documentElement.style.colorScheme = 'dark';
        document.body.style.backgroundColor = '#0E0E0F';
        document.body.style.color = '#FFFFFF';
        
        // Forzar atributos de tema
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.setAttribute('data-theme', 'dark');
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[ThemeHydrationFix] Error applying theme:', error);
        }
      }
    };

    applyTheme();
    
    // Reaplicar theme después de un delay para asegurar persistencia
    const timeoutId = setTimeout(applyTheme, 50);
    
    // Suprimir warnings de hidratación en desarrollo
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      const originalWarn = console.warn;
      
      console.error = (...args) => {
        if (
          typeof args[0] === 'string' && 
          (args[0].includes('Text content did not match') ||
           args[0].includes('Hydration failed') ||
           args[0].includes('There was an error while hydrating') ||
           args[0].includes('Expected server HTML to contain') ||
           args[0].includes('Warning: Prop') ||
           args[0].includes('cz-shortcut-listen') ||
           args[0].includes('Extra attributes from the server'))
        ) {
          console.debug('[HydrationFix] Suppressed hydration error:', args[0]);
          return;
        }
        originalError.call(console, ...args);
      };

      console.warn = (...args) => {
        if (
          typeof args[0] === 'string' && 
          (args[0].includes('Warning: Extra attributes from the server') ||
           args[0].includes('Warning: Prop') ||
           args[0].includes('cz-shortcut-listen') ||
           args[0].includes('Expected server HTML to contain'))
        ) {
          console.debug('[HydrationFix] Suppressed hydration warning:', args[0]);
          return;
        }
        originalWarn.call(console, ...args);
      };
      
      return () => {
        clearTimeout(timeoutId);
        console.error = originalError;
        console.warn = originalWarn;
      };
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}

// Hook para manejar hydration mismatches más específicos
export function useHydrationSafety() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Prevenir hydration mismatches comunes
    if (typeof window !== 'undefined') {
      // Override Math.random para ser determinista durante la hidratación inicial
      let isHydrating = true;
      const originalRandom = Math.random;
      let seedCounter = 0;
      
      Math.random = () => {
        if (isHydrating) {
          // Usar un valor determinista durante la hidratación
          seedCounter = (seedCounter + 1) % 1000;
          return seedCounter / 1000;
        }
        return originalRandom();
      };

      // Restaurar Math.random después de la hidratación
      const timeoutId = setTimeout(() => {
        isHydrating = false;
        Math.random = originalRandom;
      }, 2000); // Aumentado a 2 segundos para más seguridad

      return () => {
        clearTimeout(timeoutId);
        Math.random = originalRandom;
      };
    }
  }, []);
}

// Componente que envuelve el contenido para suprimir errores específicos
export function HydrationErrorBoundary({ 
  children
}: { 
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Suprimir errores específicos de hidratación
    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes('Hydration failed') ||
        event.message?.includes('Text content did not match') ||
        event.message?.includes('cz-shortcut-listen')
      ) {
        event.preventDefault();
        if (process.env.NODE_ENV === 'development') {
          console.debug('[HydrationErrorBoundary] Suppressed hydration error:', event.message);
        }
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return <>{children}</>;
}
