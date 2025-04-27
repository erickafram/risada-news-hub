import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { getPageBySlug, Page } from '@/services/pageService';
import { Loader2 } from 'lucide-react';
import SiteTitle from '@/components/SiteTitle';

// URL base para as imagens
const API_BASE_URL = 'http://localhost:3001';

const PageView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const pageData = await getPageBySlug(slug);
        setPage(pageData);
      } catch (error) {
        console.error(`Erro ao buscar página com slug ${slug}:`, error);
        setError('A página solicitada não foi encontrada ou não está disponível.');
        // Após 3 segundos, redirecionar para a página inicial
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-gray-600">Carregando página...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !page) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Página não encontrada</h1>
            <p className="text-lg text-gray-600 mb-6">{error || 'A página solicitada não existe.'}</p>
            <p className="text-gray-500">Você será redirecionado para a página inicial em alguns segundos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SiteTitle 
        pageTitle={page.metaTitle || page.title}
        metaDescription={page.metaDescription}
        ogImage={page.featuredImage}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{page.title}</h1>
          
          {page.featuredImage && (
            <div className="mb-8">
              <img 
                src={page.featuredImage.startsWith('/') ? `${API_BASE_URL}${page.featuredImage}` : page.featuredImage} 
                alt={page.title} 
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  console.error('Erro ao carregar imagem destacada:', page.featuredImage);
                }}
              />
            </div>
          )}
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PageView;
