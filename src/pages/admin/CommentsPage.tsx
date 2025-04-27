import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, Search, CheckCircle, XCircle, AlertCircle, 
  Trash2, Eye, MoreHorizontal, Filter, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Comment {
  id: number;
  content: string;
  status: 'approved' | 'pending' | 'spam';
  createdAt: string;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
  article: {
    id: number;
    title: string;
    slug: string;
  };
}

const CommentsPage = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Buscar comentários do backend
    fetchComments();
  }, [activeTab, searchTerm, currentPage, token]);
  
  // Função para buscar comentários do backend
  const fetchComments = async () => {
    if (!token) return;
    
    setLoading(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      // Construir parâmetros de consulta
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: activeTab,
        search: searchTerm
      });
      
      const response = await fetch(`${apiUrl}/api/comments/admin?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar comentários');
      }
      
      const data = await response.json();
      console.log('Resposta da API:', data);
      
      setComments(data.comments || []);
      setTotalPages(data.totalPages || 1);
      
    } catch (error: any) {
      console.error('Erro ao buscar comentários:', error);
      toast({
        title: "Erro",
        description: `Não foi possível carregar os comentários: ${error.message}`,
        variant: "destructive"
      });
      
      // Se houver erro, usar um array vazio
      setComments([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca já está sendo tratada no useEffect
  };
  
  const handleApproveComment = async (commentId: number) => {
    if (!token) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${apiUrl}/api/comments/${commentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'approved' })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao aprovar comentário');
      }
      
      // Atualizar o status do comentário na interface
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, status: 'approved' as const };
        }
        return comment;
      });
      
      setComments(updatedComments);
      
      toast({
        title: "Comentário aprovado",
        description: "O comentário foi aprovado com sucesso.",
      });
      
    } catch (error: any) {
      console.error('Erro ao aprovar comentário:', error);
      toast({
        title: "Erro",
        description: `Não foi possível aprovar o comentário: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  const handleMarkAsPending = async (commentId: number) => {
    if (!token) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${apiUrl}/api/comments/${commentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'pending' })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao marcar comentário como pendente');
      }
      
      // Atualizar o status do comentário na interface
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, status: 'pending' as const };
        }
        return comment;
      });
      
      setComments(updatedComments);
      
      toast({
        title: "Comentário marcado como pendente",
        description: "O comentário foi marcado como pendente com sucesso.",
      });
      
    } catch (error: any) {
      console.error('Erro ao marcar comentário como pendente:', error);
      toast({
        title: "Erro",
        description: `Não foi possível marcar o comentário como pendente: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  const handleMarkAsSpam = async (commentId: number) => {
    if (!token) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${apiUrl}/api/comments/${commentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'spam' })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao marcar comentário como spam');
      }
      
      // Atualizar o status do comentário na interface
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, status: 'spam' as const };
        }
        return comment;
      });
      
      setComments(updatedComments);
      
      toast({
        title: "Comentário marcado como spam",
        description: "O comentário foi marcado como spam com sucesso.",
      });
      
    } catch (error: any) {
      console.error('Erro ao marcar comentário como spam:', error);
      toast({
        title: "Erro",
        description: `Não foi possível marcar o comentário como spam: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteComment = async (commentId: number) => {
    if (!token) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir comentário');
      }
      
      // Remover o comentário da lista
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);
      
      toast({
        title: "Comentário excluído",
        description: "O comentário foi excluído com sucesso.",
      });
      
    } catch (error: any) {
      console.error('Erro ao excluir comentário:', error);
      toast({
        title: "Erro",
        description: `Não foi possível excluir o comentário: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Aprovado</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pendente</Badge>;
      case 'spam':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Spam</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Gerenciar Comentários</h1>
          
          <div className="mt-4 sm:mt-0">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar comentários..."
                className="pl-9 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white border">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Todos
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Aprovados
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Pendentes
            </TabsTrigger>
            <TabsTrigger value="spam" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Spam
            </TabsTrigger>
          </TabsList>
          
          <Card className="border border-gray-100">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                <h3 className="text-lg font-medium text-gray-900">Nenhum comentário encontrado</h3>
                <p className="text-gray-500 mt-1">
                  {searchTerm ? 'Tente ajustar sua busca.' : 'Não há comentários nesta categoria.'}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Autor</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Comentário</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Artigo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Data</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comments.map((comment) => (
                        <tr key={comment.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{comment.user.fullName}</div>
                            <div className="text-xs text-gray-500">{comment.user.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="line-clamp-2 max-w-xs">{comment.content}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="line-clamp-1 max-w-xs">{comment.article.title}</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {formatDate(comment.createdAt)}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(comment.status)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => window.open(`/article/${comment.article.slug}`, '_blank')}
                                title="Ver no artigo"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {comment.status !== 'approved' && (
                                    <DropdownMenuItem onClick={() => handleApproveComment(comment.id)}>
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                      <span>Aprovar</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  {comment.status !== 'pending' && (
                                    <DropdownMenuItem onClick={() => handleMarkAsPending(comment.id)}>
                                      <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                                      <span>Marcar como pendente</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  {comment.status !== 'spam' && (
                                    <DropdownMenuItem onClick={() => handleMarkAsSpam(comment.id)}>
                                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                      <span>Marcar como spam</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteComment(comment.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    <span>Excluir</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t px-4 py-3">
                    <div className="text-sm text-gray-500">
                      Mostrando <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> a <span className="font-medium">{Math.min(currentPage * 10, comments.length)}</span> de <span className="font-medium">{comments.length}</span> resultados
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default CommentsPage;
