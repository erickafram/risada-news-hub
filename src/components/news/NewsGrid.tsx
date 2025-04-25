
import React from 'react';
import NewsCard, { NewsItem } from './NewsCard';

interface NewsGridProps {
  title: string;
  news: NewsItem[];
}

const NewsGrid: React.FC<NewsGridProps> = ({ title, news }) => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-risada pb-2 border-b border-gray-200">
        {title}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </section>
  );
};

export default NewsGrid;
