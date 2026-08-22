import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Trash2, Search, User, CreditCard, DollarSign, CheckCircle, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import StatusBadge from '../../../components/ui/StatusBadge';
import ActionButton from '../../../components/ui/ActionButton';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const NewSale = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'pix'>('cash');

  // Mock data - em produção viria da API
  const products: Product[] = [
    { id: 1, name: 'Produto A', price: 29.90, stock: 100, category: 'Geral' },
    { id: 2, name: 'Produto B', price: 49.90, stock: 50, category: 'Eletrônicos' },
    { id: 3, name: 'Produto C', price: 19.90, stock: 200, category: 'Geral' },
    { id: 4, name: 'Serviço X', price: 99.90, stock: 999, category: 'Serviços' },
    { id: 5, name: 'Produto D', price: 79.90, stock: 30, category: 'Acessórios' },
  ];

  const customers = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Oliveira' },
    { id: '4', name: 'Ana Costa' },
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 0;
  const total = subtotal - discount;

  const handleFinalize = () => {
    if (cart.length === 0) {
      toast.error('Adicione produtos ao carrinho!', {
        description: 'Selecione pelo menos um produto para continuar.',
        duration: 4000,
      });
      return;
    }
    // Em produção: enviar para API
    toast.success('Venda finalizada com sucesso!', {
      description: `Total: R$ ${total.toFixed(2)}`,
      duration: 5000,
    });
    navigate('/tenant/sales');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/tenant/sales')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Venda</h1>
          <p className="text-gray-600">PDV - Ponto de Venda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Produtos e Cliente */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seleção de Cliente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Cliente
            </h2>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px]"
            >
              <option value="">Cliente não identificado (Venda balcão)</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </motion.div>

          {/* Busca de Produtos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Produtos
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px]"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Lista de Produtos */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {filteredProducts.map(product => (
                <motion.button
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    product.stock === 0
                      ? 'bg-gray-100 cursor-not-allowed opacity-50'
                      : 'bg-white hover:border-blue-500 hover:shadow-md'
                  }`}
                >
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-blue-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <span className={`text-xs ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                      Estoque: {product.stock}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Coluna Direita - Carrinho e Pagamento */}
        <div className="space-y-6">
          {/* Carrinho */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Carrinho
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Carrinho vazio</p>
                <p className="text-sm">Adicione produtos para começar</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        R$ {item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-red-100 text-red-600 rounded ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Resumo */}
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Desconto</span>
                <span>- R$ {discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span className="text-blue-600">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Pagamento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Forma de Pagamento
            </h2>
            <div className="space-y-3">
              {[
                { id: 'cash', label: 'Dinheiro', icon: DollarSign },
                { id: 'card', label: 'Cartão', icon: CreditCard },
                { id: 'pix', label: 'PIX', icon: CheckCircle },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`w-full p-4 border rounded-lg flex items-center gap-3 transition-all ${
                    paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <method.icon className="w-5 h-5" />
                  <span className="font-medium">{method.label}</span>
                  {paymentMethod === method.id && (
                    <CheckCircle className="w-5 h-5 ml-auto text-blue-600" />
                  )}
                </button>
              ))}
            </div>

            <ActionButton
              onClick={handleFinalize}
              disabled={cart.length === 0}
              className="w-full mt-6 py-4 text-lg"
              variant="primary"
            >
              Finalizar Venda
            </ActionButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewSale;
