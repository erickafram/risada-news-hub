import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Clock, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('30d');
  
  // Dados de exemplo para os gráficos
  const overviewData = {
    totalVisits: 12458,
    growth: 24.8,
    uniqueVisitors: 8745,
    visitorGrowth: 12.3,
    avgTimeOnSite: '3m 45s',
    timeGrowth: 8.7,
    bounceRate: 42.5,
    bounceRateChange: -3.2
  };
  
  const popularArticles = [
    { id: 1, title: 'Como a inteligência artificial está transformando o jornalismo', views: 2345, change: 12.5 },
    { id: 2, title: 'Os 10 melhores filmes de 2024 até agora', views: 1987, change: 8.3 },
    { id: 3, title: 'Guia completo para investir em criptomoedas em 2024', views: 1654, change: -2.1 },
    { id: 4, title: 'Receitas saudáveis para o dia a dia', views: 1432, change: 15.7 },
    { id: 5, title: 'As tendências de moda para o verão', views: 1298, change: 5.2 }
  ];
  
  const trafficSources = [
    { source: 'Pesquisa orgânica', percentage: 42, change: 3.5 },
    { source: 'Redes sociais', percentage: 28, change: 7.2 },
    { source: 'Tráfego direto', percentage: 15, change: -1.8 },
    { source: 'Links externos', percentage: 10, change: 2.3 },
    { source: 'Email', percentage: 5, change: 0.7 }
  ];
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Análise de Desempenho</h1>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-white rounded-lg border p-1">
            <button 
              className={`px-3 py-1 text-sm rounded-md ${period === '7d' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setPeriod('7d')}
            >
              7 dias
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${period === '30d' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setPeriod('30d')}
            >
              30 dias
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${period === '90d' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setPeriod('90d')}
            >
              90 dias
            </button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="audience" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Audiência
            </TabsTrigger>
            <TabsTrigger value="sources" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Fontes de Tráfego
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Cards de métricas principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total de Visitas</p>
                    <h3 className="text-2xl font-bold">{formatNumber(overviewData.totalVisits)}</h3>
                  </div>
                  <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${overviewData.growth > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {overviewData.growth > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {Math.abs(overviewData.growth)}%
                  </div>
                </div>
                <div className="mt-4 h-10 bg-gray-50 rounded-md"></div>
              </Card>
              
              <Card className="p-4 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Visitantes Únicos</p>
                    <h3 className="text-2xl font-bold">{formatNumber(overviewData.uniqueVisitors)}</h3>
                  </div>
                  <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${overviewData.visitorGrowth > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {overviewData.visitorGrowth > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {Math.abs(overviewData.visitorGrowth)}%
                  </div>
                </div>
                <div className="mt-4 h-10 bg-gray-50 rounded-md"></div>
              </Card>
              
              <Card className="p-4 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Tempo Médio</p>
                    <h3 className="text-2xl font-bold">{overviewData.avgTimeOnSite}</h3>
                  </div>
                  <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${overviewData.timeGrowth > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {overviewData.timeGrowth > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {Math.abs(overviewData.timeGrowth)}%
                  </div>
                </div>
                <div className="mt-4 h-10 bg-gray-50 rounded-md"></div>
              </Card>
              
              <Card className="p-4 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Taxa de Rejeição</p>
                    <h3 className="text-2xl font-bold">{overviewData.bounceRate}%</h3>
                  </div>
                  <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${overviewData.bounceRateChange < 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {overviewData.bounceRateChange < 0 ? <ArrowDownRight className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1" />}
                    {Math.abs(overviewData.bounceRateChange)}%
                  </div>
                </div>
                <div className="mt-4 h-10 bg-gray-50 rounded-md"></div>
              </Card>
            </div>
            
            {/* Gráfico principal */}
            <Card className="p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Visitas ao Longo do Tempo</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                    <span className="text-xs text-gray-500">Visitas</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                    <span className="text-xs text-gray-500">Visitantes únicos</span>
                  </div>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>Gráfico de visitas será exibido aqui</p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6">
            <Card className="p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Artigos Mais Populares</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Título</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Visualizações</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Variação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularArticles.map((article) => (
                      <tr key={article.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="line-clamp-1">{article.title}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">{formatNumber(article.views)}</td>
                        <td className="py-3 px-4">
                          <div className={`flex items-center justify-end ${article.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {article.change > 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                            <span className="font-medium">{Math.abs(article.change)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Dispositivos</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>Gráfico de dispositivos será exibido aqui</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Localização</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>Mapa de localização será exibido aqui</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sources" className="space-y-6">
            <Card className="p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Fontes de Tráfego</h3>
              <div className="space-y-4">
                {trafficSources.map((source, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{source.source}</span>
                      <div className="flex items-center">
                        <span className="text-sm font-bold mr-2">{source.percentage}%</span>
                        <span className={`text-xs flex items-center ${source.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {source.change > 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                          {Math.abs(source.change)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
