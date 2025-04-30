import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Loader2, ArrowLeft, ThumbsUp, Angry, Laugh, Frown, Bookmark, BookmarkCheck, Share2, Facebook, Twitter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReCAPTCHA from 'react-google-recaptcha';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Helmet } from 'react-helmet-async';
import { getShareFunctions } from '@/utils/metaTagsGenerator';

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

// Componente de botões de compartilhamento
const ShareButtons = ({ article, className = '' }: { article: Article, className?: string }) => {
  // Usa URL absoluta para garantir que o compartilhamento funcione corretamente
  const shareUrl = window.location.href;
  const title = article.title;
  const summary = article.summary || '';
  
  // Garante que a URL da imagem seja absoluta e use HTTPS
  let imageUrl = article.featuredImage || '';
  
  // Sempre usar o domínio principal para as imagens
  if (imageUrl) {
    // Extrai o caminho relativo da imagem, independente do formato da URL
    let relativePath = imageUrl;
    
    // Se a URL contiver o IP do servidor
    if (imageUrl.includes('167.172.152.174:3001')) {
      relativePath = imageUrl.replace('http://167.172.152.174:3001', '');
    } 
    // Se a URL já contiver o domínio principal
    else if (imageUrl.includes('memepmw.online')) {
      relativePath = imageUrl.replace(/https?:\/\/memepmw\.online/g, '');
    }
    
    // Garante que o caminho relativo comece com /
    if (!relativePath.startsWith('/')) {
      relativePath = '/' + relativePath;
    }
    
    // Constrói a URL absoluta final
    imageUrl = `https://memepmw.online${relativePath}`;
  } else {
    // Imagem padrão se não houver URL
    imageUrl = 'https://memepmw.online/logo.png';
  }
  
  // Função para criar um slug a partir do título do artigo
  const createSlug = (text: string) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/[^\w\-]+/g, '') // Remove caracteres não alfanuméricos
      .replace(/\-\-+/g, '-'); // Remove hífens duplicados
  };
  
  // Cria um slug a partir do título do artigo
  const articleSlug = createSlug(title);
  
  // Obtém a data atual para usar na URL
  const now = new Date();
  const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  // URL amigável para o artigo
  const friendlyUrl = `${window.location.origin}/article/${articleSlug}-${dateString}-${article.id}`;
  
  const shareOnWhatsApp = () => {
    // Usa a página de compartilhamento estática com parâmetros para meta tags
    const sharePageUrl = `${window.location.origin}/share.html?id=${article.id}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary || '')}&image=${encodeURIComponent(imageUrl)}&url=${encodeURIComponent(friendlyUrl)}`;
    
    // Abre o WhatsApp com a URL da página de compartilhamento
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(sharePageUrl)}`, '_blank');
  };
  
  const shareOnFacebook = () => {
    // Usa a página de compartilhamento estática com parâmetros para meta tags
    const sharePageUrl = `${window.location.origin}/share.html?id=${article.id}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary || '')}&image=${encodeURIComponent(imageUrl)}&url=${encodeURIComponent(friendlyUrl)}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePageUrl)}`, '_blank');
  };
  
  const shareOnTwitter = () => {
    // Usa a página de compartilhamento estática com parâmetros para meta tags
    const sharePageUrl = `${window.location.origin}/share.html?id=${article.id}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary || '')}&image=${encodeURIComponent(imageUrl)}&url=${encodeURIComponent(friendlyUrl)}`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(sharePageUrl)}`, '_blank');
  };
  
  return (
    <div className={`flex items-center gap-4 justify-center ${className}`}>
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-[#25D366] hover:bg-[#128C7E] text-white border-none rounded-md p-2 h-12 w-12 shadow-md"
        onClick={shareOnWhatsApp}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-[#1877F2] hover:bg-[#166FE5] text-white border-none rounded-md p-2 h-12 w-12 shadow-md"
        onClick={shareOnFacebook}
      >
        <Facebook size={24} />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-[#1DA1F2] hover:bg-[#0c85d0] text-white border-none rounded-md p-2 h-12 w-12 shadow-md"
        onClick={shareOnTwitter}
      >
        <Twitter size={24} />
      </Button>
    </div>
  );
};

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(false);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const { toast } = useToast();

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

  // Efeito para garantir que a página sempre inicie no topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  // Buscar artigos populares da semana
  useEffect(() => {
    const fetchPopularArticles = async () => {
      setLoadingPopular(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/articles?sort=views&limit=4`);
        
        if (!response.ok) {
          throw new Error('Erro ao buscar artigos populares');
        }
        
        const data = await response.json();
        // Garantir que o artigo atual não esteja na lista de populares
        const filteredArticles = data.articles.filter((article: Article) => article.id !== Number(id));
        setPopularArticles(filteredArticles.slice(0, 4));
      } catch (error) {
        console.error('Erro ao buscar artigos populares:', error);
      } finally {
        setLoadingPopular(false);
      }
    };
    
    fetchPopularArticles();
  }, [id]);

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

  // Verificar se o artigo está nos favoritos do usuário
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!id || !isAuthenticated || !authToken) return;
      
      setCheckingFavorite(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/favorites/check/${id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error('Erro ao verificar favorito:', error);
      } finally {
        setCheckingFavorite(false);
      }
    };
    
    if (authChecked) {
      checkIfFavorite();
    }
  }, [id, isAuthenticated, authToken, authChecked]);

  // Função para adicionar ou remover dos favoritos
  const toggleFavorite = async () => {
    if (!id || !isAuthenticated || !authToken) {
      toast({
        title: "Ação não permitida",
        description: "Você precisa estar logado para favoritar artigos.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      if (isFavorite) {
        // Remover dos favoritos
        const response = await fetch(`${apiUrl}/api/favorites/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (response.ok) {
          setIsFavorite(false);
          toast({
            title: "Removido dos favoritos",
            description: "Artigo removido dos seus favoritos com sucesso."
          });
        }
      } else {
        // Adicionar aos favoritos
        const response = await fetch(`${apiUrl}/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ articleId: id })
        });
        
        if (response.ok) {
          setIsFavorite(true);
          toast({
            title: "Adicionado aos favoritos",
            description: "Artigo adicionado aos seus favoritos com sucesso."
          });
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar os favoritos.",
        variant: "destructive"
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

  // Prepara a URL absoluta da imagem para meta tags
  const getAbsoluteImageUrl = (relativeUrl: string) => {
    if (!relativeUrl) return 'https://memepmw.online/logo.png';
    
    // Se já for uma URL absoluta
    if (relativeUrl.startsWith('http')) return relativeUrl;
    
    // Se for uma URL relativa
    if (relativeUrl.startsWith('/')) {
      return `https://memepmw.online${relativeUrl}`;
    }
    
    // Outros casos
    return `https://memepmw.online/${relativeUrl}`;
  };
  
  // Prepara a URL absoluta do artigo
  const articleUrl = window.location.href;
  const articleImageUrl = article?.featuredImage ? getAbsoluteImageUrl(article.featuredImage) : 'https://memepmw.online/logo.png';

  return (
    <Layout>
      <Helmet>
        <title>{article?.title ? `${article.title} | Meme PMW` : 'Artigo | Meme PMW'}</title>
        <meta name="description" content={article?.summary || 'Leia este artigo no Meme PMW'} />
        
        {/* Meta tags OpenGraph para compartilhamento */}
        <meta property="og:title" content={article?.title || 'Artigo | Meme PMW'} />
        <meta property="og:description" content={article?.summary || 'Leia este artigo no Meme PMW'} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:image" content={articleImageUrl} />
        <meta property="og:image:secure_url" content={articleImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Meme PMW" />
        
        {/* Meta tags Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@memepmw" />
        <meta name="twitter:title" content={article?.title || 'Artigo | Meme PMW'} />
        <meta name="twitter:description" content={article?.summary || 'Leia este artigo no Meme PMW'} />
        <meta name="twitter:image" content={articleImageUrl} />
      </Helmet>
      
      <article className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Botão de voltar ao topo */}
        <div className="fixed bottom-6 right-6 z-10">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-12 w-12 shadow-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowLeft className="h-6 w-6 transform rotate-90" />
          </Button>
        </div>
        
        <div className="overflow-hidden max-w-4xl mx-auto bg-white shadow-sm rounded-xl">
          <div className="p-8 pb-4 sm:p-4 sm:pb-2">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 leading-tight sm:text-2xl sm:mb-4">
              {article.title}
            </h1>
          </div>
          
          {article.featuredImage && (
            <div className="px-8 sm:px-4 mb-4">
              <div className="relative overflow-hidden image-container mb-4">
                {/* Imagem principal - usando src diretamente para garantir carregamento */}
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  onError={(e) => {
                    // Tenta corrigir URLs com IP
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('167.172.152.174:3001')) {
                      target.src = target.src.replace('http://167.172.152.174:3001', 'https://memepmw.online');
                    }
                  }}
                />
              </div>
              
              {/* Botões de compartilhamento abaixo da imagem */}
              <div className="flex justify-center items-center py-4 px-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-sm border border-gray-100">
                <span className="mr-4 text-gray-700 font-medium">Compartilhar:</span>
                <ShareButtons article={article} className="gap-5" />
              </div>
            </div>
          )}
          <div className="p-8 pt-4 sm:p-4 sm:pt-2">
            
            {article.author && (
              <div className="flex items-center mb-8 sm:mb-4 border-b border-gray-100 pb-6 sm:pb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                  {article.author.fullName.charAt(0)}
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-900">
                    Por {article.author.fullName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            )}
            
            {article.summary && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-600 p-6 sm:p-5 rounded-r-xl mb-8 sm:mb-6 shadow-sm">
                <p className="text-lg sm:text-base leading-relaxed text-gray-700 font-medium italic article-summary">
                  {article.summary}
                </p>
              </div>
            )}
            
            <div className="prose max-w-none text-gray-700 mb-8 sm:mb-4 leading-relaxed sm:prose-sm article-content" 
              dangerouslySetInnerHTML={{ 
                __html: article.content.replace(
                  /<img([^>]*)>/g, 
                  (match, attributes) => {
                    // Extrai o src da imagem
                    const srcMatch = attributes.match(/src=['"]([^'"]*)['"]/);
                    if (!srcMatch) return match;
                    
                    const src = srcMatch[1];
                    const altMatch = attributes.match(/alt=['"]([^'"]*)['"]/);
                    const alt = altMatch ? altMatch[1] : '';
                    
                    // Substitui a tag img por uma versão otimizada
                    // Corrige URLs com IP
                    const fixedSrc = src.includes('167.172.152.174:3001') 
                      ? src.replace('http://167.172.152.174:3001', 'https://memepmw.online')
                      : src;
                      
                    return `
                      <div class="image-container my-8 text-center">
                        <img 
                          class="w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300" 
                          src="${fixedSrc}" 
                          alt="${alt}" 
                          onerror="if(this.src.includes('167.172.152.174:3001')){this.src=this.src.replace('http://167.172.152.174:3001', 'https://memepmw.online');}" 
                        />
                        ${alt ? `<p class="text-sm text-gray-500 mt-2 italic">${alt}</p>` : ''}
                      </div>
                    `;
                  }
                ) 
              }}
            />
            
            {/* Botões de compartilhamento no final do conteúdo do artigo */}
            <div id="share-section" className="border-t border-gray-100 pt-8 pb-4 mb-6 text-center">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Gostou deste artigo? Compartilhe!</h4>
              <ShareButtons article={article} className="gap-5 justify-center" />
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8 border-t border-gray-100 pt-6">
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
                className={`flex items-center gap-1 ${isFavorite ? 'text-yellow-600 bg-yellow-50' : 'text-gray-600'}`}
                onClick={toggleFavorite}
              >
                {isFavorite ? (
                  <BookmarkCheck className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                ) : (
                  <Bookmark className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                )}
              </Button>
              
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-gray-600"
                onClick={() => document.getElementById('comment-input')?.focus()}
              >
                <MessageCircle className="h-5 w-5" />
                {comments.length} Comentários
              </Button>
              
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-gray-600 ml-auto"
                onClick={() => {
                  const shareSection = document.getElementById('share-section');
                  if (shareSection) {
                    shareSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Seção "Leia Mais" com artigos populares */}
            <div className="mt-12 sm:mt-8 border-t border-gray-100 pt-8 sm:pt-4">
              <h3 className="text-2xl font-bold mb-6 sm:mb-4 text-gray-800 flex items-center justify-center">
                Leia Mais
              </h3>
              
              {loadingPopular ? (
                <div className="flex justify-center my-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : popularArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-3 mb-12 sm:mb-6">
                  {popularArticles.map((popularArticle) => (
                    <Link 
                      to={`/article/${popularArticle.id}`} 
                      key={popularArticle.id}
                      className="group hover:no-underline"
                    >
                      <div className="overflow-hidden rounded-lg bg-white h-full flex flex-col hover:shadow-md transition-shadow">
                        {popularArticle.featuredImage && (
                          <div className="h-40 sm:h-32 overflow-hidden image-container">
                            {/* Imagem principal */}
                            <img 
                              src={popularArticle.featuredImage} 
                              alt={popularArticle.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 card-image"
                              onError={(e) => {
                                // Tenta corrigir URLs com IP
                                const target = e.target as HTMLImageElement;
                                if (target.src.includes('167.172.152.174:3001')) {
                                  target.src = target.src.replace('http://167.172.152.174:3001', 'https://memepmw.online');
                                }
                              }}
                            />
                          </div>
                        )}
                        <div className="p-4 sm:p-3 flex-1 flex flex-col">
                          <h4 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors card-title">
                            {popularArticle.title}
                          </h4>
                          {popularArticle.summary && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3 card-summary">
                              {popularArticle.summary}
                            </p>
                          )}
                          <div className="mt-auto flex items-center text-xs text-gray-500">
                            <span>
                              {new Date(popularArticle.publishedAt || popularArticle.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            
            <div className="mt-12 border-t border-gray-100 pt-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-purple-600" />
                Comentários ({comments.length})
              </h3>
              
              {isAuthenticated ? (
                <form onSubmit={handleComment} className="mb-8">
                  <div className="mb-4">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Deixe seu comentário..."
                      className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      rows={4}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Chave de teste do reCAPTCHA
                      onChange={handleCaptchaChange}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!isCaptchaVerified || !comment.trim()}
                  >
                    Enviar comentário
                  </Button>
                </form>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg mb-8 text-center">
                  <p className="text-gray-600 mb-4">Faça login para deixar um comentário</p>
                  <Link to="/login" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
                    Fazer login
                  </Link>
                </div>
              )}
              
              {comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <Card key={comment.id} className="p-4 border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {comment.user && comment.user.fullName ? comment.user.fullName.charAt(0) : '?'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-gray-900">{comment.user && comment.user.fullName}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default ArticlePage;
