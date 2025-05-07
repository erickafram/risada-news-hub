import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  Grid as GridIcon, 
  FileText, 
  Layers, 
  Settings, 
  X, 
  Save, 
  PlusCircle, 
  GripVertical, 
  Eye, 
  EyeOff
} from 'lucide-react';
import NewsCard from '@/components/news/NewsCard';
import { Link } from 'react-router-dom';

// Definição dos tipos
interface LayoutItem {
  id: string;
  type: 'featured' | 'grid' | 'category' | 'sidebar';
  settings: {
    title?: string;
    columns?: number;
    category?: string;
    limit?: number;
    showImage?: boolean;
    gridLayout?: 'standard' | 'featured' | 'horizontal' | 'vertical';
    fullWidth?: boolean;
  };
}

interface DynamicLayoutProps {
  layout?: LayoutItem[];
  isEditMode?: boolean;
  onLayoutChange?: (layout: LayoutItem[]) => void;
  onSave?: (layout: LayoutItem[]) => void;
}

const DynamicLayout = ({ layout = [], isEditMode = false, onLayoutChange, onSave }: DynamicLayoutProps) => {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const [editableLayout, setEditableLayout] = useState<LayoutItem[]>(layout);
  const [isLoading, setIsLoading] = useState(false);
  const [activeElement, setActiveElement] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [previewMode, setPreviewMode] = useState(!isEditMode);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  // Gerar ID único para itens de layout
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  useEffect(() => {
    // Garantir que todos os itens tenham IDs
    const layoutWithIds = layout.map(item => {
      return item.id ? item : { ...item, id: generateId() };
    });
    
    // Se o layout estiver vazio, criar um layout padrão
    if (layoutWithIds.length === 0) {
      const defaultLayout: LayoutItem[] = [
        {
          id: generateId(),
          type: 'featured',
          settings: {
            title: 'Destaques',
            limit: 3
          }
        },
        {
          id: generateId(),
          type: 'grid',
          settings: {
            title: 'Últimas Notícias',
            columns: 3,
            limit: 6
          }
        },
        {
          id: generateId(),
          type: 'sidebar',
          settings: {
            title: 'Mais Lidos',
            limit: 5,
            showImage: true
          }
        },
        {
          id: generateId(),
          type: 'sidebar',
          settings: {
            title: 'Mais Comentados',
            limit: 5,
            showImage: true
          }
        }
      ];
      setEditableLayout(defaultLayout);
      onLayoutChange?.(defaultLayout);
    } else {
      setEditableLayout(layoutWithIds);
    }
    
    // Sempre carrega os artigos quando o componente é montado
    fetchArticles();
  }, [layout]);
  
  // Buscar artigos reais do backend
  const fetchArticles = async () => {
    try {
      setIsLoadingArticles(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      console.log('[DEBUG DynamicLayout] Buscando artigos da API:', `${apiUrl}/api/articles?page=1&limit=15`);
      
      const response = await fetch(`${apiUrl}/api/articles?page=1&limit=15`);
      
      if (!response.ok) {
        throw new Error('Falha ao carregar artigos');
      }
      
      const data = await response.json();
      console.log('[DEBUG DynamicLayout] Dados de artigos recebidos:', data);
      
      if (data && data.articles && Array.isArray(data.articles)) {
        console.log('[DEBUG DynamicLayout] Número de artigos carregados:', data.articles.length);
        setArticles(data.articles);
      } else {
        console.log('[DEBUG DynamicLayout] Formato de dados inesperado, usando mock data');
        setArticles(mockArticles);
      }
    } catch (error) {
      console.error('[DEBUG DynamicLayout] Erro ao buscar artigos:', error);
      // Em caso de erro, use dados de exemplo
      setArticles(mockArticles);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const handleAddElement = (type: 'featured' | 'grid' | 'category' | 'sidebar') => {
    const newElement: LayoutItem = {
      id: generateId(),
      type,
      settings: {}
    };

    switch (type) {
      case 'featured':
        newElement.settings = {
          title: 'Destaques',
          limit: 3
        };
        break;
      case 'grid':
        newElement.settings = {
          title: 'Notícias',
          columns: 3,
          category: 'all',
          limit: 6,
          gridLayout: 'standard'
        };
        break;
      case 'category':
        newElement.settings = {
          title: 'Categoria',
          category: 'all',
          limit: 4
        };
        break;
      case 'sidebar':
        newElement.settings = {
          title: 'Sidebar',
          limit: 5,
          showImage: true
        };
        break;
    }

    const updatedLayout = [...editableLayout, newElement];
    setEditableLayout(updatedLayout);
    onLayoutChange?.(updatedLayout);
    
    // Definir o novo elemento como ativo
    setActiveElement(editableLayout.length);
  };

  const handleUpdateElement = (index: number, updates: Partial<LayoutItem>) => {
    const newLayout = [...editableLayout];
    newLayout[index] = { ...newLayout[index], ...updates };
    setEditableLayout(newLayout);
    onLayoutChange?.(newLayout);
  };

  const handleDeleteElement = (index: number) => {
    const newLayout = [...editableLayout];
    newLayout.splice(index, 1);
    setEditableLayout(newLayout);
    onLayoutChange?.(newLayout);
    
    // Limpar elemento ativo se excluído
    if (activeElement === index) {
      setActiveElement(null);
    } else if (activeElement !== null && activeElement > index) {
      // Ajustar índice do elemento ativo se necessário
      setActiveElement(activeElement - 1);
    }
  };

  const moveElement = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === editableLayout.length - 1)) {
      return; // Não pode mover além dos limites
    }

    const newLayout = [...editableLayout];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Trocar os elementos
    [newLayout[index], newLayout[targetIndex]] = [newLayout[targetIndex], newLayout[index]];
    
    setEditableLayout(newLayout);
    onLayoutChange?.(newLayout);
    
    // Atualizar o elemento ativo se necessário
    if (activeElement === index) {
      setActiveElement(targetIndex);
    } else if (activeElement === targetIndex) {
      setActiveElement(index);
    }
  };

  const handleSaveLayout = async () => {
    if (!user || user.role !== 'admin') {
      toast({
        title: 'Erro',
        description: 'Apenas administradores podem salvar layouts',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Salvando layout:', editableLayout);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/page-layouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'Layout Atual',
          layout: editableLayout,
          isActive: true
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar layout');
      }

      // Aguardar um segundo para garantir que o servidor processou a atualização
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar a visualização
      setPreviewMode(true);

      // Notificar o componente pai (Index) sobre o salvamento
      if (onSave) {
        console.log('Notificando componente pai sobre salvar layout');
        onSave(editableLayout);
      }

      toast({
        title: 'Sucesso',
        description: 'Layout salvo com sucesso'
      });
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

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'featured': return <Layers className="w-4 h-4" />;
      case 'grid': return <GridIcon className="w-4 h-4" />;
      case 'category': return <FileText className="w-4 h-4" />;
      case 'sidebar': return <Layers className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const getElementTitle = (type: string) => {
    switch (type) {
      case 'featured': return 'Destaques';
      case 'grid': return 'Grade de Notícias';
      case 'category': return 'Categoria';
      case 'sidebar': return 'Sidebar';
      default: return 'Elemento';
    }
  };

  // Mock de dados para visualização (apenas como fallback)
  const mockArticles = [
    {
      id: '1',
      title: "Prefeito Eduardo Siqueira Campos Anuncia Plano 'Taquari 20 Anos'",
      excerpt: "Em um pronunciamento que deixou a população de Palmas entre o êxtase futurista e a gargalhada incrédula, o prefeito Eduardo Siqueira Campos revelou...",
      category: "Política",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
      publishedAt: "2023-05-15T10:30:00",
      source: "Risada News Hub",
      likes: 45,
      comments: 12
    },
    // ... outros artigos mock ...
  ];

  // Obter artigos reais ou mock para uma seção
  const getArticlesForSection = (limit: number = 3, category?: string) => {
    if (articles.length === 0) {
      return getMockArticlesForSection(limit, category);
    }
    
    let filteredArticles = [...articles];
    
    // Filtrar por categoria se especificada
    if (category && category !== 'all') {
      filteredArticles = articles.filter(article => {
        // Verifica diferentes propriedades onde a categoria pode estar
        const articleCategory = article.category?.name || article.category || '';
        return articleCategory.toLowerCase() === category.toLowerCase();
      });
      
      // Se não houver artigos nesta categoria, usar todos
      if (filteredArticles.length === 0) {
        filteredArticles = articles;
      }
    }
    
    // Mapear para o formato NewsItem
    return filteredArticles.slice(0, limit).map(article => ({
      id: article.id?.toString() || Math.random().toString(),
      title: article.title || 'Sem título',
      excerpt: article.summary || article.excerpt || (article.content && article.content.substring(0, 150) + '...') || 'Sem conteúdo',
      category: article.category?.name || article.category || 'Sem categoria',
      imageUrl: article.featuredImage || article.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop',
      publishedAt: article.publishedAt || article.createdAt || new Date().toISOString(),
      source: article.author?.fullName || article.source || 'Risada News Hub',
      likes: article.reactionCounts?.heart || article.likes || 0,
      comments: article.commentCount || article.comments || 0
    }));
  };

  const getMockArticlesForSection = (limit: number = 3, category?: string) => {
    let filteredArticles = mockArticles;
    
    // Filtrar por categoria se especificada
    if (category && category !== 'all') {
      filteredArticles = mockArticles.filter(
        article => article.category.toLowerCase() === category.toLowerCase()
      );
      
      // Se não houver artigos nesta categoria, usar todos
      if (filteredArticles.length === 0) {
        filteredArticles = mockArticles;
      }
    }
    
    return filteredArticles.slice(0, limit);
  };

  const renderPreview = (item: LayoutItem, index: number) => {
    console.log('Renderizando preview do item:', item);
    const articlesForSection = getArticlesForSection(item.settings.limit || 3, item.settings.category !== 'all' ? item.settings.category : undefined);
    
    switch (item.type) {
      case 'featured':
        return (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{item.settings.title || 'Destaques'}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left side - one large article */}
              <div className="lg:col-span-5 flex">
                {articlesForSection.length > 0 && (
                  <div className="w-full h-full rounded-lg overflow-hidden shadow-md">
                    <NewsCard article={articlesForSection[0]} featured={true} />
                  </div>
                )}
              </div>
              
              {/* Right side - two smaller articles */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  {articlesForSection.slice(1, 3).map((article, i) => (
                    <div key={i} className="h-full rounded-lg overflow-hidden shadow-md">
                      <NewsCard key={i} article={article} compact={true} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'grid':
        const columnClass = `grid-cols-1 md:grid-cols-${item.settings.columns || 3}`;
        const categoryTitle = item.settings.category && item.settings.category !== 'all'
          ? `${item.settings.title || 'Notícias'} - ${item.settings.category}`
          : (item.settings.title || 'Notícias');
        
        const gridArticles = getArticlesForSection(item.settings.limit || 6, item.settings.category !== 'all' ? item.settings.category : undefined);
        
        // Different layout templates based on the gridLayout setting
        const renderGridLayout = () => {
          switch (item.settings.gridLayout) {
            case 'featured':
              // 1 large + 2 small articles layout
              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left side - one large article */}
                  <div className="lg:col-span-6 flex">
                    {gridArticles.length > 0 && (
                      <div className="w-full h-full rounded-lg overflow-hidden shadow-md">
                        <NewsCard article={gridArticles[0]} featured={true} />
                      </div>
                    )}
                  </div>
                  
                  {/* Right side - two smaller articles */}
                  <div className="lg:col-span-6">
                    <div className="grid grid-cols-1 gap-4 h-full">
                      {gridArticles.slice(1, 3).map((article, i) => (
                        <div key={i} className="h-full rounded-lg overflow-hidden shadow-md">
                          <NewsCard key={i} article={article} compact={true} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
              
            case 'horizontal':
              // Horizontal layout (single row)
              return (
                <div className="overflow-x-auto">
                  <div className="flex gap-4 pb-2">
                    {gridArticles.map((article, i) => (
                      <div key={i} className="min-w-[280px] max-w-[320px] flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                        <NewsCard key={i} article={article} compact={true} />
                      </div>
                    ))}
                  </div>
                </div>
              );
              
            case 'vertical':
              // Vertical layout (single column)
              return (
                <div className="flex flex-col gap-4">
                  {gridArticles.map((article, i) => (
                    <div key={i} className="rounded-lg overflow-hidden shadow-md">
                      <NewsCard key={i} article={article} />
                    </div>
                  ))}
                </div>
              );
              
            case 'standard':
            default:
              // Standard grid layout
              return (
                <div className={`grid ${columnClass} gap-4`}>
                  {gridArticles.map((article, i) => (
                    <div key={i} className="rounded-lg overflow-hidden shadow-md">
                      <NewsCard key={i} article={article} />
                    </div>
                  ))}
                </div>
              );
          }
        };
        
        return (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{categoryTitle}</h2>
            {renderGridLayout()}
          </div>
        );
        
      case 'category':
        return (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {item.settings.title || `Categoria: ${item.settings.category || 'Não selecionada'}`}
            </h2>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
              {getArticlesForSection(item.settings.limit || 4, item.settings.category).map((article, i) => (
                <div key={i} className="shadow-md rounded-lg overflow-hidden">
                  <NewsCard key={i} article={article} />
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'sidebar':
        const sidebarArticles = getArticlesForSection(item.settings.limit || 5, item.settings.category !== 'all' ? item.settings.category : undefined);
        return (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
              <div className="space-y-3">
                {sidebarArticles.map((article, i) => (
                  <div key={i} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <Link to={`/article/${article.id}`} className="hover:text-primary flex items-center gap-2">
                      {item.settings.showImage && (
                        <div className="w-12 h-12 flex-shrink-0">
                          <img 
                            src={article.imageUrl} 
                            alt={article.title} 
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm line-clamp-2">{article.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {article.likes}
                          </span>
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {article.comments}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Tipo de elemento desconhecido</div>;
    }
  };

  return (
    <div className="space-y-6">
      {isEditMode && (
        <div className="sticky top-0 z-10 bg-white border-b p-4 mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Editor de Layout</h2>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? <Settings className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {previewMode ? 'Modo Edição' : 'Pré-visualizar'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowControls(!showControls)}
            >
              {showControls ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showControls ? 'Esconder Controles' : 'Mostrar Controles'}
            </Button>
            
            <Button
              onClick={handleSaveLayout}
              disabled={isLoading}
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Layout
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Conteúdo principal */}
        <div className={`flex-1 ${isEditMode && showControls && !previewMode ? 'pr-4' : ''}`}>
          {previewMode || !isEditMode ? (
            // Modo de pré-visualização - mostra o layout com dados reais
            <div className="space-y-6">
              {isLoadingArticles ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Verificar se há algum item com largura total */}
                  {editableLayout.some(item => item.settings.fullWidth) ? (
                    <>
                      {/* Itens com largura total */}
                      <div className="md:col-span-12">
                        {editableLayout
                          .filter(item => item.settings.fullWidth)
                          .map((item, index) => (
                            <div key={item.id}>
                              {renderPreview(item, index)}
                            </div>
                          ))}
                      </div>
                      
                      {/* Itens regulares (sem serem de largura total) em layout de duas colunas */}
                      <div className="md:col-span-8">
                        {editableLayout
                          .filter(item => !item.settings.fullWidth && (item.type === 'featured' || item.type === 'grid' || item.type === 'category'))
                          .map((item, index) => (
                            <div key={item.id}>
                              {renderPreview(item, index)}
                            </div>
                          ))}
                      </div>
                      
                      {/* Sidebar - sempre na coluna direita */}
                      <div className="md:col-span-4">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                          <span className="text-purple-600 mr-2">↗</span> Mais Lidos
                        </h2>
                        {editableLayout
                          .filter(item => item.type === 'sidebar' && item.settings.title === 'Mais Lidos')
                          .map((item, index) => (
                            <div key={item.id}>
                              {renderPreview(item, index)}
                            </div>
                          ))}
                          
                        <h2 className="text-xl font-bold mb-4 mt-8 flex items-center">
                          <span className="text-purple-600 mr-2">💬</span> Mais Comentados
                        </h2>
                        {editableLayout
                          .filter(item => item.type === 'sidebar' && item.settings.title === 'Mais Comentados')
                          .map((item, index) => (
                            <div key={item.id}>
                              {renderPreview(item, index)}
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:col-span-8">
                        {/* Conteúdo principal - Featured e Grid */}
                        {editableLayout
                          .filter(item => item.type === 'featured' || item.type === 'grid' || item.type === 'category')
                          .map((item, index) => (
                            <div key={item.id}>
                              {renderPreview(item, index)}
                            </div>
                          ))}
                      </div>
                      <div className="md:col-span-4">
                        {/* Sidebar - Mais Lidos e Mais Comentados */}
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                          <span className="text-purple-600 mr-2">↗</span> Mais Lidos
                        </h2>
                        {editableLayout
                          .filter(item => item.type === 'sidebar' && item.settings.title === 'Mais Lidos')
                          .map((item, index) => (
                            <div key={item.id}>
                              {renderPreview(item, index)}
                            </div>
                          ))}
                          
                        <h2 className="text-xl font-bold mb-4 mt-8 flex items-center">
                          <span className="text-purple-600 mr-2">💬</span> Mais Comentados
                        </h2>
                        {editableLayout
                          .filter(item => item.type === 'sidebar' && item.settings.title === 'Mais Comentados')
                          .map((item, index) => (
                            <div key={item.id}>
                              {renderPreview(item, index)}
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Modo de edição - mostra os elementos editáveis
            <div className="space-y-4">
              {editableLayout.map((item, index) => (
                <Card 
                  key={item.id}
                  className={`border-2 ${activeElement === index ? 'border-primary ring-2 ring-primary/20' : 'border-dashed'}`}
                  onClick={() => setActiveElement(index)}
                >
                  <div className="flex justify-between items-center p-3 border-b bg-gray-50">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      {getElementIcon(item.type)}
                      <span className="font-medium">{getElementTitle(item.type)}</span>
                      {item.settings.title && (
                        <span className="text-gray-500 text-sm">
                          - {item.settings.title}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {index > 0 && (
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveElement(index, 'up');
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                        </Button>
                      )}
                      
                      {index < editableLayout.length - 1 && (
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveElement(index, 'down');
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteElement(index);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500">
                      {item.type === 'featured' && (
                        <div>
                          <div className="font-medium mb-2">{item.settings.title || 'Destaques'}</div>
                          <div className="grid grid-cols-3 gap-2 bg-gray-100 p-3 rounded">
                            <div className="col-span-1 bg-white p-2 rounded border">Notícia Grande</div>
                            <div className="col-span-2">
                              <div className="bg-white p-2 rounded border mb-2">Notícia Pequena 1</div>
                              <div className="bg-white p-2 rounded border">Notícia Pequena 2</div>
                            </div>
                          </div>
                          <div className="mt-2">Mostra {item.settings.limit || 3} artigos em destaque, com layout 1+2.</div>
                        </div>
                      )}
                      
                      {item.type === 'grid' && (
                        <div>
                          <div className="font-medium mb-2">
                            {item.settings.title || 'Grade de Notícias'} 
                            {item.settings.fullWidth && <span className="text-blue-600 ml-2">(Largura Total)</span>}
                          </div>
                          <div className="grid grid-cols-3 gap-2 bg-gray-100 p-3 rounded">
                            {[...Array(Math.min(item.settings.limit || 6, 6))].map((_, i) => (
                              <div key={i} className="bg-white p-2 rounded border">
                                Notícia {i+1}
                              </div>
                            ))}
                          </div>
                          <div className="mt-2">
                            Exibe {item.settings.limit || 6} artigos em {item.settings.columns || 3} colunas.
                            {item.settings.fullWidth && 
                              <span className="block mt-1 text-blue-600">
                                Esta grade ocupará toda a largura da página.
                              </span>
                            }
                          </div>
                        </div>
                      )}
                      
                      {item.type === 'category' && (
                        <div>
                          <div className="font-medium mb-2">
                            {item.settings.title || `Categoria: ${item.settings.category || 'Não selecionada'}`}
                            {item.settings.fullWidth && <span className="text-blue-600 ml-2">(Largura Total)</span>}
                          </div>
                          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-3 rounded">
                            {[...Array(Math.min(item.settings.limit || 4, 4))].map((_, i) => (
                              <div key={i} className="bg-white p-2 rounded border">
                                Artigo {i+1} da categoria
                              </div>
                            ))}
                          </div>
                          <div className="mt-2">
                            Mostra {item.settings.limit || 4} artigos da categoria {item.settings.category || '[selecione]'}.
                            {item.settings.fullWidth && 
                              <span className="block mt-1 text-blue-600">
                                Esta categoria ocupará toda a largura da página.
                              </span>
                            }
                          </div>
                        </div>
                      )}
                      
                      {item.type === 'sidebar' && (
                        <div>
                          <div className="font-medium mb-2">{item.settings.title || 'Sidebar'}</div>
                          <div className="bg-gray-100 p-3 rounded">
                            {[...Array(Math.min(item.settings.limit || 5, 5))].map((_, i) => (
                              <div key={i} className="bg-white p-2 rounded border mb-2">
                                Item {i+1} da sidebar
                              </div>
                            ))}
                          </div>
                          <div className="mt-2">
                            Mostra {item.settings.limit || 5} itens.
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {editableLayout.length === 0 && (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="text-gray-500">
                    <Layers className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Nenhum elemento adicionado</h3>
                    <p className="mb-4">Adicione elementos usando os botões abaixo</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Painel lateral para adicionar elementos e configurações */}
        {isEditMode && showControls && !previewMode && (
          <div className="w-72 border-l bg-gray-50 p-4 shrink-0">
            <div className="mb-4">
              <h3 className="font-medium mb-2 text-sm uppercase tracking-wide text-gray-500">Adicionar Elementos</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleAddElement('featured')}
                  className="h-auto flex flex-col items-center py-3 bg-white"
                >
                  <Layers className="w-5 h-5 mb-1" />
                  <span className="text-xs">Destaques</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAddElement('grid')}
                  className="h-auto flex flex-col items-center py-3 bg-white"
                >
                  <GridIcon className="w-5 h-5 mb-1" />
                  <span className="text-xs">Grade</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAddElement('category')}
                  className="h-auto flex flex-col items-center py-3 bg-white"
                >
                  <FileText className="w-5 h-5 mb-1" />
                  <span className="text-xs">Categoria</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAddElement('sidebar')}
                  className="h-auto flex flex-col items-center py-3 bg-white"
                >
                  <Layers className="w-5 h-5 mb-1" />
                  <span className="text-xs">Sidebar</span>
                </Button>
              </div>
            </div>
            
            {activeElement !== null && editableLayout[activeElement] ? (
              <div className="border rounded bg-white p-3">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                  {getElementIcon(editableLayout[activeElement].type)}
                  <h3 className="font-medium">
                    Editar {getElementTitle(editableLayout[activeElement].type)}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Título</Label>
                    <Input
                      value={editableLayout[activeElement].settings.title || ''}
                      onChange={(e) => handleUpdateElement(activeElement, {
                        settings: { 
                          ...editableLayout[activeElement].settings,
                          title: e.target.value 
                        }
                      })}
                      className="mt-1"
                    />
                  </div>
                  
                  {(editableLayout[activeElement].type === 'grid' || editableLayout[activeElement].type === 'category') && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="fullWidth"
                        checked={editableLayout[activeElement].settings.fullWidth || false}
                        onChange={(e) => handleUpdateElement(activeElement, {
                          settings: { 
                            ...editableLayout[activeElement].settings,
                            fullWidth: e.target.checked 
                          }
                        })}
                        className="mr-2"
                      />
                      <Label htmlFor="fullWidth" className="text-sm">Largura total (sem sidebar)</Label>
                    </div>
                  )}
                  
                  {editableLayout[activeElement].type === 'grid' && (
                    <>
                      <div>
                        <Label className="text-sm">Número de Colunas</Label>
                        <Select
                          value={String(editableLayout[activeElement].settings.columns || 3)}
                          onValueChange={(value) => handleUpdateElement(activeElement, {
                            settings: { 
                              ...editableLayout[activeElement].settings,
                              columns: parseInt(value) 
                            }
                          })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Número de colunas" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Coluna</SelectItem>
                            <SelectItem value="2">2 Colunas</SelectItem>
                            <SelectItem value="3">3 Colunas</SelectItem>
                            <SelectItem value="4">4 Colunas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm">Tipo de Layout</Label>
                        <Select
                          value={editableLayout[activeElement].settings.gridLayout || 'standard'}
                          onValueChange={(value) => handleUpdateElement(activeElement, {
                            settings: { 
                              ...editableLayout[activeElement].settings,
                              gridLayout: value as 'standard' | 'featured' | 'horizontal' | 'vertical'
                            }
                          })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Tipo de Layout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Padrão (Grade)</SelectItem>
                            <SelectItem value="featured">Destaque (1 grande + 2 pequenas)</SelectItem>
                            <SelectItem value="horizontal">Horizontal (Linha)</SelectItem>
                            <SelectItem value="vertical">Vertical (Coluna)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm">Categoria</Label>
                        <Select
                          value={editableLayout[activeElement].settings.category || "all"}
                          onValueChange={(value) => handleUpdateElement(activeElement, {
                            settings: { 
                              ...editableLayout[activeElement].settings,
                              category: value 
                            }
                          })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Todas as categorias" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas as categorias</SelectItem>
                            <SelectItem value="notícias">Notícias</SelectItem>
                            <SelectItem value="esportes">Esportes</SelectItem>
                            <SelectItem value="tecnologia">Tecnologia</SelectItem>
                            <SelectItem value="entretenimento">Entretenimento</SelectItem>
                            <SelectItem value="política">Política</SelectItem>
                            <SelectItem value="economia">Economia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div>
                    <Label className="text-sm">Limite de Itens</Label>
                    <Input
                      type="number"
                      value={editableLayout[activeElement].settings.limit || 
                        (editableLayout[activeElement].type === 'featured' ? 3 : 
                         editableLayout[activeElement].type === 'grid' ? 6 :
                         editableLayout[activeElement].type === 'category' ? 4 : 5)}
                      onChange={(e) => handleUpdateElement(activeElement, {
                        settings: { 
                          ...editableLayout[activeElement].settings,
                          limit: parseInt(e.target.value) 
                        }
                      })}
                      min={1}
                      max={20}
                      className="mt-1"
                    />
                  </div>
                  
                  {editableLayout[activeElement].type === 'sidebar' && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showImages"
                        checked={editableLayout[activeElement].settings.showImage || false}
                        onChange={(e) => handleUpdateElement(activeElement, {
                          settings: { 
                            ...editableLayout[activeElement].settings,
                            showImage: e.target.checked 
                          }
                        })}
                        className="mr-2"
                      />
                      <Label htmlFor="showImages" className="text-sm">Mostrar imagens</Label>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border rounded bg-white p-4 text-center">
                <Settings className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500 text-sm">
                  Selecione um elemento para editar suas propriedades
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicLayout;
