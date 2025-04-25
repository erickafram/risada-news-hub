
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
}

const NewsCard: React.FC<NewsCardProps> = ({ news, featured, compact, list }) => {
  const formattedDate = new Date(news.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const imageHeight = featured ? 'h-[400px]' : compact ? 'h-[195px]' : list ? 'h-48' : 'h-48';

  return (
    <Card className={`overflow-hidden border-0 shadow-none ${list ? 'flex' : ''}`}>
      <div className={`relative ${imageHeight} ${list ? 'w-1/3' : 'w-full'}`}>
        <img
          src={news.imageUrl}
          alt={news.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
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
      </div>
      <CardContent className={`p-4 ${list ? 'w-2/3' : 'w-full'}`}>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
            {news.category}
          </Badge>
          <span className="text-sm text-gray-600">{formattedDate}</span>
        </div>
        <Link to={`/article/${news.id}`}>
          <h3 className={`${featured ? 'text-xl' : 'text-lg'} font-bold mb-2 text-gray-800`}>
            {news.title}
          </h3>
        </Link>
        {!compact && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{news.excerpt}</p>
        )}
        <span className="text-sm text-gray-500">{news.source}</span>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
