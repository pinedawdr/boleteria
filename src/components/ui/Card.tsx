import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * 🎮 COMPONENTE CARD ESTILO GAMETIME.CO
 * 
 * Cards con estilo moderno inspirado en Gametime.co
 * Fondo sólido oscuro con bordes sutiles y efectos hover elegantes
 */

const cardVariants = cva(
  'rounded-xl transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        // Card principal: estilo Gametime unificado
        default: 'card-default',
        // Card con efecto elevado
        elevated: 'card-elevated',
        // Card con efecto glow verde
        glow: 'card-default hover-glow',
        // Card outline solo con borde
        outline: 'bg-transparent border border-default hover:border-accent hover:bg-card',
        // Card con acento verde
        accent: 'bg-card border border-accent hover:border-accent hover-glow',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4', 
        lg: 'p-6',
        xl: 'p-8',
      },
      hover: {
        none: '',
        lift: 'hover-lift',
        glow: 'hover-glow',
        scale: 'hover-scale',
        both: 'hover-lift hover-glow',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'lg',
      hover: 'lift',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, hover }), className)}
      {...props}
    />
  )
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-400', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
));

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
