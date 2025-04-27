import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  Settings, Save, Globe, Mail, Bell, Shield, Palette,
  FileText, Users, Database, Upload, Trash2, RefreshCcw
} from 'lucide-react';
import { getAllSettings, updateSettings, resetSettings } from '@/services/settingsService';
import { uploadImage } from '@/services/uploadService';
import { getFullImageUrl } from '@/services/imageService';

const SettingsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para as configurações gerais
  const [siteTitle, setSiteTitle] = useState('Risada News Hub');
  const [siteDescription, setSiteDescription] = useState('Portal de notícias e entretenimento');
  const [siteUrl, setSiteUrl] = useState('https://risadanews.com.br');
  const [adminEmail, setAdminEmail] = useState('admin@risadanews.com.br');
  const [language, setLanguage] = useState('pt-BR');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');

  // Estados para as configurações de conteúdo
  const [postsPerPage, setPostsPerPage] = useState('10');
  const [enableComments, setEnableComments] = useState(true);
  const [moderateComments, setModerateComments] = useState(true);
  const [enableRss, setEnableRss] = useState(true);
  const [enableSocialSharing, setEnableSocialSharing] = useState(true);

  // Estados para as configurações de email
  const [smtpServer, setSmtpServer] = useState('smtp.example.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUsername, setSmtpUsername] = useState('user@example.com');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [emailFrom, setEmailFrom] = useState('noreply@risadanews.com.br');
  const [emailReplyTo, setEmailReplyTo] = useState('contato@risadanews.com.br');

  // Estados para as configurações de notificações
  const [notifyNewComments, setNotifyNewComments] = useState(true);
  const [notifyNewUsers, setNotifyNewUsers] = useState(true);
  const [notifySystemErrors, setNotifySystemErrors] = useState(true);

  // Estados para as configurações de segurança
  const [enableCaptcha, setEnableCaptcha] = useState(true);
  const [captchaSiteKey, setCaptchaSiteKey] = useState('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
  const [captchaSecretKey, setCaptchaSecretKey] = useState('6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [sessionTimeout, setSessionTimeout] = useState('60');

  // Estados para as configurações de aparência
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [primaryTextColor, setPrimaryTextColor] = useState('#ffffff'); // Cor do texto dos botões
  const [contentTextColor, setContentTextColor] = useState('#1f2937'); // Cor do texto do conteúdo
  const [headerStartColor, setHeaderStartColor] = useState('#9333ea'); // purple-600 padrão
  const [headerEndColor, setHeaderEndColor] = useState('#db2777'); // pink-600 padrão
  const [footerStartColor, setFooterStartColor] = useState('#9333ea'); // purple-600 padrão
  const [footerEndColor, setFooterEndColor] = useState('#db2777'); // pink-600 padrão
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');
  
  // Carregar configurações do backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const settings = await getAllSettings();
        
        // Configurações gerais
        if (settings.general) {
          setSiteTitle(settings.general.site_title || 'Risada News Hub');
          setSiteDescription(settings.general.site_description || 'Portal de notícias e entretenimento');
          setSiteUrl(settings.general.site_url || 'https://risadanews.com.br');
          setAdminEmail(settings.general.admin_email || 'admin@risadanews.com.br');
          setLanguage(settings.general.language || 'pt-BR');
          setTimezone(settings.general.timezone || 'America/Sao_Paulo');
        }
        
        // Configurações de conteúdo
        if (settings.content) {
          setPostsPerPage(settings.content.posts_per_page || '10');
          setEnableComments(settings.content.enable_comments === 'true');
          setModerateComments(settings.content.moderate_comments === 'true');
          setEnableRss(settings.content.enable_rss === 'true');
          setEnableSocialSharing(settings.content.enable_social_sharing === 'true');
        }
        
        // Configurações de aparência
        if (settings.appearance) {
          setTheme(settings.appearance.theme || 'light');
          setPrimaryColor(settings.appearance.primary_color || '#3b82f6');
          setPrimaryTextColor(settings.appearance.primary_text_color || '#ffffff');
          setContentTextColor(settings.appearance.content_text_color || '#1f2937');
          setHeaderStartColor(settings.appearance.header_start_color || '#9333ea');
          setHeaderEndColor(settings.appearance.header_end_color || '#db2777');
          setFooterStartColor(settings.appearance.footer_start_color || '#9333ea');
          setFooterEndColor(settings.appearance.footer_end_color || '#db2777');
          setLogoUrl(settings.appearance.logo_url || '/logo.png');
          setFaviconUrl(settings.appearance.favicon_url || '/favicon.ico');
        }
        
        // Aplicar configurações de aparência ao site
        applyAppearanceSettings({
          theme: settings.appearance?.theme || 'light',
          primary_color: settings.appearance?.primary_color || '#3b82f6',
          primary_text_color: settings.appearance?.primary_text_color || '#ffffff',
          content_text_color: settings.appearance?.content_text_color || '#1f2937',
          logo_url: settings.appearance?.logo_url || '/logo.png',
          favicon_url: settings.appearance?.favicon_url || '/favicon.ico'
        });
        
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
        setError('Erro ao carregar configurações. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  // Função para aplicar configurações de aparência ao site
  // Por enquanto, apenas armazenamos as configurações, mas não aplicamos ao dashboard
  const applyAppearanceSettings = (appearanceSettings: any) => {
    // Armazenamos as configurações, mas não aplicamos ao dashboard
    // para manter o layout original
    console.log('Configurações de aparência carregadas:', appearanceSettings);
    
    // No futuro, essas configurações serão aplicadas apenas ao frontend público
    // e não ao dashboard administrativo
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Preparar os dados para enviar ao backend
      const settingsToUpdate: Record<string, string> = {
        // Configurações gerais
        'site_title': siteTitle,
        'site_description': siteDescription,
        'site_url': siteUrl,
        'admin_email': adminEmail,
        'language': language,
        'timezone': timezone,
        
        // Configurações de conteúdo
        'posts_per_page': postsPerPage,
        'enable_comments': enableComments.toString(),
        'moderate_comments': moderateComments.toString(),
        'enable_rss': enableRss.toString(),
        'enable_social_sharing': enableSocialSharing.toString(),
        
        // Configurações de aparência
        'theme': theme,
        'primary_color': primaryColor,
        'primary_text_color': primaryTextColor,
        'content_text_color': contentTextColor,
        'header_start_color': headerStartColor,
        'header_end_color': headerEndColor,
        'footer_start_color': footerStartColor,
        'footer_end_color': footerEndColor,
        'logo_url': logoUrl,
        'favicon_url': faviconUrl
      };
      
      // Enviar as configurações para o backend
      await updateSettings(settingsToUpdate);
      
      // Aplicar configurações de aparência
      if (activeTab === 'appearance') {
        applyAppearanceSettings({
          theme,
          primary_color: primaryColor,
          primary_text_color: primaryTextColor,
          content_text_color: contentTextColor,
          header_start_color: headerStartColor,
          header_end_color: headerEndColor,
          footer_start_color: footerStartColor,
          footer_end_color: footerEndColor,
          logo_url: logoUrl,
          favicon_url: faviconUrl
        });
      }
      
      toast({
        title: "Configurações salvas",
        description: "Suas alterações foram salvas com sucesso.",
        variant: "default",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleResetSettings = async () => {
    if (window.confirm('Tem certeza que deseja restaurar todas as configurações para os valores padrão? Esta ação não pode ser desfeita.')) {
      try {
        // Chamar a API para restaurar as configurações padrão
        await resetSettings();
        
        // Recarregar a página para obter as configurações padrão
        window.location.reload();
        
        toast({
          title: "Configurações restauradas",
          description: "Todas as configurações foram restauradas para os valores padrão.",
          variant: "default",
        });
      } catch (error) {
        console.error('Erro ao restaurar configurações:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao restaurar as configurações. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3">Carregando configurações...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Configurações do Sistema</h1>
        </div>

        <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white border overflow-x-auto flex-nowrap">
            <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Globe className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Palette className="h-4 w-4 mr-2" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Database className="h-4 w-4 mr-2" />
              Manutenção
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSaveSettings}>
            <TabsContent value="general">
              <Card className="border border-gray-100">
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Configure as informações básicas do seu site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-title">Título do Site</Label>
                      <Input
                        id="site-title"
                        value={siteTitle}
                        onChange={(e) => setSiteTitle(e.target.value)}
                        placeholder="Título do seu site"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="site-url">URL do Site</Label>
                      <Input
                        id="site-url"
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                        placeholder="https://seusite.com.br"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="site-description">Descrição do Site</Label>
                      <Textarea
                        id="site-description"
                        value={siteDescription}
                        onChange={(e) => setSiteDescription(e.target.value)}
                        placeholder="Uma breve descrição do seu site"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email do Administrador</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@seusite.com.br"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma Padrão</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Selecione um idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Selecione um fuso horário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">América/São Paulo (GMT-3)</SelectItem>
                          <SelectItem value="America/New_York">América/Nova York (GMT-5)</SelectItem>
                          <SelectItem value="Europe/London">Europa/Londres (GMT+0)</SelectItem>
                          <SelectItem value="Europe/Paris">Europa/Paris (GMT+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card className="border border-gray-100">
                <CardHeader>
                  <CardTitle>Configurações de Conteúdo</CardTitle>
                  <CardDescription>
                    Configure como o conteúdo é exibido e gerenciado no seu site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="posts-per-page">Artigos por Página</Label>
                      <Input
                        id="posts-per-page"
                        type="number"
                        value={postsPerPage}
                        onChange={(e) => setPostsPerPage(e.target.value)}
                        min="1"
                        max="100"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enable-comments">Habilitar Comentários</Label>
                        <Switch
                          id="enable-comments"
                          checked={enableComments}
                          onCheckedChange={setEnableComments}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="moderate-comments">Moderar Comentários</Label>
                        <Switch
                          id="moderate-comments"
                          checked={moderateComments}
                          onCheckedChange={setModerateComments}
                          disabled={!enableComments}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enable-rss">Habilitar Feed RSS</Label>
                        <Switch
                          id="enable-rss"
                          checked={enableRss}
                          onCheckedChange={setEnableRss}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="enable-social-sharing">Habilitar Compartilhamento Social</Label>
                        <Switch
                          id="enable-social-sharing"
                          checked={enableSocialSharing}
                          onCheckedChange={setEnableSocialSharing}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email">
              <Card className="border border-gray-100">
                <CardHeader>
                  <CardTitle>Configurações de Email</CardTitle>
                  <CardDescription>
                    Configure o servidor de email para envio de notificações.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-server">Servidor SMTP</Label>
                      <Input
                        id="smtp-server"
                        value={smtpServer}
                        onChange={(e) => setSmtpServer(e.target.value)}
                        placeholder="smtp.example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">Porta SMTP</Label>
                      <Input
                        id="smtp-port"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        placeholder="587"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-username">Usuário SMTP</Label>
                      <Input
                        id="smtp-username"
                        value={smtpUsername}
                        onChange={(e) => setSmtpUsername(e.target.value)}
                        placeholder="user@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">Senha SMTP</Label>
                      <Input
                        id="smtp-password"
                        type="password"
                        value={smtpPassword}
                        onChange={(e) => setSmtpPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-from">Email de Origem</Label>
                      <Input
                        id="email-from"
                        value={emailFrom}
                        onChange={(e) => setEmailFrom(e.target.value)}
                        placeholder="noreply@seusite.com.br"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-reply-to">Email de Resposta</Label>
                      <Input
                        id="email-reply-to"
                        value={emailReplyTo}
                        onChange={(e) => setEmailReplyTo(e.target.value)}
                        placeholder="contato@seusite.com.br"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Button type="button" variant="outline" className="w-full">
                        Enviar Email de Teste
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="border border-gray-100">
                <CardHeader>
                  <CardTitle>Configurações de Notificações</CardTitle>
                  <CardDescription>
                    Configure quais notificações você deseja receber.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-new-comments" className="block">Novos Comentários</Label>
                        <p className="text-sm text-gray-500">Receba notificações quando novos comentários forem adicionados.</p>
                      </div>
                      <Switch
                        id="notify-new-comments"
                        checked={notifyNewComments}
                        onCheckedChange={setNotifyNewComments}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-new-users" className="block">Novos Usuários</Label>
                        <p className="text-sm text-gray-500">Receba notificações quando novos usuários se registrarem.</p>
                      </div>
                      <Switch
                        id="notify-new-users"
                        checked={notifyNewUsers}
                        onCheckedChange={setNotifyNewUsers}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-system-errors" className="block">Erros do Sistema</Label>
                        <p className="text-sm text-gray-500">Receba notificações sobre erros críticos do sistema.</p>
                      </div>
                      <Switch
                        id="notify-system-errors"
                        checked={notifySystemErrors}
                        onCheckedChange={setNotifySystemErrors}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="border border-gray-100">
                <CardHeader>
                  <CardTitle>Configurações de Segurança</CardTitle>
                  <CardDescription>
                    Configure as opções de segurança do seu site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enable-captcha" className="block">Habilitar CAPTCHA</Label>
                          <p className="text-sm text-gray-500">Proteja seu site contra bots e spam.</p>
                        </div>
                        <Switch
                          id="enable-captcha"
                          checked={enableCaptcha}
                          onCheckedChange={setEnableCaptcha}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="captcha-site-key">Chave do Site (reCAPTCHA)</Label>
                      <Input
                        id="captcha-site-key"
                        value={captchaSiteKey}
                        onChange={(e) => setCaptchaSiteKey(e.target.value)}
                        placeholder="Chave do site"
                        disabled={!enableCaptcha}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="captcha-secret-key">Chave Secreta (reCAPTCHA)</Label>
                      <Input
                        id="captcha-secret-key"
                        value={captchaSecretKey}
                        onChange={(e) => setCaptchaSecretKey(e.target.value)}
                        placeholder="Chave secreta"
                        disabled={!enableCaptcha}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-login-attempts">Máximo de Tentativas de Login</Label>
                      <Input
                        id="max-login-attempts"
                        type="number"
                        value={maxLoginAttempts}
                        onChange={(e) => setMaxLoginAttempts(e.target.value)}
                        min="1"
                        max="10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Tempo de Sessão (minutos)</Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                        min="5"
                        max="1440"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card className="border border-gray-100">
                <CardHeader>
                  <CardTitle>Configurações de Aparência</CardTitle>
                  <CardDescription>
                    Personalize a aparência do seu site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Tema</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tema" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Cor Primária</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          id="primaryColor"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          placeholder="#3b82f6"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Esta cor será usada para botões e elementos de destaque.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Cor do Texto dos Botões</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          id="primaryTextColor"
                          value={primaryTextColor}
                          onChange={(e) => setPrimaryTextColor(e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          placeholder="#ffffff"
                          value={primaryTextColor}
                          onChange={(e) => setPrimaryTextColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Esta cor será usada para o texto dos botões.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Cor do Texto do Conteúdo</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          id="contentTextColor"
                          value={contentTextColor}
                          onChange={(e) => setContentTextColor(e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          placeholder="#1f2937"
                          value={contentTextColor}
                          onChange={(e) => setContentTextColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Esta cor será usada para o texto das notícias e categorias.</p>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Cores do Cabeçalho</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="headerStartColor">Cor Inicial</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              id="headerStartColor"
                              value={headerStartColor}
                              onChange={(e) => setHeaderStartColor(e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              type="text"
                              value={headerStartColor}
                              onChange={(e) => setHeaderStartColor(e.target.value)}
                              className="flex-1"
                              placeholder="#9333ea"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="headerEndColor">Cor Final</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              id="headerEndColor"
                              value={headerEndColor}
                              onChange={(e) => setHeaderEndColor(e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              type="text"
                              value={headerEndColor}
                              onChange={(e) => setHeaderEndColor(e.target.value)}
                              className="flex-1"
                              placeholder="#db2777"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 p-2 border rounded-md bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${headerStartColor}, ${headerEndColor})` }}>
                        <p className="text-white text-center py-2 font-medium">Pré-visualização do Cabeçalho</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Cores do Rodapé</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="footerStartColor">Cor Inicial</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              id="footerStartColor"
                              value={footerStartColor}
                              onChange={(e) => setFooterStartColor(e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              type="text"
                              value={footerStartColor}
                              onChange={(e) => setFooterStartColor(e.target.value)}
                              className="flex-1"
                              placeholder="#9333ea"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="footerEndColor">Cor Final</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              id="footerEndColor"
                              value={footerEndColor}
                              onChange={(e) => setFooterEndColor(e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              type="text"
                              value={footerEndColor}
                              onChange={(e) => setFooterEndColor(e.target.value)}
                              className="flex-1"
                              placeholder="#db2777"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 p-2 border rounded-md bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${footerStartColor}, ${footerEndColor})` }}>
                        <p className="text-white text-center py-2 font-medium">Pré-visualização do Rodapé</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo-url">URL do Logo</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="logo-url"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          placeholder="/logo.png"
                          className="flex-1"
                        />
                        <input
                          type="file"
                          id="logo-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const uploadedUrl = await uploadImage(file);
                                // Obter a URL completa da imagem
                                const fullUrl = getFullImageUrl(uploadedUrl);
                                setLogoUrl(fullUrl);
                                toast({
                                  title: "Imagem enviada",
                                  description: "A logomarca foi enviada com sucesso.",
                                  variant: "default",
                                });
                              } catch (error) {
                                console.error('Erro ao fazer upload da logomarca:', error);
                                toast({
                                  title: "Erro",
                                  description: "Ocorreu um erro ao enviar a logomarca. Tente novamente.",
                                  variant: "destructive",
                                });
                              }
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      {logoUrl && (
                        <div className="mt-2 p-2 border rounded-md">
                          <p className="text-sm mb-1">Pré-visualização:</p>
                          <div className="flex justify-center bg-gray-100 p-2 rounded">
                            <img 
                              src={logoUrl} 
                              alt="Logomarca" 
                              className="h-16 object-contain" 
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                // Usar uma imagem de placeholder que sabemos que existe
                                target.src = '/placeholder-image.png';
                                console.error('Erro ao carregar a imagem:', logoUrl);
                              }}
                            />
                          </div>
                          <div className="mt-2 text-center">
                            <a href={logoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                              Abrir imagem em nova aba
                            </a>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-center break-all">{logoUrl}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="favicon-url">URL do Favicon</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="favicon-url"
                          value={faviconUrl}
                          onChange={(e) => setFaviconUrl(e.target.value)}
                          placeholder="/favicon.ico"
                          className="flex-1"
                        />
                        <input
                          type="file"
                          id="favicon-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const uploadedUrl = await uploadImage(file);
                                // Obter a URL completa da imagem
                                const fullUrl = getFullImageUrl(uploadedUrl);
                                setFaviconUrl(fullUrl);
                                toast({
                                  title: "Imagem enviada",
                                  description: "O favicon foi enviado com sucesso.",
                                  variant: "default",
                                });
                              } catch (error) {
                                console.error('Erro ao fazer upload do favicon:', error);
                                toast({
                                  title: "Erro",
                                  description: "Ocorreu um erro ao enviar o favicon. Tente novamente.",
                                  variant: "destructive",
                                });
                              }
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => document.getElementById('favicon-upload')?.click()}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      {faviconUrl && (
                        <div className="mt-2 p-2 border rounded-md">
                          <p className="text-sm mb-1">Pré-visualização:</p>
                          <div className="flex justify-center bg-gray-100 p-2 rounded">
                            <img 
                              src={faviconUrl} 
                              alt="Favicon" 
                              className="h-8 object-contain" 
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                // Usar uma imagem de placeholder que sabemos que existe
                                target.src = '/placeholder-image.png';
                                console.error('Erro ao carregar a imagem:', faviconUrl);
                              }}
                            />
                          </div>
                          <div className="mt-2 text-center">
                            <a href={faviconUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                              Abrir imagem em nova aba
                            </a>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-center break-all">{faviconUrl}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance">
              <Card className="border border-gray-100">
                <CardHeader>
                  <CardTitle>Manutenção do Sistema</CardTitle>
                  <CardDescription>
                    Ferramentas para manutenção e backup do sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Backup do Banco de Dados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-4">
                          Crie um backup completo do banco de dados do seu site.
                        </p>
                        <Button type="button" variant="outline" className="w-full">
                          <Database className="h-4 w-4 mr-2" />
                          Criar Backup
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Limpar Cache</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-4">
                          Limpe o cache do sistema para resolver problemas de desempenho.
                        </p>
                        <Button type="button" variant="outline" className="w-full">
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Limpar Cache
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 md:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base text-red-600">Zona de Perigo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-4">
                          Estas ações são irreversíveis. Tenha certeza antes de prosseguir.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleResetSettings}>
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Restaurar Padrões
                          </Button>
                          <Button type="button" variant="destructive" className="w-full sm:w-auto">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Limpar Todos os Dados
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="mt-6 flex justify-end">
              <Button type="submit" className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
