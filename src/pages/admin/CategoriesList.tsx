
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  active: boolean;
}

const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/categories/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar categorias');
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as categorias',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/api/categories/${categoryToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir categoria');
      }

      const data = await response.json();
      
      // Atualizar a lista de categorias
      setCategories(categories.filter(cat => cat.id !== categoryToDelete));
      
      toast({
        title: data.deleted ? 'Categoria excluída' : 'Categoria desativada',
        description: data.message,
      });
      
      // Se a categoria foi apenas desativada, recarregar a lista
      if (!data.deleted) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a categoria',
        variant: 'destructive'
      });
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
          <Button onClick={() => navigate('/admin/categories/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma categoria encontrada.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/admin/categories/new')}
            >
              Criar primeira categoria
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Slug</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{category.name}</td>
                    <td className="py-3 px-4">{category.slug}</td>
                    <td className="py-3 px-4">
                      {category.active ? (
                        <Badge variant="success">Ativa</Badge>
                      ) : (
                        <Badge variant="secondary">Inativa</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => confirmDelete(category.id)}
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
              Esta ação não pode ser desfeita. Se a categoria tiver artigos associados, ela será apenas desativada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default CategoriesList;
