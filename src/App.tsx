import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { DataOverview } from '@/pages/data-management/Overview';
import { DataAnalytics } from '@/pages/data-management/Analytics';
import { AllUsers } from '@/pages/user-table/AllUsers';
import { InactiveUsers } from '@/pages/user-table/Inactive';
import { AdminsTable } from '@/pages/admin-table/Admins';
import { Permissions } from '@/pages/admin-table/Permissions';
import { Settings } from '@/pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="data-management/overview" element={<DataOverview />} />
            <Route path="data-management/analytics" element={<DataAnalytics />} />
            <Route path="user-table/all-users" element={<AllUsers />} />
            <Route path="user-table/inactive" element={<InactiveUsers />} />
            <Route path="admin-table/admins" element={<AdminsTable />} />
            <Route path="admin-table/permissions" element={<Permissions />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
