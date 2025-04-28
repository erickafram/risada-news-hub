import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
  likes?: number;
  comments?: number;
}

interface NewsCardProps {
  news: NewsItem;
  featured?: boolean;
  compact?: boolean;
  list?: boolean;
  sidebar?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, featured, compact, list, sidebar }) => {
  const formattedDate = new Date(news.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const imageHeight = featured ? 'h-[500px]' : compact ? (sidebar ? 'h-[100px]' : 'h-[180px]') : 'h-[220px]';

  return (
    <Card className={`overflow-hidden border-0 shadow-none ${sidebar ? 'flex gap-3' : ''}`}>
      <Link to={`/article/${news.id}`} className={`block ${sidebar ? 'w-1/3 flex-shrink-0' : ''}`}>
        <div className={`relative ${imageHeight} cursor-pointer transition-transform hover:scale-[1.02] duration-300`}>
          <img
            src={news.imageUrl}
            alt={news.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {!sidebar && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <div className="flex gap-4 text-white">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {news.likes || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {news.comments || 0}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
      <CardContent className={`p-4 ${sidebar ? 'p-0 w-2/3 flex-grow' : ''}`}>
        {!sidebar && (
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
              {news.category}
            </Badge>
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>
        )}
        <Link to={`/article/${news.id}`}>
          <h3 
            className={`font-bold mb-2 text-gray-800 line-clamp-2 ${
              featured ? 'text-2xl' : sidebar ? 'text-sm' : compact ? 'text-lg' : 'text-xl'
            }`}
          >
            {news.title}
          </h3>
        </Link>
        {!compact && !sidebar && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">{news.excerpt}</p>
        )}
        {!sidebar && (
          <span className="text-sm text-gray-500">{news.source}</span>
        )}
        {sidebar && (
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {news.likes || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {news.comments || 0}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsCard;
