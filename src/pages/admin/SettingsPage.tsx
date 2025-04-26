import React, { useState } from 'react';
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

const SettingsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  
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
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Em um cenário real, enviaríamos as configurações para a API
    // Aqui estamos apenas mostrando um toast de sucesso
    
    toast({
      title: "Configurações salvas",
      description: "Suas alterações foram salvas com sucesso.",
      variant: "default",
    });
  };
  
  const handleResetSettings = () => {
    // Em um cenário real, restauraríamos as configurações padrão
    // Aqui estamos apenas mostrando um toast de confirmação
    
    if (window.confirm('Tem certeza que deseja restaurar todas as configurações para os valores padrão? Esta ação não pode ser desfeita.')) {
      toast({
        title: "Configurações restauradas",
        description: "Todas as configurações foram restauradas para os valores padrão.",
        variant: "default",
      });
    }
  };
  
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Tema</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger id="theme">
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
                      <Label htmlFor="primary-color">Cor Primária</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="primary-color" 
                          type="color"
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1"
                        />
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
                        <Button type="button" variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
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
                        <Button type="button" variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
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
