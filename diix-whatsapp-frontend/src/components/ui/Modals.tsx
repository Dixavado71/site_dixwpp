import { useState, type ChangeEvent } from 'react';
import Modal from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, variant = 'danger' }: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-text-secondary">{message}</p>
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : variant === 'warning' ? 'primary' : 'primary'} 
            onClick={handleConfirm}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: { id: string; name: string; email: string; role: string; status: string };
  onSave: (data: any) => void;
}

export function UserModal({ isOpen, onClose, user, onSave }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'tenant',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(user ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Editar Usuário' : 'Novo Usuário'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Nome</label>
          <Input
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Digite o nome"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Digite o email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Cargo</label>
          <select
            value={formData.role}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary"
          >
            <option value="admin">Administrador</option>
            <option value="tenant">Tenant</option>
          </select>
        </div>
        {!user && (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Senha</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Digite a senha"
              required
            />
          </div>
        )}
        <div className="flex gap-3 justify-end mt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{user ? 'Atualizar' : 'Criar'}</Button>
        </div>
      </form>
    </Modal>
  );
}

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant?: { id: string; name: string; businessName: string; email: string; phone: string; document: string; plan: string };
  onSave: (data: any) => void;
}

export function TenantModal({ isOpen, onClose, tenant, onSave }: TenantModalProps) {
  const [formData, setFormData] = useState({
    name: tenant?.name || '',
    businessName: tenant?.businessName || '',
    email: tenant?.email || '',
    phone: tenant?.phone || '',
    document: tenant?.document || '',
    plan: tenant?.plan || 'basic',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(tenant ? 'Tenant atualizado com sucesso!' : 'Tenant criado com sucesso!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tenant ? 'Editar Tenant' : 'Novo Tenant'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Nome Fantasia</label>
            <Input
              value={formData.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome fantasia"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Razão Social</label>
            <Input
              value={formData.businessName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Razão social"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@empresa.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Telefone</label>
            <Input
              value={formData.phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">CNPJ</label>
            <Input
              value={formData.document}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, document: e.target.value })}
              placeholder="00.000.000/0000-00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Plano</label>
            <select
              value={formData.plan}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, plan: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary"
            >
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{tenant ? 'Atualizar' : 'Criar'}</Button>
        </div>
      </form>
    </Modal>
  );
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: { id: string; name: string; description: string; price: number; stock: number; active: boolean };
  onSave: (data: any) => void;
}

export function ProductModal({ isOpen, onClose, product, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    active: product?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(product ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Editar Produto' : 'Novo Produto'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Nome</label>
          <Input
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nome do produto"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descrição do produto"
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Preço (R$)</label>
            <Input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Estoque</label>
            <Input
              type="number"
              value={formData.stock}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              placeholder="0"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, active: e.target.checked })}
            className="rounded bg-white/5 border-white/10 text-accent-primary focus:ring-accent-primary"
          />
          <label htmlFor="active" className="text-sm text-text-secondary">Produto ativo</label>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{product ? 'Atualizar' : 'Criar'}</Button>
        </div>
      </form>
    </Modal>
  );
}

interface SaleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale?: { id: string; clientName: string; items: any[]; total: number; status: string; paymentMethod: string; createdAt: string };
}

export function SaleDetailModal({ isOpen, onClose, sale }: SaleDetailModalProps) {
  if (!sale) return null;

  const statusColors: Record<string, string> = {
    completed: 'bg-green-500/20 text-green-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  const statusLabels: Record<string, string> = {
    completed: 'Concluído',
    pending: 'Pendente',
    cancelled: 'Cancelado',
  };

  const paymentLabels: Record<string, string> = {
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    cash: 'Dinheiro',
    pix: 'PIX',
    bank_transfer: 'Transferência',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Venda #${sale.id}`} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-text-muted">Cliente</p>
            <p className="text-text-primary font-medium">{sale.clientName}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Data</p>
            <p className="text-text-primary font-medium">{new Date(sale.createdAt).toLocaleString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Status</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[sale.status]}`}>
              {statusLabels[sale.status]}
            </span>
          </div>
          <div>
            <p className="text-sm text-text-muted">Pagamento</p>
            <p className="text-text-primary font-medium">{paymentLabels[sale.paymentMethod]}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">Itens</h3>
          <div className="space-y-2">
            {sale.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-text-primary font-medium">{item.serviceName || item.productName}</p>
                  <p className="text-sm text-text-muted">Qtd: {item.quantity} x R$ {item.price.toFixed(2)}</p>
                </div>
                <p className="text-text-primary font-medium">R$ {item.subtotal.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-text-primary">Total</p>
            <p className="text-2xl font-bold text-accent-primary">R$ {sale.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </Modal>
  );
}
