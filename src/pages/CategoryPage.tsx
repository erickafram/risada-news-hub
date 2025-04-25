
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import NewsGrid from '@/components/news/NewsGrid';
import { NewsItem } from '@/components/news/NewsCard';
import { Loader2, ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams();
  const [categoryData, setCategoryData] = useState<{ id: number, name: string, slug: string } | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  
  useEffect(() => {
    const fetchCategoryAndNews = async () => {
      setLoading(true);
      try {
        // Buscar informações da categoria
        const categoryResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${category}`);
        
        if (!categoryResponse.ok) {
          throw new Error('Categoria não encontrada');
        }
        
        const categoryData = await categoryResponse.json();
        setCategoryData(categoryData);
        
        // Buscar artigos da categoria
        const articlesResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/articles?category=${categoryData.id}&limit=12`);
        
        if (articlesResponse.ok) {
          const data = await articlesResponse.json();
          setNews(data.articles.map(mapArticleToNewsItem));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar categoria ou artigos:', error);
        setError(error instanceof Error ? error.message : 'Erro ao buscar categoria');
        setLoading(false);
      }
    };
    
    if (category) {
      fetchCategoryAndNews();
    }
  }, [category]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-medium">Carregando categoria...</h2>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !categoryData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Categoria não encontrada</h1>
            <p className="text-gray-600 mb-6">{error || 'A categoria solicitada não está disponível.'}</p>
            <Link to="/" className="inline-flex items-center text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-6xl mx-auto mb-6">
          <Link to="/" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          {categoryData.name}
        </h1>
        
        {news.length > 0 ? (
          <NewsGrid title="Artigos nesta categoria" news={news} />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Nenhum artigo disponível</h2>
            <p className="text-gray-600">Não há artigos publicados nesta categoria ainda.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
