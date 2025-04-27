import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  FileText, 
  Save, 
  ArrowLeft, 
  Eye, 
  Settings, 
  Image,
  Upload,
  Loader2
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getPageById, createPage, updatePage } from '@/services/pageService';
import { uploadImage } from '@/services/uploadService';
import slugify from 'slugify';

// URL base para as imagens
const API_BASE_URL = 'http://localhost:3001';

const PageForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(true);
  
  // Estados para os campos do formulário
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [showInMenu, setShowInMenu] = useState(false);
  const [menuOrder, setMenuOrder] = useState(0);
  
  // Carregar dados da página se estiver editando
  useEffect(() => {
    const fetchPageData = async () => {
      if (id && id !== 'new') {
        setIsNew(false);
        setLoading(true);
        
        try {
          const pageData = await getPageById(parseInt(id));
          
          setTitle(pageData.title);
          setSlug(pageData.slug);
          setContent(pageData.content);
          setMetaTitle(pageData.metaTitle || '');
          setMetaDescription(pageData.metaDescription || '');
          setFeaturedImage(pageData.featuredImage || '');
          setStatus(pageData.status);
          setShowInMenu(pageData.showInMenu);
          setMenuOrder(pageData.menuOrder);
        } catch (error) {
          console.error('Erro ao carregar dados da página:', error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados da página. Tente novamente.",
            variant: "destructive",
          });
          navigate('/admin/pages');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPageData();
  }, [id, navigate, toast]);
  
  // Gerar slug automaticamente a partir do título
  const generateSlug = () => {
    if (title) {
      const newSlug = slugify(title, {
        lower: true,
        strict: true,
        locale: 'pt'
      });
      setSlug(newSlug);
    }
  };
  
  // Manipular upload de imagem destacada
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadedUrl = await uploadImage(file);
        setFeaturedImage(uploadedUrl);
        
        toast({
          title: "Imagem enviada",
          description: "A imagem destacada foi enviada com sucesso.",
          variant: "default",
        });
      } catch (error) {
        console.error('Erro ao fazer upload da imagem destacada:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao enviar a imagem destacada. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };
  
  // Salvar a página
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e conteúdo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    
    try {
      const pageData = {
        title,
        slug: slug || slugify(title, { lower: true, strict: true, locale: 'pt' }),
        content,
        metaTitle,
        metaDescription,
        featuredImage,
        status,
        showInMenu,
        menuOrder
      };
      
      if (isNew) {
        await createPage(pageData);
        toast({
          title: "Página criada",
          description: "A página foi criada com sucesso.",
          variant: "default",
        });
      } else {
        await updatePage(parseInt(id!), pageData);
        toast({
          title: "Página atualizada",
          description: "A página foi atualizada com sucesso.",
          variant: "default",
        });
      }
      
      navigate('/admin/pages');
    } catch (error) {
      console.error('Erro ao salvar página:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a página. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3">Carregando página...</span>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">
              {isNew ? 'Nova Página' : 'Editar Página'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={() => navigate('/admin/pages')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Salvar
                </>
              )}
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSave}>
          <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">
                <FileText className="h-4 w-4 mr-2" /> Conteúdo
              </TabsTrigger>
              <TabsTrigger value="seo">
                <Eye className="h-4 w-4 mr-2" /> SEO
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" /> Configurações
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Conteúdo da Página</CardTitle>
                  <CardDescription>
                    Defina o título e o conteúdo principal da página.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Página</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={generateSlug}
                      placeholder="Digite o título da página"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="slug-da-pagina"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateSlug}
                        className="whitespace-nowrap"
                      >
                        Gerar do Título
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      URL da página: /{slug}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo</Label>
                    <div className="h-[500px] overflow-auto border rounded-md">
                      <ReactQuill 
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }],
                            ['link', 'image'],
                            ['clean']
                          ],
                        }}
                        formats={[
                          'header',
                          'bold', 'italic', 'underline', 'strike',
                          'list', 'bullet',
                          'color', 'background',
                          'align',
                          'link', 'image'
                        ]}
                        style={{ height: '450px' }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Otimização para Mecanismos de Busca (SEO)</CardTitle>
                  <CardDescription>
                    Configure os metadados para melhorar a visibilidade da página nos mecanismos de busca.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Título Meta (SEO)</Label>
                    <Input
                      id="metaTitle"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Título para SEO (deixe em branco para usar o título da página)"
                    />
                    <p className="text-sm text-gray-500">
                      Recomendado: até 60 caracteres. Atual: {metaTitle.length}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Descrição Meta</Label>
                    <Textarea
                      id="metaDescription"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Breve descrição da página para exibição nos resultados de busca"
                      rows={3}
                    />
                    <p className="text-sm text-gray-500">
                      Recomendado: 120-160 caracteres. Atual: {metaDescription.length}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="featuredImage">Imagem Destacada</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="featuredImage"
                        value={featuredImage}
                        onChange={(e) => setFeaturedImage(e.target.value)}
                        placeholder="URL da imagem destacada"
                        className="flex-1"
                      />
                      <input
                        type="file"
                        id="featuredImageUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFeaturedImageUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => document.getElementById('featuredImageUpload')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    {featuredImage && (
                      <div className="mt-2 p-2 border rounded-md">
                        <p className="text-sm mb-1">Pré-visualização:</p>
                        <img
                          src={featuredImage.startsWith('/') ? `${API_BASE_URL}${featuredImage}` : featuredImage}
                          alt="Imagem destacada"
                          className="h-32 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/placeholder-image.png';
                            console.log('Erro ao carregar imagem destacada:', featuredImage);
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">{featuredImage}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Página</CardTitle>
                  <CardDescription>
                    Configure o status de publicação e as opções de menu.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value: 'draft' | 'published') => setStatus(value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      Páginas com status "Rascunho" não são visíveis publicamente.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showInMenu"
                        checked={showInMenu}
                        onCheckedChange={(checked) => setShowInMenu(checked as boolean)}
                      />
                      <Label htmlFor="showInMenu">Mostrar no Menu</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Se marcado, a página será exibida no menu de navegação do site.
                    </p>
                  </div>
                  
                  {showInMenu && (
                    <div className="space-y-2">
                      <Label htmlFor="menuOrder">Ordem no Menu</Label>
                      <Input
                        id="menuOrder"
                        type="number"
                        min="0"
                        value={menuOrder}
                        onChange={(e) => setMenuOrder(parseInt(e.target.value) || 0)}
                      />
                      <p className="text-sm text-gray-500">
                        Páginas com valores menores aparecem primeiro no menu.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Salvar Página
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default PageForm;
