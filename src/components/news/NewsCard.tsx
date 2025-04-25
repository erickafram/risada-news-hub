
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
}

interface NewsCardProps {
  news: NewsItem;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const formattedDate = new Date(news.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
      <div className="relative h-48">
        <img
          src={news.imageUrl}
          alt={news.title}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-purple-100 text-purple-600 border-purple-200">
            {news.category}
          </Badge>
          <span className="text-sm text-gray-600">{formattedDate}</span>
        </div>
        <Link to={`/article/${news.id}`}>
          <h3 className="text-lg font-bold mb-2 hover:text-purple-600 transition-colors line-clamp-2">
            {news.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{news.excerpt}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Source: {news.source}</span>
          <Link
            to={`/article/${news.id}`}
            className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            Read More
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
