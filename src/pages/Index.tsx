
import React from 'react';
import Layout from '@/components/layout/Layout';
import NewsCard from '@/components/news/NewsCard';
import { mockFeaturedNews, mockTechnologyNews, mockBusinessNews, mockPoliticsNews } from '@/data/mockNewsData';

const Index = () => {
  const allNews = [...mockTechnologyNews, ...mockBusinessNews, ...mockPoliticsNews];
  const featuredNews = mockFeaturedNews.slice(0, 4);
  const newsList = allNews.slice(0, 12);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Featured News Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 lg:col-span-2 row-span-2">
              <NewsCard news={featuredNews[0]} featured={true} />
            </div>
            <div className="space-y-6">
              {featuredNews.slice(1, 4).map((news) => (
                <NewsCard key={news.id} news={news} compact={true} />
              ))}
            </div>
          </div>
        </section>

        {/* News List */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-600">Latest News</h2>
          <div className="grid gap-6">
            {newsList.map((news) => (
              <NewsCard key={news.id} news={news} list={true} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
