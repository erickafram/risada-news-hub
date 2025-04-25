
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import NewsGrid from '@/components/news/NewsGrid';
import { mockTechnologyNews, mockBusinessNews, mockPoliticsNews } from '@/data/mockNewsData';

const CategoryPage = () => {
  const { category } = useParams();

  const getCategoryNews = () => {
    switch (category) {
      case 'technology':
        return { title: 'Notícias de Tecnologia', news: mockTechnologyNews };
      case 'business':
        return { title: 'Notícias de Negócios', news: mockBusinessNews };
      case 'politics':
        return { title: 'Notícias de Política', news: mockPoliticsNews };
      default:
        return { title: 'Notícias da Categoria', news: [] };
    }
  };

  const { title, news } = getCategoryNews();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <NewsGrid title="Últimas Histórias" news={news} />
      </div>
    </Layout>
  );
};

export default CategoryPage;
