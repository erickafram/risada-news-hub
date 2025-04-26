import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ArticleFormData {
  title: string;
  content: string;
  summary: string;
  categoryId: string;
  featuredImage: string;
  published: boolean;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

const ArticleForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    summary: '',
    categoryId: '',
    featuredImage: '',
    published: false
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null
  });
  
  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchArticle();
    }
  }, [id]);
  
  const fetchCategories = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/categories`, {
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
    }
  };
  
  const fetchArticle = async () => {
    if (!id) return;
    
    setIsFetching(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      console.log(`Buscando artigo com ID: ${id}`);
      
      if (!token) {
        console.error('Token não encontrado');
        throw new Error('Você precisa estar autenticado para editar artigos');
      }
      
      const response = await fetch(`${apiUrl}/api/articles/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const responseText = await response.text();
      console.log(`Resposta do servidor:`, responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Erro ao fazer parse da resposta JSON:', e);
        throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        console.error('Resposta não-OK:', response.status, response.statusText, data);
        throw new Error(data.message || `Erro ${response.status}: ${response.statusText}`);
      }
      
      console.log('Dados do artigo recebidos:', data);
      
      if (!data || !data.id) {
        throw new Error('Dados do artigo incompletos ou inválidos');
      }
      
      // Extrair o ID da categoria de forma segura
      let categoryId = '';
      if (data.categoryId) {
        categoryId = data.categoryId.toString();
      } else if (data.category_id) {
        categoryId = data.category_id.toString();
      } else if (data.category && data.category.id) {
        categoryId = data.category.id.toString();
      }
      
      console.log('ID da categoria extraído:', categoryId);
      
      setFormData({
        title: data.title || '',
        content: data.content || '',
        summary: data.summary || '',
        categoryId,
        featuredImage: data.featuredImage || '',
        published: Boolean(data.published)
      });
    } catch (error) {
      console.error('Erro ao buscar artigo:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível carregar os dados do artigo',
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
    setFormData(prev => ({ ...prev, published: checked }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoryId: value }));
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Verificar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Erro',
        description: 'Apenas imagens JPEG, PNG, GIF e WebP são permitidas',
        variant: 'destructive'
      });
      return;
    }
    
    // Verificar tamanho do arquivo (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'A imagem deve ter no máximo 5MB',
        variant: 'destructive'
      });
      return;
    }
    
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null
    });
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      console.log('Enviando imagem para:', `${apiUrl}/api/upload/image`);
      
      // Importante: Não incluir o header Content-Type ao enviar FormData
      // O navegador irá definir automaticamente com o boundary correto
      const response = await fetch(`${apiUrl}/api/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Falha ao fazer upload da imagem');
      }
      
      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        featuredImage: `${apiUrl}${data.imageUrl}`
      }));
      
      toast({
        title: 'Sucesso',
        description: 'Imagem enviada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      setUploadState(prev => ({
        ...prev,
        error: 'Falha ao fazer upload da imagem'
      }));
      
      toast({
        title: 'Erro',
        description: 'Não foi possível fazer upload da imagem',
        variant: 'destructive'
      });
    } finally {
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100
      }));
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadState(prev => ({
          ...prev,
          progress: 0
        }));
      }, 1000);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.categoryId) {
      toast({
        title: 'Erro',
        description: 'Título, conteúdo e categoria são obrigatórios',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const url = isEditing 
        ? `${apiUrl}/api/articles/${id}`
        : `${apiUrl}/api/articles`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          summary: formData.summary,
          categoryId: parseInt(formData.categoryId),
          featuredImage: formData.featuredImage,
          published: formData.published
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar artigo');
      }
      
      toast({
        title: 'Sucesso',
        description: isEditing 
          ? 'Artigo atualizado com sucesso' 
          : 'Artigo criado com sucesso'
      });
      
      navigate('/admin/news');
    } catch (error) {
      console.error('Erro ao salvar artigo:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao salvar artigo',
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
          onClick={() => navigate('/admin/news')}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Editar Artigo' : 'Novo Artigo'}
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Artigo' : 'Novo Artigo'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título do artigo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="summary">Resumo</Label>
              <Textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Resumo do artigo"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Conteúdo do artigo"
                rows={10}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="featuredImage">Imagem Destacada</Label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Input
                      id="featuredImage"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleChange}
                      placeholder="URL da imagem ou faça upload"
                      className="flex-1"
                    />
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadState.isUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  
                  {uploadState.isUploading && (
                    <div className="mt-2">
                      <Progress value={uploadState.progress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">Enviando imagem...</p>
                    </div>
                  )}
                  
                  {uploadState.error && (
                    <p className="text-xs text-red-500 mt-1">{uploadState.error}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-center border rounded-md p-4 h-40">
                  {formData.featuredImage ? (
                    <img 
                      src={formData.featuredImage} 
                      alt="Prévia da imagem" 
                      className="max-h-32 max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400?text=Imagem+Inválida';
                      }}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="h-10 w-10 mx-auto mb-2" />
                      <p className="text-sm">Prévia da imagem</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="published">Publicar artigo</Label>
            </div>
            
            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Atualizando...' : 'Criando...'}
                  </>
                ) : (
                  isEditing ? 'Atualizar Artigo' : 'Criar Artigo'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleForm;
