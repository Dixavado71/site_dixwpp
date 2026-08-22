import * as React from 'react';
import { cn } from '@/lib/utils';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva, type VariantProps } from 'class-variance-authority';

const tooltipContentVariants = cva(
  'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-[24px] border-white/[0.08] text-white',
        premium: 'bg-gradient-to-br from-gray-900/98 to-black/95 backdrop-blur-[32px] border-white/[0.12] text-white shadow-2xl shadow-green-500/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TooltipProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, 'children' | 'content'>,
    VariantProps<typeof tooltipContentVariants> {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delayDuration?: number;
}

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = ({ children, content, ...props }: TooltipProps) => (
  <TooltipPrimitive.Root>
    <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content {...props}>{content}</TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  </TooltipPrimitive.Root>
);

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & VariantProps<typeof tooltipContentVariants>
>(({ className, sideOffset = 4, variant = 'default', ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipContentVariants({ variant }), className)}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
export default Tooltip;
