/**
 * Olympus UI Components - Design System Premium
 * 
 * Componentes atômicos reconstruídos com Radix UI Primitives + CVA
 * Acessibilidade nativa, variações tipadas e performance otimizada
 */

// Buttons & Actions
export { Button, buttonVariants, type ButtonProps } from './Button';

// Form Inputs
export { Input, inputVariants, type InputProps } from './Input';
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
} from './Card';

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
} from './Dialog';

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
} from './Select/Select';

// Navigation & Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs/Tabs';

// Accordion
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion/Accordion';

// Badges & Indicators
export { Badge, badgeVariants, type BadgeProps } from './Badge/Badge';
export { Progress } from './ProgressBar/ProgressBar';

// Avatars
export { Avatar, AvatarImage, AvatarFallback } from './Avatar/Avatar';

// Tooltips & Popover
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './Tooltip/Tooltip';
export { Popover, PopoverTrigger, PopoverClose, PopoverContent } from './popover/popover';

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
} from './dropdown-menu/dropdown-menu';

// Feedback & Loading
export { Skeleton, type SkeletonProps, SkeletonCard, SkeletonTable, SkeletonChart, SkeletonDashboard } from './Skeleton';

// Legacy exports for backward compatibility
export { StatusBadge, type StatusBadgeProps } from './StatusBadge';
export { ActionButton, type ActionButtonProps } from './ActionButton';
export { Backdrop } from './Backdrop';
export { ThemeToggle } from './ThemeToggle';
export { Toast } from './Toast';
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem } from './Breadcrumb/Breadcrumb';
export { Pagination, type PaginationProps } from './Pagination/Pagination';
export { KPICard, type KPICardProps } from './KPICard';
export { EmptyState, type EmptyStateProps } from './EmptyState';
export { LoadingState, type LoadingStateProps } from './LoadingState';

// Form components
export {
  Form,
  FormInput,
  FormSelect,
  FormCheckbox,
  FormRadio,
  type FormProps,
  type FormFieldProps,
} from './form/Form';

// Table components
export { DataTable, type DataTableProps } from './table/DataTable';
