import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Lock, Building2, Palette, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export default function TenantSettings() {
  const [businessName, setBusinessName] = useState('Barbearia Style');
  const [email, setEmail] = useState('contato@style.com.br');
  const [phone, setPhone] = useState('(11) 98765-4321');
  const [address, setAddress] = useState('Rua das Flores, 123 - Centro');
  const [description, setDescription] = useState('Barbearia tradicional com os melhores profissionais da região.');

  const handleSave = () => {
    // Implementação real de salvamento será feita via store
    console.log('Salvando configurações...', { businessName, email, phone, address, description });
  };

  return (
    
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-text-primary">Configurações</h1>
          <p className="text-text-muted mt-1">Gerencie as configurações do seu negócio</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Informações do Negócio */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-accent-primary" />
                <CardTitle>Informações do Negócio</CardTitle>
              </div>
              <p className="text-sm text-text-muted">Dados principais da sua empresa</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Nome do Negócio</label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Nome do negócio" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">Telefone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefone" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">Endereço</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Endereço" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">Descrição</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição do negócio" rows={3} />
              </div>
              <Button variant="primary" className="w-full" onClick={handleSave}>Salvar Informações</Button>
            </CardContent>
          </Card>

          {/* Preferências */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-accent-primary" />
                <CardTitle>Preferências</CardTitle>
              </div>
              <p className="text-sm text-text-muted">Personalize sua experiência</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm font-medium text-text-primary">Notificações por Email</p>
                  <p className="text-xs text-text-muted">Receba atualizações por email</p>
                </div>
                <Button variant="ghost" size="sm">Ativado</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm font-medium text-text-primary">Notificações Push</p>
                  <p className="text-xs text-text-muted">Receba notificações no navegador</p>
                </div>
                <Button variant="ghost" size="sm">Ativado</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm font-medium text-text-primary">Modo Escuro</p>
                  <p className="text-xs text-text-muted">Tema escuro para melhor visualização</p>
                </div>
                <Button variant="ghost" size="sm">Ativado</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm font-medium text-text-primary">Idioma</p>
                  <p className="text-xs text-text-muted">Selecione o idioma do sistema</p>
                </div>
                <Button variant="ghost" size="sm">Português</Button>
              </div>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-accent-primary" />
                <CardTitle>Segurança</CardTitle>
              </div>
              <p className="text-sm text-text-muted">Gerencie sua senha e acesso</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Senha Atual</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">Nova Senha</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">Confirmar Nova Senha</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button variant="primary" className="w-full">Alterar Senha</Button>
            </CardContent>
          </Card>

          {/* Integrações */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-accent-primary" />
                <CardTitle>Integrações</CardTitle>
              </div>
              <p className="text-sm text-text-muted">Conecte com outros serviços</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm font-medium text-text-primary">WhatsApp Business</p>
                  <p className="text-xs text-text-muted">Integração com WhatsApp</p>
                </div>
                <Button variant="ghost" size="sm">Conectado</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm font-medium text-text-primary">Google Calendar</p>
                  <p className="text-xs text-text-muted">Sincronize agendamentos</p>
                </div>
                <Button variant="ghost" size="sm">Conectado</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm font-medium text-text-primary">Instagram</p>
                  <p className="text-xs text-text-muted">Integração com Instagram</p>
                </div>
                <Button variant="ghost" size="sm">Conectado</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    
  );
}
