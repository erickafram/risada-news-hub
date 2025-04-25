
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { mockTechnologyNews, mockBusinessNews, mockPoliticsNews, mockFeaturedNews } from '@/data/mockNewsData';

const ArticlePage = () => {
  const { id } = useParams();
  const allNews = [...mockFeaturedNews, ...mockTechnologyNews, ...mockBusinessNews, ...mockPoliticsNews];
  const article = allNews.find(news => news.id === id);

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">Article not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8 animate-fade-in">
        <Card className="overflow-hidden border-0 shadow-lg max-w-4xl mx-auto">
          <div className="relative h-96">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {article.title}
            </h1>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-600">
                Published on {new Date(article.publishedAt).toLocaleDateString()}
              </span>
              <span className="text-sm font-medium text-purple-600">
                Source: {article.source}
              </span>
            </div>
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              {article.excerpt}
            </p>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              {/* Aqui você adicionaria o conteúdo completo do artigo */}
            </div>
          </div>
        </Card>
      </article>
    </Layout>
  );
};

export default ArticlePage;
