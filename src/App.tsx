
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import ArticlePage from "./pages/ArticlePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoriesList from "./pages/admin/CategoriesList";
import CategoryForm from "./pages/admin/CategoryForm";
import NewsList from "./pages/admin/NewsList";
import ArticleForm from "./pages/admin/ArticleForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute requireAdmin={true}>
                <CategoriesList />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories/new" element={
              <ProtectedRoute requireAdmin={true}>
                <CategoryForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories/edit/:id" element={
              <ProtectedRoute requireAdmin={true}>
                <CategoryForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/news" element={
              <ProtectedRoute requireAdmin={true}>
                <NewsList />
              </ProtectedRoute>
            } />
            <Route path="/admin/news/new" element={
              <ProtectedRoute requireAdmin={true}>
                <ArticleForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/news/edit/:id" element={
              <ProtectedRoute requireAdmin={true}>
                <ArticleForm />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
