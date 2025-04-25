import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash, Plus, Loader2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  featuredImage: string;
  published: boolean;
  publishedAt: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  author: {
    id: number;
    fullName: string;
  };
}

const NewsList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/articles/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar artigos');
      }

      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os artigos',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setArticleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/api/articles/${articleToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir artigo');
      }

      // Atualizar a lista de artigos
      setArticles(articles.filter(article => article.id !== articleToDelete));
      
      toast({
        title: 'Artigo excluído',
        description: 'O artigo foi excluído com sucesso',
      });
    } catch (error) {
      console.error('Erro ao excluir artigo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o artigo',
        variant: 'destructive'
      });
    } finally {
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Artigos</h1>
          <Button onClick={() => navigate('/admin/news/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Artigo
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum artigo encontrado.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/admin/news/new')}
            >
              Criar primeiro artigo
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Título</th>
                  <th className="text-left py-3 px-4">Categoria</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Visualizações</th>
                  <th className="text-left py-3 px-4">Data</th>
                  <th className="text-right py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {article.featuredImage ? (
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-10 h-10 rounded object-cover mr-3"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/100x100?text=Sem+Imagem';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-gray-500 text-xs">Sem img</span>
                          </div>
                        )}
                        <span className="font-medium truncate max-w-xs">{article.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{article.category?.name || 'Sem categoria'}</td>
                    <td className="py-3 px-4">
                      {article.published ? (
                        <Badge variant="success">Publicado</Badge>
                      ) : (
                        <Badge variant="secondary">Rascunho</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">{article.views}</td>
                    <td className="py-3 px-4">
                      {article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => window.open(`/article/${article.slug}`, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => navigate(`/admin/news/edit/${article.id}`)}
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => confirmDelete(article.id)}
                        >
                          <Trash className="w-4 h-4" />
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O artigo será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteArticle}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default NewsList;
