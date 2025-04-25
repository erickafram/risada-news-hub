
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

const NewsCard: React.FC<NewsCardProps> = ({ news, featured = false }) => {
  const formattedDate = new Date(news.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (featured) {
    return (
      <Card className="news-card overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-full">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-purple-100 text-purple-600 border-purple-200">
                  {news.category}
                </Badge>
                <span className="text-sm text-gray-600">{formattedDate}</span>
              </div>
              <Link to={`/article/${news.id}`}>
                <h2 className="text-2xl font-bold mb-3 hover:text-purple-600 transition-colors line-clamp-2">{news.title}</h2>
              </Link>
              <p className="text-gray-600 line-clamp-3 mb-4">{news.excerpt}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Source: {news.source}</span>
              <Link
                to={`/article/${news.id}`}
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                Read More
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="news-card overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full bg-gradient-to-br from-white to-purple-50">
      <div className="relative h-48">
        <img
          src={news.imageUrl}
          alt={news.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-purple-100 text-purple-600 border-purple-200 text-xs">
            {news.category}
          </Badge>
          <span className="text-xs text-gray-600">{formattedDate}</span>
        </div>
        <Link to={`/article/${news.id}`}>
          <h3 className="text-lg font-bold mb-2 hover:text-purple-600 transition-colors line-clamp-2">{news.title}</h3>
        </Link>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{news.excerpt}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Source: {news.source}</span>
          <Link
            to={`/article/${news.id}`}
            className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            Read More
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
