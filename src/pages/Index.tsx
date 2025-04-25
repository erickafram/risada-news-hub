
import React from 'react';
import Layout from '@/components/layout/Layout';
import FeaturedNews from '@/components/news/FeaturedNews';
import NewsGrid from '@/components/news/NewsGrid';
import { mockFeaturedNews, mockTechnologyNews, mockBusinessNews, mockPoliticsNews } from '@/data/mockNewsData';

const Index = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-risada">Risada News Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted source for the latest news and stories from around the world.
            Stay informed with our comprehensive coverage of global events.
          </p>
        </section>

        {/* Featured News */}
        <FeaturedNews featuredNews={mockFeaturedNews} />

        {/* Technology News */}
        <NewsGrid title="Technology" news={mockTechnologyNews} />

        {/* Business News */}
        <NewsGrid title="Business" news={mockBusinessNews} />

        {/* Politics News */}
        <NewsGrid title="Politics" news={mockPoliticsNews} />
      </div>
    </Layout>
  );
};

export default Index;
