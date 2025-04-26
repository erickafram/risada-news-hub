import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ThumbsUp, Laugh, Angry, Frown, Loader2, ArrowLeft, Clock, Edit } from 'lucide-react';

interface UserReaction {
  id: number;
  user_id: number;
  article_id: number;
  reaction_type: 'heart' | 'thumbsUp' | 'laugh' | 'angry' | 'sad';
  created_at: string;
  updated_at: string;
  article: {
    id: number;
    title: string;
    slug: string;
    featured_image: string;
    published_at: string;
  };
}

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: 'reader' | 'admin';
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userReactions, setUserReactions] = useState<UserReaction[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('perfil');
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login?redirect=/dashboard');
      return;
    }
    
    setAuthToken(token);
    fetchUserProfile(token);
    fetchUserReactions(token);
  }, [navigate]);

  const fetchUserProfile = async (token: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else if (response.status === 401) {
        // Token inválido, redirecionar para login
        localStorage.removeItem('token');
        navigate('/login?redirect=/dashboard');
      }
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
    }
  };

  const fetchUserReactions = async (token: string) => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/reactions/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserReactions(data);
      }
    } catch (error) {
      console.error('Erro ao buscar reações do usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para renderizar o ícone de reação
  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'heart':
        return <Heart className="h-5 w-5 text-pink-600 fill-current" />;
      case 'thumbsUp':
        return <ThumbsUp className="h-5 w-5 text-blue-600 fill-current" />;
      case 'laugh':
        return <Laugh className="h-5 w-5 text-yellow-600 fill-current" />;
      case 'angry':
        return <Angry className="h-5 w-5 text-red-600 fill-current" />;
      case 'sad':
        return <Frown className="h-5 w-5 text-indigo-600 fill-current" />;
      default:
        return null;
    }
  };

  // Função para exibir o nome da reação em português
  const getReactionName = (type: string) => {
    switch (type) {
      case 'heart':
        return 'Curtiu';
      case 'thumbsUp':
        return 'Gostou';
      case 'laugh':
        return 'Achou engraçado';
      case 'angry':
        return 'Ficou irritado';
      case 'sad':
        return 'Ficou triste';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-medium">Carregando dados do usuário...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto mb-6">
          <Link to="/" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Dashboard do Usuário
          </h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="reacoes">Minhas Reações</TabsTrigger>
            </TabsList>
            
            {/* Tab de Perfil */}
            <TabsContent value="perfil" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Perfil do Usuário</CardTitle>
                  <CardDescription>Informações do seu perfil no memepmw</CardDescription>
                </CardHeader>
                <CardContent>
                  {userProfile && (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-3xl font-bold">
                          {userProfile.fullName.charAt(0)}
                        </div>
                        <div className="ml-6">
                          <h3 className="text-xl font-semibold">{userProfile.fullName}</h3>
                          <p className="text-gray-500">{userProfile.email}</p>
                          <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                            {userProfile.role === 'admin' ? 'Administrador' : 'Leitor'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <h4 className="text-lg font-medium mb-2">Estatísticas</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex items-center">
                                <Heart className="h-8 w-8 text-pink-600 mr-4" />
                                <div>
                                  <p className="text-2xl font-bold">
                                    {userReactions.filter(r => r.reaction_type === 'heart').length}
                                  </p>
                                  <p className="text-sm text-gray-500">Reações de curtida</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex items-center">
                                <Clock className="h-8 w-8 text-blue-600 mr-4" />
                                <div>
                                  <p className="text-2xl font-bold">{userReactions.length}</p>
                                  <p className="text-sm text-gray-500">Total de reações</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div className="flex">
                                  <Edit className="h-8 w-8 text-purple-600 mr-4" />
                                  <div>
                                    <p className="text-2xl font-bold">Editar</p>
                                    <p className="text-sm text-gray-500">Perfil</p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  Editar
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}>
                    Sair
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Tab de Reações */}
            <TabsContent value="reacoes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Minhas Reações</CardTitle>
                  <CardDescription>Artigos que você reagiu</CardDescription>
                </CardHeader>
                <CardContent>
                  {userReactions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-md">
                      <p className="text-gray-600">Você ainda não reagiu a nenhum artigo.</p>
                      <Link to="/" className="mt-4 inline-block text-primary hover:underline">
                        Explorar artigos
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userReactions.map((reaction) => (
                        <Link to={`/article/${reaction.article_id}`} key={reaction.id}>
                          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                {reaction.article.featured_image && (
                                  <div className="w-20 h-20 overflow-hidden rounded-md">
                                    <img 
                                      src={reaction.article.featured_image} 
                                      alt={reaction.article.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg line-clamp-2">
                                    {reaction.article.title}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge className="flex items-center gap-1" variant="outline">
                                      {getReactionIcon(reaction.reaction_type)}
                                      <span>{getReactionName(reaction.reaction_type)}</span>
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                      {formatDate(reaction.created_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
