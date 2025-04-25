
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-2">Categorias</h3>
            <p className="text-3xl font-bold">5</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-2">Notícias</h3>
            <p className="text-3xl font-bold">24</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-2">Visualizações</h3>
            <p className="text-3xl font-bold">1,234</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
