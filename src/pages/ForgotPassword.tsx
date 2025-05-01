import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { settings } = useSiteSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: 'Email enviado',
          description: 'Verifique seu email para redefinir sua senha.',
        });
      } else {
        const data = await response.json();
        toast({
          title: 'Erro',
          description: data.message || 'Ocorreu um erro ao processar sua solicitação.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
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
            <p className="text-lg italic">"Não se preocupe, vamos ajudar você a recuperar o acesso à sua conta."</p>
            <p className="mt-2 font-semibold">Equipe {settings?.siteTitle || 'Meme PMW'}</p>
          </div>
          
          <p className="text-sm opacity-70">&copy; {new Date().getFullYear()} {settings?.siteTitle || 'Meme PMW'}</p>
        </div>
      </div>
      
      {/* Formulário de recuperação de senha */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:text-left">
            <div className="md:hidden mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{settings?.siteTitle || 'Meme PMW'}</h1>
              <p className="text-gray-600">{settings?.siteDescription || 'Portal de notícias e entretenimento'}</p>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">Recuperar senha</h2>
            <p className="text-gray-600 mt-1">
              {isSubmitted 
                ? 'Verifique seu email para instruções de recuperação' 
                : 'Informe seu email para receber instruções de recuperação'}
            </p>
          </div>
          
          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-green-800 mb-2">Email enviado com sucesso!</h3>
              <p className="text-green-700 mb-4">
                Enviamos um link de recuperação para <strong>{email}</strong>. 
                Por favor, verifique sua caixa de entrada e siga as instruções.
              </p>
              <p className="text-sm text-green-600">
                Se não encontrar o email, verifique sua pasta de spam.
              </p>
            </div>
          ) : (
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
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white transition-all rounded-lg font-medium text-base" 
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
              </Button>
            </form>
          )}
          
          <div className="mt-8 text-center space-y-4">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium block">
              Voltar para o login
            </Link>
            
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

export default ForgotPassword;
