import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import NewsCard from '@/components/news/NewsCard';
import { useAuth } from '@/contexts/AuthContext';
import { NewsItem } from '@/components/news/NewsCard';
import { Loader2, ArrowUp, Newspaper, TrendingUp, MessageSquare } from 'lucide-react';
import SiteTitle from '@/components/SiteTitle';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import ScrollToTop from '@/components/ui/scroll-to-top';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Newspaper as NewspaperIcon } from 'lucide-react';
import DynamicLayout from '@/components/DynamicLayout';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [allArticles, setAllArticles] = useState<NewsItem[]>([]);
  const [mostReadArticles, setMostReadArticles] = useState<NewsItem[]>([]);
  const [mostCommentedArticles, setMostCommentedArticles] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string, slug: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const { settings } = useSiteSettings();
  const [layout, setLayout] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDefaultLayout, setShowDefaultLayout] = useState(true);
  
  // Função para converter dados da API para o formato NewsItem
  const mapArticleToNewsItem = (article: any): NewsItem => ({
    id: article.id.toString(),
    title: article.title,
    excerpt: article.summary || article.content.substring(0, 150) + '...',
    category: article.category?.name || 'Sem categoria',
    imageUrl: article.featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop',
    publishedAt: article.publishedAt || article.createdAt,
    source: article.author?.fullName || 'Risada News Hub',
    likes: article.reactionCounts?.heart || 0,
    comments: article.commentCount || 0
  });

  // Verificar conexão com o backend
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`);
        if (!response.ok) {
          console.error('Erro ao conectar com o backend:', response.status);
        }
      } catch (error) {
        console.error('Erro ao conectar com o backend:', error);
      }
    };

    checkBackendConnection();
  }, []);

  // Função para buscar contagens de reações para um artigo
  const fetchReactionCounts = async (articleId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/reactions/count/${articleId}`);
      
      if (response.ok) {
        return await response.json();
      }
      return { heart: 0, thumbsUp: 0, laugh: 0, angry: 0, sad: 0 };
    } catch (error) {
      console.error(`Erro ao buscar contagens de reações para o artigo ${articleId}:`, error);
      return { heart: 0, thumbsUp: 0, laugh: 0, angry: 0, sad: 0 };
    }
  };
  
  // Função para buscar contagem de comentários para um artigo
  const fetchCommentCount = async (articleId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/comments/count/${articleId}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.count;
      }
      return 0;
    } catch (error) {
      console.error(`Erro ao buscar contagem de comentários para o artigo ${articleId}:`, error);
      return 0;
    }
  };

  // Buscar layout ativo e artigos
  useEffect(() => {
    const fetchActiveLayout = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        console.log("[DEBUG] Fetching active layout from:", `${apiUrl}/api/page-layouts/active`);
        
        const response = await fetch(`${apiUrl}/api/page-layouts/active`);
        
        if (response.ok) {
          const data = await response.json();
          console.log("[DEBUG] Active layout API response:", data);
          
          // Check if there's a valid layout structure in the response
          if (data && data.layout && Array.isArray(data.layout) && data.layout.length > 0) {
            console.log("[DEBUG] Valid layout found, applying custom layout...");
            setLayout(data.layout);
            setShowDefaultLayout(false);
          } else {
            console.log("[DEBUG] No valid layout in response, using default layout");
            setShowDefaultLayout(true);
          }
        } else {
          console.error("[DEBUG] Error fetching layout:", response.status, response.statusText);
          setShowDefaultLayout(true);
        }
      } catch (error) {
        console.error('[DEBUG] Exception fetching active layout:', error);
        setShowDefaultLayout(true);
      }
    };

    const fetchArticles = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
        // Se houver uma consulta de pesquisa, buscar artigos correspondentes
        if (searchQuery) {
          console.log('Realizando pesquisa por:', searchQuery);
          setLoading(true);
          
          const searchResponse = await fetch(`${apiUrl}/api/articles?search=${encodeURIComponent(searchQuery)}`);
          if (!searchResponse.ok) {
            throw new Error(`Erro ao buscar resultados da pesquisa: ${searchResponse.status}`);
          }
          
          const searchData = await searchResponse.json();
          console.log('Resultados da pesquisa (dados brutos):', searchData);
          console.log('Artigos encontrados:', searchData.articles ? searchData.articles.length : 0);
          
          if (!searchData.articles || searchData.articles.length === 0) {
            console.log('Nenhum artigo encontrado para o termo:', searchQuery);
            setAllArticles([]);
            setFeaturedNews([]);
            setLoading(false);
            return;
          }
          
          // Mapear diretamente os artigos para o formato NewsItem
          const searchResults = searchData.articles.map(mapArticleToNewsItem);
          console.log('Artigos processados para exibição:', searchResults);
          
          setAllArticles(searchResults);
          setFeaturedNews([]); // Não mostrar artigos em destaque nos resultados da pesquisa
          setLoading(false);
          return; // Sair da função para não buscar os artigos normais
        }
        
        // Buscar artigos em destaque (os 3 mais recentes - página 1)
        const featuredResponse = await fetch(`${apiUrl}/api/articles?page=1&limit=3`);
        if (!featuredResponse.ok) {
          throw new Error(`Erro ao buscar artigos em destaque: ${featuredResponse.status}`);
        }
        
        const featuredData = await featuredResponse.json();
        console.log('Artigos em destaque:', featuredData);
        
        // Buscar contagens de reações e comentários para artigos em destaque
        const featuredWithReactions = await Promise.all(
          (featuredData.articles || []).map(async (article: any) => {
            try {
              const reactionCounts = await fetchReactionCounts(article.id.toString());
              const commentCount = await fetchCommentCount(article.id.toString());
              return { ...article, reactionCounts, commentCount };
            } catch (e) {
              console.error(`Erro ao buscar reações/comentários para artigo ${article.id}:`, e);
              return { ...article, reactionCounts: { heart: 0 }, commentCount: 0 };
            }
          })
        );
        
        if (featuredWithReactions.length > 0) {
          setFeaturedNews(featuredWithReactions.map(mapArticleToNewsItem));
        }

        // Buscar todos os artigos começando pela página 1 (agora buscando mais artigos)
        const allArticlesResponse = await fetch(`${apiUrl}/api/articles?page=1&limit=12`);
        if (!allArticlesResponse.ok) {
          throw new Error(`Erro ao buscar todos os artigos: ${allArticlesResponse.status}`);
        }
        
        const allArticlesData = await allArticlesResponse.json();
        console.log('Todos os artigos:', allArticlesData);
        
        // Buscar contagens de reações e comentários para todos os artigos
        const allWithReactions = await Promise.all(
          (allArticlesData.articles || []).map(async (article: any) => {
            try {
              const reactionCounts = await fetchReactionCounts(article.id.toString());
              const commentCount = await fetchCommentCount(article.id.toString());
              return { ...article, reactionCounts, commentCount };
            } catch (e) {
              console.error(`Erro ao buscar reações/comentários para artigo ${article.id}:`, e);
              return { ...article, reactionCounts: { heart: 0 }, commentCount: 0 };
            }
          })
        );
        
        if (allWithReactions.length > 0) {
          // Remover os artigos em destaque da lista principal para evitar duplicação
          const featuredIds = featuredWithReactions.map(article => article.id);
          const nonFeaturedArticles = allWithReactions.filter(article => !featuredIds.includes(article.id));
          setAllArticles(nonFeaturedArticles.map(mapArticleToNewsItem));
          
          // Criar lista de artigos mais lidos (simulando com base nas visualizações ou reações)
          // Aqui estamos usando as reações como métrica para "mais lidos"
          const sortedByReactions = [...allWithReactions].sort((a, b) => {
            const aReactions = (a.reactionCounts?.heart || 0) + (a.reactionCounts?.thumbsUp || 0);
            const bReactions = (b.reactionCounts?.heart || 0) + (b.reactionCounts?.thumbsUp || 0);
            return bReactions - aReactions;
          });
          setMostReadArticles(sortedByReactions.slice(0, 4).map(mapArticleToNewsItem));
          
          // Criar lista de artigos mais comentados
          const sortedByComments = [...allWithReactions].sort((a, b) => {
            return (b.commentCount || 0) - (a.commentCount || 0);
          });
          setMostCommentedArticles(sortedByComments.slice(0, 4).map(mapArticleToNewsItem));
        }
      } catch (error) {
        console.error('Erro ao buscar artigos:', error);
      } finally {
        setLoading(false);
      }
    };

    // Buscar categorias
    const fetchCategories = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchActiveLayout();
    fetchArticles();
    fetchCategories();
  }, [searchQuery]);

  // Add effect to set default layout state based on layout content
  useEffect(() => {
    if (layout && layout.length > 0) {
      setShowDefaultLayout(false);
    }
  }, [layout]);

  // Função atualizada para salvar o layout
  const handleLayoutSave = async (savedLayout: any[]) => {
    console.log('[DEBUG] Layout recebido para salvar:', savedLayout);
    
    // Update local layout state
    setLayout(savedLayout);
    
    // Set to show custom layout, not default
    setShowDefaultLayout(false);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      // First get the active layout to check if it exists
      console.log('[DEBUG] Verificando layout ativo existente...');
      const getResponse = await fetch(`${apiUrl}/api/page-layouts/active`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const layoutData = await getResponse.json();
      console.log('[DEBUG] Layout atual recuperado:', layoutData);
      
      // Choose correct method (POST for new, PUT for update)
      const method = layoutData && layoutData.id ? 'PUT' : 'POST';
      const url = layoutData && layoutData.id 
        ? `${apiUrl}/api/page-layouts/${layoutData.id}`
        : `${apiUrl}/api/page-layouts`;
        
      console.log(`[DEBUG] Enviando requisição ${method} para ${url}`);
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: 'Layout Atual',
          layout: savedLayout,
          isActive: true
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao salvar layout: ${response.status} ${response.statusText}`);
      }
      
      const savedData = await response.json();
      console.log('[DEBUG] Layout salvo com sucesso:', savedData);
      
      // Force reload after save to ensure layout is properly loaded from server
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      toast({
        title: "Layout salvo",
        description: "O layout foi salvo com sucesso e a página será recarregada.",
      });
    } catch (error) {
      console.error('[DEBUG] Erro ao salvar layout:', error);
      
      toast({
        variant: "destructive",
        title: "Erro ao salvar layout",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar o layout",
      });
    }
  };

  // Adicionar useEffect para logs
  useEffect(() => {
    console.log('Layout atual:', layout);
    console.log('Mostrar layout padrão:', showDefaultLayout);
  }, [layout, showDefaultLayout]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <SiteTitle />
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar notícias..."
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery || ''}
                onChange={(e) => {
                  const newQuery = e.target.value;
                  searchParams.set('search', newQuery);
                  window.location.search = `?${searchParams.toString()}`;
                }}
              />
              {searchQuery && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    searchParams.delete('search');
                    window.location.search = `?${searchParams.toString()}`;
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-primary hover:underline">
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    setIsEditMode(!isEditMode);
                    // Se estiver saindo do modo de edição, voltar para o layout padrão
                    if (isEditMode) {
                      setShowDefaultLayout(true);
                    }
                  }}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    isEditMode 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {isEditMode ? 'Sair do modo edição' : 'Editar Layout'}
                </button>
                {isEditMode && (
                  <>
                    <button
                      onClick={() => {
                        const newValue = !showDefaultLayout;
                        console.log('Mudando para mostrar layout padrão:', newValue);
                        setShowDefaultLayout(newValue);
                      }}
                      className="px-3 py-1.5 rounded text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      {showDefaultLayout ? 'Ver layout personalizado' : 'Ver layout padrão'}
                    </button>
                    <Link to="/admin/article/new" className="text-purple-600 hover:text-purple-800 hover:underline font-medium">
                      Criar um novo artigo
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          isAuthenticated && isAdmin && isEditMode ? (
            // Admin in edit mode
            <DynamicLayout
              layout={layout}
              isEditMode={true}
              onLayoutChange={setLayout}
              onSave={handleLayoutSave}
            />
          ) : showDefaultLayout ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                <div className="md:col-span-8">
                  {/* Featured News - 1 large, 2 small */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Destaques</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      {/* Left side - one large article */}
                      <div className="lg:col-span-5 flex">
                        {featuredNews.length > 0 && (
                          <div className="w-full h-full rounded-lg overflow-hidden shadow-md">
                            <NewsCard article={featuredNews[0]} />
                          </div>
                        )}
                      </div>
                      
                      {/* Right side - two smaller articles */}
                      <div className="lg:col-span-7">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                          {featuredNews.slice(1, 3).map((article, i) => (
                            <div key={article.id} className="h-full rounded-lg overflow-hidden shadow-md">
                              <NewsCard article={article} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Latest News Grid */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Últimas Notícias</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {allArticles.slice(0, 6).map((article, i) => (
                        <div key={article.id} className="rounded-lg overflow-hidden shadow-md">
                          <NewsCard article={article} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4">
                  {/* Sidebar - Mais Lidos */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <span className="text-purple-600 mr-2">↗</span> Mais Lidos
                    </h2>
                    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                      <div className="space-y-3">
                        {mostReadArticles.map((article) => (
                          <div key={article.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                            <Link to={`/article/${article.id}`} className="hover:text-primary flex items-center gap-2">
                              <div className="w-12 h-12 flex-shrink-0">
                                <img 
                                  src={article.imageUrl} 
                                  alt={article.title} 
                                  className="w-full h-full object-cover rounded-full"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-sm line-clamp-2">{article.title}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                  <span className="flex items-center">
                                    <Heart className="h-3 w-3 mr-1" />
                                    {article.likes || 0}
                                  </span>
                                  <span className="flex items-center">
                                    <MessageCircle className="h-3 w-3 mr-1" />
                                    {article.comments || 0}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar - Mais Comentados */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <span className="text-purple-600 mr-2">💬</span> Mais Comentados
                    </h2>
                    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                      <div className="space-y-3">
                        {mostCommentedArticles.map((article) => (
                          <div key={article.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                            <Link to={`/article/${article.id}`} className="hover:text-primary flex items-center gap-2">
                              <div className="w-12 h-12 flex-shrink-0">
                                <img 
                                  src={article.imageUrl} 
                                  alt={article.title} 
                                  className="w-full h-full object-cover rounded-full"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-sm line-clamp-2">{article.title}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                  <span className="flex items-center">
                                    <Heart className="h-3 w-3 mr-1" />
                                    {article.likes || 0}
                                  </span>
                                  <span className="flex items-center">
                                    <MessageCircle className="h-3 w-3 mr-1" />
                                    {article.comments || 0}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Custom layout in view mode for everyone
            <DynamicLayout
              layout={layout}
              isEditMode={false}
            />
          )
        )}

        <ScrollToTop />
      </div>
    </Layout>
  );
};

export default Index;
