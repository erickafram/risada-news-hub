
import React from 'react';
import NewsCard, { NewsItem } from './NewsCard';

interface NewsGridProps {
  title: string;
  news: NewsItem[];
}

const NewsGrid: React.FC<NewsGridProps> = ({ title, news }) => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-purple-600">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((newsItem) => (
          <NewsCard key={newsItem.id} news={newsItem} />
        ))}
      </div>
    </section>
  );
};

export default NewsGrid;
