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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-800">
            {settings?.siteTitle || 'Meme PMW'}
          </h1>
          <p className="text-gray-600 mt-1">
            {settings?.siteDescription || 'Portal de notícias e entretenimento'}
          </p>
        </div>
        
        <Card className="w-full shadow-lg border-0">
          <CardHeader className="space-y-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <LogIn className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
            <CardDescription className="text-center text-purple-100">
              Entre com suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white transition-all" 
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 items-center bg-gray-50 rounded-b-lg">
            <p className="text-sm text-gray-600 w-full text-center">
              Não tem uma conta? <Link to="/register" className="text-purple-600 hover:text-purple-800 font-medium hover:underline">Registre-se</Link>
            </p>
            <Link to="/" className="text-xs text-gray-500 hover:text-gray-700 mt-2">
              Voltar para o site
            </Link>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-6 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {settings?.siteTitle || 'Meme PMW'} - Todos os direitos reservados
        </div>
      </div>
    </div>
  );
};

export default Login;
