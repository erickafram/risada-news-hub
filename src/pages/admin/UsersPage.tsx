import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, PlusCircle, MoreHorizontal, UserPlus, UserMinus, 
  UserCog, Mail, Trash2, Eye, ChevronLeft, ChevronRight,
  Shield, User, Users as UsersIcon
} from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'subscriber';
  status: 'active' | 'inactive' | 'banned';
  lastLogin: string;
  createdAt: string;
  articlesCount: number;
}

const UsersPage = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Formulário para novo usuário
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'subscriber'
  });
  
  // Dados de exemplo para usuários
  const mockUsers: User[] = [
    {
      id: 1,
      fullName: 'João Silva',
      email: 'joao.silva@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-04-25T14:32:00',
      createdAt: '2023-01-15T10:00:00',
      articlesCount: 45
    },
    {
      id: 2,
      fullName: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      role: 'editor',
      status: 'active',
      lastLogin: '2024-04-24T09:15:00',
      createdAt: '2023-02-20T11:30:00',
      articlesCount: 32
    },
    {
      id: 3,
      fullName: 'Carlos Mendes',
      email: 'carlos.mendes@example.com',
      role: 'author',
      status: 'inactive',
      lastLogin: '2024-03-15T16:45:00',
      createdAt: '2023-03-10T09:45:00',
      articlesCount: 18
    },
    {
      id: 4,
      fullName: 'Ana Souza',
      email: 'ana.souza@example.com',
      role: 'subscriber',
      status: 'active',
      lastLogin: '2024-04-26T08:20:00',
      createdAt: '2023-04-05T14:20:00',
      articlesCount: 0
    },
    {
      id: 5,
      fullName: 'Pedro Santos',
      email: 'pedro.santos@example.com',
      role: 'author',
      status: 'banned',
      lastLogin: '2024-02-10T11:30:00',
      createdAt: '2023-05-12T16:10:00',
      articlesCount: 7
    }
  ];
  
  useEffect(() => {
    // Em um cenário real, buscaríamos os usuários da API
    // Aqui estamos usando dados de exemplo
    setLoading(true);
    
    // Filtrar usuários com base na aba ativa
    let filteredUsers = [...mockUsers];
    
    if (activeTab !== 'all') {
      filteredUsers = mockUsers.filter(user => {
        if (activeTab === 'admin') return user.role === 'admin';
        if (activeTab === 'staff') return ['editor', 'author'].includes(user.role);
        if (activeTab === 'subscribers') return user.role === 'subscriber';
        if (activeTab === 'inactive') return user.status !== 'active';
        return true;
      });
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setUsers(filteredUsers);
    setTotalPages(Math.ceil(filteredUsers.length / 10));
    setLoading(false);
  }, [searchTerm, activeTab]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca já está sendo tratada no useEffect
  };
  
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      toast({
        title: "Erro ao adicionar usuário",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Erro ao adicionar usuário",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    // Em um cenário real, enviaríamos uma requisição para a API
    // Aqui estamos apenas atualizando o estado local
    
    const newUserId = Math.max(...users.map(user => user.id)) + 1;
    
    const createdUser: User = {
      id: newUserId,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role as 'admin' | 'editor' | 'author' | 'subscriber',
      status: 'active',
      lastLogin: '-',
      createdAt: new Date().toISOString(),
      articlesCount: 0
    };
    
    setUsers(prevUsers => [...prevUsers, createdUser]);
    
    toast({
      title: "Usuário adicionado",
      description: `${newUser.fullName} foi adicionado com sucesso.`,
    });
    
    // Resetar formulário
    setNewUser({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'subscriber'
    });
    
    setIsAddUserOpen(false);
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };
  
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    // Em um cenário real, enviaríamos uma requisição para a API
    // Aqui estamos apenas atualizando o estado local
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      )
    );
    
    toast({
      title: "Usuário atualizado",
      description: `${selectedUser.fullName} foi atualizado com sucesso.`,
    });
    
    setIsEditUserOpen(false);
  };
  
  const handleStatusChange = async (userId: number, newStatus: 'active' | 'inactive' | 'banned') => {
    // Em um cenário real, enviaríamos uma requisição para a API
    // Aqui estamos apenas atualizando o estado local
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    
    const statusText = newStatus === 'active' ? 'ativado' : newStatus === 'inactive' ? 'desativado' : 'banido';
    
    toast({
      title: "Status atualizado",
      description: `Usuário ${statusText} com sucesso.`,
      variant: newStatus === 'banned' ? 'destructive' : 'default',
    });
  };
  
  const handleDelete = async (userId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    // Em um cenário real, enviaríamos uma requisição para a API
    // Aqui estamos apenas atualizando o estado local
    
    setUsers(prevUsers => 
      prevUsers.filter(user => user.id !== userId)
    );
    
    toast({
      title: "Usuário excluído",
      description: "O usuário foi excluído permanentemente.",
      variant: "destructive",
    });
  };
  
  const formatDate = (dateString: string) => {
    if (dateString === '-') return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Administrador</Badge>;
      case 'editor':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Editor</Badge>;
      case 'author':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Autor</Badge>;
      case 'subscriber':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Assinante</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Inativo</Badge>;
      case 'banned':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Banido</Badge>;
      default:
        return null;
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 mr-2" />;
      case 'editor':
        return <UserCog className="h-4 w-4 mr-2" />;
      case 'author':
        return <User className="h-4 w-4 mr-2" />;
      case 'subscriber':
        return <User className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Gerenciar Usuários</h1>
          
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar usuários..."
                className="pl-9 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                  <DialogDescription>
                    Preencha os campos abaixo para criar um novo usuário.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome Completo</Label>
                      <Input
                        id="fullName"
                        value={newUser.fullName}
                        onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                        placeholder="Nome completo do usuário"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="email@exemplo.com"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={newUser.confirmPassword}
                          onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Função</Label>
                      <Select 
                        value={newUser.role} 
                        onValueChange={(value) => setNewUser({...newUser, role: value})}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="author">Autor</SelectItem>
                          <SelectItem value="subscriber">Assinante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Adicionar Usuário</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white border">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <UsersIcon className="h-4 w-4 mr-2" />
              Todos
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Administradores
            </TabsTrigger>
            <TabsTrigger value="staff" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <UserCog className="h-4 w-4 mr-2" />
              Equipe
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              Assinantes
            </TabsTrigger>
            <TabsTrigger value="inactive" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <UserMinus className="h-4 w-4 mr-2" />
              Inativos/Banidos
            </TabsTrigger>
          </TabsList>
          
          <Card className="border border-gray-100">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <UsersIcon className="h-12 w-12 text-gray-300 mb-2" />
                <h3 className="text-lg font-medium text-gray-900">Nenhum usuário encontrado</h3>
                <p className="text-gray-500 mt-1">
                  {searchTerm ? 'Tente ajustar sua busca.' : 'Não há usuários nesta categoria.'}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Usuário</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Função</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Artigos</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Último Login</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Cadastro</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(user.status)}
                          </td>
                          <td className="py-3 px-4">
                            {user.articlesCount}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {formatDate(user.lastLogin)}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditUser(user)}
                                title="Editar usuário"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                    <UserCog className="h-4 w-4 mr-2" />
                                    <span>Editar Usuário</span>
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuItem onClick={() => window.location.href = `mailto:${user.email}`}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    <span>Enviar Email</span>
                                  </DropdownMenuItem>
                                  
                                  {user.status !== 'active' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                                      <UserPlus className="h-4 w-4 mr-2 text-green-500" />
                                      <span>Ativar Usuário</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  {user.status !== 'inactive' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'inactive')}>
                                      <UserMinus className="h-4 w-4 mr-2 text-yellow-500" />
                                      <span>Desativar Usuário</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  {user.status !== 'banned' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'banned')}>
                                      <UserMinus className="h-4 w-4 mr-2 text-red-500" />
                                      <span>Banir Usuário</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDelete(user.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    <span>Excluir</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t px-4 py-3">
                    <div className="text-sm text-gray-500">
                      Mostrando <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> a <span className="font-medium">{Math.min(currentPage * 10, users.length)}</span> de <span className="font-medium">{users.length}</span> resultados
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </Tabs>
        
        {/* Modal de Edição de Usuário */}
        {selectedUser && (
          <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Editar Usuário</DialogTitle>
                <DialogDescription>
                  Atualize as informações do usuário.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateUser}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-fullName">Nome Completo</Label>
                    <Input
                      id="edit-fullName"
                      value={selectedUser.fullName}
                      onChange={(e) => setSelectedUser({...selectedUser, fullName: e.target.value})}
                      placeholder="Nome completo do usuário"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Função</Label>
                    <Select 
                      value={selectedUser.role} 
                      onValueChange={(value: any) => setSelectedUser({...selectedUser, role: value})}
                    >
                      <SelectTrigger id="edit-role">
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="author">Autor</SelectItem>
                        <SelectItem value="subscriber">Assinante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select 
                      value={selectedUser.status} 
                      onValueChange={(value: any) => setSelectedUser({...selectedUser, status: value})}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="banned">Banido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reset-password">Redefinir Senha</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="reset-password"
                        type="password"
                        placeholder="Nova senha (deixe em branco para manter)"
                      />
                      <Button type="button" variant="outline">
                        Redefinir
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Deixe em branco para manter a senha atual.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditUserOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Alterações</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
