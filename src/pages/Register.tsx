import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, loading: settingsLoading } = useSiteSettings();
  const { isAuthenticated, isAdmin } = useAuth();

  // Verificar se o usuário já está autenticado e redirecionar se estiver
  useEffect(() => {
    if (isAuthenticated) {
      // Redirecionar com base no papel do usuário
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          confirmPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: 'Erro no cadastro',
          description: data.message || 'Ocorreu um erro ao registrar sua conta.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Sua conta foi criada. Você já pode fazer login.',
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao conectar com o servidor.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Coluna lateral com imagem/branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-800 text-white p-8 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">{settings?.siteTitle || 'Meme PMW'}</h1>
          <p className="text-xl opacity-90">{settings?.siteDescription || 'Portal de notícias e entretenimento'}</p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <p className="text-lg italic">"Junte-se à nossa comunidade e tenha acesso a conteúdos exclusivos."</p>
            <p className="mt-2 font-semibold">Equipe {settings?.siteTitle || 'Meme PMW'}</p>
          </div>
          
          <p className="text-sm opacity-70">&copy; {new Date().getFullYear()} {settings?.siteTitle || 'Meme PMW'}</p>
        </div>
      </div>
      
      {/* Formulário de registro */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md py-8">
          <div className="mb-8 text-center md:text-left">
            <div className="md:hidden mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{settings?.siteTitle || 'Meme PMW'}</h1>
              <p className="text-gray-600">{settings?.siteDescription || 'Portal de notícias e entretenimento'}</p>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">Crie sua conta</h2>
            <p className="text-gray-600 mt-1">Preencha os dados abaixo para se registrar</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700 font-medium">Nome completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`h-12 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all ${errors.fullName ? 'border-red-500 ring ring-red-200' : ''}`}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-12 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all ${errors.email ? 'border-red-500 ring ring-red-200' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`h-12 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all ${errors.phone ? 'border-red-500 ring ring-red-200' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`h-12 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all ${errors.password ? 'border-red-500 ring ring-red-200' : ''}`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`h-12 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all ${errors.confirmPassword ? 'border-red-500 ring ring-red-200' : ''}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white transition-all rounded-lg font-medium text-base mt-4" 
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Criar conta'}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-gray-600">
                Já tem uma conta? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">Faça login</Link>
              </p>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar para o site
            </Link>
          </div>
          
          <div className="md:hidden text-center mt-8 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {settings?.siteTitle || 'Meme PMW'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
