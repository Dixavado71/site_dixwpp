import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabContext = React.createContext<TabContextType | undefined>(undefined);

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || '');
  
  const isControlled = controlledValue !== undefined;
  const activeTab = isControlled ? controlledValue : uncontrolledValue;
  
  const setActiveTab = React.useCallback((newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  }, [isControlled, onValueChange]);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)} role="tablist">
        {children}
      </div>
    </TabContext.Provider>
  );
};

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabContext);
    
    if (!context) {
      throw new Error('TabsTrigger must be used within Tabs');
    }
    
    const { activeTab, setActiveTab } = context;
    const isSelected = activeTab === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isSelected}
        onClick={() => setActiveTab(value)}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          isSelected && 'bg-background text-foreground shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabContext);
    
    if (!context) {
      throw new Error('TabsContent must be used within Tabs');
    }
    
    const { activeTab } = context;
    const isSelected = activeTab === value;

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={cn(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';

export default Tabs;
