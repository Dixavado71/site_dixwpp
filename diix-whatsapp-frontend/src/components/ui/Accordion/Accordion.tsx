import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface AccordionContextType {
  expandedItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined);

export interface AccordionProps {
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  defaultValue = [],
  value: controlledValue,
  onValueChange,
  type = 'multiple',
  collapsible = false,
  className,
  children,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  
  const isControlled = controlledValue !== undefined;
  const expandedItems = isControlled ? controlledValue : uncontrolledValue;

  const toggleItem = React.useCallback((itemValue: string) => {
    if (isControlled) {
      if (type === 'single') {
        const newValue = expandedItems[0] === itemValue && collapsible ? [] : [itemValue];
        onValueChange?.(newValue);
      } else {
        const newValue = expandedItems.includes(itemValue)
          ? expandedItems.filter((v) => v !== itemValue)
          : [...expandedItems, itemValue];
        onValueChange?.(newValue);
      }
    } else {
      if (type === 'single') {
        setUncontrolledValue(expandedItems[0] === itemValue && collapsible ? [] : [itemValue]);
      } else {
        setUncontrolledValue(
          expandedItems.includes(itemValue)
            ? expandedItems.filter((v) => v !== itemValue)
            : [...expandedItems, itemValue]
        );
      }
    }
  }, [isControlled, type, collapsible, expandedItems, onValueChange]);

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem }}>
      <div className={cn('w-full', className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    
    if (!context) {
      throw new Error('AccordionItem must be used within Accordion');
    }
    
    const { expandedItems } = context;
    const isExpanded = expandedItems.includes(value);

    return (
      <div
        ref={ref}
        className={cn('border-b last:border-b-0', className)}
        data-state={isExpanded ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    const parentItem = React.useContext(React.createContext<{ value?: string }>({}));
    
    if (!context) {
      throw new Error('AccordionTrigger must be used within Accordion');
    }
    
    const { expandedItems, toggleItem } = context;
    const isExpanded = parentItem.value ? expandedItems.includes(parentItem.value) : false;

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => parentItem.value && toggleItem(parentItem.value)}
        className={cn(
          'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        aria-expanded={isExpanded}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        />
      </button>
    );
  }
);

AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    const parentItem = React.useContext(React.createContext<{ value?: string }>({}));
    
    if (!context) {
      throw new Error('AccordionContent must be used within Accordion');
    }
    
    const { expandedItems } = context;
    const isExpanded = parentItem.value ? expandedItems.includes(parentItem.value) : false;

    if (!isExpanded) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden text-sm pb-4 animate-accordion-down',
          className
        )}
        {...props}
      >
        <div className="pt-0">{children}</div>
      </div>
    );
  }
);

AccordionContent.displayName = 'AccordionContent';

export default Accordion;
