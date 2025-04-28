import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ThumbsUp, Laugh, Angry, Frown, Loader2, ArrowLeft, Clock, Edit, MessageSquare, User, Save, Home, LogOut, Bookmark } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

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

interface UserComment {
  id: number;
  content: string;
  created_at: string;
  article: {
    id: number;
    title: string;
    slug: string;
    featuredImage: string;
    publishedAt: string;
  };
}

interface UserFavorite {
  id: number;
  title: string;
  slug: string;
  featured_image: string;
  published_at: string;
}

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: 'reader' | 'admin';
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userReactions, setUserReactions] = useState<UserReaction[]>([]);
  const [userComments, setUserComments] = useState<UserComment[]>([]);
  const [userFavorites, setUserFavorites] = useState<UserFavorite[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('perfil');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Estados para o formulário de edição de perfil
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
    fetchUserComments(token);
    fetchUserFavorites(token);
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
        setEditName(data.fullName || '');
        setEditPhone(data.phone || '');
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

  const fetchUserComments = async (token: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/comments/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserComments(data);
      }
    } catch (error) {
      console.error('Erro ao buscar comentários do usuário:', error);
    }
  };

  const fetchUserFavorites = async (token: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserFavorites(data);
      }
    } catch (error) {
      console.error('Erro ao buscar favoritos do usuário:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (!userProfile) return;
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/users/${userProfile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          fullName: editName,
          phone: editPhone
        })
      });
      
      if (response.ok) {
        toast({
          title: 'Perfil atualizado',
          description: 'Suas informações foram atualizadas com sucesso.',
        });
        
        // Atualizar o perfil local
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            fullName: editName,
            phone: editPhone
          });
        }
        
        setIsEditing(false);
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível atualizar o perfil.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao tentar atualizar o perfil.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Função para renderizar o ícone da reação
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

  // Renderizar o conteúdo com base na seção ativa
  const renderContent = () => {
    switch (activeSection) {
      case 'perfil':
        return (
          <div className="space-y-6">
            {!isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-pink-100">
                          <Heart className="h-6 w-6 text-pink-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-2xl font-bold">
                            {userReactions.filter(r => r.reaction_type === 'heart').length}
                          </p>
                          <p className="text-sm text-gray-500">Curtidas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100">
                          <MessageSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-2xl font-bold">{userComments.length}</p>
                          <p className="text-sm text-gray-500">Comentários</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100">
                          <Clock className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-2xl font-bold">{userReactions.length}</p>
                          <p className="text-sm text-gray-500">Total de reações</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="border border-gray-100 shadow-sm">
                  <CardHeader className="border-b bg-gray-50">
                    <div className="flex justify-between items-center">
                      <CardTitle>Dados Pessoais</CardTitle>
                      <Button 
                        onClick={() => setIsEditing(true)} 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Nome</p>
                        <p className="font-medium">{userProfile?.fullName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{userProfile?.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium">{userProfile?.phone || 'Não informado'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Tipo de conta</p>
                        <p className="font-medium">
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                            {userProfile?.role === 'admin' ? 'Administrador' : 'Assinante'}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle>Editar Perfil</CardTitle>
                  <CardDescription>Atualize suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-700">Nome completo</Label>
                        <Input 
                          id="name"
                          type="text" 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)} 
                          className="mt-1"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-gray-700">Telefone</Label>
                        <Input 
                          id="phone"
                          type="text" 
                          value={editPhone} 
                          onChange={(e) => setEditPhone(e.target.value)} 
                          className="mt-1"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <Button 
                        type="submit" 
                        disabled={isSaving}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar alterações
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        className="border-gray-200"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        );
      case 'reacoes':
        return (
          <div className="space-y-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle>Minhas Reações</CardTitle>
                <CardDescription>Artigos que você reagiu recentemente</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {userReactions.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Heart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhuma reação ainda</h3>
                    <p className="text-gray-500 mb-4">Você ainda não reagiu a nenhum artigo.</p>
                    <Link to="/">
                      <Button variant="outline" className="bg-white">
                        Explorar artigos
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {userReactions.map((reaction) => (
                      <Link to={`/article/${reaction.article.id}`} key={reaction.id}>
                        <Card className="hover:shadow-md transition-all border border-gray-100 overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            {reaction.article.featured_image && (
                              <div className="w-full md:w-1/4 h-40 md:h-auto">
                                <img 
                                  src={reaction.article.featured_image} 
                                  alt={reaction.article.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="p-4 flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                                {reaction.article.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 mt-2">
                                <Badge className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 border-0">
                                  {getReactionIcon(reaction.reaction_type)}
                                  <span>{getReactionName(reaction.reaction_type)}</span>
                                </Badge>
                                <span className="text-sm text-gray-500 flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {formatDate(reaction.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 'comentarios':
        return (
          <div className="space-y-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle>Meus Comentários</CardTitle>
                <CardDescription>Comentários que você fez em artigos</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {userComments.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum comentário ainda</h3>
                    <p className="text-gray-500 mb-4">Você ainda não fez nenhum comentário em artigos.</p>
                    <Link to="/">
                      <Button variant="outline" className="bg-white">
                        Explorar artigos
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {userComments.map((comment) => (
                      <Link to={`/article/${comment.article.id}`} key={comment.id}>
                        <Card className="hover:shadow-md transition-all border border-gray-100 overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            {comment.article.featuredImage && (
                              <div className="w-full md:w-1/4 h-40 md:h-auto">
                                <img 
                                  src={comment.article.featuredImage} 
                                  alt={comment.article.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="p-4 flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                                {comment.article.title}
                              </h3>
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                                <p className="text-gray-700 line-clamp-3">
                                  "{comment.content}"
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                <Badge className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 border-0">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>Comentário</span>
                                </Badge>
                                <span className="text-sm text-gray-500 flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {formatDate(comment.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 'favoritos':
        return (
          <div className="space-y-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle>Meus Favoritos</CardTitle>
                <CardDescription>Artigos que você favoritou</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {userFavorites.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Bookmark className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum favorito ainda</h3>
                    <p className="text-gray-500 mb-4">Você ainda não favoritou nenhum artigo.</p>
                    <Link to="/">
                      <Button variant="outline" className="bg-white">
                        Explorar artigos
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {userFavorites.map((favorite) => (
                      <Link to={`/article/${favorite.id}`} key={favorite.id}>
                        <Card className="hover:shadow-md transition-all border border-gray-100 overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            {favorite.featured_image && (
                              <div className="w-full md:w-1/4 h-40 md:h-auto">
                                <img 
                                  src={favorite.featured_image} 
                                  alt={favorite.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="p-4 flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                                {favorite.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3">
                                <Badge className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 border-0">
                                  <Bookmark className="h-4 w-4" />
                                  <span>Favorito</span>
                                </Badge>
                                <span className="text-sm text-gray-500 flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {formatDate(favorite.published_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Menu lateral */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-purple-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-purple-600 text-xl font-bold">
                      {userProfile?.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{userProfile?.fullName}</h3>
                      <p className="text-purple-100 text-sm truncate">{userProfile?.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveSection('perfil')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeSection === 'perfil' 
                          ? 'bg-purple-50 text-purple-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <User className="h-5 w-5" />
                      <span>Meu Perfil</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveSection('reacoes')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeSection === 'reacoes' 
                          ? 'bg-purple-50 text-purple-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Heart className="h-5 w-5" />
                      <span>Minhas Reações</span>
                      {userReactions.length > 0 && (
                        <Badge className="ml-auto bg-purple-100 text-purple-700 hover:bg-purple-200">
                          {userReactions.length}
                        </Badge>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setActiveSection('comentarios')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeSection === 'comentarios' 
                          ? 'bg-purple-50 text-purple-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>Meus Comentários</span>
                      {userComments.length > 0 && (
                        <Badge className="ml-auto bg-purple-100 text-purple-700 hover:bg-purple-200">
                          {userComments.length}
                        </Badge>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setActiveSection('favoritos')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeSection === 'favoritos' 
                          ? 'bg-purple-50 text-purple-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Bookmark className="h-5 w-5" />
                      <span>Meus Favoritos</span>
                      {userFavorites.length > 0 && (
                        <Badge className="ml-auto bg-purple-100 text-purple-700 hover:bg-purple-200">
                          {userFavorites.length}
                        </Badge>
                      )}
                    </button>
                    
                    <Link to="/" className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                      <Home className="h-5 w-5" />
                      <span>Página Inicial</span>
                    </Link>
                    
                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          localStorage.removeItem('token');
                          localStorage.removeItem('user');
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sair da conta</span>
                      </button>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
            
            {/* Conteúdo principal */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                  {activeSection === 'perfil' && 'Meu Perfil'}
                  {activeSection === 'reacoes' && 'Minhas Reações'}
                  {activeSection === 'comentarios' && 'Meus Comentários'}
                  {activeSection === 'favoritos' && 'Meus Favoritos'}
                </h1>
                
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
