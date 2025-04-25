
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import NewsCard from '@/components/news/NewsCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { mockFeaturedNews, mockTechnologyNews, mockBusinessNews, mockPoliticsNews } from '@/data/mockNewsData';

const Index = () => {
  const allNews = [...mockTechnologyNews, ...mockBusinessNews, ...mockPoliticsNews];
  const featuredNews = mockFeaturedNews.slice(0, 4);
  const newsList = allNews.slice(0, 12);
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          {isAuthenticated ? (
            isAdmin ? (
              <Link to="/admin">
                <Button>Painel Admin</Button>
              </Link>
            ) : (
              <Link to="/profile">
                <Button>Meu Perfil</Button>
              </Link>
            )
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>

        {/* Featured News Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 h-full">
              <NewsCard news={featuredNews[0]} featured={true} />
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 gap-4">
              {featuredNews.slice(1, 4).map((news) => (
                <NewsCard key={news.id} news={news} compact={true} />
              ))}
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">
            Últimas Notícias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
