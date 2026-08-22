/**
 * Olympus UI Components - Design System Premium
 * 
 * Componentes atômicos reconstruídos com Radix UI Primitives + CVA
 * Acessibilidade nativa, variações tipadas e performance otimizada
 */

// Buttons & Actions
export { Button, buttonVariants, type ButtonProps } from './button';

// Form Inputs
export { Input, inputVariants, type InputProps } from './input';
export { Textarea, type TextareaProps } from './Textarea';

// Layout & Containers
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
  type CardProps,
} from './card';

// Dialogs & Modals
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';

// Selection Controls
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './select';

// Navigation & Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

// Accordion
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';

// Badges & Indicators
export { Badge, badgeVariants, type BadgeProps } from './badge';
export { Progress } from './progress';

// Avatars
export { Avatar, AvatarImage, AvatarFallback } from './avatar';

// Tooltips & Popovers
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
export { Popover, PopoverTrigger, PopoverClose, PopoverContent } from './popover';

// Dropdown Menus
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './dropdown-menu';

// Feedback & Loading
export { Skeleton, type SkeletonProps } from './skeleton';

// Legacy exports for backward compatibility
export { StatusBadge, type StatusBadgeProps } from './StatusBadge';
export { ActionButton, type ActionButtonProps } from './ActionButton';
export { Backdrop } from './Backdrop';
export { ThemeToggle } from './ThemeToggle';
export { Toast } from './Toast';
export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './Breadcrumb';
export { Pagination, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from './Pagination';
export { KPICard, type KPICardProps } from './KPICard';
export { EmptyState, type EmptyStateProps } from './EmptyState';
export { LoadingState, type LoadingStateProps } from './LoadingState';

// Form components
export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription, useFormField } from './form/Form';

// Table components
export { DataTable, type DataTableProps } from './table/DataTable';
