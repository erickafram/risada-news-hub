import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Menu, 
  ExternalLink 
} from 'lucide-react';
import { getAllPages, deletePage, Page } from '@/services/pageService';
import { formatDate } from '@/lib/utils';

const PagesListPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);

  // Função para buscar as páginas
  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllPages(
        currentPage,
        10,
        statusFilter === 'all' ? '' : statusFilter,
        searchQuery
      );
      
      setPages(response.pages);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Erro ao buscar páginas:', error);
      setError('Erro ao buscar páginas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Buscar páginas ao carregar o componente e quando os filtros mudarem
  useEffect(() => {
    fetchPages();
  }, [currentPage, statusFilter]);

  // Função para lidar com a pesquisa
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Resetar para a primeira página ao pesquisar
    fetchPages();
  };

  // Função para excluir uma página
  const handleDeletePage = async () => {
    if (!pageToDelete) return;
    
    try {
      await deletePage(pageToDelete.id);
      
      toast({
        title: "Página excluída",
        description: `A página "${pageToDelete.title}" foi excluída com sucesso.`,
        variant: "default",
      });
      
      // Atualizar a lista de páginas
      fetchPages();
    } catch (error) {
      console.error('Erro ao excluir página:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a página. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setPageToDelete(null);
    }
  };

  // Função para renderizar a paginação
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            
            // Mostrar apenas algumas páginas para não sobrecarregar a interface
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNumber)}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            
            // Adicionar elipses para indicar páginas omitidas
            if (
              (pageNumber === 2 && currentPage > 3) ||
              (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
            ) {
              return (
                <PaginationItem key={`ellipsis-${pageNumber}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            
            return null;
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">Gerenciar Páginas</h1>
          </div>
          
          <Button onClick={() => navigate('/admin/pages/new')} className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" /> Nova Página
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Buscar páginas..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
              
              <div className="w-full md:w-48">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <span className="ml-3">Carregando páginas...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchPages}>Tentar novamente</Button>
            </div>
          ) : pages.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">Nenhuma página encontrada.</p>
              <p className="text-gray-500 mb-4">
                {searchQuery || statusFilter
                  ? "Tente ajustar seus filtros de busca."
                  : "Clique no botão 'Nova Página' para criar sua primeira página."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Menu</TableHead>
                      <TableHead>Atualizado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell>{page.slug}</TableCell>
                        <TableCell>
                          <Badge
                            variant={page.status === 'published' ? 'default' : 'secondary'}
                          >
                            {page.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {page.showInMenu ? (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Menu className="h-3 w-3" />
                              <span>Ordem: {page.menuOrder}</span>
                            </Badge>
                          ) : (
                            <span className="text-gray-500 text-sm">Não</span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(page.updatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              asChild
                              title="Visualizar"
                            >
                              <Link to={`/${page.slug}`} target="_blank">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => navigate(`/admin/pages/edit/${page.id}`)}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setPageToDelete(page)}
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir página</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a página "{page.title}"?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeletePage}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-4 border-t">
                {renderPagination()}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PagesListPage;
