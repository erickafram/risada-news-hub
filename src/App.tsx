
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import ArticlePage from "./pages/ArticlePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoriesList from "./pages/admin/CategoriesList";
import CategoryForm from "./pages/admin/CategoryForm";
import NewsList from "./pages/admin/NewsList";
import ArticleForm from "./pages/admin/ArticleForm";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import CommentsPage from "./pages/admin/CommentsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import UsersPage from "./pages/admin/UsersPage";
import PagesListPage from "./pages/admin/PagesListPage";
import PageForm from "./pages/admin/PageForm";
import PageView from "./pages/PageView";
import PageLayoutEditor from "./pages/admin/PageLayoutEditor";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <HelmetProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            
            {/* User Dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireAdmin={false}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            
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
            <Route path="/admin/page-layout" element={
              <ProtectedRoute requireAdmin={true}>
                <PageLayoutEditor />
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute requireAdmin={true}>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/comments" element={
              <ProtectedRoute requireAdmin={true}>
                <CommentsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requireAdmin={true}>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireAdmin={true}>
                <UsersPage />
              </ProtectedRoute>
            } />
            
            {/* Rotas para gerenciamento de páginas */}
            <Route path="/admin/pages" element={
              <ProtectedRoute requireAdmin={true}>
                <PagesListPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/pages/new" element={
              <ProtectedRoute requireAdmin={true}>
                <PageForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/pages/edit/:id" element={
              <ProtectedRoute requireAdmin={true}>
                <PageForm />
              </ProtectedRoute>
            } />
            
            {/* Rota para visualização de páginas estáticas */}
            <Route path="/:slug" element={<PageView />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
          </HelmetProvider>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
