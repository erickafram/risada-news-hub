import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface CategoryFormData {
  name: string;
  description: string;
  active: boolean;
}

const CategoryForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();
  
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    active: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  useEffect(() => {
    if (isEditing) {
      fetchCategory();
    }
  }, [id]);
  
  const fetchCategory = async () => {
    if (!id) return;
    
    setIsFetching(true);
    try {
      const response = await fetch(`http://localhost:3001/api/categories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar categoria');
      }
      
      const data = await response.json();
      setFormData({
        name: data.name,
        description: data.description || '',
        active: data.active
      });
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados da categoria',
        variant: 'destructive'
      });
    } finally {
      setIsFetching(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, active: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Erro',
        description: 'O nome da categoria é obrigatório',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const url = isEditing 
        ? `http://localhost:3001/api/categories/${id}`
        : 'http://localhost:3001/api/categories';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar categoria');
      }
      
      toast({
        title: 'Sucesso',
        description: isEditing 
          ? 'Categoria atualizada com sucesso' 
          : 'Categoria criada com sucesso'
      });
      
      navigate('/admin/categories');
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao salvar categoria',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/categories')}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Entretenimento"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrição da categoria"
                rows={4}
              />
            </div>
            
            {isEditing && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="active">Categoria Ativa</Label>
              </div>
            )}
            
            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Atualizando...' : 'Criando...'}
                  </>
                ) : (
                  isEditing ? 'Atualizar Categoria' : 'Criar Categoria'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryForm;
