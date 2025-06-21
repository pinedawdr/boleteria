import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const selectVariants = cva(
  'flex w-full border bg-surface px-3 py-2 text-sm ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-border focus-visible:ring-primary-500 hover:border-primary-500/50',
        error: 'border-error-500 focus-visible:ring-error-500 text-error-600',
        success: 'border-success-500 focus-visible:ring-success-500',
        glass: 'bg-background-overlay backdrop-blur-md border-white/10 focus-visible:ring-primary-500',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
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

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  label?: string;
  helperText?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded, 
    options, 
    placeholder,
    error, 
    label, 
    helperText, 
    ...props 
  }, ref) => {
    const selectVariant = error ? 'error' : variant;
    
    return (
      <div className="w-full">
        {label && (
          <label className="text-sm font-medium text-text-primary mb-2 block">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              selectVariants({ variant: selectVariant, size, rounded, className }),
              'appearance-none pr-10'
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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

Select.displayName = 'Select';

export { Select, selectVariants };
