import { Navigate, Route, Routes } from "react-router";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AdminChatsPage } from "./pages/admin/AdminChatsPage";
import { AdminComplaintDetailPage } from "./pages/admin/AdminComplaintDetailPage";
import { AdminComplaintsPage } from "./pages/admin/AdminComplaintsPage";
import { AdminConferencesPage } from "./pages/admin/AdminConferencesPage";
import { AdminControlPage } from "./pages/admin/AdminControlPage";
import { AdminOverviewPage } from "./pages/admin/AdminOverviewPage";
import { AdminRndPage } from "./pages/admin/AdminRndPage";
import { CompanyChatsPage } from "./pages/company/CompanyChatsPage";
import { CompanyContentPage } from "./pages/company/CompanyContentPage";
import { CompanyDashboardPage } from "./pages/company/CompanyDashboardPage";
import { CompanyReportPage } from "./pages/company/CompanyReportPage";
import { CompanyRndPage } from "./pages/company/CompanyRndPage";
import { AssistantPage } from "./pages/public/AssistantPage";
import { ComplaintPage } from "./pages/public/ComplaintPage";
import { FavoritesPage } from "./pages/public/FavoritesPage";
import { HomePage } from "./pages/public/HomePage";
import { LoginPage } from "./pages/public/LoginPage";
import { NewsDetailPage } from "./pages/public/NewsDetailPage";
import { NotificationsPage } from "./pages/public/NotificationsPage";
import { ProductDetailPage } from "./pages/public/ProductDetailPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/complaint" element={<ComplaintPage />} />
      <Route path="/assistant" element={<AssistantPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route element={<ProtectedRoute role="company" />}>
        <Route path="/company" element={<CompanyDashboardPage />} />
        <Route path="/company/content" element={<CompanyContentPage />} />
        <Route path="/company/report" element={<CompanyReportPage />} />
        <Route path="/company/chats" element={<CompanyChatsPage />} />
        <Route path="/company/rnd" element={<CompanyRndPage />} />
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminOverviewPage />} />
        <Route path="/admin/control" element={<AdminControlPage />} />
        <Route path="/admin/conferences" element={<AdminConferencesPage />} />
        <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
        <Route path="/admin/complaints/:id" element={<AdminComplaintDetailPage />} />
        <Route path="/admin/chats" element={<AdminChatsPage />} />
        <Route path="/admin/rnd" element={<AdminRndPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
