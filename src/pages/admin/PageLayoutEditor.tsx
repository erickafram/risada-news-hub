import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid, GridItem } from '../../components/ui/grid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

type ElementType = 'grid' | 'category' | 'posts';

interface LayoutItem {
  type: ElementType;
  settings: {
    columns?: number;
    category?: string;
    limit?: number;
  };
  content?: any;
}

const PageLayoutEditor = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { toast } = useToast();
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [layoutName, setLayoutName] = useState('');
  const [activeLayout, setActiveLayout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin');
      return;
    }

    fetchActiveLayout();
  }, [user, navigate]);

  const fetchActiveLayout = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/page-layouts/active', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setActiveLayout(data);
    } catch (error) {
      console.error('Erro ao buscar layout ativo:', error);
    }
  };

  const handleAddElement = (type: ElementType) => {
    const newElement: LayoutItem = {
      type,
      settings: {}
    };

    switch (type) {
      case 'grid':
        newElement.settings.columns = 3;
        break;
      case 'category':
        newElement.settings.category = '';
        break;
      case 'posts':
        newElement.settings.limit = 5;
        break;
    }

    setLayout([...layout, newElement]);
  };

  const handleUpdateElement = (index: number, updates: Partial<LayoutItem>) => {
    const newLayout = [...layout];
    newLayout[index] = { ...newLayout[index], ...updates };
    setLayout(newLayout);
  };

  const handleDeleteElement = (index: number) => {
    const newLayout = [...layout];
    newLayout.splice(index, 1);
    setLayout(newLayout);
  };

  const handleSaveLayout = async () => {
    if (!layoutName.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome do layout é obrigatório',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/page-layouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: layoutName,
          layout: layout
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar layout');
      }

      toast({
        title: 'Sucesso',
        description: 'Layout salvo com sucesso'
      });
      navigate('/admin');
    } catch (error) {
      console.error('Erro ao salvar layout:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao salvar layout',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin')}
          className="mr-2"
        >
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Editor de Layout</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações do Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="layoutName">Nome do Layout</Label>
              <Input
                id="layoutName"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                placeholder="Nome do layout"
              />
            </div>

            <div className="space-y-2">
              <Label>Elementos do Layout</Label>
              <div className="space-y-4">
                {layout.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{item.type}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteElement(index)}
                      >
                        Remover
                      </Button>
                    </div>

                    {item.type === 'grid' && (
                      <div className="space-y-2">
                        <Label>Colunas</Label>
                        <Input
                          type="number"
                          value={item.settings.columns}
                          onChange={(e) => handleUpdateElement(index, {
                            settings: { columns: parseInt(e.target.value) }
                          })}
                          min={1}
                          max={12}
                        />
                      </div>
                    )}

                    {item.type === 'category' && (
                      <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Input
                          value={item.settings.category}
                          onChange={(e) => handleUpdateElement(index, {
                            settings: { category: e.target.value }
                          })}
                          placeholder="Nome da categoria"
                        />
                      </div>
                    )}

                    {item.type === 'posts' && (
                      <div className="space-y-2">
                        <Label>Limite de Posts</Label>
                        <Input
                          type="number"
                          value={item.settings.limit}
                          onChange={(e) => handleUpdateElement(index, {
                            settings: { limit: parseInt(e.target.value) }
                          })}
                          min={1}
                          max={50}
                        />
                      </div>
                    )}
                  </Card>
                ))}

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => handleAddElement('grid')}
                  >
                    Adicionar Grid
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAddElement('category')}
                  >
                    Adicionar Categoria
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAddElement('posts')}
                  >
                    Adicionar Posts
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSaveLayout}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Salvando...' : 'Salvar Layout'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageLayoutEditor;
