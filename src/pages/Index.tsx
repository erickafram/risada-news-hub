import React from 'react';
import Layout from '@/components/layout/Layout';
import NewsCard from '@/components/news/NewsCard';
import { mockFeaturedNews, mockTechnologyNews, mockBusinessNews, mockPoliticsNews } from '@/data/mockNewsData';

const Index = () => {
  // Combine all news items into a single array
  const allNews = [...mockTechnologyNews, ...mockBusinessNews, ...mockPoliticsNews];
  // Get first 4 items for featured section
  const featuredNews = mockFeaturedNews.slice(0, 4);
  // Rest of the news for the list
  const newsList = allNews.slice(0, 12); // Limiting to 12 items for the list

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Risada Fun
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your daily dose of entertainment and fun stories from around the world!
          </p>
        </section>

        {/* Featured News Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-600">Featured Stories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>

        {/* News List */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-600">Latest News</h2>
          <div className="space-y-6">
            {newsList.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    />
                  </div>
                  <div className="md:w-3/4 p-6">
                    <span className="text-purple-600 text-sm font-medium mb-2 inline-block">
                      {news.category}
                    </span>
                    <h3 className="text-xl font-bold mb-2 hover:text-purple-600 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{news.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{new Date(news.publishedAt).toLocaleDateString()}</span>
                      <button className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
