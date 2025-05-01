import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, LogIn } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, loading: settingsLoading } = useSiteSettings();

  // Verificar se o usuário já está autenticado e redirecionar se estiver
  useEffect(() => {
    if (isAuthenticated) {
      // Redirecionar com base no papel do usuário
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: 'Login bem-sucedido',
          description: 'Você foi autenticado com sucesso.',
        });
        
        // Redirecionar com base no papel do usuário
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast({
          title: 'Erro de autenticação',
          description: 'Email ou senha incorretos.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro durante o login.',
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
            <p className="text-lg italic">"Mantenha-se informado com as últimas notícias e conteúdos exclusivos."</p>
            <p className="mt-2 font-semibold">Equipe {settings?.siteTitle || 'Meme PMW'}</p>
          </div>
          
          <p className="text-sm opacity-70">&copy; {new Date().getFullYear()} {settings?.siteTitle || 'Meme PMW'}</p>
        </div>
      </div>
      
      {/* Formulário de login */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:text-left">
            <div className="md:hidden mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{settings?.siteTitle || 'Meme PMW'}</h1>
              <p className="text-gray-600">{settings?.siteDescription || 'Portal de notícias e entretenimento'}</p>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h2>
            <p className="text-gray-600 mt-1">Acesse sua conta para continuar</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white transition-all rounded-lg font-medium text-base" 
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            
            <div className="text-center">
              <p className="text-gray-600">
                Não tem uma conta? <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">Registre-se</Link>
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

export default Login;
