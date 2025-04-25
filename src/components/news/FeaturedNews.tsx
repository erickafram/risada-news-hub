
import React from 'react';
import NewsCard, { NewsItem } from './NewsCard';

interface FeaturedNewsProps {
  featuredNews: NewsItem[];
}

const FeaturedNews: React.FC<FeaturedNewsProps> = ({ featuredNews }) => {
  // Get the first news item as the main featured
  const mainFeatured = featuredNews[0];
  // Get the next 2 news items
  const secondaryFeatured = featuredNews.slice(1, 3);

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-risada pb-2 border-b border-gray-200">
        Featured Stories
      </h2>
      <div className="grid gap-6">
        {mainFeatured && (
          <div className="mb-6">
            <NewsCard news={mainFeatured} featured={true} />
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {secondaryFeatured.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews;
