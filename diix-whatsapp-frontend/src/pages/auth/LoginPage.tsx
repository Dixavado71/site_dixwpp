import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Lock, Loader2, Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'tenant';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  useEffect(() => {
    const savedIdentifier = localStorage.getItem('mock_remembered_identifier');
    const savedPassword = localStorage.getItem('mock_remembered_password');
    if (savedIdentifier || savedPassword) {
      if (savedIdentifier) setValue('identifier', savedIdentifier);
      if (savedPassword) setValue('password', savedPassword);
      setValue('rememberMe', true);
    }
  }, []);
  
  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const isEmail = data.identifier.includes('@');
      const mockUser: User = {
        id: 'mock-user-' + Date.now(),
        email: isEmail ? data.identifier : `${data.identifier}@demo.local`,
        name: data.identifier,
        role: data.identifier.toLowerCase().includes('admin') ? 'admin' : 'tenant',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      if (data.rememberMe) {
        localStorage.setItem('mock_remembered_identifier', data.identifier);
        localStorage.setItem('mock_remembered_password', data.password);
      } else {
        localStorage.removeItem('mock_remembered_identifier');
        localStorage.removeItem('mock_remembered_password');
      }
      toast.success(`Bem-vindo, ${mockUser.name}! (Modo Demonstração)`);
      navigate(mockUser.role === 'admin' ? '/admin' : '/tenant');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Erro no login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-animated-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-accent-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-accent-secondary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        <Card className="glass-card border-white/10">
          <CardHeader className="text-center pb-2">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-cyan flex items-center justify-center mb-4 shadow-neon-green">
                <span className="text-2xl font-bold text-black">D</span>
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold"><span className="text-gradient">DiixWhatsApp</span></CardTitle>
            <p className="text-text-muted mt-2">Modo Demonstração - Use qualquer login</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Usuário ou E-mail" type="text" placeholder="admin (para Admin) ou usuario (para Tenant)" icon={Mail} error={errors.identifier?.message} {...register('identifier')} />
              <div className="relative">
                <Input label="Senha" type={showPassword ? 'text' : 'password'} placeholder="••••••••" icon={Lock} error={errors.password?.message} {...register('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[34px] text-text-muted hover:text-text-primary transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-accent-primary focus:ring-accent-primary" {...register('rememberMe')} />
                  <span className="text-sm text-text-muted">Lembrar de mim</span>
                </label>
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full mt-6" isLoading={isLoading}>{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Entrando...</> : 'Entrar'}</Button>
            </form>
            <div className="mt-4 p-3 bg-accent-primary/10 rounded-lg border border-accent-primary/20">
              <p className="text-xs text-center text-accent-primary font-medium">💡 Dica: Use "admin" para acessar o painel Admin<br/>Use qualquer outro nome para acessar o painel Tenant</p>
            </div>
            <p className="text-center text-text-muted text-sm mt-6">© 2024 DiixWhatsApp - Modo Demonstração</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
