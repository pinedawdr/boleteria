import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * 🎮 COMPONENTE TEXTAREA ESTILO GAMETIME.CO
 * 
 * Textarea con estilo consistente al sistema Gametime
 * Background #0E0E0F global y estilos unificados
 */

const textareaVariants = cva(
  'textarea-default',
  {
    variants: {
      variant: {
        default: 'textarea-default',
        error: 'textarea-default border-red-500 focus:border-red-500',
        success: 'textarea-default border-green-500 focus:border-green-500',
      },
      size: {
        sm: 'min-h-[80px] text-sm',
        md: 'min-h-[120px] text-base',
        lg: 'min-h-[160px] text-base',
        xl: 'min-h-[200px] text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
