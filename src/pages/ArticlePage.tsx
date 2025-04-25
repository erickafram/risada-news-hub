
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  featuredImage: string;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  author?: {
    id: number;
    fullName: string;
  };
}

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{ text: string; date: Date }>>([]);
  
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${id}`);
        
        if (!response.ok) {
          throw new Error('Artigo não encontrado');
        }
        
        const data = await response.json();
        setArticle(data);
        setLikesCount(Math.floor(Math.random() * 50)); // Simulando contagem de likes
      } catch (error) {
        console.error('Erro ao buscar artigo:', error);
        setError(error instanceof Error ? error.message : 'Erro ao buscar artigo');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchArticle();
    }
  }, [id]);

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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-medium">Carregando artigo...</h2>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Artigo não encontrado</h1>
            <p className="text-gray-600 mb-6">{error || 'O artigo solicitado não está disponível.'}</p>
            <Link to="/" className="inline-flex items-center text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-4xl mx-auto mb-6">
          <Link to="/" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
          </Link>
        </div>
        
        <Card className="overflow-hidden border-0 shadow-lg max-w-4xl mx-auto bg-white/80 backdrop-blur-sm">
          {article.featuredImage && (
            <div className="relative h-96">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              {article.category && (
                <Link to={`/category/${article.category.slug}`}>
                  <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                    {article.category.name}
                  </Badge>
                </Link>
              )}
              <span className="text-sm text-gray-500">
                {new Date(article.publishedAt || article.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              {article.title}
            </h1>
            
            {article.author && (
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold mr-3">
                  {article.author.fullName.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Por {article.author.fullName}
                </span>
              </div>
            )}
            
            {article.summary && (
              <p className="text-lg leading-relaxed text-gray-700 mb-6 font-medium italic">
                {article.summary}
              </p>
            )}
            
            <div className="prose max-w-none text-gray-700 mb-8" 
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

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
