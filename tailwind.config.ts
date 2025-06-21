import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Sistema de colores inspirado en Gametime.co (versión sólida)
      colors: {
        // Colores principales (oscuros como Gametime)
        primary: '#111111',        // Fondo principal - gris muy oscuro
        secondary: '#1C1C1E',      // Contenedores - gris oscuro
        
        // Color de acento principal (verde neón brillante)
        accent: '#FF0042',         // Verde neón/teal brillante (reemplaza degradados)
        'accent-hover': '#FF0042', // Versión más oscura para hover
        'accent-light': '#88F8DC', // Versión más clara
        
        // Textos
        'text-primary': '#FFFFFF',   // Texto principal - blanco puro
        'text-secondary': '#8E8E93', // Texto secundario - gris medio
        'text-muted': '#48484A',     // Texto apagado - gris más oscuro
        
        // Bordes y divisores
        'border-color': '#333333',   // Bordes sutiles
        'border-light': '#48484A',   // Bordes más visibles
        
        // Estados
        success: '#FF0042',          // Verde éxito
        warning: '#FFD60A',          // Amarillo advertencia  
        error: '#FF453A',            // Rojo error
        info: '#007AFF',             // Azul información
        
        // Fondos específicos del layout
        'header-bg': '#000000',      // Fondo del header - negro completo
        'footer-bg': '#000000',      // Fondo del footer - negro completo
        'body-bg': '#0e0e0f',        // Fondo del cuerpo principal - negro más oscuro
        
        // Fondos especiales
        'card-bg': '#1C1C1E',        // Fondo de tarjetas
        'input-bg': '#2C2C2E',       // Fondo de inputs
        'hover-bg': '#2C2C2E',       // Fondo hover
        'active-bg': '#3A3A3C',      // Fondo activo
        
        // Overlays
        'overlay-light': 'rgba(0, 0, 0, 0.4)',
        'overlay-medium': 'rgba(0, 0, 0, 0.6)',
        'overlay-heavy': 'rgba(0, 0, 0, 0.8)',
        
        // Mantenemos algunos colores legacy para compatibilidad
        'background-var': "var(--background)",
        'foreground-var': "var(--foreground)",
      },
      
      // Tipografía moderna (Inter como en sitios modernos)
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.025em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0.025em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0.025em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
      },
      
      // Bordes redondeados modernos
      borderRadius: {
        'xs': '0.125rem',    // 2px
        'sm': '0.25rem',     // 4px  
        'md': '0.375rem',    // 6px
        'lg': '0.5rem',      // 8px
        'xl': '0.75rem',     // 12px
        '2xl': '1rem',       // 16px
        '3xl': '1.5rem',     // 24px
      },
      
      // Sombras modernas y sutiles
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        
        // Sombras con acento verde
        'accent': '0 0 0 1px #FF0042',
        'accent-lg': '0 0 0 2px #FF0042, 0 4px 6px -1px rgba(21, 245, 186, 0.1)',
        'glow': '0 0 20px rgba(21, 245, 186, 0.3)',
        'glow-lg': '0 0 40px rgba(21, 245, 186, 0.2)',
        
        // Sombras para cards
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 25px rgba(0, 0, 0, 0.15)',
      },
      
      // Animaciones suaves
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 1s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(21, 245, 186, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(21, 245, 186, 0.6)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      
      // Transiciones optimizadas
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      // Espaciados adicionales
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      // Z-index estandarizado
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
      },
    },
  },
  plugins: [],
};

export default config;
