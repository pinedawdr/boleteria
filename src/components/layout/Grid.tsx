import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const gridVariants = cva(
  'grid',
  {
    variants: {
      cols: {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        12: 'grid-cols-12',
      },
      gap: {
        none: 'gap-0',
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
        '2xl': 'gap-12',
      },
      responsive: {
        none: '',
        sm: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        md: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        lg: 'lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
        auto: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
      },
    },
    defaultVariants: {
      cols: 1,
      gap: 'md',
      responsive: 'none',
    },
  }
);

type ResponsiveColumns = {
  base?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
};

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof gridVariants>, 'cols'> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | ResponsiveColumns;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, responsive, ...props }, ref) => {
    // Handle responsive columns
    let responsiveClasses = '';
    if (typeof cols === 'object') {
      const { base, sm, md, lg, xl } = cols;
      responsiveClasses = [
        base && `grid-cols-${base}`,
        sm && `sm:grid-cols-${sm}`,
        md && `md:grid-cols-${md}`,
        lg && `lg:grid-cols-${lg}`,
        xl && `xl:grid-cols-${xl}`,
      ].filter(Boolean).join(' ');
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          responsiveClasses || gridVariants({ cols: cols as 1 | 2 | 3 | 4 | 5 | 6 | 12, gap, responsive }),
          gap && `gap-${gap === 'xs' ? '1' : gap === 'sm' ? '2' : gap === 'md' ? '4' : gap === 'lg' ? '6' : gap === 'xl' ? '8' : gap === '2xl' ? '12' : '0'}`,
          className
        )}
        {...props}
      />
    );
  }
);

Grid.displayName = 'Grid';

type ResponsiveSpan = {
  base?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
};

const GridItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | ResponsiveSpan;
    start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    end?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  }
>(({ className, span, start, end, ...props }, ref) => {
  let spanClasses = '';
  
  if (typeof span === 'object') {
    const { base, sm, md, lg, xl } = span;
    spanClasses = [
      base && `col-span-${base}`,
      sm && `sm:col-span-${sm}`,
      md && `md:col-span-${md}`,
      lg && `lg:col-span-${lg}`,
      xl && `xl:col-span-${xl}`,
    ].filter(Boolean).join(' ');
  } else if (span) {
    spanClasses = `col-span-${span}`;
  }

  const startClass = start ? `col-start-${start}` : '';
  const endClass = end ? `col-end-${end}` : '';

  return (
    <div
      ref={ref}
      className={cn(spanClasses, startClass, endClass, className)}
      {...props}
    />
  );
});

GridItem.displayName = 'GridItem';

export { Grid, GridItem, gridVariants };
