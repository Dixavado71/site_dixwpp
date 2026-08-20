import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { toast } from 'sonner';

const mockProducts = [
  { id: '1', name: 'Shampoo Premium', price: 45.90, stock: 25, category: 'Cabelo' },
  { id: '2', name: 'Condicionador Hidratante', price: 38.50, stock: 18, category: 'Cabelo' },
  { id: '3', name: 'Máscara Capilar', price: 62.00, stock: 12, category: 'Tratamento' },
  { id: '4', name: 'Óleo Finalizador', price: 55.90, stock: 8, category: 'Finalização' },
  { id: '5', name: 'Spray Fixador', price: 29.90, stock: 30, category: 'Finalização' },
];

export default function TenantProducts() {
  const [products] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Produtos</h1>
            <p className="text-text-muted mt-1">Gerencie seu estoque de produtos</p>
          </div>
          <Button variant="primary">Novo Produto</Button>
        </motion.div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Produtos</CardTitle>
              <div className="relative w-64">
                <Input placeholder="Buscar produto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Nome</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Categoria</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Preço</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Estoque</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-accent-primary/5">
                      <td className="py-3 px-4 text-sm text-text-primary">{product.name}</td>
                      <td className="py-3 px-4 text-sm"><span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary">{product.category}</span></td>
                      <td className="py-3 px-4 text-sm text-text-primary">R$ {product.price.toFixed(2).replace('.', ',')}</td>
                      <td className="py-3 px-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs ${product.stock > 10 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{product.stock} un</span></td>
                      <td className="py-3 px-4 text-sm text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => toast.info(`Editar ${product.name}`)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="danger" size="sm" onClick={() => toast.success(`${product.name} removido`)}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    
  );
}
