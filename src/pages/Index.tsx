
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import NewsCard from '@/components/news/NewsCard';
import { useAuth } from '@/contexts/AuthContext';
import { NewsItem } from '@/components/news/NewsCard';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [newsByCategory, setNewsByCategory] = useState<{[key: string]: NewsItem[]}>({});
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
    likes: 0,
    comments: 0
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

  // Buscar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        console.log('Tentando conectar à API em:', apiUrl);
        
        const response = await fetch(`${apiUrl}/api/categories`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar categorias: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Categorias carregadas:', data);
        setCategories(data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        setLoading(false); // Parar o carregamento mesmo com erro
      }
    };

    fetchCategories();
  }, []);

  // Buscar artigos em destaque e por categoria
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
        // Buscar artigos em destaque (os mais recentes)
        const featuredResponse = await fetch(`${apiUrl}/api/articles?limit=4`);
        if (!featuredResponse.ok) {
          throw new Error(`Erro ao buscar artigos em destaque: ${featuredResponse.status}`);
        }
        
        const featuredData = await featuredResponse.json();
        console.log('Artigos em destaque:', featuredData);
        if (featuredData.articles && Array.isArray(featuredData.articles)) {
          setFeaturedNews(featuredData.articles.map(mapArticleToNewsItem));
        }

        // Buscar artigos por categoria
        const categoryNewsMap: {[key: string]: NewsItem[]} = {};
        
        for (const category of categories) {
          const response = await fetch(`${apiUrl}/api/articles?category=${category.id}&limit=3`);
          if (response.ok) {
            const data = await response.json();
            if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
              categoryNewsMap[category.name] = data.articles.map(mapArticleToNewsItem);
            }
          }
        }
        
        setNewsByCategory(categoryNewsMap);
      } catch (error) {
        console.error('Erro ao buscar artigos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchArticles();
    } else {
      setLoading(false); // Garantir que o loading pare mesmo se não houver categorias
    }
  }, [categories]);

  return (
    <Layout>
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
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">
                  Destaques
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {featuredNews.length > 0 && (
                    <div className="lg:col-span-2 h-full">
                      <NewsCard news={featuredNews[0]} featured={true} />
                    </div>
                  )}
                  <div className="lg:col-span-2 grid grid-cols-1 gap-4">
                    {featuredNews.slice(1, 4).map((news) => (
                      <NewsCard key={news.id} news={news} compact={true} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* News by Category */}
            {Object.entries(newsByCategory).map(([categoryName, articles]) => (
              <section className="mb-12" key={categoryName}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">
                  {categoryName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((news) => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
              </section>
            ))}

            {/* Show message if no news */}
            {featuredNews.length === 0 && Object.keys(newsByCategory).length === 0 && (
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
