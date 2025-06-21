import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const sectionVariants = cva(
  'relative',
  {
    variants: {
      variant: {
        default: '',
        surface: 'bg-body-bg',
        muted: 'bg-body-bg',
        primary: 'text-text-primary',
        secondary: 'bg-body-bg text-text-primary',
        glass: 'bg-body-bg/80 backdrop-blur-md border border-border-color',
      },
      padding: {
        none: 'py-0',
        sm: 'py-8',
        md: 'py-12',
        lg: 'py-16',
        xl: 'py-20',
        '2xl': 'py-24',
      },
      spacing: {
        tight: 'space-y-4',
        normal: 'space-y-6',
        relaxed: 'space-y-8',
        loose: 'space-y-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'lg',
      spacing: 'normal',
    },
  }
);

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: 'section' | 'div' | 'main' | 'article' | 'aside';
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, variant, padding, spacing, as: Component = 'section', ...props }, ref) => (
    <Component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn(sectionVariants({ variant, padding, spacing, className }))}
      {...props}
    />
  )
);

Section.displayName = 'Section';

export { Section, sectionVariants };
