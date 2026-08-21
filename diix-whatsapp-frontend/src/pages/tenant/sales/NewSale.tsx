import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Search, User, Package, CreditCard, DollarSign, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { toast } from 'sonner';
import { useTenantProductStore } from '@/stores/tenantProductStore';
import { useTenantServiceStore } from '@/stores/tenantServiceStore';
import { useTenantCustomerStore } from '@/stores/tenantCustomerStore';
import type { Product, Service, Client } from '@/types';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'service';
}

export default function TenantNewSale() {
  const { products, loading: productsLoading, fetch: fetchProducts } = useTenantProductStore();
  const { services, loading: servicesLoading, fetch: fetchServices } = useTenantServiceStore();
  const { customers, loading: customersLoading, fetch: fetchCustomers } = useTenantCustomerStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Client | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'pix'>('cash');
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);

  const tenantId = 'current-tenant-id';

  useEffect(() => {
    fetchProducts(tenantId);
    fetchServices();
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  const addToCart = (item: Product | Service, type: 'product' | 'service') => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: 1, 
        type 
      }]);
    }
    toast.success(`${item.name} adicionado ao carrinho!`);
  };

  const filteredItems = activeTab === 'products' 
    ? products.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : services.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
    toast.info('Item removido do carrinho');
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Adicione itens ao carrinho!');
      return;
    }
    if (!selectedCustomer) {
      toast.error('Selecione um cliente!');
      return;
    }
    toast.success(`Venda finalizada com sucesso! Total: R$ ${cartTotal.toFixed(2).replace('.', ',')}`);
    // Aqui seria implementada a impressão do recibo
    printReceipt();
    setCart([]);
    setSelectedCustomer(null);
  };

  const printReceipt = () => {
    // Implementação básica de impressão de recibo
    const receiptContent = `
      ====================================
      RECIBO DE VENDA
      ====================================
      Cliente: ${selectedCustomer?.name || 'N/A'}
      Data: ${new Date().toLocaleDateString('pt-BR')}
      
      ITENS:
      ${cart.map(item => `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n')}
      
      TOTAL: R$ ${cartTotal.toFixed(2)}
      Pagamento: ${paymentMethod === 'cash' ? 'Dinheiro' : paymentMethod === 'card' ? 'Cartão' : 'PIX'}
      ====================================
    `;
    console.log(receiptContent);
    // Em produção, usaria window.print() ou uma biblioteca de impressão
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Nova Venda</h1>
          <p className="text-text-muted mt-1">PDV - Ponto de Venda</p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna da Esquerda - Produtos/Serviços */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs Mobile */}
          <div className="flex gap-2 md:hidden">
            <Button 
              variant={activeTab === 'products' ? 'primary' : 'ghost'} 
              className="flex-1"
              onClick={() => setActiveTab('products')}
            >
              <Package className="w-4 h-4 mr-2" />
              Produtos
            </Button>
            <Button 
              variant={activeTab === 'services' ? 'primary' : 'ghost'} 
              className="flex-1"
              onClick={() => setActiveTab('services')}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Serviços
            </Button>
          </div>

          {/* Busca */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-accent-primary" />
                {activeTab === 'products' ? 'Produtos' : 'Serviços'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input 
                placeholder={`Buscar ${activeTab === 'products' ? 'produto' : 'serviço'}...`} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </CardContent>
          </Card>

          {/* Lista de Itens */}
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredItems.map((item) => (
              <Card key={item.id} className="glass-card border-white/10 hover:border-accent-primary/30 transition-colors">
                <CardContent className="pt-4">
                  <div className="flex flex-col gap-3">
                    <div>
                      <h3 className="font-semibold text-text-primary">{item.name}</h3>
                      {'category' in item && (
                        <p className="text-xs text-text-muted">{item.category}</p>
                      )}
                      {'duration' in item && (
                        <p className="text-xs text-text-muted">{item.duration} min</p>
                      )}
                      {'stock' in item && (
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${item.stock > 10 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {item.stock} em estoque
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-accent-primary">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                      <Button size="sm" onClick={() => addToCart(item, activeTab === 'products' ? 'product' : 'service')}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Coluna da Direita - Carrinho */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-accent-primary" />
                Carrinho
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cliente */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">Cliente</label>
                <div className="relative">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between pl-10"
                    onClick={() => setShowCustomerSelect(!showCustomerSelect)}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-text-muted" />
                      <span className="truncate">{selectedCustomer ? selectedCustomer.name : 'Selecionar cliente'}</span>
                    </div>
                  </Button>
                </div>

                {/* Modal de Seleção de Cliente */}
                {showCustomerSelect && (
                  <Card className="absolute z-10 w-full mt-2 glass-card border-white/10">
                    <CardContent className="p-4 space-y-3">
                      <Input
                        placeholder="Buscar cliente..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="w-full"
                      />
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {customersLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-primary"></div>
                          </div>
                        ) : filteredCustomers.length === 0 ? (
                          <p className="text-center text-text-muted text-sm">Nenhum cliente encontrado</p>
                        ) : (
                          filteredCustomers.map((customer) => (
                            <button
                              key={customer.id}
                              className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setShowCustomerSelect(false);
                              }}
                            >
                              <p className="text-sm font-medium text-text-primary">{customer.name}</p>
                              <p className="text-xs text-text-muted">{customer.phone}</p>
                            </button>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Itens do Carrinho */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center text-text-muted py-4">Carrinho vazio</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                        <p className="text-xs text-text-muted">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => updateQuantity(item.id, -1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm text-text-primary w-6 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="sm" onClick={() => updateQuantity(item.id, 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Forma de Pagamento */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">Forma de Pagamento</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={paymentMethod === 'cash' ? 'primary' : 'ghost'} 
                    className="flex flex-col items-center py-2"
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <DollarSign className="w-4 h-4 mb-1" />
                    <span className="text-xs">Dinheiro</span>
                  </Button>
                  <Button 
                    variant={paymentMethod === 'card' ? 'primary' : 'ghost'} 
                    className="flex flex-col items-center py-2"
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="w-4 h-4 mb-1" />
                    <span className="text-xs">Cartão</span>
                  </Button>
                  <Button 
                    variant={paymentMethod === 'pix' ? 'primary' : 'ghost'} 
                    className="flex flex-col items-center py-2"
                    onClick={() => setPaymentMethod('pix')}
                  >
                    <DollarSign className="w-4 h-4 mb-1" />
                    <span className="text-xs">PIX</span>
                  </Button>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-text-primary">Total</span>
                  <span className="text-2xl font-bold text-accent-primary">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Botão Finalizar */}
              <Button variant="primary" className="w-full" size="lg" onClick={handleCheckout}>
                <CreditCard className="w-5 h-5 mr-2" />
                Finalizar Venda
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
