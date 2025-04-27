
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import NewsCard from '@/components/news/NewsCard';
import { useAuth } from '@/contexts/AuthContext';
import { NewsItem } from '@/components/news/NewsCard';
import { Loader2 } from 'lucide-react';
import SiteTitle from '@/components/SiteTitle';

const Index = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [allArticles, setAllArticles] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string, slug: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();
  
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

        // Buscar todos os artigos começando pela página 2 (pulando os 3 primeiros)
        const allArticlesResponse = await fetch(`${apiUrl}/api/articles?page=2&limit=30`);
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
          setAllArticles(allWithReactions.map(mapArticleToNewsItem));
        }
      } catch (error) {
        console.error('Erro ao buscar artigos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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
            {/* Featured News Grid */}
            {featuredNews.length > 0 && (
              <section className="mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {featuredNews.length > 0 && (
                    <div className="lg:col-span-2 h-full">
                      <NewsCard news={featuredNews[0]} featured={true} />
                    </div>
                  )}
                  <div className="lg:col-span-2 grid grid-cols-1 gap-4">
                    {featuredNews.slice(1, 3).map((news) => (
                      <NewsCard key={news.id} news={news} compact={true} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* All Articles */}
            {allArticles.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">
                  Todas as Notícias
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allArticles.map((news) => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
              </section>
            )}

            {/* Show message if no news */}
            {featuredNews.length === 0 && allArticles.length === 0 && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Nenhuma notícia disponível</h2>
                <p className="text-gray-600">Volte mais tarde para conferir as novidades!</p>
                {isAdmin && (
                  <p className="mt-4">
                    <a href="/admin/article/new" className="text-primary hover:underline">Criar um novo artigo</a>
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
