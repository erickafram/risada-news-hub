import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Loader2, ArrowLeft, ThumbsUp, Angry, Laugh, Frown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReCAPTCHA from 'react-google-recaptcha';

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

interface CommentType {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    fullName: string;
  };
  parent_id: number | null;
}

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [reaction, setReaction] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState({
    heart: 0,
    thumbsUp: 0,
    laugh: 0,
    angry: 0,
    sad: 0
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentType[]>([]);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Verificar se o usuário está autenticado
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        setAuthToken(token);
      }
      setAuthChecked(true);
    };
    
    checkAuth();
  }, []);

  // Buscar o artigo e as reações
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/articles/${id}`);
        
        if (!response.ok) {
          throw new Error('Artigo não encontrado');
        }
        
        const data = await response.json();
        setArticle(data);
        
        // Buscar contagem real de reações
        await fetchReactionCounts();
        
        // Buscar comentários do artigo
        await fetchComments();
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

  // Buscar a reação do usuário quando autenticado
  useEffect(() => {
    const fetchUserReaction = async () => {
      if (!isAuthenticated || !authChecked || !id || !authToken) return;
      
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/reactions/user/${id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.hasReaction) {
            setReaction(data.reactionType);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar reação do usuário:', error);
      }
    };
    
    fetchUserReaction();
  }, [id, isAuthenticated, authChecked, authToken]);

  // Função para buscar comentários do artigo
  const fetchComments = async () => {
    if (!id) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/comments/article/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[FRONTEND] Comentários recebidos do servidor:', data);
        setComments(data);
      } else {
        console.error('[FRONTEND] Erro ao buscar comentários. Status:', response.status);
        setComments([]);
      }
    } catch (error) {
      console.error('[FRONTEND] Erro ao buscar comentários:', error);
      setComments([]);
    }
  };

  // Função para buscar contagem de reações
  const fetchReactionCounts = async () => {
    if (!id) return;
    
    console.log('[FRONTEND] Iniciando busca de contagens para artigo:', id);
    console.log('[FRONTEND] Contagens atuais no estado:', reactionCounts);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const url = `${apiUrl}/api/reactions/count/${id}`;
      console.log('[FRONTEND] Chamando API:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[FRONTEND] Contagem de reações recebida do servidor:', data);
        
        // Verificar se há diferenças entre o estado atual e os novos dados
        const differences = {};
        let hasDifferences = false;
        
        Object.keys(data).forEach(key => {
          if (data[key] !== reactionCounts[key as keyof typeof reactionCounts]) {
            // @ts-ignore
            differences[key] = {
              old: reactionCounts[key as keyof typeof reactionCounts],
              new: data[key]
            };
            hasDifferences = true;
          }
        });
        
        if (hasDifferences) {
          console.log('[FRONTEND] Diferenças detectadas entre estado atual e novos dados:', differences);
        } else {
          console.log('[FRONTEND] Nenhuma diferença detectada entre estado atual e novos dados');
        }
        
        setReactionCounts(data);
      } else {
        console.error('[FRONTEND] Erro ao buscar contagem de reações. Status:', response.status);
        // Definir contagens como zero em caso de erro
        setReactionCounts({
          heart: 0,
          thumbsUp: 0,
          laugh: 0,
          angry: 0,
          sad: 0
        });
      }
    } catch (error) {
      console.error('[FRONTEND] Erro ao buscar contagem de reações:', error);
      // Definir contagens como zero em caso de erro
      setReactionCounts({
        heart: 0,
        thumbsUp: 0,
        laugh: 0,
        angry: 0,
        sad: 0
      });
    }
  };

  const handleReaction = async (type: string) => {
    if (!isAuthenticated) {
      // Redirecionar para a página de login se não estiver autenticado
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    
    console.log(`[FRONTEND] Usuário clicou na reação: ${type}`);
    console.log(`[FRONTEND] Reação atual do usuário: ${reaction}`);
    console.log('[FRONTEND] Contagens atuais:', reactionCounts);
    
    try {
      // Atualizar a UI imediatamente para feedback visual rápido
      const oldReaction = reaction;
      const oldCounts = {...reactionCounts};
      
      // Se clicou no mesmo botão já selecionado, simula remoção
      if (oldReaction === type) {
        console.log(`[FRONTEND] Removendo reação existente: ${type}`);
        setReaction(null);
        setReactionCounts(prev => {
          const newCounts = {
            ...prev,
            [type]: Math.max(0, prev[type as keyof typeof prev] - 1)
          };
          console.log(`[FRONTEND] Nova contagem após remoção de ${type}:`, newCounts);
          return newCounts;
        });
      } else {
        // Se já tinha uma reação, simula decremento da anterior
        if (oldReaction) {
          console.log(`[FRONTEND] Trocando reação de ${oldReaction} para ${type}`);
          setReactionCounts(prev => {
            const newCounts = {
              ...prev,
              [oldReaction]: Math.max(0, prev[oldReaction as keyof typeof prev] - 1)
            };
            console.log(`[FRONTEND] Contagem após decrementar ${oldReaction}:`, newCounts);
            return newCounts;
          });
        } else {
          console.log(`[FRONTEND] Adicionando nova reação: ${type}`);
        }
        
        // Simula incremento da nova reação
        setReaction(type);
        setReactionCounts(prev => {
          const newCounts = {
            ...prev,
            [type]: prev[type as keyof typeof prev] + 1
          };
          console.log(`[FRONTEND] Contagem após incrementar ${type}:`, newCounts);
          return newCounts;
        });
      }
      
      // Enviar a reação para o servidor
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const url = `${apiUrl}/api/reactions/${id}`;
      console.log(`[FRONTEND] Enviando reação para o servidor: ${url}`, { reactionType: type });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ reactionType: type })
      });
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('[FRONTEND] Resposta do servidor:', responseData);
        
        // Buscar as contagens atualizadas do servidor após um pequeno atraso
        console.log('[FRONTEND] Aguardando 1 segundo para buscar contagens atualizadas...');
        setTimeout(() => {
          console.log('[FRONTEND] Buscando contagens atualizadas após reação');
          fetchReactionCounts();
        }, 1000); // Aumentando o atraso para garantir que o banco de dados foi atualizado
      } else {
        console.error('[FRONTEND] Erro na resposta do servidor:', response.status);
        // Reverter as alterações na UI se a requisição falhar
        console.log('[FRONTEND] Revertendo alterações locais devido a erro');
        setReaction(oldReaction);
        setReactionCounts(oldCounts);
        setTimeout(fetchReactionCounts, 500);
      }
    } catch (error) {
      console.error('[FRONTEND] Erro ao processar reação:', error);
      // Atualizar contagens em caso de erro
      fetchReactionCounts();
    }
  };

  // Função para enviar comentários para o backend
  // Função para lidar com a verificação do CAPTCHA
  const handleCaptchaChange = (value: string | null) => {
    console.log('[FRONTEND] CAPTCHA verificado:', value);
    setCaptchaValue(value);
    setIsCaptchaVerified(!!value);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // Redirecionar para a página de login se não estiver autenticado
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    
    if (!comment.trim()) {
      alert('Por favor, digite um comentário.');
      return;
    }
    
    if (!isCaptchaVerified) {
      alert('Por favor, verifique o CAPTCHA antes de enviar seu comentário.');
      return;
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/comments/article/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          content: comment,
          parentId: null,
          captchaToken: captchaValue
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('[FRONTEND] Comentário enviado com sucesso:', data);
        
        // Atualizar a lista de comentários
        await fetchComments();
        
        // Limpar o campo de comentário e resetar o CAPTCHA
        setComment('');
        setCaptchaValue(null);
        setIsCaptchaVerified(false);
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      } else {
        console.error('[FRONTEND] Erro ao enviar comentário. Status:', response.status);
        alert('Erro ao enviar comentário. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('[FRONTEND] Erro ao enviar comentário:', error);
      alert('Erro ao enviar comentário. Por favor, tente novamente.');
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
        
        <div className="overflow-hidden max-w-4xl mx-auto bg-white/80 backdrop-blur-sm">
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

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Button
                variant="ghost"
                className={`flex items-center gap-1 ${reaction === 'heart' ? 'text-pink-600 bg-pink-50' : 'text-gray-600'}`}
                onClick={() => handleReaction('heart')}
              >
                <Heart className={`h-5 w-5 ${reaction === 'heart' ? 'fill-current' : ''}`} />
                {reactionCounts.heart}
              </Button>
              
              <Button
                variant="ghost"
                className={`flex items-center gap-1 ${reaction === 'thumbsUp' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                onClick={() => handleReaction('thumbsUp')}
              >
                <ThumbsUp className={`h-5 w-5 ${reaction === 'thumbsUp' ? 'fill-current' : ''}`} />
                {reactionCounts.thumbsUp}
              </Button>
              
              <Button
                variant="ghost"
                className={`flex items-center gap-1 ${reaction === 'laugh' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-600'}`}
                onClick={() => handleReaction('laugh')}
              >
                <Laugh className={`h-5 w-5 ${reaction === 'laugh' ? 'fill-current' : ''}`} />
                {reactionCounts.laugh}
              </Button>
              
              <Button
                variant="ghost"
                className={`flex items-center gap-1 ${reaction === 'angry' ? 'text-red-600 bg-red-50' : 'text-gray-600'}`}
                onClick={() => handleReaction('angry')}
              >
                <Angry className={`h-5 w-5 ${reaction === 'angry' ? 'fill-current' : ''}`} />
                {reactionCounts.angry}
              </Button>
              
              <Button
                variant="ghost"
                className={`flex items-center gap-1 ${reaction === 'sad' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600'}`}
                onClick={() => handleReaction('sad')}
              >
                <Frown className={`h-5 w-5 ${reaction === 'sad' ? 'fill-current' : ''}`} />
                {reactionCounts.sad}
              </Button>
              
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-gray-600 ml-auto"
                onClick={() => document.getElementById('comment-input')?.focus()}
              >
                <MessageCircle className="h-5 w-5" />
                {comments.length} Comentários
              </Button>
            </div>

            <div className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Comentários</h3>
              
              {isAuthenticated ? (
                <form onSubmit={handleComment} className="mb-6">
                  <Textarea
                    id="comment-input"
                    placeholder="Compartilhe sua opinião..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-2"
                  />
                  <div className="mb-4 mt-2">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Chave de teste do reCAPTCHA
                      onChange={handleCaptchaChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">Este site é protegido por reCAPTCHA para evitar spam.</p>
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    disabled={!isCaptchaVerified}
                  >
                    Enviar Comentário
                  </Button>
                </form>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg mb-6 text-center">
                  <p className="text-gray-700 mb-4">Você precisa estar logado para comentar neste artigo.</p>
                  <Link to="/login" className="inline-block">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      Fazer Login
                    </Button>
                  </Link>
                </div>
              )}

              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold mr-2">
                          {comment.user && comment.user.fullName ? comment.user.fullName.charAt(0) : '?'}
                        </div>
                        <span className="font-medium">{comment.user && comment.user.fullName ? comment.user.fullName : 'Usuário'}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                      <span className="text-sm text-gray-500 mt-2 block">
                        {new Date(comment.created_at || new Date()).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default ArticlePage;
