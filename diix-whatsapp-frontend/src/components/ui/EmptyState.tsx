import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  FileText, 
  Inbox, 
  Search,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  variant?: 'default' | 'search' | 'success' | 'error';
}

const defaultIcons: Record<string, ReactNode> = {
  default: <Inbox className="w-8 h-8" />,
  search: <Search className="w-8 h-8" />,
  success: <CheckCircle className="w-8 h-8 text-success" />,
  error: <AlertCircle className="w-8 h-8 text-error" />,
};

const variantConfig = {
  default: {
    iconBg: 'bg-white/5',
    textColor: 'text-text-primary',
  },
  search: {
    iconBg: 'bg-accent-primary/10',
    textColor: 'text-text-primary',
  },
  success: {
    iconBg: 'bg-success/10',
    textColor: 'text-success',
  },
  error: {
    iconBg: 'bg-error/10',
    textColor: 'text-error',
  },
};

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const config = variantConfig[variant];
  
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className={cn(
        'w-16 h-16 rounded-full flex items-center justify-center mb-4',
        config.iconBg
      )}>
        {icon || defaultIcons[variant]}
      </div>
      <h3 className={cn('text-lg font-medium', config.textColor)}>{title}</h3>
      {description && (
        <p className="text-sm text-text-muted mt-2 max-w-md">{description}</p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  );
}

// EmptyStates especializados por contexto

interface ProductEmptyStateProps {
  onAddProduct?: () => void;
  showAction?: boolean;
}

export function ProductEmptyState({ onAddProduct, showAction = true }: ProductEmptyStateProps) {
  return (
    <EmptyState
      icon={<Package className="w-8 h-8" />}
      title="Nenhum produto cadastrado"
      description="Comece adicionando seu primeiro produto ao catálogo."
      variant="default"
      action={showAction && onAddProduct ? (
        <Button onClick={onAddProduct} className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Produto
        </Button>
      ) : undefined}
    />
  );
}

interface ClientEmptyStateProps {
  onAddClient?: () => void;
  showAction?: boolean;
}

export function ClientEmptyState({ onAddClient, showAction = true }: ClientEmptyStateProps) {
  return (
    <EmptyState
      icon={<Users className="w-8 h-8" />}
      title="Nenhum cliente cadastrado"
      description="Adicione seu primeiro cliente para começar a gerenciar."
      variant="default"
      action={showAction && onAddClient ? (
        <Button onClick={onAddClient} className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Cliente
        </Button>
      ) : undefined}
    />
  );
}

interface SaleEmptyStateProps {
  onNewSale?: () => void;
  showAction?: boolean;
}

export function SaleEmptyState({ onNewSale, showAction = true }: SaleEmptyStateProps) {
  return (
    <EmptyState
      icon={<ShoppingCart className="w-8 h-8" />}
      title="Nenhuma venda registrada"
      description="Registre sua primeira venda para acompanhar o histórico."
      variant="default"
      action={showAction && onNewSale ? (
        <Button onClick={onNewSale} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Venda
        </Button>
      ) : undefined}
    />
  );
}

interface ReportEmptyStateProps {
  onGenerateReport?: () => void;
  showAction?: boolean;
}

export function ReportEmptyState({ onGenerateReport, showAction = true }: ReportEmptyStateProps) {
  return (
    <EmptyState
      icon={<FileText className="w-8 h-8" />}
      title="Nenhum relatório disponível"
      description="Selecione um período para gerar relatórios."
      variant="default"
      action={showAction && onGenerateReport ? (
        <Button onClick={onGenerateReport} className="gap-2">
          Gerar Relatório
        </Button>
      ) : undefined}
    />
  );
}

interface SearchEmptyStateProps {
  searchTerm: string;
  onClearSearch?: () => void;
}

export function SearchEmptyState({ searchTerm, onClearSearch }: SearchEmptyStateProps) {
  return (
    <EmptyState
      variant="search"
      icon={<Search className="w-8 h-8" />}
      title={`Nenhum resultado para "${searchTerm}"`}
      description="Tente buscar com outros termos ou limpe os filtros."
      action={onClearSearch ? (
        <Button variant="outline" onClick={onClearSearch}>
          Limpar busca
        </Button>
      ) : undefined}
    />
  );
}

interface SuccessEmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SuccessEmptyState({ title, description, action }: SuccessEmptyStateProps) {
  return (
    <EmptyState
      variant="success"
      icon={<CheckCircle className="w-8 h-8" />}
      title={title}
      description={description}
      action={action}
    />
  );
}

interface ErrorEmptyStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorEmptyState({ title, description, onRetry }: ErrorEmptyStateProps) {
  return (
    <EmptyState
      variant="error"
      icon={<XCircle className="w-8 h-8" />}
      title={title}
      description={description}
      action={onRetry ? (
        <Button onClick={onRetry} variant="outline">
          Tentar novamente
        </Button>
      ) : undefined}
    />
  );
}

export default EmptyState;
