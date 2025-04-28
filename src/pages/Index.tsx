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

  // Buscar artigos
  useEffect(() => {
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

    fetchArticles();
  }, [searchQuery]);

  return (
    <Layout>
      <SiteTitle />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando notícias...</span>
          </div>
        ) : (
          <>
            {/* Removida a seção Hero com o título do site */}

            {/* Mostrar título de pesquisa se houver uma consulta */}
            {searchQuery && (
              <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 w-1 h-8 rounded mr-3"></span>
                  Resultados da pesquisa: "{searchQuery}"
                </h1>
                <p className="text-gray-600">
                  {allArticles.length === 0 
                    ? "Nenhum resultado encontrado. Tente outra pesquisa." 
                    : `Encontramos ${allArticles.length} resultado${allArticles.length !== 1 ? 's' : ''}.`}
                </p>
              </div>
            )}

            {/* Featured News Grid - mostrar apenas se não for uma pesquisa */}
            {!searchQuery && featuredNews.length > 0 && (
              <section className="mb-12">
                {/* Removido o título "Destaques" */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden rounded-xl shadow-md">
                  {/* Notícia principal em destaque */}
                  {featuredNews.length > 0 && (
                    <div className="lg:col-span-8 relative group">
                      <Link to={`/article/${featuredNews[0].id}`} className="block relative overflow-hidden h-[450px]">
                        <img 
                          src={featuredNews[0].imageUrl} 
                          alt={featuredNews[0].title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <div className="mb-2">
                            <span className="bg-purple-600 text-white text-xs font-medium px-2.5 py-1 rounded">
                              {featuredNews[0].category}
                            </span>
                            <span className="ml-2 text-xs opacity-75">
                              {new Date(featuredNews[0].publishedAt).toLocaleDateString('pt-BR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <h2 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-3 hover:text-purple-300 transition-colors">
                            {featuredNews[0].title}
                          </h2>
                          <p className="text-gray-200 line-clamp-2 mb-3">{featuredNews[0].excerpt}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {featuredNews[0].likes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {featuredNews[0].comments || 0}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                  
                  {/* Notícias secundárias */}
                  <div className="lg:col-span-4 grid grid-rows-2 gap-4">
                    {featuredNews.slice(1, 3).map((news, index) => (
                      <Link key={news.id} to={`/article/${news.id}`} className="relative group overflow-hidden h-[220px] block">
                        <img 
                          src={news.imageUrl} 
                          alt={news.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <div className="mb-1">
                            <span className="bg-purple-600 text-white text-xs font-medium px-2 py-0.5 rounded">
                              {news.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold line-clamp-2 hover:text-purple-300 transition-colors">
                            {news.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Layout principal com conteúdo e sidebar */}
            {!searchQuery && (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Conteúdo principal (70%) */}
                <div className="lg:w-[70%]">
                  {/* All Articles */}
                  {allArticles.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                        <Newspaper className="mr-2 h-5 w-5 text-purple-600" />
                        Últimas Notícias
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {allArticles.map((news) => (
                          <NewsCard key={news.id} news={news} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* Sidebar (30%) */}
                {(mostReadArticles.length > 0 || mostCommentedArticles.length > 0) && (
                  <div className="lg:w-[30%]">
                    {/* Most Read Articles */}
                    {mostReadArticles.length > 0 && (
                      <div className="border border-gray-100 rounded-lg p-6 mb-8 shadow-sm bg-white hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                          <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
                          Mais Lidos
                        </h3>
                        <div className="space-y-4">
                          {mostReadArticles.map((news) => (
                            <NewsCard key={news.id} news={news} compact={true} sidebar={true} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Most Commented Articles */}
                    {mostCommentedArticles.length > 0 && (
                      <div className="border border-gray-100 rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                          <MessageSquare className="mr-2 h-5 w-5 text-purple-600" />
                          Mais Comentados
                        </h3>
                        <div className="space-y-4">
                          {mostCommentedArticles.map((news) => (
                            <NewsCard key={news.id} news={news} compact={true} sidebar={true} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Resultados da pesquisa */}
            {searchQuery && allArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allArticles.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            )}

            {/* Show message if no news */}
            {featuredNews.length === 0 && allArticles.length === 0 && (
              <div className="text-center py-12 border border-gray-100 rounded-lg shadow-sm bg-white">
                <Newspaper className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Nenhuma notícia disponível</h2>
                <p className="text-gray-600">Volte mais tarde para conferir as novidades!</p>
                {isAdmin && (
                  <p className="mt-4">
                    <Link to="/admin/article/new" className="text-purple-600 hover:text-purple-800 hover:underline font-medium">
                      Criar um novo artigo
                    </Link>
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Botão para voltar ao topo */}
      <ScrollToTop />
    </Layout>
  );
};

export default Index;
