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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center p-4 py-12">
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
              <UserPlus className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Criar conta</CardTitle>
            <CardDescription className="text-center text-purple-100">
              Preencha o formulário abaixo para se registrar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all ${errors.fullName ? 'border-red-500 ring ring-red-200' : ''}`}
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all ${errors.email ? 'border-red-500 ring ring-red-200' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all ${errors.phone ? 'border-red-500 ring ring-red-200' : ''}`}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all ${errors.password ? 'border-red-500 ring ring-red-200' : ''}`}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all ${errors.confirmPassword ? 'border-red-500 ring ring-red-200' : ''}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white transition-all" 
                disabled={isLoading}
              >
                {isLoading ? 'Registrando...' : 'Registrar'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 items-center bg-gray-50 rounded-b-lg">
            <p className="text-sm text-gray-600">
              Já tem uma conta? <Link to="/login" className="text-purple-600 hover:text-purple-800 font-medium hover:underline">Faça login</Link>
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

export default Register;
