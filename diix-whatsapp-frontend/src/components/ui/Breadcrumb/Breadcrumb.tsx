import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <React.Fragment key={item.href || item.label}>
              <li>
                {isLast ? (
                  <span
                    className="text-sm font-medium text-foreground"
                    aria-current="page"
                  >
                    {item.icon && (
                      <span className="mr-1 inline-flex items-center">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.icon && (
                      <span className="mr-1 inline-flex items-center">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </a>
                )}
              </li>
              {!isLast && (
                <li className="text-muted-foreground" aria-hidden="true">
                  {separator}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
