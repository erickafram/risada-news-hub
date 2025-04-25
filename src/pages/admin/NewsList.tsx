import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { mockFeaturedNews, mockBusinessNews, mockTechnologyNews, mockPoliticsNews } from '@/data/mockNewsData';
import { NewsItem } from '@/components/news/NewsCard';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const NewsList = () => {
  const [allNews, setAllNews] = useState<NewsItem[]>([
    ...mockFeaturedNews,
    ...mockTechnologyNews,
    ...mockBusinessNews,
    ...mockPoliticsNews,
  ]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [newNewsData, setNewNewsData] = useState<Partial<NewsItem>>({
    title: '',
    excerpt: '',
    category: '',
    imageUrl: '',
    source: '',
  });
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setNewNewsData({ ...newNewsData, imageUrl: URL.createObjectURL(file) });
    }
  };

  const handleAddNews = () => {
    if (!newNewsData.title || !newNewsData.excerpt || !newNewsData.category) {
      toast({
        title: "Campos incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const newNews: NewsItem = {
      id: `news-${Date.now()}`,
      title: newNewsData.title || '',
      excerpt: newNewsData.excerpt || '',
      category: newNewsData.category || '',
      imageUrl: newNewsData.imageUrl || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      publishedAt: new Date().toISOString(),
      source: newNewsData.source || 'Admin',
      likes: 0,
      comments: 0,
    };
    
    setAllNews([newNews, ...allNews]);
    setIsAddDrawerOpen(false);
    setNewNewsData({
      title: '',
      excerpt: '',
      category: '',
      imageUrl: '',
      source: '',
    });
    
    toast({
      title: "Notícia adicionada",
      description: "A notícia foi adicionada com sucesso.",
    });
  };

  const handleEditNews = () => {
    if (!currentNews) return;
    
    setAllNews(
      allNews.map((news) =>
        news.id === currentNews.id ? currentNews : news
      )
    );
    
    setIsEditDrawerOpen(false);
    toast({
      title: "Notícia atualizada",
      description: "A notícia foi atualizada com sucesso.",
    });
  };

  const handleDeleteNews = (id: string) => {
    setAllNews(allNews.filter((news) => news.id !== id));
    toast({
      title: "Notícia removida",
      description: "A notícia foi removida com sucesso.",
    });
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Notícias</h1>
          <Button onClick={() => setIsAddDrawerOpen(true)}>Nova Notícia</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Título</th>
                <th className="text-left py-3 px-4">Categoria</th>
                <th className="text-left py-3 px-4">Data</th>
                <th className="text-right py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {allNews.map((news) => (
                <tr key={news.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span className="font-medium line-clamp-1">{news.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{news.category}</td>
                  <td className="py-3 px-4">
                    {new Date(news.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          setCurrentNews(news);
                          setIsEditDrawerOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleDeleteNews(news.id)}
                      >
                        <Trash className="w-4 h-4" />
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add News Drawer */}
      <Drawer open={isAddDrawerOpen} onOpenChange={setIsAddDrawerOpen}>
        <DrawerContent>
          <div className="container max-w-lg mx-auto p-6">
            <DrawerHeader>
              <DrawerTitle>Adicionar Nova Notícia</DrawerTitle>
              <DrawerDescription>
                Preencha os campos para criar uma nova notícia.
              </DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newNewsData.title || ''}
                  onChange={(e) =>
                    setNewNewsData({ ...newNewsData, title: e.target.value })
                  }
                  placeholder="Título da notícia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  value={newNewsData.excerpt || ''}
                  onChange={(e) =>
                    setNewNewsData({ ...newNewsData, excerpt: e.target.value })
                  }
                  placeholder="Breve resumo da notícia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={newNewsData.category || ''}
                  onChange={(e) =>
                    setNewNewsData({ ...newNewsData, category: e.target.value })
                  }
                  placeholder="Categoria da notícia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Imagem</Label>
                <div className="flex flex-col gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="relative w-full h-48">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Fonte</Label>
                <Input
                  id="source"
                  value={newNewsData.source || ''}
                  onChange={(e) =>
                    setNewNewsData({ ...newNewsData, source: e.target.value })
                  }
                  placeholder="Fonte da notícia"
                />
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={handleAddNews}>Adicionar Notícia</Button>
              <Button variant="outline" onClick={() => setIsAddDrawerOpen(false)}>
                Cancelar
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Edit News Drawer */}
      <Drawer open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
        <DrawerContent>
          <div className="container max-w-lg mx-auto p-6">
            <DrawerHeader>
              <DrawerTitle>Editar Notícia</DrawerTitle>
              <DrawerDescription>
                Modifique os campos da notícia selecionada.
              </DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={currentNews?.title || ''}
                  onChange={(e) =>
                    setCurrentNews(
                      currentNews
                        ? { ...currentNews, title: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-excerpt">Resumo</Label>
                <Textarea
                  id="edit-excerpt"
                  value={currentNews?.excerpt || ''}
                  onChange={(e) =>
                    setCurrentNews(
                      currentNews
                        ? { ...currentNews, excerpt: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Categoria</Label>
                <Input
                  id="edit-category"
                  value={currentNews?.category || ''}
                  onChange={(e) =>
                    setCurrentNews(
                      currentNews
                        ? { ...currentNews, category: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl">URL da imagem</Label>
                <Input
                  id="edit-imageUrl"
                  value={currentNews?.imageUrl || ''}
                  onChange={(e) =>
                    setCurrentNews(
                      currentNews
                        ? { ...currentNews, imageUrl: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-source">Fonte</Label>
                <Input
                  id="edit-source"
                  value={currentNews?.source || ''}
                  onChange={(e) =>
                    setCurrentNews(
                      currentNews
                        ? { ...currentNews, source: e.target.value }
                        : null
                    )
                  }
                />
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={handleEditNews}>Salvar Alterações</Button>
              <Button variant="outline" onClick={() => setIsEditDrawerOpen(false)}>
                Cancelar
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </AdminLayout>
  );
};

export default NewsList;
