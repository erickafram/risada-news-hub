
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Newspaper, FolderPlus, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md h-screen sticky top-0">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-sm text-gray-500">Bem-vindo, {user?.name}</p>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/admin" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/categories" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                  <FolderPlus className="w-5 h-5" />
                  <span>Categorias</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/news" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                  <Newspaper className="w-5 h-5" />
                  <span>Notícias</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="absolute bottom-0 w-full p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-center gap-2 text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
