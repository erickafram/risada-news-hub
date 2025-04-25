
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle } from 'lucide-react';
import { mockTechnologyNews, mockBusinessNews, mockPoliticsNews, mockFeaturedNews } from '@/data/mockNewsData';

const ArticlePage = () => {
  const { id } = useParams();
  const allNews = [...mockFeaturedNews, ...mockTechnologyNews, ...mockBusinessNews, ...mockPoliticsNews];
  const article = allNews.find(news => news.id === id);
  
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 100));
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{ text: string; date: Date }>>([]);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments(prev => [...prev, { text: comment, date: new Date() }]);
      setComment('');
    }
  };

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">Article not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8 animate-fade-in">
        <Card className="overflow-hidden border-0 shadow-lg max-w-4xl mx-auto bg-white/80 backdrop-blur-sm">
          <div className="relative h-96">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {article.title}
            </h1>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-600">
                Published on {new Date(article.publishedAt).toLocaleDateString()}
              </span>
              <span className="text-sm font-medium text-purple-600">
                Source: {article.source}
              </span>
            </div>
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              {article.excerpt}
            </p>
            <div className="prose max-w-none text-gray-700 mb-8">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <Button
                variant="ghost"
                className={`flex items-center gap-2 ${liked ? 'text-pink-600' : 'text-gray-600'}`}
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                {likesCount} Likes
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-600"
                onClick={() => document.getElementById('comment-input')?.focus()}
              >
                <MessageCircle className="h-5 w-5" />
                {comments.length} Comments
              </Button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold mb-4">Comments</h3>
              <form onSubmit={handleComment} className="mb-6">
                <Textarea
                  id="comment-input"
                  placeholder="Share your thoughts..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-2"
                />
                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  Post Comment
                </Button>
              </form>

              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{comment.text}</p>
                    <span className="text-sm text-gray-500 mt-2 block">
                      {comment.date.toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </article>
    </Layout>
  );
};

export default ArticlePage;
