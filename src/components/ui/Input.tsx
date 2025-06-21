import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * 🎮 COMPONENTE INPUT ESTILO GAMETIME.CO v2.0
 * 
 * Inputs mejorados con sistema consistente
 * Background #0E0E0F global y estilos unificados
 */

const inputVariants = cva(
  'flex w-full transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        // Input principal: estilo Gametime unificado
        default: 'input-default',
        // Input de búsqueda con padding para ícono
        search: 'input-search',
        // Input con error: borde rojo
        error: 'input-default border-red-500 focus:border-red-500 focus:ring-red-500',
        // Input con éxito: borde verde
        success: 'input-default border-green-500 focus:border-green-500 focus:ring-green-500', 
        // Input outline: transparente con borde
        outline: 'bg-transparent border border-default text-primary focus:border-accent hover:bg-surface',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-12 px-4 text-base', 
        xl: 'h-14 px-6 text-lg',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'lg',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, rounded, type, leftIcon, rightIcon, error, label, helperText, ...props }, ref) => {
    const inputVariant = error ? 'error' : variant;
    
    return (
      <div className="w-full">
        {label && (
          <label className="text-sm font-medium text-text-primary mb-2 block">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: inputVariant, size, rounded, className }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10'
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn(
            'text-xs mt-1',
            error ? 'text-error-500' : 'text-text-secondary'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
