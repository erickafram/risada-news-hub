
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      <Header />
      <main className="flex-grow animate-fade-in">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
