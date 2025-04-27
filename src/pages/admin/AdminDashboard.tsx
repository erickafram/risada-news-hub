
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Loader2, BarChart3, FileText, Tag, Eye, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  categoryCount: number;
  articleCount: number;
  totalViews: number;
  topArticles: Array<{
    id: number;
    title: string;
    views: number;
    slug: string;
  }>;
  recentArticles: Array<{
    id: number;
    title: string;
    created_at: string;
    slug: string;
  }>;
  articlesByCategory: Array<{
    id: number;
    name: string;
    articleCount: number;
  }>;
  categoriesThisMonth: number;
  articlesThisWeek: number;
  viewsGrowthPercent: number;
  commentStats: {
    total: number;
    approved: number;
    pending: number;
    spam: number;
  };
  commentPercentages: {
    approved: number;
    pending: number;
    spam: number;
  };
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Você precisa estar autenticado para acessar esta página');
          setLoading(false);
          return;
        }
        
        const response = await fetch(`${apiUrl}/api/stats/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar estatísticas: ${response.status}`);
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        setError(error instanceof Error ? error.message : 'Erro ao buscar estatísticas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando estatísticas...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <div className="mt-2 sm:mt-0 flex items-center text-sm text-gray-500">
            <span className="inline-flex items-center">
              <CalendarIcon className="mr-1 h-4 w-4" />
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
        
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Tag className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Categorias</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold">{stats?.categoryCount || 0}</p>
                  {stats?.categoriesThisMonth > 0 && (
                    <span className="ml-2 text-xs text-green-500 font-medium">+{stats.categoriesThisMonth} este mês</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Notícias</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold">{stats?.articleCount || 0}</p>
                  {stats?.articlesThisWeek > 0 && (
                    <span className="ml-2 text-xs text-green-500 font-medium">+{stats.articlesThisWeek} esta semana</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Visualizações</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold">{formatNumber(stats?.totalViews || 0)}</p>
                  {stats?.viewsGrowthPercent > 0 ? (
                    <span className="ml-2 text-xs text-green-500 font-medium">+{stats.viewsGrowthPercent}% este mês</span>
                  ) : stats?.viewsGrowthPercent < 0 ? (
                    <span className="ml-2 text-xs text-red-500 font-medium">{stats.viewsGrowthPercent}% este mês</span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Desempenho</h3>
                <div className="text-xs bg-gray-100 rounded-full px-3 py-1">30 dias</div>
              </div>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>Gráfico de desempenho será exibido aqui</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 h-full">
              <h3 className="text-lg font-semibold mb-4">Resumo de comentários</h3>
              <p className="text-sm text-gray-500 mb-4">Total: <span className="font-medium">{stats?.commentStats.total || 0}</span></p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Comentários aprovados</span>
                    <span className="font-medium">{stats?.commentStats.approved || 0}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats?.commentPercentages.approved || 0}%` }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Comentários pendentes</span>
                    <span className="font-medium">{stats?.commentStats.pending || 0}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${stats?.commentPercentages.pending || 0}%` }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Comentários spam</span>
                    <span className="font-medium">{stats?.commentStats.spam || 0}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${stats?.commentPercentages.spam || 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Artigos mais visualizados e recentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Eye className="h-4 w-4 mr-2 text-gray-500" />
                Artigos Mais Visualizados
              </h3>
              <Link to="/admin/news" className="text-xs text-primary hover:underline">Ver todos</Link>
            </div>
            <ul className="space-y-3">
              {stats?.topArticles && stats.topArticles.length > 0 ? (
                stats.topArticles.map((article) => (
                  <li key={article.id} className="border-b border-gray-100 pb-2 last:border-0">
                    <Link 
                      to={`/article/${article.slug}`} 
                      className="hover:text-primary flex justify-between items-center"
                      target="_blank"
                    >
                      <span className="line-clamp-1 text-sm">{article.title}</span>
                      <span className="text-xs font-medium text-gray-500 ml-2 bg-gray-100 rounded-full px-2 py-1">
                        {formatNumber(article.views)}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm py-4 text-center">Nenhum artigo encontrado</li>
              )}
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                Artigos Recentes
              </h3>
              <Link to="/admin/news" className="text-xs text-primary hover:underline">Ver todos</Link>
            </div>
            <ul className="space-y-3">
              {stats?.recentArticles && stats.recentArticles.length > 0 ? (
                stats.recentArticles.map((article) => (
                  <li key={article.id} className="border-b border-gray-100 pb-2 last:border-0">
                    <Link 
                      to={`/article/${article.slug}`} 
                      className="hover:text-primary flex justify-between items-center"
                      target="_blank"
                    >
                      <span className="line-clamp-1 text-sm">{article.title}</span>
                      <span className="text-xs font-medium text-gray-500 ml-2 bg-gray-100 rounded-full px-2 py-1">
                        {new Date(article.created_at).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm py-4 text-center">Nenhum artigo encontrado</li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Artigos por categoria */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-gray-500" />
              Artigos por Categoria
            </h3>
            <Link to="/admin/categories" className="text-xs text-primary hover:underline">Gerenciar categorias</Link>
          </div>
          <div className="space-y-3">
            {stats?.articlesByCategory && stats.articlesByCategory.length > 0 ? (
              stats.articlesByCategory.map((category) => (
                <div key={category.id} className="flex items-center">
                  <span className="w-1/3 font-medium text-sm">{category.name}</span>
                  <div className="w-2/3 flex items-center">
                    <div className="h-2 bg-gray-100 flex-grow rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (category.articleCount / (stats.articleCount || 1)) * 100)}%` 
                        }}
                      />
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                      {category.articleCount}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm py-4 text-center">Nenhuma categoria encontrada</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
