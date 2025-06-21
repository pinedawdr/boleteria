import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const modalVariants = cva(
  'fixed inset-0 z-modal flex items-center justify-center p-4',
  {
    variants: {
      variant: {
        default: '',
        blur: 'backdrop-blur-sm',
      },
    },
    defaultVariants: {
      variant: 'blur',
    },
  }
);

const modalContentVariants = cva(
  'relative w-full max-w-lg mx-auto bg-surface rounded-xl border border-border shadow-xl transform transition-all duration-300',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw] max-h-[95vh]',
      },
      variant: {
        default: 'bg-surface',
        glass: 'bg-background-overlay backdrop-blur-md border-white/10',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface ModalProps extends VariantProps<typeof modalVariants> {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
}

export interface ModalContentProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalContentVariants> {}

const Modal = ({ 
  open, 
  onClose, 
  children, 
  variant, 
  className, 
  closeOnOverlayClick = true 
}: ModalProps) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div 
      className={cn(modalVariants({ variant, className }))}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, size, variant, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(modalContentVariants({ size, variant, className }))}
      {...props}
    >
      {children}
    </div>
  )
);

ModalContent.displayName = 'ModalContent';

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between p-6 pb-4', className)}
    {...props}
  />
));

ModalHeader.displayName = 'ModalHeader';

const ModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-xl font-semibold text-text-primary', className)}
    {...props}
  />
));

ModalTitle.displayName = 'ModalTitle';

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-6 py-4', className)}
    {...props}
  />
));

ModalBody.displayName = 'ModalBody';

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex justify-end gap-3 p-6 pt-4 border-t border-border', className)}
    {...props}
  />
));

ModalFooter.displayName = 'ModalFooter';

const ModalCloseButton = ({ onClose }: { onClose: () => void }) => (
  <button
    onClick={onClose}
    className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

export {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  modalVariants,
  modalContentVariants,
};
