
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, Newspaper, FolderPlus, LogOut, Menu, X, Users, 
  MessageSquare, Settings, BarChart3, ChevronDown, ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Responsividade automática para telas menores
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const menuItems = [
    { path: '/admin', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/admin/categories', icon: <FolderPlus className="w-5 h-5" />, label: 'Categorias' },
    { path: '/admin/news', icon: <Newspaper className="w-5 h-5" />, label: 'Notícias' },
    { path: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Usuários' },
    { path: '/admin/comments', icon: <MessageSquare className="w-5 h-5" />, label: 'Comentários' },
    { path: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Estatísticas' },
    { path: '/admin/settings', icon: <Settings className="w-5 h-5" />, label: 'Configurações' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Mobile */}
      <header className="lg:hidden bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="mr-2"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link to="/admin" className="flex items-center">
            <span className="font-bold text-xl text-primary">Risada News</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium hidden sm:inline-block">{user?.fullName}</span>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside 
          className={cn(
            "bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 hidden lg:block",
            isCollapsed ? "w-[80px]" : "w-[250px]"
          )}
        >
          <div className="h-full flex flex-col">
            <div className={cn(
              "flex items-center h-16 px-4 border-b border-gray-200",
              isCollapsed ? "justify-center" : "justify-between"
            )}>
              {!isCollapsed && (
                <Link to="/admin" className="flex items-center">
                  <span className="font-bold text-xl text-primary">Risada News</span>
                </Link>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className={isCollapsed ? "" : ""}
              >
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
            
            <nav className="flex-1 py-4 overflow-y-auto">
              <ul className="space-y-1 px-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center gap-2 py-2 px-3 rounded-md transition-colors",
                        isActive(item.path) 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-gray-100",
                        isCollapsed ? "justify-center" : ""
                      )}
                    >
                      {item.icon}
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="p-4 border-t border-gray-200">
              <Button 
                variant="ghost" 
                className={cn(
                  "text-red-600 w-full",
                  isCollapsed ? "justify-center p-2" : "flex items-center justify-center gap-2"
                )}
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                {!isCollapsed && <span>Sair</span>}
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile Menu - Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={toggleMobileMenu}></div>
        )}

        {/* Mobile Menu - Sidebar */}
        <aside 
          className={cn(
            "bg-white border-r border-gray-200 h-screen fixed top-0 left-0 z-50 w-[250px] transition-transform duration-300 lg:hidden",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <Link to="/admin" className="flex items-center">
                <span className="font-bold text-xl text-primary">Risada News</span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <div className="text-sm font-medium">{user?.fullName}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
            
            <nav className="flex-1 py-4 overflow-y-auto">
              <ul className="space-y-1 px-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center gap-3 py-2 px-3 rounded-md transition-colors",
                        isActive(item.path) 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-gray-100"
                      )}
                      onClick={toggleMobileMenu}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="p-4 border-t border-gray-200">
              <Button 
                variant="ghost" 
                className="text-red-600 w-full flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
