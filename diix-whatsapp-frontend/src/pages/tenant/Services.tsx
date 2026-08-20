import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { toast } from 'sonner';

const mockData = [
  { id: '1', name: 'Item 1', email: 'item1@email.com', status: 'active' },
  { id: '2', name: 'Item 2', email: 'item2@email.com', status: 'active' },
  { id: '3', name: 'Item 3', email: 'item3@email.com', status: 'pending' },
];

export default function Page() {
  const [data] = useState(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredData = data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Página</h1>
            <p className="text-text-muted mt-1">Gerencie seus itens</p>
          </div>
          <Button variant="primary">Novo Item</Button>
        </motion.div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Itens</CardTitle>
              <div className="relative w-64">
                <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Nome</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-accent-primary/5">
                      <td className="py-3 px-4 text-sm text-text-primary">{item.name}</td>
                      <td className="py-3 px-4 text-sm text-text-muted">{item.email}</td>
                      <td className="py-3 px-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs ${item.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{item.status}</span></td>
                      <td className="py-3 px-4 text-sm text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => toast.info(`Editar ${item.name}`)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="danger" size="sm" onClick={() => toast.success(`${item.name} removido`)}><Trash2 className="h-4 w-4" /></Button>
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
