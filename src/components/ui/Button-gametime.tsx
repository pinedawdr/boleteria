import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * 🎮 COMPONENTE BUTTON ESTILO GAMETIME.CO
 * 
 * Sistema de variantes inspirado en Gametime.co con colores sólidos
 * Mantiene la funcionalidad exacta pero cambia completamente la estética
 */

const buttonVariants = cva(
  // Clases base Gametime style
  "inline-flex items-center justify-center rounded-lg font-bold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Botón principal: verde neón sobre negro (como Gametime)
        primary: "bg-accent text-black hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-lg",
        // Botón secundario: fondo oscuro con borde
        secondary: "bg-body-bg border border-border-color text-text-primary hover:bg-hover-bg hover:border-border-light",
        // Botón outline: solo borde verde neón
        outline: "bg-transparent border border-accent text-accent hover:bg-accent hover:text-black",
        // Botón ghost: solo hover
        ghost: "bg-transparent text-text-primary hover:bg-hover-bg hover:text-accent",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base", 
        lg: "h-12 px-8 text-lg",
        xl: "h-14 px-10 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant,
    size,
    loading, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled, 
    fullWidth,
    ...props 
  }, ref) => {
    
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* Left icon */}
        {leftIcon && !loading && (
          <span className="mr-2 flex-shrink-0">
            {leftIcon}
          </span>
        )}
        
        {/* Content */}
        <span className="flex-1">
          {children}
        </span>
        
        {/* Right icon */}
        {rightIcon && (
          <span className="ml-2 flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
