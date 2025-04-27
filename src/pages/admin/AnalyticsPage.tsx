import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Clock, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { getAuthToken } from '@/utils/auth';

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState({
    overview: true,
    content: true,
    audience: true,
    sources: true
  });
  
  // Estados para armazenar os dados reais
  const [overviewData, setOverviewData] = useState({
    totalVisits: 0,
    growth: 0,
    uniqueVisitors: 0,
    visitorGrowth: 0,
    avgTimeOnSite: '0m 0s',
    timeGrowth: 0,
    bounceRate: 0,
    bounceRateChange: 0
  });
  
  const [popularArticles, setPopularArticles] = useState<Array<{
    id: number;
    title: string;
    views: number;
    change: number;
    slug?: string;
  }>>([]);
  
  const [deviceData, setDeviceData] = useState<Array<{
    device: string;
    visits: number;
    percentage: number;
  }>>([]);
  
  const [trafficSources, setTrafficSources] = useState<Array<{
    source: string;
    percentage: number;
    change: number;
  }>>([]);
  
  // Função para buscar dados da API
  const fetchData = async (endpoint: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = getAuthToken();
      
      const response = await fetch(`${apiUrl}/api/analytics/${endpoint}?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados de ${endpoint}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar dados de ${endpoint}:`, error);
      return null;
    }
  };
  
  // Buscar dados de visão geral
  const fetchOverviewData = async () => {
    setLoading(prev => ({ ...prev, overview: true }));
    const data = await fetchData('overview');
    if (data) {
      setOverviewData(data.overviewData);
    }
    setLoading(prev => ({ ...prev, overview: false }));
  };
  
  // Buscar dados de conteúdo
  const fetchContentData = async () => {
    setLoading(prev => ({ ...prev, content: true }));
    const data = await fetchData('content');
    if (data) {
      setPopularArticles(data.popularArticles);
    }
    setLoading(prev => ({ ...prev, content: false }));
  };
  
  // Buscar dados de audiência
  const fetchAudienceData = async () => {
    setLoading(prev => ({ ...prev, audience: true }));
    const data = await fetchData('audience');
    if (data) {
      setDeviceData(data.devices);
    }
    setLoading(prev => ({ ...prev, audience: false }));
  };
  
  // Buscar dados de fontes de tráfego
  const fetchTrafficSourceData = async () => {
    setLoading(prev => ({ ...prev, sources: true }));
    const data = await fetchData('traffic-sources');
    if (data) {
      setTrafficSources(data.trafficSources);
    }
    setLoading(prev => ({ ...prev, sources: false }));
  };
  
  // Carregar dados quando o período mudar
  useEffect(() => {
    fetchOverviewData();
    fetchContentData();
    fetchAudienceData();
    fetchTrafficSourceData();
  }, [period]);
  
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
            {loading.overview ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-gray-500">Carregando dados...</span>
              </div>
            ) : (
            <>
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
            </>
            )}
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6">
            {loading.content ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-gray-500">Carregando dados...</span>
              </div>
            ) : (
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
                    {popularArticles.length > 0 ? (
                      popularArticles.map((article) => (
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-gray-500">
                          Nenhum artigo encontrado no período selecionado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
            )}
          </TabsContent>
          
          <TabsContent value="audience" className="space-y-6">
            {loading.audience ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-gray-500">Carregando dados...</span>
              </div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Dispositivos</h3>
                {deviceData.length > 0 ? (
                  <div className="space-y-4">
                    {deviceData.map((device, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">
                            {device.device === 'desktop' ? 'Desktop' : 
                             device.device === 'mobile' ? 'Dispositivos Móveis' : 
                             device.device === 'tablet' ? 'Tablets' : device.device}
                          </span>
                          <div className="flex items-center">
                            <span className="text-sm font-bold mr-2">{device.percentage}%</span>
                            <span className="text-xs">{formatNumber(device.visits)} visitas</span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                    <div className="text-center text-gray-500">
                      <p>Nenhum dado de dispositivo encontrado no período selecionado</p>
                    </div>
                  </div>
                )}
              </Card>
              
              <Card className="p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Localização</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>Dados de localização não disponíveis no momento</p>
                  </div>
                </div>
              </Card>
            </div>
            )}
          </TabsContent>
          
          <TabsContent value="sources" className="space-y-6">
            {loading.sources ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-gray-500">Carregando dados...</span>
              </div>
            ) : (
            <Card className="p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Fontes de Tráfego</h3>
              {trafficSources.length > 0 ? (
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
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                  <div className="text-center text-gray-500">
                    <p>Nenhum dado de fonte de tráfego encontrado no período selecionado</p>
                  </div>
                </div>
              )}
            </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
