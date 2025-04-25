
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

  const imageHeight = featured ? 'h-[500px]' : compact ? 'h-32' : list ? 'h-64' : 'h-48';
  const titleSize = featured ? 'text-3xl' : compact ? 'text-base' : 'text-xl';

  return (
    <Card className={`group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white ${list ? 'flex' : ''}`}>
      <div className={`relative ${imageHeight} ${list ? 'w-1/3' : 'w-full'}`}>
        <img
          src={news.imageUrl}
          alt={news.title}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
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
          <Badge variant="outline" className="bg-purple-100 text-purple-600 border-purple-200">
            {news.category}
          </Badge>
          <span className="text-sm text-gray-600">{formattedDate}</span>
        </div>
        <Link to={`/article/${news.id}`}>
          <h3 className={`${titleSize} font-bold mb-2 hover:text-purple-600 transition-colors line-clamp-2`}>
            {news.title}
          </h3>
        </Link>
        {!compact && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{news.excerpt}</p>
        )}
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
