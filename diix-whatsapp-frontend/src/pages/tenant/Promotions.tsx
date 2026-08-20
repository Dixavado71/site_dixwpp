import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { toast } from 'sonner';

const mockPromotions = [
  { id: '1', title: 'Corte + Barba Promoção', discount: 20, type: 'percentage', validUntil: '2024-02-28', active: true },
  { id: '2', title: 'Hidratação Grátis', discount: 30, type: 'fixed', validUntil: '2024-02-15', active: true },
  { id: '3', title: 'Primeira Visita 15% OFF', discount: 15, type: 'percentage', validUntil: '2024-03-31', active: false },
];

export default function TenantPromotions() {
  const [promotions] = useState(mockPromotions);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPromotions = promotions.filter(promo => promo.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Promoções</h1>
            <p className="text-text-muted mt-1">Gerencie suas promoções</p>
          </div>
          <Button variant="primary">Nova Promoção</Button>
        </motion.div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Promoções</CardTitle>
              <div className="relative w-64">
                <Input placeholder="Buscar promoção..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Título</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Desconto</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Validade</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPromotions.map((promo) => (
                    <tr key={promo.id} className="border-b border-border hover:bg-accent-primary/5">
                      <td className="py-3 px-4 text-sm text-text-primary">{promo.title}</td>
                      <td className="py-3 px-4 text-sm"><span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary">{promo.type === 'percentage' ? `${promo.discount}%` : `R$ ${promo.discount}`}</span></td>
                      <td className="py-3 px-4 text-sm text-text-muted">{new Date(promo.validUntil).toLocaleDateString('pt-BR')}</td>
                      <td className="py-3 px-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs ${promo.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{promo.active ? 'Ativo' : 'Inativo'}</span></td>
                      <td className="py-3 px-4 text-sm text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => toast.info(`Editar ${promo.title}`)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="danger" size="sm" onClick={() => toast.success(`${promo.title} removida`)}><Trash2 className="h-4 w-4" /></Button>
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
